// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        testNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            console.log('Mouse up');
            console.log(event);
            var worldPos = this.testNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var newVec2 = this.testNode.parent.convertToNodeSpaceAR(worldPos);
            console.log('===========start==========');
            console.log(this.testNode.position)
            console.log(worldPos)
            console.log(newVec2)
            console.log('===========end==========');
        }, this);
    },

    // update (dt) {},
});
