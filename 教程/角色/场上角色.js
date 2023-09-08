player.out() 将角色移出游戏
判断角色是否被移出游戏
player.isOut()  角色是否被移出游戏
playet.isIn()  角色是否在场

game.players  存活角色,包括出场的角色

game.countPlayer()  场上的角度数量
game.dead  阵亡角色

game.countPlayer(fuc)
可接收一个判断函数作为参数,返回符合条件的人数

game.hasPlayer(fuc)
相比于game.countPlayer函数,返回符合条件的角色构成的数组

eg.
全场已受伤角色
game.hasPlayer(function(current){
      return current.isDamaged();//当前角色是否受伤
});