{
    audio:"shuishi",
    enable:"phaseUse",
    usable:1,
    frequent:true,
    filter:function(event,player){
        return player.maxHp<10;
    },
    content:function(){
        'step 0'
        event.cards=[];
        event.suits=[];
        'step 1'
        player.judge(function(result){
            var evt=_status.event.getParent('reshuishi');
            if(evt&&evt.suits&&evt.suits.contains(get.suit(result))) return 0;
            return 1;
        }).set('callback',lib.skill.reshuishi.callback).judge2=function(result){
            return result.bool?true:false;
        };
        'step 2'
        var cards=cards.filterInD();
        if(cards.length) player.chooseTarget('将'+get.translation(cards)+'交给一名角色',true).set('ai',function(target){
            var player=_status.event.player;
            var att=get.attitude(player,target)/Math.sqrt(1+target.countCards('h'));
            if(target.hasSkillTag('nogain')) att/=10;
            return att;
        });
        else event.finish();
        'step 3'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
            player.line(target,'green');
            target.gain(cards,'gain2').giver=player;
        }
        else event.finish();
        'step 4'
        if(target.isMaxHandcard()) player.loseMaxHp();
    },
    callback:function(){
        'step 0'
        var evt=event.getParent(2);
        event.getParent().orderingCards.remove(event.judgeResult.card);
        evt.cards.push(event.judgeResult.card);
        if(event.getParent().result.bool&&player.maxHp<10){
            evt.suits.push(event.getParent().result.suit);
            player.gainMaxHp();
            player.chooseBool('是否继续发动【慧识】？').set('frequentSkill','reshuishi');
        }
        else event._result={bool:false};
        'step 1'
        if(result.bool) event.getParent(2).redo();
    },
}