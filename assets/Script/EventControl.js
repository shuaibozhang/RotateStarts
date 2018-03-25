var gameEvents = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        actionListners:{
            default:[],
            type:[cc.Node],
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown: function ( event ) {
        switch (event.keyCode) {
            case cc.KEY.left:
                console.log('Press a key: left');
                for (var index = 0; index < this.actionListners.length; index++) {
                    var node = this.actionListners[index];
                    node.emit(gameEvents.EVENT_ROTATE_LEFT);
                }
                break;
            case cc.KEY.right:
                console.log('Press a key: right');
                for (var index = 0; index < this.actionListners.length; index++) {
                    var node = this.actionListners[index];
                    node.emit(gameEvents.EVENT_ROTATE_RIGHT);
                }
                break;
        }
    },

    doRotateLeft: function(){
        console.log('Press a key: left');
        for (var index = 0; index < this.actionListners.length; index++) {
            var node = this.actionListners[index];
            node.emit(gameEvents.EVENT_ROTATE_LEFT);
        }
    },

    doRotateRight: function(){
        for (var index = 0; index < this.actionListners.length; index++) {
            var node = this.actionListners[index];
            node.emit(gameEvents.EVENT_ROTATE_RIGHT);
        }
    },

    doLoadNext: function(){
        for (var index = 0; index < this.actionListners.length; index++) {
            var node = this.actionListners[index];
            node.emit(gameEvents.EVENT_NEXT);
        }
    },
    doGameWin: function(){
        for (var index = 0; index < this.actionListners.length; index++) {
            var node = this.actionListners[index];
            node.emit(gameEvents.EVENT_WIN);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
