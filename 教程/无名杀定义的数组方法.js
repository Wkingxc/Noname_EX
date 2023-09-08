可用范围：数组

X.contains(b)
X若含有b元素,则返回true,反回false
可以用includes方法替代
同时用indexOf方法也可以判断是否包含

X.filterInD(b)
返回一个数组,内容是X卡组中位置为b的卡牌,没有则是空数组
b可以是字符串和数组,默认为"o"处理区,所以以下两种都可以
["h","e","j","o"]    "hejo"

X.add(b)
向X中不重复地添加一个元素,相对于push,add方法不能添加重复的元素

X.addArray(b)
相对于add方法,addArray的参数为数组

X.remove(b)
将数组X移除b元素
如果b为数组,依次将X中的b元素的元素移除
如果b为其他东西,移除之,但如果b不存在,返回false,否则返回处理过的X

X.removeArray(b)
依次将b数组的所有元素从X中移除并返回处理过的X

X.randomGet()
返回X中随机一个元素

X.randomGets(b)
返回X中随机b个元素

X.randomRemove(b)
X随机移除b个元素
b默认1

X.randomSort()
将X的元素顺序打乱,并返回处理后的X




