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
            xzhipeilvzhe: ["none", "jin", 3, ["xzhipei", "xqianren",], []],
            xliuyan: ["male", "shen", 3, ["t"], []],
            xxiao: ['male', "shen", 3, ["xchaoli", "xboshi", "xxiuse", "xwulai"], []],
        },
        translate:{
            xzhipeilvzhe: "支配之律者",
            xliuyan: "刘焉",
            xxiao: "肖吊毛",
        },
    },
    
    skill:{
        skill: {
            t: {
                trigger: {
                    player: "phaseAfter",
                },
                forced: true,
                frequent: true,
                content: function () {
                    var num = player.countMark('t');
                    for (var i = 0; i < num; i++) {
                        player.removeMark('t', 1);
                        player.insertPhase();
                    }
                },
                group: "t_lun",
                subSkill: {
                    lun: {
                        trigger: {
                            global: "roundStart",
                        },
                        frequent: true,
                        content: function () {
                            var num = game.countPlayer() - 1;
                            player.addMark('t', num)
                        }
                    }
                }
            },

            /*钞力：锁定技,你使用或打出一张牌后,获得等于此牌点数的“钞”标记。
            出牌阶段限X次, 你可以移去10张“钞”, 视为使用一种任意基本牌或者普通锦囊牌(X为3-体力上限)。*/
            xchaoli: {
                audio:1,
                enable:"phaseUse",
                // usable:2,
                filter: function (event, player) {
                    var num = 2;
                    return (player.getStat("skill").xchaoli||0) < num && player.countMark('xchaoli_chao') >= 10;
                },
                chooseButton:{
                    dialog:function(event,player){
                        var list=[];
                        for(var i=0;i<lib.inpile.length;i++){
                            var name=lib.inpile[i];
                            if(name=='sha'){
                                list.push(['基本','','sha']);
                                for(var j of lib.inpile_nature) list.push(['基本','','sha',j]);
                            }
                            else if(get.type(name)=='trick') list.push(['锦囊','',name]);
                            else if(get.type(name)=='basic') list.push(['基本','',name]);
                        }
                        return ui.create.dialog('钞力',[list,'vcard']);
                    },
                    filter:function(button,player){
                        return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
                    },
                    backup:function(links,player){
                        return {
                            filterCard:true,
                            audio:'scstaoluan',
                            selectCard:0,
                            viewAs: { name: links[0][2], nature: links[0][3]},
                            onuse: function (result, player) {
                                player.removeMark('xchaoli_chao', 10);
                            }
                        }
                    },
                    
                },
                group: "xchaoli_chao",
                subSkill: {
                    chao: {
                        sub: true,
                        parent: "xchaoli",
                        forced: true,
                        trigger: {
                            player: ["useCard", "respond"],
                        },
                        filter: function (event, player) {
                            return typeof get.number(event.card) == 'number';
                        },
                        marktext: "钞",
                        intro: {
                            content: "mark",
                        },
                        content: function () {
                            player.addMark('xchaoli_chao', get.number(trigger.card));
                        },
                    },
                },
            },
            /**博识：摸牌阶段开始时，你可以跳过并进行判定：若结果与此阶段内以此法进行判定的结果的点数均不同,
             * 你可以重复此流程,然后你摸所有判定生效牌数一半的牌(向下取整),若此时你手牌全场最多,你失去一点体力。*/
            xboshi: {},
            //秀色：你对女性角色造成伤害时,你获得其一张牌;当女性角色对你造成伤害时,你随机弃置一张手牌或装备牌。
            xxiuse: {},
            //无赖：锁定技,当你处于濒死状态时,若体力上限大于1,你减少一点体力上限,并回复一点体力。
            xwulai: {},

        },
        translate: {
            t: "测试",
            "t_info": "测试",
            xchaoli: "钞力",
            xchaoli_info: "锁定技,你使用或打出一张牌后,获得等于此牌点数的“钞”标记。出牌阶段限X次, 你可以移去10张“钞”, 视为使用一种任意基本牌或者普通锦囊牌(X为3-体力上限)。",
            xboshi: "博识",
            xboshi_info: "出牌阶段限一次,你可以进行判定：若结果与此阶段内以此法进行判定的结果的点数均不同,你可以重复此流程,然后你摸所有判定生效牌数一半的牌(向下取整),若此时你手牌全场最多,你失去一点体力。",
            xxiuse: "秀色",
            xxiuse_info: "你对女性角色造成伤害时,你获得其一张牌;当女性角色对你造成伤害时,你随机弃置一张手牌或装备牌。",
            xwulai: "无赖",
            xwulai_info: "锁定技,当你处于濒死状态时,若体力上限大于1,你减少一点体力上限,并回复一点体力。",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[""],"card":[],"skill":[]}}})
