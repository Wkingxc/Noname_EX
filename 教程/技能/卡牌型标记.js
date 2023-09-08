扣置在武将牌上的牌

player.getExpansions(storage)
返回扣置上武将牌上的牌

注意：
扣置在武将牌上的牌位于x区

player.addToExpansion(cards)
cards  被扣置在武将牌上的牌，可以为一张或多张

函数返回事件对象，可以设置卡牌标签
eg.
player.addToExpansion(cards).gaintag.add(tag)
tag  标签名

注意：将牌置入仁库中同样是用的这个函数