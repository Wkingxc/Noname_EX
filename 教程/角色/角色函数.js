player.gain(card,info)
info  描述,包括：

gain  表示玩家从其他玩家处获得一张牌,但不显示在武将界面上
gain2  表示玩家从其他玩家处获得一张牌,并显示在武将界面上

draw  表示玩家从牌堆获得一张牌,但不显示在武将界面上
draw2  表示玩家从牌堆获得一张牌,并显示在武将界面上

fromStorage  从标记中获得牌
fromRenku  从仁库中获得牌

player.addJudge(card)
向判定区加入一张卡牌

player.addSkill(skill)  玩家获得技能
skill为技能英文名
player.addTempSkill(skill,temp)
player.removeSkill(skill)  玩家失去技能

player.skip('a')玩家跳过a阶段,如a为 phaseJudge时,跳过判定阶段
player.init('a') 将玩家的武将牌替换为a,a为武将名
player.addSkill('a')玩家获得a技能, a为技能名

玩家获 得a技能直至b时刻,a为技能名。b为时机,如phaseAfter等 

player.revive() 玩家复活,将体力回复至1点

player.changeHujia(num,type,limit)
玩家获得num点护甲
type  失去护甲鱼类型
limit  是否有护甲限制,为true时护甲限制护甲限制为5,也可以自行设置上限

角色状态
player.isLinked();//返回玩家是否横置
player.link();//切换玩家的横置状态
player.link(true);//将玩家横置
player.link(false);//解除横置

player.isTurnedOver() //判断玩家是否翻面
player.turnOver();//切换玩家的翻面状态
player.turnOver(true);//玩家翻面
player.turnOver(false);//翻到正面

死亡相关
player.die() 玩家立刻死亡

player.revive() 玩家复活,体力回复至一点

player.out() 玩家离开游戏

player.isOut()  玩家是否离开游戏
player.isIn()  玩家是否在场


player.update() 玩家刷新状态