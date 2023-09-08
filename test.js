game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"Test",content:function(config,pack){
    
},precontent:function(){
    
},config:{},help:{},package:{
    character: {
        card:{
            card:{
            },
            translate:{
            },
            list:[],
        },
        character:{
            xzhipeilvzhe:["none","jin",3,["xzhipei","xqianren",],[]],
        },
        translate:{
            xzhipeilvzhe: "支配之律者",
        },
    },
    
    skill:{
        skill: {
            //测试：每轮限一次，你选择一名角色，
            //你可以废除一个装备栏，获得其一个非限觉主的技能直到下个回合开始。
            xt: {
                enable: 'phaseUse',
                round: 1,
                filter: function (event, player) {
                    return !player.hasSkill('xt_clear');
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
                    player.addTempSkill('xt_clear', { player: 'phaseBegin' });
                    event.target.disableSkill('xt2', result.control);
                    event.target.addAdditionalSkill('xt_' + player.playerid, 'xt2');

                    var mark = get.translation(result.control);
                    event.target.markSkill('xt2', '', '被支配 ' + mark);
                    
                },
                subSkill: {
                    clear: {
                        onremove: function (player) {
                            game.countPlayer(function (current) {
                                current.removeAdditionalSkill('xt_' + player.playerid);
                            })
                        },
                        sub: true,
                        parentskill: "xt",
                    }
                },

            },
            xt2: {
                onremove: function (player, skill) {
                    player.enableSkill(skill);
                },
                intro: {},
                locked: true,
                charlotte: true,
            },
            t: {
                trigger: {
                    player: "phaseAfter",
                },
                forced: true,
                frequent: true,
                content: function () {
                    var num = player.countMark('t');
                    for (var i = 0; i < num; i++) { 
                        player.removeMark('t',1);
                        player.insertPhase();
                    }
                },
                group: "t_lun",
                subSkill: {
                    lun: {
                        trigger: {
                            global:"roundStart",
                        },
                        frequent: true,
                        content: function () {
                            var num = game.countPlayer() - 1;
                            player.addMark('t', num)
                        }
                    }
                }
            },

            /*支配：每轮限一次,你可以与一名角色拼点。
            若你赢, 你可以废除你的一个装备栏, 然后获得其一个非限觉主的技能直到下个回合开始;
            若你没赢, 其对你造成一点伤害并获得一枚“傀”标记。
            拥有“傀”标记的角色手牌上限- 1, 摸牌阶段少摸一张牌, 其回合结束时移除该标记。*/
            xzhipei: {
                enable: 'phaseUse',
                round: 1,
                filter: function (event, player) {
                    return !player.hasSkill('xzhipei_clear')&&player.countCards('h')>0;
                },
                filterTarget:function(card,player,target){
                    return player!=target&&target.countCards('h');
                },
                content: function () {
                    'step 0'
                    player.chooseToCompare(target);
                    'step 1'
                    if (result.bool) {
                        event.goto(2);
                    } else {
                        event.goto(4);
                    }
                    'step 2'
                    // event.target = result.targets[0];
                    event.target = target;
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
                    'step 3'
                    player.addTempSkill(result.control, { player: 'phaseBegin' });
                    player.addTempSkill('xzhipei_clear', { player: 'phaseBegin' });
                    event.target.disableSkill('xzhipei2', result.control);
                    event.target.addAdditionalSkill('xzhipei_' + player.playerid, 'xzhipei2');
                    var mark = get.translation(result.control);
                    event.target.markSkill('xzhipei2', '', '被支配 ' + mark);
                    event.finish();
                    'step 4'
                    player.damage(event.target);
                    event.target.addTempSkill('xzhipei_kui', { player: 'phaseAfter' });
                    event.target.markSkill('xzhipei_kui', '傀','傀');
                    
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
                    },
                    kui: {
                        frequent: true,
                        trigger: {
                            player: "phaseDrawBegin2",
                        },
                        filter:function(event,player){
                            return !event.numFixed;
                        },
                        content:function(){
                            trigger.num--;
                        },
                        mod: {
                            maxHandcard: function (player, num) {
                                return num - 1;
                            }
                        },
                        sub: true,
                        parentskill: "xzhipei",
                    },
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

            /*千人：觉醒技,当你死亡时,你复活、复原装备栏并将体力上限改为1点,获得技能【剧场】和1点护盾;
            全场存活角色进入支配剧场,获得技能【信标】和一枚“支”标记。 */
            xqianren: {
                skillAnimation: true,
                animationColor: 'wood',
                juexingji: true,
                forced: true,
                trigger: {
                    player: "dieBefore",
                },
                content: function () {
                    'step 0'
                    trigger.cancel();
                    player.revive(1);
                    player.loseMaxHp(player.maxHp - 1);
                    var num = player.countDisabled();
                    if (num) {
                        for (var i = 1; i < 6; i++){
                            if(player.isDisabled(i)){player.enableEquip(i);}
                        }
                    }
                    player.addSkill('xjuchang');
                    player.changeHujia(1);
                    'step 1'
                    game.countPlayer(function (current) {
                        if(current!=player){
                            current.addSkill('xxinbiao');
                        }
                    }),
                    player.awakenSkill('xqianren');
                }
            },

            /*剧场：锁定技,拥有“支”标记的角色对你造成伤害后,你获得其一个技能直到你下个回合结束。
            每轮开始时,该轮你额外执行X个回合,你的手牌上限+X(X为全场“支”的数量)。 */
            xjuchang: {
                forced: true,
                trigger: {
                    player:"damageAfter",
                },
                filter: function (event, player) {
                    return event.source && event.source.hasSkill('xxinbiao');
                },
                content: function () {
                    'step 0'
                    event.target = trigger.source;
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
                    if (event.skills.length > 0) {
                        player.chooseControl(event.skills);
                    } else { event.finish(); }
                    'step 1'
                    player.addTempSkill(result.control, { player: 'phaseAfter' });
                    player.addTempSkill('xzhipei_clear', { player: 'phaseAfter' });
                    event.target.disableSkill('xzhipei2', result.control);
                    event.target.addAdditionalSkill('xzhipei_' + player.playerid, 'xzhipei2');
                    var mark = get.translation(result.control);
                    event.target.markSkill('xzhipei2', '', '被支配 ' + mark);
                },
                mod: {
                    maxHandcard: function (player, num) {
                        return num + game.countPlayer(function (current) {
                            return current.hasSkill('xxinbiao');
                        });
                    }
                },
                group: ["xjuchang_huihe","xjuchang_lun"],
                subSkill: {
                    huihe: {
                        trigger: {
                            player: "phaseBefore",
                        },
                        forced: true,
                        frequent: true,
                        content: function () {
                            var num = player.countMark('xjuchang');
                            for (var i = 0; i < num; i++) {
                                player.removeMark('xjuchang', 1);
                                player.insertPhase();
                            }
                        },
                    },
                    lun: {
                        frequent: true,
                        trigger: {
                            global: "roundStart",
                        },
                        content: function () {
                            var num = game.countPlayer(function (current) {
                                return current.hasSkill('xxinbiao');
                            });
                            player.addMark('xjuchang', num);
                        },
                    },
                },
            },

            /*信标：锁定技,当你进入濒死状态时,你移除一枚“支”标记。*/
            xxinbiao: {
                mark: true,
                marktext: "支",
                intro: {
                    name: "支",
                    content: "锁定技,当你进入濒死状态时,你移除一枚“支”标记。",
                },
                forced: true,
                locked: true,
                frequent: true,
                init: function (player) {
                    player.addMark('xxinbiao', 1);
                },
                trigger: {
                    player: "dyingBegin",
                },
                content: function () {
                    player.removeMark('xxinbiao');
                    player.removeSkill('xxinbiao');
                }
            },
        },
        translate: {
            t: "删除",
            "t_info": "删除",
            xt: "测试",
            "xt_info": "每轮限一次,你选择一名角色,你可以废除一个装备栏,获得其一个非限觉主的技能直到下个回合开始。",
            xzhipei: "支配",
            "xzhipei_info": "每轮限一次,你可以与一名角色拼点。若你赢, 你可以废除你的一个装备栏, 然后获得其一个非限觉主的技能直到下个回合开始; 若你没赢, 其对你造成一点伤害并获得一枚“傀”标记。拥有“傀”标记的角色手牌上限- 1, 摸牌阶段少摸一张牌, 其回合结束时移除该标记。",
            xqianren: "千人",
            "xqianren_info": "觉醒技,当你死亡时,你复活、复原装备栏并将体力上限改为1点,获得技能【剧场】和1点护盾; 全场存活角色进入支配剧场,获得技能【信标】和一枚“支”标记。",
            xjuchang: "剧场",
            "xjuchang_info": "锁定技,拥有“支”标记的角色对你造成伤害后,你获得其一个技能直到你下个回合结束。每轮开始时,该轮你额外执行X个回合,你的手牌上限+X(X为全场“支”的数量)。",
            xxinbiao: "信标",
            "xxinbiao_info": "锁定技,当你进入濒死状态时,你移除一枚“支”标记。",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["xzhipeilvzhe.jpg"],"card":[],"skill":[]}}})