{
    audio:1,
    enable:"phaseUse",
    usable:1,
    filter:function(event,player){
        return player.countCards('hes')>0;
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
            return ui.create.dialog('滔乱',[list,'vcard']);
        },
        filter:function(button,player){
            return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
        },
        backup:function(links,player){
            return {
                filterCard:true,
                audio:'scstaoluan',
                selectCard:1,
                popname:true,
                check:function(card){
                    return 6-get.value(card);
                },
                position:'hes',
                viewAs:{name:links[0][2],nature:links[0][3]}
            }
        },
    },
}