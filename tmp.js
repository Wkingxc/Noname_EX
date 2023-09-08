
/*技能描述: 当你于出牌阶段内对一名角色造成伤害后，
你可以选择该角色武将牌上的一个技能。
若如此做，你结束出牌阶段，且你令此技能于其下个回合结束之前无效
*/
    filter: function(event, player) {
        if (!player.isPhaseUsing() || event.player.isDead()) return false;
        for (var i in event.player.disabledSkills) {
            if (event.player.disabledSkills[i].contains('olduorui2')) return false;
        }
        var list = [];
        var listm = [];
        var listv = [];
        if (event.player.name1 != undefined) listm = lib.character[event.player.name1][3];
        else listm = lib.character[event.player.name][3];
        if (event.player.name2 != undefined) listv = lib.character[event.player.name2][3];
        listm = listm.concat(listv);
        var func = function (skill) {
            var info = get.info(skill);
            if (!info || info.charlotte) return false;
            return true;
        };
        for (var i = 0; i < listm.length; i++) {
            if (func(listm[i])) list.add(listm[i]);
        }
        return list.length > 0;
    },
    logTarget: "player",
    content: function() {
        'step 0'
        var list = [];
        var listm = [];
        var listv = [];
        if (trigger.player.name1 != undefined) listm = lib.character[trigger.player.name1][3];
        else listm = lib.character[trigger.player.name][3];
        if (trigger.player.name2 != undefined) listv = lib.character[trigger.player.name2][3];
        listm = listm.concat(listv);
        var func = function (skill) {
            var info = get.info(skill);
            if (!info || info.charlotte) return false;
            return true;
        };
        for (var i = 0; i < listm.length; i++) {
            if (func(listm[i])) list.add(listm[i]);
        }
        event.skills = list;
        player.chooseControl(list).set('prompt', '选择' + get.translation(trigger.player) + '武将牌上的一个技能并令其失效');
        'step 1'
        trigger.player.disableSkill('olduorui2', result.control);
        trigger.player.addTempSkill('olduorui2', { player: 'phaseAfter' });
        game.log(player, '选择了', trigger.player, '的技能', '#g【' + get.translation(result.control) + '】');
        event.getParent('phaseUse').skipped = true;
},
    
olduorui2:{
    onremove:function(player,skill){
        player.enableSkill(skill);
    },
    locked:true,
    mark:true,
    charlotte:true,
    intro:{
        content:function(storage,player,skill){
            var list=[];
            for(var i in player.disabledSkills){
                if(player.disabledSkills[i].contains(skill)) list.push(i);
            };
            if(list.length){
                var str='失效技能：';
                for(var i=0;i<list.length;i++){
                    if(lib.translate[list[i]+'_info']) str+=get.translation(list[i])+'、';
                };
                return str.slice(0,str.length-1);
            };
        },
    },
}
    
    
    
    /*当你于出牌阶段内对一名其他角色造成伤害后，你可以废除你的一个装备栏，
    然后选择该角色的武将牌上的一个技能（限定技、觉醒技、主公技除外），
    令其于其下回合结束之前此技能无效，然后你于其下回合结束或其死亡之前拥有此技能且不能发动“夺锐”。 */
{
    init:function(player, skill) {
        if (!player.storage.drlt_duorui) player.storage.drlt_duorui = [];
    },
    trigger:{
        source:"damageSource",
    },
    filter:function(event, player) {
        if (player.storage.drlt_duorui.length) return false;
        return player != event.player && event.player.isAlive() && _status.currentPhase == player;
    },
    content:function() {
        'step 0'
        var list = [];
        var listm = [];
        var listv = [];
        if (trigger.player.name1 != undefined) listm = lib.character[trigger.player.name1][3];
        else listm = lib.character[trigger.player.name][3];
        if (trigger.player.name2 != undefined) listv = lib.character[trigger.player.name2][3];
        listm = listm.concat(listv);
        var func = function(skill) {
            var info = get.info(skill);
            if (!info || info.charlotte || info.hiddenSkill || info.zhuSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable) || lib.skill.drlt_duorui.bannedList.contains(skill)) return false;
            return true;
        };
        for (var i = 0; i < listm.length; i++) {
            if (func(listm[i])) list.add(listm[i]);
        }
        event.skills = list;
        if (player.countDisabled() < 5) {
            player.chooseToDisable();
        }
        'step 1'
        if (event.skills.length > 0) {
            player.chooseControl(event.skills)
                .set('prompt', '请选择要获得的技能');
        } else event.finish();
        'step 2'
        player.addTempSkill(result.control, {player: 'dieAfter'});
        player.popup(result.control, 'thunder');
        player.storage.drlt_duorui = [result.control];
        player.storage.drlt_duorui_player = trigger.player;
        trigger.player.storage.drlt_duorui = [result.control];
        trigger.player.addTempSkill('drlt_duorui1', {
            player: 'phaseAfter'
        });
        game.log(player, '获得了技能', '#g【' + get.translation(result.control) + '】')
        player.unmarkSkill('drlt_duorui_mark');
        var mark = get.translation(result.control);
        player.storage.drlt_duorui_mark = '';
        player.addSkill("drlt_duorui_mark", );
        player.markSkill("drlt_duorui_mark", '', '夺锐 ' + mark);
        trigger.player.addTempSkill("drlt_duorui_mark", {
            player: 'phaseAfter'
        });
        trigger.player.markSkill("drlt_duorui_mark", '', '被夺锐 ' + mark);
    },
    group:["duorui_clear"],
    subSkill:{
        mark:{
            intro:{
            },
            sub:true,
            parentskill:"drlt_duorui",
        },
    },
}

//每回合限一次，出牌阶段，你可以展示至多四张牌名各不相同的手牌，并选择等量的角色，
//然后每名角色可以从“写满技能的天书”中获得一个技能，直到你的下回合开始。
{
    enable:"phaseUse",
    filter:function(event,player){
        return !player.hasSkill('jinghe_clear');
    },
    content:function(){
        'step 0'
        player.showCards(cards,get.translation(player)+'发动了【经合】');
        event.skills=lib.skill.jinghe.derivation.randomGets(4);
        player.addTempSkill('jinghe_clear',{player:'phaseBegin'});
        event.targets.sortBySeat();
        event.num=0;
        'step 1'
        event.target=targets[num];
        event.num++;
        event.target.chooseControl(event.skills,'cancel2').set('choiceList',event.skills.map(function(i){
            return '<div class="skill">【'+get.translation(lib.translate[i+'_ab']||get.translation(i).slice(0,2))+'】</div><div>'+get.skillInfoTranslation(i,player)+'</div>';
        })).set('displayIndex',false).set('prompt','选择获得一个技能');
        'step 2'
        var skill=result.control;
        if(skill!='cancel2'){
            event.skills.remove(skill);
            target.addAdditionalSkill('jinghe_'+player.playerid,skill);
            target.popup(skill);
            game.log(target,'获得了技能','#g【'+get.translation(skill)+'】');
        }
        if(event.num<event.targets.length) event.goto(1);
        if(target!=game.me&&!target.isOnline2()) game.delayx();
    },
    subSkill:{
        clear:{
            onremove:function(player){
                game.countPlayer(function(current){
                    current.removeAdditionalSkill('jinghe_'+player.playerid);
                });
            },
            sub:true,
            parentskill:"jinghe",
        },
    },
}

//测试：每轮限一次，你选择一名角色，
            //你可以废除一个装备栏，获得其一个非限觉主的技能直到下个回合开始。
            xzhipei: {
                enable: 'phaseUse',
                round: 1,
                filter: function (event, player) {
                    return !player.hasSkill('xzhipei_clear');
                },
                content: function () {
                    'step 0'
                    player.chooseTarget('选择一名角色', function (card, player, target) {
                        return target != player;
                    });
                    'step 1'
                    event.target = result.targets[0];
                    var list = [];
                    var listm = [];
                    var listv = [];
                    if (event.target.name1 != undefined) listm = lib.character[event.target.name1][3];
                    else listm = lib.character[event.target.name][3];
                    if (event.target.name2 != undefined) listv = lib.character[event.target.name2][3];
                    listm = listm.concat(listv);
                    var func = function (skill) {
                        var info = get.info(skill);
                        if (!info || info.charlotte || info.hiddenSkill || info.zhuSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable)) return false;
                        return true;
                    }
                    for (var i = 0; i < listm.length; i++) {
                        if (func(listm[i])) list.add(listm[i]);
                    }
                    event.skills = list;
                    if (player.countDisabled() < 5) {
                        player.chooseToDisable();
                    }
                    if (event.skills.length > 0) {
                        player.chooseControl(event.skills);
                    } else { event.finish(); }
                    'step 2'
                    player.addTempSkill(result.control, { player: 'phaseBegin' });
                    player.addTempSkill('xzhipei_clear', { player: 'phaseBegin' });
                    event.target.disableSkill('xzhipei2', result.control);
                    event.target.addAdditionalSkill('xzhipei_' + player.playerid, 'xzhipei2');

                    var mark = get.translation(result.control);
                    event.target.markSkill('xzhipei2', '', '被支配 ' + mark);
                    
                },
                subSkill: {
                    clear: {
                        onremove: function (player) {
                            game.countPlayer(function (current) {
                                current.removeAdditionalSkill('xzhipei_' + player.playerid);
                            })
                        },
                        sub: true,
                        parentskill: "xzhipei",
                    }
                },

            },
            xzhipei2: {
                onremove: function (player, skill) {
                    player.enableSkill(skill);
                },
                intro: {},
                locked: true,
                charlotte: true,
            },