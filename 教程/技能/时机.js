player玩家，current当前玩家， target其他玩家， global场上所有角色

　　【阶段类】
	phaseName:['phaseZhunbei','phaseJudge','phaseDraw','phaseUse','phaseDiscard','phaseJieshu'],
	
	enterGame
　　gameStart
　　所有人都展示武将牌后 (前缀必须为global)

　　gameDrawBefore/Begin/End/After
　　游戏开始阶段 前/时/后/结束后 (前缀必须为global)
　　phaseBefore/Begin/End/After
　　回合阶段 开始前/时/后/结束后
    phaseZhunbeiBefore/Begin/End/After
　　准备阶段 开始前/时/后/结束后
　　phaseJudgeBefore/Begin/End/After
　　判定阶段 开始前/时/后/结束后
　　phaseDrawBefore/Begin/End/After
　　摸牌阶段 开始前/时/后/结束后
　　phaseUseBefore/Begin/End/After
　　出牌阶段 开始前/时/后/结束后
　　phaseDiscardBefore/Begin/End/After
　　弃牌阶段 开始前/时/后/结束后
    phaseJieshuBefore/Begin/End/After
　　结束阶段 开始前/时/后/结束后

　　【卡牌类】
　　shaBefore/Begin/End/After
　　使用杀 之前/时/后/结束后
    player:"shaMiss"
    使用杀未命中
    
　　juedouBeforeBegin/End/After
　　使用决斗 之前/时/后/结束后

　　useCardBefore/Begin/End/After
　　使用卡牌 之前/时/后/结束后
　　useCardToBefore/Begin/End/After
　　使用卡牌指定 之前/时/后/结束后
　　respondBefore/Begin/End/After
　　打出卡牌 之前/时/后/结束后


　　loseBefore/Begin/End/After
　　失去卡牌 之前/时/后/结束后
　　gainBefore/Begin/End/After
　　获得卡牌 之前/时/后/结束后
　　drawBefore/Begin/End/After
　　从牌堆摸牌 之前/时/后/结束后
　　equipBefore/Begin/End/After
　　装备装备牌 之前/时/后/结束后

　　【体力类】
　　damageBefore/Begin/End/After
　　受到伤害 之前/时/后/结束后
　　(若前缀为source则为你造成伤害)
　　loseHpBefore/Begin/End/After
　　失去(流失)体力 之前/时/后/结束后
　　recoverBefore/Begin/End/After
　　回复体力 之前/时/后/结束后
　　changeHpBefore/Begin/End/After
　　体力值发生改变  之前/时/后/结束后
　　loseMaxHpBefore/Begin/End/After
　　减少体力上限 之前/时/后/结束后
　　gainMaxHpBefore/Begin/End/After
　　增加体力上限 之前/时/后/结束后

　　【状态类】
    dyingBefore/Begin/End/After
　　进入濒临状态 之前/时/后/结束后
　　dieBefore/Begin/End/After
　　死亡 之前/时/后/结束后

　　chooseToRespondBefore/Begin/End/After
　　在你需要响应卡牌 之前/时/后/结束后
　　turnOverBefore/Begin/End/After
　　武将牌翻面 之前/时/后/结束后
　　linkBefore/Begin/End/After
　　武将牌横置(连环) 之前/时/后/结束后



    【主动技时机】
　　enable:"phaseUse", 回合使用
　　enable:"chooseToUse", 挑选卡牌以使用
　　enable:"chooseToRespond", 挑选卡牌以响应