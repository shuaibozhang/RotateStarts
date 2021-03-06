var gameEvents = require('GameEvent');
cc.Class({
    extends: cc.Component,

    properties: {
        mainNode: cc.Node,
        nextBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.mainNode.active = false;
        this.nextBtn.on('click', function(event){
            cc.zsb.eventControl.doLoadNext();
        }, this);
    },

    start () {
        cc.zsb.eventControl.addLinsterNode(this.node);
    },

    showGameOver: function(){
        this.mainNode.active = true;
    },

    unShowGameOver: function(){
        this.mainNode.active = false;
    },

    registerEvent: function () {
        this.node.on(gameEvents.EVENT_WIN, this.showGameOver, this);
        this.node.on(gameEvents.EVENT_NEXT, this.unShowGameOver, this);
    },

    unregisterEvent: function () {
        this.node.off(gameEvents.EVENT_WIN, this.showGameOver, this);
        this.node.off(gameEvents.EVENT_NEXT, this.unShowGameOver, this);
    },

    onEnable: function () {
        this.registerEvent();
    },

    onDisable: function () {
        this.unregisterEvent();
    },
    // update (dt) {},
});
