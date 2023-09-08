作者:苏婆玛丽奥(现无名杀更新者,有BUG到无名杀贴吧的BUG反馈贴反馈)
以下摘自百度贴吧:

get.bottomCards()
为许攸量身定做的新函数 
用法和get.cards()完全一致 只不过这个函数得到的是牌堆底的牌 而那个函数得到的是牌堆顶的牌 就是这样 
如果要从牌堆底摸牌的话 在括号里加上一个 'bottom' 即可
例:player.draw(2,'bottom'); 效果即为让玩家从牌堆底摸两张牌
或者可以写成 player.draw(2).set('bottom',true); 效果和之前的函数一致 


然后是废除装备栏的写法 例:
一: player.disableEquip(2);
二: player.disableEquip('equip2');
两种写法的效果一样 都是废除玩家的防具栏 
1=武器栏 2=防具栏 3=加一马栏 4=减一马栏 5=宝物栏 就是这样 
一次性废除多个装备栏的话 请将这段代码复制几遍
例:
player.disableEquip(1);
player.disableEquip(2);
...
判断玩家一个装备栏有没有被废除 请使用player.isDisabled()函数
例:假设有一个孙笨 废除了自己的武器栏 那么
用 player.isDisabled(1) 就可以判断出孙笨的武器栏已经被废除
也可以写成 player.isDisabled('equip1') 效果依然一样 
判断玩家的某个装备栏是不是"空栏"(即既没有被废除 栏内也没有装备牌) 请使用player.isEmpty()函数
例:一个装着武器的孙笨 player.isEmpty(1)函数得到的结果为false 
一个废除了防具栏的陆抗 player.isEmpty(2)得到的结果为false
一个宝物栏里没有宝物牌 也没有废除宝物栏的SP黄月英 player.isEmpty(5)得到的结果为true
括号里面也可以填文字 用法和之前类似
恢复装备栏的用法与废除装备栏类似
用player.enableEquip()函数即可 括号的填法和之前一样 就不赘述了
player.chooseToEnable();
让玩家选择并恢复一个装备栏
用法很简单 就不细说了
集中讲一下之后的一些新函数吧...
player.countDisabled();
这个函数的作用是统计玩家一共废除了多少个装备栏
例:陆抗技能【决堰】
...
'step 0'
 player.chooseToDisable(true).set('ai',function(event,player,list){
 if(list.contains('equip2')) return 'equip2';
 if(list.contains('equip1')&&player.countCards('h',{name:'sha'})>2) return 'equip1';
 if(list.contains('equip5')&&player.countCards('h',{type:'trick'})>=1) return 'equip5';
 });
 'step 1'
 if(result.control=='equip1'){
 player.addTempSkill('drlt_jueyan1',{player:'phaseAfter'});
 };
 if(result.control=='equip2'){
 player.draw(3);
 player.addTempSkill('drlt_jueyan3',{player:'phaseAfter'});
 };
 if(result.control=='equip6'){
 player.addTempSkill('drlt_jueyan2',{player:'phaseAfter'});
 };
 if(result.control=='equip5'){
 player.addTempSkill('rejizhi',{player:'phaseAfter'});
 };
...
括号里的true 作用是让玩家在选择时 把两个坐骑栏放在一起废除(之后对应的结果是equip6)
game.cardsDiscard();
这个函数的作用是「将不属于任何人的卡牌置入弃牌堆」
把要弃置的卡牌填进括号就行
chooseToPSS()
石头剪刀布的函数 用法和拼点类似
例:player.chooseToPSS(target);
如果发起玩家胜利 那么result.bool值为true 失败则为false 如果平局 那么result.tie值为true
chooseToDuiben();
对一名其他角色发起对笨(划掉)对策
为审配专门加入的函数 用法和石头剪刀布类似 只不过没有平局的结果
顺便 发起人在对策过程中是选择防御策略的角色 在用的时候不要搞错了
chooseUseTarget()
这个函数算不上新函数 不过以前很少用到(因为这个函数并不能在联机模式下使用)
函数的作用是:给定一张卡牌 让玩家选择卡牌的目标并对这些目标使用此牌
例:孙茹【影箭】
player.chooseUseTarget('###是否发动【影箭】？# ##视为使用一张没有距离限制的【杀】',{name:'sha'},false,'nodistance').logSkill='yingjian';
带###的文本为发动时的文字提示(没有指定提示的时候 默认为「选择xxx的目标」) 写成###的形式是为了方便用同一条文本同时设置prompt和prompt2 也可以分成两条文本填在括号里
{name:'sha'} 自然是要使用的卡牌了 除了这种虚拟卡牌以外 也可以填真实卡牌
false 意义在于让此次使用的卡牌不计入使用次数
'nodistance' 是让此次使用的卡牌不受距离限制
后面的logSkill 则是在玩家确定要使用卡牌的情况下 弹出发动的技能
顺便 如果想让目标强制使用卡牌且不能取消的话 在括号里填true就行
除logSkill外 以上参数没有任何顺序要求
zhuiyi:{
audio:2,
trigger:{player:'die'},
//die时机 是死亡结算流程中明置身份牌之后 弃置区域内的牌和结算奖惩之前
direct:true,
skillAnimation:true,
animationColor:'wood',
forceDie:true,
//这个forceDie是重中之重 没有它的话 技能是不会在死后发动的
content:function(){
"step 0"
player.chooseTarget(get.prompt2('zhuiyi'),function(card,player,target){
return player!=target&&_status.event.source!=target;
}).set('forceDie',true).set('ai',function(target){
var num=get.attitude(_status.event.player,target);
if(num>0){
if(target.hp==1){
num+=2;
}
if(target.hp<target.maxHp){
num+=2;
}
}
return num;
}).set('source',event.source);
//以死亡的角色为发起人的事件一定要将forceDie也set为true 否则不能正常结算
"step 1"
if(result.bool){
var target=result.targets[0];
player.logSkill('zhuiyi',target);
player.line(target,'green');
target.recover();
target.draw(3);
}
},
ai:{
expose:0.5,
}
},
废除判定区
直接使用 player.disableJudge(); 即可
括号里面什么都不用填 不过目前没有恢复判定区的函数 因此慎用
最后说说周妃的「移出游戏」
为了解决这个武将的问题 目前的策略是「修改所有涉及到这一用法的其他武将技能 来实现周妃的技能」 
各位扩展作者在编写扩展时 如果涉及到了「移出游戏」 请注意以下内容 否则您扩展内的武将将无法触发周妃的联动技能 
例1
...
player.lose(cards,ui.special,'toStorage');
...
一般在将自己的牌放到游戏外的时候 都会lose到ui.special
在括号里加上'toStorage' 作为标记 就可以触发周妃的技能了
例2
...
player.storage.buqu.push(event.card);
player.syncStorage('buqu');
event.trigger("addCardToStorage");
...
这是周泰「不屈」中的部分代码
由于不屈牌在移除游戏之前不属于任何人 因此不存在任何技能时机 能够检测到这一行为 
因此请在合适的地方加上 event.trigger("addCardToStorage"); 这一段代码 给周妃创建一个发动技能的时机
例3
...
player.gain(player.storage.xxx,'gain2','fromStorage');
...
这是从游戏外获得牌时的代码 并且前面两项大家应该都懂 
这一类情况的用法和第一类类似 只要括号里有'fromStorage'这个东西就行 
发现漏了一个函数
player.canCompare(target) 用于判断玩家能否和目标角色拼点
众所周知 按照三国杀规则 拼点发起者想和一名角色拼点 需要满足以下条件:
1. 拼点发起者不是拼点目标
2. 拼点发起者和拼点目标都有手牌(所以别指望秦宓白嫖拼点了 )
3. 拼点目标不是陆抗 
只有同时满足以上三个条件 函数才会返回true 否则返回结果为false
例:太史慈(火)的目标判断函数:
...
filterTarget:function(card,player,target){
 return player.canCompare(target);
},
...
想让一名角色能和陆抗一样 不能成为拼点目标 请参考下方写法:
...
ai:{
 noCompareTarget:true,
},
...
什么？为什么要把代码写在AI里面？当然是因为skillTag用着方便啊 
类似的 将noCompareTarget改成noCompareSource 可以让玩家不能发起拼点 不过我想一般没人会做这种负面技能 
另外1.9.87.1版 吴国太的【甘露】代码独立了出来 成为了新的swapEquip函数 用来让两名角色交换装备区内的牌:
例:
player.swapEquip(target);
括号里面填上要交换装备牌的角色就行 
新版本在执行shaBegin等和杀有关的时机时 可以直接在此步骤调整【杀】伤害 而不需要建立额外的技能
例:新黄忠【烈弓】的部分代码
.........
trigger:{player:'shaBegin'},
.........
content:function(){
.........
 if(typeof trigger.extraDamage!='number'){
 trigger.extraDamage=0;
 }
 trigger.extraDamage++;
.........
},
在useCard等时机也可以对【杀】的伤害进行调整
和上面的时机区别在于:如果一张【杀】指定了多个目标 在useCard相关的时机修改【杀】的伤害值时对所有的目标角色都有效 而上面的只对特定的目标有效
例:新版本【酒】的部分代码:
trigger:{player:'useCard'},
filter:function(event){
return event.card&&event.card.name=='sha';
},
forced:true,
content:function(){
if(!trigger.baseDamage) trigger.baseDamage=1;
trigger.baseDamage+=player.storage.jiu;
.........
},
众所周知 有些技能 看起来什么时候都能发动 然而在OL上却只能在出牌阶段内发动 如徐盛的【破军】 马云禄的【凤魄】等
判断一名角色是否处在出牌阶段内 使用player.isPhaseUsing()判断即可
关于自定义势力颜色的问题
在以前 自定义势力的颜色需要修改get.groupnature()函数
而现在不需要了 在lib.groupnature里添加需要的势力颜色映射即可
例:新版本「Key杀」中自定义【键】势力的相关代码
//设置势力的颜色
//这个步骤是在样式库中写入需要的势力颜色 rgba里面的四个数字就代表颜色的RGB值和透明度
 var style2=document.createElement('style');
 style2.innerHTML=".player .identity[data-color='key'],";
 style2.innerHTML+="div[data-nature='key'],";
 style2.innerHTML+="span[data-nature='key'] {text-shadow: black 0 0 1px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 5px,rgba(203, 177, 255,1) 0 0 10px,rgba(203, 177, 255,1) 0 0 10px}";
 style2.innerHTML+="div[data-nature='keym'],";
 style2.innerHTML+="span[data-nature='keym'] {text-shadow: black 0 0 1px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 5px,rgba(203, 177, 255,1) 0 0 5px,rgba(203, 177, 255,1) 0 0 5px,black 0 0 1px;}";
 style2.innerHTML+="div[data-nature='keymm'],";
 style2.innerHTML+="span[data-nature='keymm'] {text-shadow: black 0 0 1px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 2px,black 0 0 1px;}";
 document.head.appendChild(style2);
 //在lib.groupnat
 
player.getDamagedHp()
用于计算玩家已损失的体力值(若因旧周泰等而导致体力值小于0 则以0作为当前体力值进行计算)
player.changeGroup();
用于切换玩家的国籍
例:player.changeGroup('wei') 即为将玩家的势力切换为魏国
(在国战模式下不影响势力,胜利条件,野心家判断等)
get.isLuckyStar()
用于判断是否开启了【幸运星模式】的选项
关于useCard流程中的各种新时机
由于内容较多 会分为数个楼层讲解
图源为凌天翼规则集
useCard1(声明使用牌后)和useCard2(使用牌选择目标后)
useCard1目前在无名杀里只有朱雀羽扇(程普没有使用这个时机)
useCard2一般是一些(可以令一些其他角色也成为XXX牌目标)的技能
之后就是大家熟悉的useCard(牌被使用时)时机
一般用于一些纯粹摸牌系和全体强命系的技能
而useCardToPlayer(指定目标时)和useCardToTarget(成为目标时) 则往往是一些会改变卡牌目标数的技能
useCardToPlayer和useCardToTarget这两个时机 对卡牌的所有目标都会依次触发一遍 此时trigger.target即为被触发的目标
需要特别注意的是:这两个时机的trigger本身并不是useCard事件 trigger.parent/trigger.getParent()才是
之后依然是一连串的useCardToPlayered(指定目标后)和useCardToTargeted(成为目标后)的时机了
注意要点和上面差不多
 另外关于新版本卡牌强命的方法
除原有的wuxieRespondable的mod和norespond的skillTag之外 还可以通过以下的方法实现卡牌强命/不可无懈
例1:麴义【伏骑】
...
content:function(){
trigger.directHit.addArray(game.filterPlayer(function(current){
return current!=player&&get.distance(current,player)<=1;
}));
},
...
useCard事件的directHit列表 即为【不能使用或打出牌响应卡牌】的角色
想让此牌完全不能被响应？把场上所有角色都加进这个列表就行了
 例2:SP贾诩【缜略】
...
content:function(){
trigger.nowuxie=true;
},
...
只想让卡牌不能被无懈？直接把nowuxie属性设置为true即可
另外 这一属性也可以在useCard函数的括号内直接设置
例3:貂蝉【离间】
...
targets[1].useCard({name:'juedou'},'nowuxie',targets[0],'noai').animate=false;
...
那个nowuxie就是关键
 然后是两个国战模式专用的函数
get.guozhanRank()
用于判断一个武将在国战模式下的强度评级
评级有10个级别 从-1,0,1...一直到6,7,8 级别越高说明武将强度越强
士兵会被判断为-1 非国战原生武将会被判断为0 君主会被判断为7
其他武将将根据自己在lib.guozhanRank(若为鏖战模式 则改为优先以lib.aozhanRank)中的位置来判断强度
例:get.guozhanRank('gz_xunyou')
判断荀攸的强度 结果无论鏖战还是非鏖战都为8
另外 强度小于4的武将是会被AI荀攸马谡吕范直接换掉的
get.guozhanReverse(xxx,yyy)
用于AI判断是否要调整主副将顺序的函数 xxx为主将 yyy为副将 当AI觉得要换时返回值为true 否则为false
荀攸吕范必定会被AI放在主将
其次是是搭配三血武将的邓艾
搭配 三血将/周泰 的 姜维/孙策 则必定会被AI放在副将
新版本的伤害事件中 添加了damageBegin1 damageBegin2 damageBegin3 damageBegin4这四个新时机
分别对应图中的造成伤害时1 造成伤害时2 受到伤害时2 受到伤害时3
1,2是造成伤害时
3,4是受到伤害时
这么规定的
1,3可以改变伤害大小
2,4不能
game.cardsGotoSpecial()
将卡牌送至ui.special并触发周妃【良姻】
用法和game.cardsDiscard类似 不再赘述
phaseZhunbeiBegin/phaseJieshuBegin
新版本的【准备阶段】和【结束阶段】的时机
当然你继续用phaseBegin和phaseEnd也可以
useCard流程中的customArgs
这个恕我难以使用语言描述 不如贴个例子来的实在
例:黄忠【烈弓】部分代码
trigger:{player:'useCardToTargeted'},
logTarget:'target',
check:function(event,player){
return get.attitude(player,event.target)<=0;
},
filter:function(event,player){
if(event.card.name!='sha') return false;
if(event.target.countCards('h')<=player.countCards('h')) return true;
if(event.target.hp>=player.hp) return true;
return false;
},
content:function(){
if(trigger.target.countCards('h')<=player.countCards('h')) trigger.getParent().directHit.push(trigger.target);
if(trigger.target.hp>=player.hp){
var id=trigger.target.playerid;
var map=trigger.getParent().customArgs;
if(!map[id]) map[id]={};
if(typeof map[id].extraDamage!='number'){
map[id].extraDamage=0;
}
map[id].extraDamage++;
}
},
新版本出牌阶段主动技的新参数(均仅在discard为false且lose不为false时有效)
例:卡牌重铸类技能:
...
visible:true,
loseTo:'discardPile',
...
visible参数是让角色失去卡牌的过程中强制视为正面朝上失去
loseTo则是指定将卡牌的去向(默认为.ui.special)
新版本的judge事件中 可以通过设置callback事件 在judgeEnd和judgeAfter时机之前对判定牌进行操作 避免被曹植截胡
例:黄巾雷使【助祭】:
...
content:function(){
trigger.source.judge().callback=lib.skill.fuji.callback;
},
callback:function(){
var evt=event.getParent(2);
if(event.judgeResult.color=='black'){
game.cardsDiscard(card);
evt._trigger.num++;
}
else{
evt._trigger.source.gain(card,'gain2');
}
},
...
judgeResult即为判定相关结果
player.drawTo();
角色将手牌摸至X张,若角色手牌数不小于X则无事发生
例:李肃【馈珠】:
...
player.drawTo(Math.min(5,target.countCards('h')));
...


filterInD();
将一个Array中所有位于处理区的卡牌过滤出来
例:设一list为[c1,c2,c3,c4],其中c1和c3是位于处理区的卡牌
那么list.filterInD()得到的结果即为[c1,c3]
目前基本上为花瓶函数 无意义
关于处理区:
不知道处理区是什么的同学们 请自行查阅凌天翼规则集相关内容太长了我懒得贴
处理区在无名杀的代码为ui.ordering
为方便兼容旧扩展 使用get.position(card)方法读取处理区的卡牌 默认得到的仍然是弃牌堆('d')
使用get.position(card,true) 才会得到处理区('o')的结果
想把卡牌送进处理区 有两个方法
对于有主的卡牌 直接player.lose(cards,ui.ordering)伺候即可
无主的卡牌则是通过game.cardsGotoOrdering()解决 用法和那两个一样
想不插入卡牌置入弃牌堆的事件 请设置事件的noOrdering属性

例1 沙摩柯【蒺藜】
...
filter:function(event,player){
return player.getHistory('useCard').length+player.getHistory('respond').length==player.getAttackRange();
},
...
括号里填需要获取的行动的类型即可
目前支持2种事件类型:useCard(使用牌) respond(打出牌)
以一种字符串类型及skipped(本回合跳过过的阶段)
函数返回得到的结果为数组型数据
例2 刘琦【屯江】中判断本回合是否跳过了出牌阶段的部分
...
if(player.getHistory('skipped').contains('phaseUse')) return false;
...
skipped返回的数组内 包含角色本回合跳过的阶段的名称
注意和player.skipList进行区分
例3 魏蔡文姬【默识】
...
filter:function(event,player){
return player.getHistory('useCard',function(evt){
return evt.isPhaseUsing()&&['basic','trick'].contains(get.type(evt.card));
}).length>0&&player.countCards('h')>0;
},
...
可以通过在getHistory函数中添加一个函数作为参数 来对事件进行过滤
顺便 在本次更新中 一个事件也可以用isPhaseUsing()函数 判断其是否发生在出牌阶段
顺便 1.9.96.8版本中 摸牌阶段的相关时机有所变动

图中时机先后对应phaseDrawBefore phaseDrawBegin phaseDrawBegin1 phaseDrawBegin2
新版本添加了countMark hasMark addMark removeMark
用于对数量型标记进行快速操作
countMark
例:
player.countMark('nzry_huaiju')
返回的就是玩家拥有的【橘】标记的数量
你就站在此地不要走动 待我翻过铁道 去袁术座上给你偷三个橘子去.jpg
hasMark
例:
player.hasMark('nzry_huaiju')
有时候橘子的数量不重要 有橘子就行
当角色拥有某种标记时 返回值为true 否则为false
addMark
例:
player.addMark('nzry_huaiju',3);
一次性获得三个橘子
数字可以不填 默认为1
removeMark
用法和addMark一样 不讲了
在1.9.97.8.1或更高版本中 在lose事件里 可以直接通过event.hs/es/js 来判断一张卡牌在此次失去事件中原先所处的区域
例:陆逊【连营】:
filter:function(event,player){
if(player.countCards('h')) return false;
return event.hs&&event.hs.length;
},
三个参数均为包含卡牌的数组
相比使用card.original判断卡牌来源而言 这种方法不会受到其他插入结算的影响 结果更可靠

game.getGlobalHistory();
类似于getHistory() 用于获取本回合内发生过的 不属于任何角色的一些事件
目前仅支持cardMove参数(cardsDiscard cardsGotoOrdering cardsGotoSpecial等涉及卡牌位置改变的事件)
例:张昭张纮【固政】
var cards=[];
var cards2=[];
game.getGlobalHistory('cardMove',function(evt){
if(evt.name=='cardsDiscard'&&evt.getParent('phaseDiscard')==trigger) cards.addArray(evt.cards.filterInD('d'));
});
event.relatedLose
这是gain事件中 如果获得其他角色的卡牌时 其他角色失去卡牌的事件
例:蒋干【伪诚】
filter:function(event,player){
if(event.source==player&&event.player!=player&&player.hp>player.countCards('h')){
return event.relatedLose&&event.relatedLose.hs&&event.relatedLose.length>0;
}
return false;
},
player.hasUsableCard()
这个函数用于判断一名角色能否使用XX牌
如果该角色手牌中有XX牌 或者能够通过技能使用XX牌 则返回值为true 否则为false
例:判断能否使用【草船借箭】的代码
...
return player.hasUsableCard('caochuan');
...
直接填写要判断的卡牌名称即可

player.inRange(target);
判断target是否在player的攻击范围内
player.inRangeOf(source);
判断player是否在source的攻击范围内
现在cardsGotoOrdering函数 可以通过指定一个事件而不一定是强制使用当前事件 在这个事件之后丢弃所有还在处理区未被移动的卡牌
例:五谷丰登:
contentBefore:function(){
...
var cards=get.cards(num);
game.cardsGotoOrdering(cards).relatedEvent=event.getParent();
...
}
通过将relatedEvent设置为当前事件的parent(即useCard) 在这一事件结束时而不是contentBefore结束时再丢弃所有卡牌

在1.9.98.2以后的新版本中 useCard过程中中的event.card 不再是简单暴力地使用event.cards[0] 而是重新生成的一个{}
在这种情况下 判断这张牌是否为【转化】的卡牌的方法如下:
...
filter:function(event){
return (get.type(event.card,'trick')=='trick'&&event.card.isCard);
},
...
当event.card.isCard为true时 卡牌为非转化卡牌 否则为转化卡牌

xxx.set('yyy',zzz)
xxx.yyy=zzz
两种写法本质上一样 不过不用set的话 设置的数据没法传输给联机模式的其他玩家
