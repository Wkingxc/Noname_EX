这个函数的功能是在玩家发动技能时,记录技能的发动,播放技能的音效与特效

这个函数的参数有四个,分别是name, targets, nature, logv。

name是技能的名称,可以是一个字符串或者一个数组。如果是一个数组,那么第一个元素是技能的名称,第二个元素是弹出的名称。例如,name可以是[wushuang,无双]。

targets是技能的目标,可以是一个玩家或者一个玩家数组。例如,targets可以是player或者[player1,player2]。

nature是技能的属性,可以是undefined, false, green, red, thunder, fire等。如果是undefined或者false,那么不画线条。如果是其他值,那么画出对应颜色的线条。

logv是一个布尔值,表示是否记录技能的信息到游戏日志中。

函数的主要逻辑如下：

首先,检查技能是否有翻译,如果有,那么尝试播放技能的动画,并在玩家头像上弹出技能的名称。
然后,根据技能的目标,生成一条日志信息,记录玩家对谁发动了什么技能。例如,“张飞对刘备、关羽发动了【咆哮】”。
接着,根据技能的属性,画出线条。例如,“张飞对刘备、关羽发动了【咆哮】”时,画出红色的线条。
然后,检查技能是否有ai属性,并且是否有暴露度。如果有,并且玩家没有关闭ai日志,并且目标不是自己,那么记录玩家的暴露度。暴露度表示玩家使用这个技能时对其他玩家的敌意程度。
然后,检查技能是否有round属性。如果有,那么给玩家添加一个回合计数器,并且标记这个技能。回合计数器表示这个技能在多少回合后失效。
然后,尝试播放技能的音效。
然后,如果游戏模式是象棋模式,那么让玩家聚焦到棋盘上。
然后,根据logv参数,决定是否记录技能的信息到游戏日志中。
最后,创建一个logSkill事件,并且把它插入到当前事件的after数组中。这个事件会把技能的信息保存到玩家的历史记录中,并且触发一些与技能相关的事件。

lib.element.player.logSkill=function(name,targets,nature,logv){
	if(get.itemtype(targets)=='player') targets=[targets];
	var nopop=false;
	var popname=name;
	if(Array.isArray(name)){
		popname=name[1];
		name=name[0];
	}
	var checkShow=this.checkShow(name);
	if(lib.translate[name]){
		this.trySkillAnimate(name,popname,checkShow);
		if(Array.isArray(targets)&&targets.length){
			var str;
			if(targets[0]==this){
				str='#b自己';
				if(targets.length>1){
					str+='、';
					str+=get.translation(targets.slice(1));
				}
			}
			else str=targets;
			game.log(this,'对',str,'发动了','【'+get.skillTranslation(name,this)+'】');
		}
		else{
			game.log(this,'发动了','【'+get.skillTranslation(name,this)+'】');
		}
	}
	if(nature!=false){
		if(nature===undefined){
			nature='green';
		}
		this.line(targets,nature);
	}
	var info=lib.skill[name];
	if(info&&info.ai&&info.ai.expose!=undefined&&
		this.logAi&&(!targets||targets.length!=1||targets[0]!=this)){
		this.logAi(lib.skill[name].ai.expose);
	}
	if(info&&info.round){
		var roundname=name+'_roundcount';
		this.storage[roundname]=game.roundNumber;
		this.syncStorage(roundname);
		this.markSkill(roundname);
	}
	game.trySkillAudio(name,this,true);
	if(game.chess){
		this.chessFocus();
	}
	if(logv===true){
		game.logv(this,name,targets,null,true);
	}
	else if(info&&info.logv!==false){
		game.logv(this,name,targets);
	}
	if(info){
		var player=this;
		var players=player.getSkills(false,false,false);
		var equips=player.getSkills('e');
		var global=lib.skill.global.slice(0);
		var logInfo={
			skill:name,
			targets:targets,
			event:_status.event,
		};
		if(info.sourceSkill){
			logInfo.sourceSkill=info.sourceSkill;
			if(global.contains(info.sourceSkill)){
				logInfo.type='global';
			}
			else if(players.contains(info.sourceSkill)){
				logInfo.type='player';
			}
			else if(equips.contains(info.sourceSkill)){
				logInfo.type='equip';
			}
		}
		else{
			if(global.contains(name)){
				logInfo.sourceSkill=name;
				logInfo.type='global';
			}
			else if(players.contains(name)){
				logInfo.sourceSkill=name;
				logInfo.type='player';
			}
			else if(equips.contains(name)){
				logInfo.sourceSkill=name;
				logInfo.type='equip';
			}
			else{
				var bool=false;
				for(var i of players){
					var expand=[i];
					game.expandSkills(expand);
					if(expand.contains(name)){
						bool=true;
						logInfo.sourceSkill=i;
						logInfo.type='player';
						break;
					}
				}
				if(!bool){
					for(var i of players){
						var expand=[i];
						game.expandSkills(expand);
						if(expand.contains(name)){
							logInfo.sourceSkill=i;
							logInfo.type='equip';
							break;
						}
					}
				}
			}
		}
		var next=game.createEvent('logSkill',false),evt=_status.event;
		next.player=player;
		next.forceDie=true;
		evt.next.remove(next);
		if(evt.logSkill) evt=evt.getParent();
		for(var i in logInfo){
			if(i=='event') next.log_event=logInfo[i];
			else next[i]=logInfo[i];
		}
		evt.after.push(next);
		next.setContent('emptyEvent');				
		player.getHistory('useSkill').push(logInfo);
		//尽可能别往这写插入结算
		//不能用来终止技能发动！！！
		var next2=game.createEvent('logSkillBegin',false);
		next2.player=player;
		next2.forceDie=true;
		for(var i in logInfo){
			if(i=='event') next2.log_event=logInfo[i];
			else next2[i]=logInfo[i];
		}
		next2.setContent('emptyEvent');
	}
	if(this._hookTrigger){
		for(var i=0;i<this._hookTrigger.length;i++){
			var info=lib.skill[this._hookTrigger[i]].hookTrigger;
			if(info&&info.log){
				info.log(this,name,targets);
			}
		}
	}
}