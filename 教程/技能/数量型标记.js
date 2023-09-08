数量型标记
hasMark
countMark

addMark
removeMark
clearMark

lib.skill.juxi={
    enable:"phaseUse",
    usable:1,
    filter:function(event,player){
        return player.storage.juxi>=game.countPlayer();
    },
    filterTarget:true,
    init:function(player){
        player.storage.juxi=0;
    },
    "init2":function(player){
        if(get.mode()=='guozhan'){
            player.logSkill('juxi');
        }
    },
    intro:{
        content:"mark",
    },
    content:function(){
        'step 0'
        player.storage.juxi-=game.countPlayer();
        player.syncStorage('juxi');
        if(player.storage.juxi<=0){
            player.unmarkSkill('juxi');
        }
        else{
            player.updateMarks();
        }
        if(target.isDamaged()){
            player.chooseControl(function(){
                if(get.attitude(player,target)>0) return 1;
                return 0;
            }).set('choiceList',[
                '对'+get.translation(target)+'造成一点伤害',
                '令'+get.translation(target)+'回复一点体力',
            ])
        }
        else{
            target.damage();
            event.finish();
        }
        'step 1'
        if(result.control=='选项一'){
            target.damage();
        }
        else{
            target.recover();
        }
    },
    ai:{
        order:7,
        result:{
            target:function(player,target){
                if(get.attitude(player,target)>0){
                    if(target.isDamaged()) return get.recoverEffect(target,player,target);
                    return 0;
                }
                else{
                    return get.damageEffect(target,player,target);
                }
            },
        },
    },
    group:"juxi_count",
    subSkill:{
        count:{
            trigger:{
                global:"discardAfter",
            },
            forced:true,
            popup:false,
            filter:function(event,player){
                return _status.currentPhase!=event.player;
            },
            content:function(){
                player.storage.juxi++;
                player.syncStorage('juxi');
                player.markSkill('juxi');
                player.updateMarks();
            },
            sub:true,
        },
    },
}

锁定技，每当一名角色于其回合外弃置牌，你获得一枚聚息标记；出牌阶段限一次，你可以移去X枚聚息标记，然后选择一项：对一名角造成一点伤害，或令一名角色回复一点体力，X为存活角色数