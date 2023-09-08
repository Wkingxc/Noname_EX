将一名角色非锁定技封印
player.addSkill("fengyin");

lib.skill.fengyin= {
    init: function(player, skill) {
        var skills = player.getSkills(true, false);
        for (var i = 0; i < skills.length; i++) {
            if (get.is.locked(skills[i]) || lib.skill[skills[i]].charlotte) {
                skills.splice(i--, 1);
            }
        }
        player.disableSkill(skill, skills);
    },
    onremove: function(player, skill) {
        player.enableSkill(skill);
    },
    locked: true,
    mark: true,
    intro: {
        content: function(storage, player, skill) {
            var list = [];
            for (var i in player.disabledSkills) {
                if (player.disabledSkills[i].contains(skill)) {
                    list.push(i)
                }
            }
            if (list.length) {
                var str = '失效技能：';
                for (var i = 0; i < list.length; i++) {
                    if (lib.translate[list[i]+'_info']) {
                        str += get.translation(list[i])+'、';
                    }
                }
                return str.slice(0, str.length-1);
            }
        }
    }
}

封印的技能加入player.disabledSkills中

eg.
player.disabledSkills
==>
{
    "tianzhong1": ["fengyin"],
    "tianzhong2": ["fengyin"],
    "tianzhong3": ["fengyin"]
}

player.disableSkill(skill,skills);
skill  用于封印的技能
skills  被封印技能，可以是数组

player.enableSkill(skill);
skill  解除封印的技能

以下为封印与解封印代码
lib.element.player.enableSkill= function(skill) {
    for (var i in this.disabledSkills) {
        this.disabledSkills[i].remove(skill);
        if (this.disabledSkills[i].length == 0) {
            delete this.disabledSkills[i];
        }
    }
    return this;
}

lib.element.player.disableSkill= function(skill, skills) {
    if (typeof skills == 'string') {
        //skill是技能名内储存的数组
        //skills是技能名
        if (!this.disabledSkills[skills]) {
            this.disabledSkills[skills] = [];
            var info = get.info(skills);
            if (info.ondisable && info.onremove) {
                info.onremove(this);
            }
        }
        this.disabledSkills[skills].add(skill);
        var group = lib.skill[skills].group;
        if (typeof group == 'string' || Array.isArray(group)) {
            this.disableSkill(skill, group);
        }
    } else if (Array.isArray(skills)) {
        for (var i = 0; i < skills.length; i++) {
            this.disableSkill(skill, skills[i]);
        }
    }
    return this;
}

因为要配合觉醒技/限定技的
player.awakenSkill(skill);
使一名角色的觉醒技/限定技处于已发动状态

player.disabledSkills
==>
{
    "觉醒/限定技名": ["觉醒/限定技名_awake"]
}

player.restoreSkill(skill);
使一名角色的觉醒技/限定技处于未发动状态

以下为觉醒技/限定技awakenSkill函数和restoreSkill函数源码：
lib.element.player.awakenSkill= function(skill, nounmark) {
    if (!nounmark) this.unmarkSkill(skill);
    this.disableSkill(skill+'_awake', skill);
    this.awakenedSkills.add(skill);
    if (this.storage[skill] === false) this.storage[skill] = true;
    return this;
}

lib.element.player.restoreSkill= function(skill, nomark) {
    if (this.storage[skill] === true) this.storage[skill] = false;
    this.awakenedSkills.remove(skill);
    this.enableSkill(skill+'_awake', skill);
    if (!nomark) this.markSkill(skill);
    return this;
}