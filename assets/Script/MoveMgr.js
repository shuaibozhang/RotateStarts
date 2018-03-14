var moveMgr = {}
var moveQueue = [];
var moveCallBack = null;
var totalTime = 0;

moveMgr.addMove = function(node, targetpos, time){
    var move = {'node': node, 'pos': targetpos, 'time': time,'done': false}
   moveQueue.push(move);
    if(totalTime <= time){
        totalTime = time;
    }
}

moveMgr.doMove = function(node, callback){
    moveCallBack = callback;
    for(var i = 0; i < moveQueue.length; i++){
        var move = moveQueue[i];
        var action = cc.moveTo(move.time, move.pos);
        move.node.runAction(action);
    }

    var delay =  cc.delayTime(totalTime);
    node.runAction(cc.sequence(delay, cc.callFunc(function(){
        if(moveCallBack){
            moveCallBack();
            moveCallBack = null;
        }
    })));

    moveQueue = [];
    totalTime = 0;
}

module.exports = moveMgr;