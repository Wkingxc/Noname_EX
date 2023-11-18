import os
from collections import defaultdict,Counter
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')
## Reading and processing dataset 
train_file = 'KDDTrain+.txt'
test_file = 'KDDTest+.txt'
attack_type_file = 'training_attack_types.txt'
# Original KDD dataset feature names obtained from 
# http://kdd.ics.uci.edu/databases/kddcup99/kddcup.names
# http://kdd.ics.uci.edu/databases/kddcup99/kddcup99.html

header_names = ['duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins', 'logged_in', 'num_compromised', 'root_shell', 'su_attempted', 'num_root', 'num_file_creations', 'num_shells', 'num_access_files', 'num_outbound_cmds', 'is_host_login', 'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate', 'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate', 'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate', 'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate', 'dst_host_serror_rate', 'dst_host_srv_serror_rate', 'dst_host_rerror_rate', 'dst_host_srv_rerror_rate', 'attack_type', 'success_pred']

df = pd.read_csv(train_file, header=None, names=header_names)
df_test = pd.read_csv(test_file, header=None, names=header_names)
attack_type_df = pd.read_csv(
    attack_type_file, sep=' ', header=None, names=[
        'name', 'attack_type'])

# 定义5大类和小类的映射字典，方便替代
attack_type_dict = dict(
    zip(attack_type_df['name'].tolist(), attack_type_df['attack_type'].tolist()))

# 最后一列 既无法作为feature，也不是我们的label，删掉
df.drop('success_pred', axis=1, inplace=True)
df_test.drop('success_pred', axis=1, inplace=True)

# 替换label 为5 大类
df['attack_type'].replace(attack_type_dict, inplace=True)
df_test['attack_type'].replace(attack_type_dict, inplace=True)

#把细分的攻击类型列命名为label
df.rename(columns={'attack_type':'label'},inplace=True)
df_test.rename(columns={'attack_type':'label'},inplace=True)
df.info()
train_label= df[['label']]
train_label['type'] = 'train'
test_label= df_test[['label']]
test_label['type'] = 'test'
label_all = pd.concat([train_label,test_label],axis=0)
sns.countplot(x='label',hue='type', data=label_all)
#将训练集和测试集中的标签 数据分离
Y_train=df['label']
Y_test=df_test['label']
X_train=df.drop('label',axis=1)
X_test=df_test.drop('label',axis=1)
#样本中存在三个离散型字符变量 protocol_type service flag
#对字符型数据进行编码
categorical_mask = (X_train.dtypes == object)
categorical_columns = X_train.columns[categorical_mask].tolist()
def shownumoftype(dataset):
    out=""
    for column in {'protocol_type','service','flag'}:
        out+=str(len(Counter(dataset[column])))+' '
    print(out)
shownumoftype(X_train)
shownumoftype(X_test)
X_test.shape
#这里可以看出训练集和测试集的service列的类型数并不统一，在字符转数字后无法做到一一对应
#因此需要在X_test中补齐这几种类型
service = X_train['service']
test_service = X_test['service'] 
different_service_type = np.array(list(set(service) - set(test_service)))
np_service = np.array(list(service))

miss_service_data_index = np.array([],dtype=bool)
exist_type=[]
for type_service in np_service:
    if (type_service in different_service_type) & (type_service not in exist_type):
        exist_type.append(type_service)
        miss_service_data_index=np.append(miss_service_data_index,True)
    else:
        miss_service_data_index=np.append(miss_service_data_index,False)

add_to_test_data = X_train.values[miss_service_data_index.nonzero()]

X_test = np.concatenate((X_test.values,add_to_test_data))
X_test = pd.DataFrame(X_test)
X_test.columns = X_train.columns

tmp=pd.DataFrame(Y_train.values[miss_service_data_index.nonzero()],columns=['label'])
Y_test = pd.DataFrame(Y_test,columns=['label'])

Y_test = np.concatenate((Y_test.values,tmp))
Y_test = pd.DataFrame(Y_test)
Y_test.columns = ['label']
shownumoftype(X_train)
shownumoftype(X_test)
X_test.shape
#在训练集中对每种service类型扩充了一条记录，此时测试集和训练集的service段类型一致
#可以进行字符->数字的转码
#字符转数字编码
from sklearn.preprocessing import LabelEncoder
def label_encoder(data):
    labelencoder = LabelEncoder()
    for col in data.columns:
        data.loc[:, col] = labelencoder.fit_transform(data[col])
    return data

X_train[categorical_columns]= label_encoder(X_train[categorical_columns])
X_test[categorical_columns] = label_encoder(X_test[categorical_columns])
#因为类型分布不均衡，需要对较少的类型进行重采样来扩充样本量
from imblearn.over_sampling import SMOTE, ADASYN
oversample = ADASYN()
X_train, Y_train = oversample.fit_resample(X_train, Y_train)
#查看此时的类型分布
value_counts = Y_train.value_counts()
value_counts.plot(kind='bar')
#对测试集和训练集的字符转码的三列进行独热编码

X_train=pd.get_dummies(X_train,columns=['protocol_type','service','flag'])
X_test=pd.get_dummies(X_test,columns=['protocol_type','service','flag'])
#存储
pd.DataFrame(X_train).to_csv('data/KDDTrain+vtest+_afterHandle.csv',index=False)
pd.DataFrame(Y_train).to_csv('data/KDDTrain+vtest+_label_afterHandle.csv',index=False)
pd.DataFrame(X_test).to_csv('data/KDDTest+_afterHandle.csv', index=False)
pd.DataFrame(Y_test).to_csv('data/KDDTest+_label_afterHandle.csv', index=False)