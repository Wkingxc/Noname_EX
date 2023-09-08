player.countCards(position,obj)
position  区域

obj  描述对象
描述对象可以描述卡牌的名称、花色、颜色、类型
obj可以简写为卡牌的名称
eg.
手牌中【闪】的数量player.countCards('h','shan')

eg.
player.countCards('h')
手牌数

eg.
player.countCards('h',{color:'black'})
黑色手牌数
player.getCards('h');