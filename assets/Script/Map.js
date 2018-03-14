var MapState = cc.Enum({
    MAP_IDLE: 1,
    MAP_ROTATE: 2,
    MAP_DOWN: 3,
});

var mapTool = require('MapTools');
var gameEvents = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        mapArray: { default: null, visible: false },
        mapElement: { default: null, visible: false },
        elementStaticSquare: cc.Prefab,
        elementMoveableSquare: cc.Prefab,
        elementPlayerSquare: cc.Prefab,
        elementTargetSquare: cc.Prefab,
        tiledSize: 80,
        mapState: { default: MapState.MAP_IDLE, type: cc.Enum(MapState)},
        rotate: 0,
    },

    // use this for initialization
    onLoad: function () {
        var testMap = [
            [1, 1, 1, 1],
            [1, 4, 3, 1],
            [1, 0, 2, 1],
            [1, 1, 1, 1],
        ];

        this.createMap(testMap);
    },
    /**
     * 创建地图
     * @param  {Array}   mapConfig     带有地图信息的二维数组
     * @return {Void}
     */
    createMap: function (mapConfig) {
        var n = mapConfig.length;
        var mapTopLeftPoint = new cc.Vec2(0,0);
        mapTopLeftPoint.x = -n * this.tiledSize * 0.5 + 0.5 * this.tiledSize;      
        mapTopLeftPoint.y = n * this.tiledSize * 0.5 - + 0.5 * this.tiledSize;

        this.mapArray = mapConfig;
        this.mapElement = [];
        for (var rows = 0; rows < mapConfig.length; rows++) {
            var line = mapConfig[rows];
            this.mapElement[rows] = [];
            for (var column = 0; column < line.length; column++){
                var element = this.createElementById(line[column]);
                element.parent = this.node;
                element.setPosition(mapTopLeftPoint.x + this.tiledSize * column,mapTopLeftPoint.y - this.tiledSize * rows);
                this.mapElement[rows][column] = element;
            }
        } 
    },
    /**
     * 创建地图元素
     * id == 0 创建静态的砖块
     * id == 1 创建可移动的砖块
     * id == 2 创建玩家
     * id == 3 创建目标位置的砖块
     * @param  {Integer}   elementid 元素的id
     * @return {Object} 元素实例
     */
    createElementById: function (elementid) {
        if(elementid == 1){
            return cc.instantiate(this.elementStaticSquare);
        }
        else if(elementid == 2){
            return cc.instantiate(this.elementMoveableSquare);
        }
        else if(elementid == 3){
            return cc.instantiate(this.elementPlayerSquare);
        }
        else if (elementid == 4) {
            return cc.instantiate(this.elementTargetSquare);
        }
        else {
            return new cc.Node('empty');
        }
    },

    rotateLeft: function () {
        if (this.mapState == MapState.MAP_ROTATE) {
            return;
        }
        var self = this;
        this.mapState = MapState.MAP_ROTATE;
        this.rotate = this.rotate - 90;
        var action = cc.rotateBy(1, -90);
        var action2 = cc.callFunc(function () {
            self.enterCheckDown();
        })
        this.node.runAction(cc.sequence(action, action2));

        mapTool.rotateLeft(this.mapArray);
        mapTool.rotateLeft(this.mapElement);
    },

    rotateRight: function () {
        if (this.mapState == MapState.MAP_ROTATE){
            return;
        }
        var self = this;
        this.mapState = MapState.MAP_ROTATE;
        this.rotate = this.rotate + 90;
        var action = cc.rotateBy(1, 90);
        var action2 = cc.callFunc(function () {
            self.enterCheckDown();
        })
        this.node.runAction(cc.sequence(action, action2));

        mapTool.rotateRight(this.mapArray);
        mapTool.rotateRight(this.mapElement);
    },

    enterCheckDown: function () {
        this.mapState = MapState.MAP_DOWN;
    },

    registerEvent: function () {
        this.node.on(gameEvents.EVENT_ROTATE_LEFT, this.rotateLeft, this);
        this.node.on(gameEvents.EVENT_ROTATE_RIGHT, this.rotateRight, this);
    },

    unregisterEvent: function () {
        this.node.off(gameEvents.EVENT_ROTATE_LEFT, this.rotateLeft, this);
        this.node.off(gameEvents.EVENT_ROTATE_RIGHT, this.rotateRight, this);
    },

    onEnable: function () {
        this.registerEvent();
    },

    onDisable: function () {
        this.unregisterEvent();
    },
});
