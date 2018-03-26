var MapState = cc.Enum({
    MAP_IDLE: 1,
    MAP_ROTATE: 2,
    MAP_DOWN: 3,
    MAP_FINISH: 4,
});

var mapTool = require('MapTools');
var gameEvents = require('GameEvent');
var moveMgr = require('MoveMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        mapArray: { default: null, visible: false },
        mapElement: { default: null, visible: false },
        elementStaticSquare: cc.Prefab,
        elementMoveableSquare: cc.Prefab,
        elementPlayerSquare: cc.Prefab,
        elementTargetSquare: cc.Prefab,
        tiledSize: 40,
        mapState: { default: MapState.MAP_IDLE, type: cc.Enum(MapState)},
        rotate: 0,
    },

    // use this for initialization
    onLoad: function () {
        var testMap = [
            [1, 1, 1, 1, 1,1,1],
            [1, 2, 0, 0, 0,0,1],
            [1, 0, 2, 0, 0,0,1],
            [1, 0, 0, 1, 2,0,1],
            [1, 0, 2, 3, 1,0,1],
            [1, 4, 0, 0, 0,0,1],
            [1, 1, 1, 1, 1,1,1],
        ];

        this.createMap(testMap);
    },

    start: function(){
        cc.zsb.eventControl.addLinsterNode(this.node);
    },

    /**
     * 创建地图
     * @param  {Array}   mapConfig     带有地图信息的二维数组
     * @return {Void}
     */
    createMap: function (mapConfig) {
        this.node.removeAllChildren();
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
     * id == 1 创建静态的砖块
     * id == 2 创建可移动的砖块
     * id == 3 创建玩家
     * id == 4 创建目标位置的砖块
     * @param  {Integer}   elementid 元素的id
     * @return {Object} 元素实例
     */
    createElementById: function (elementid) {
        if(elementid == gameEvents.MAP_STATIC){
            return cc.instantiate(this.elementStaticSquare);
        }
        else if(elementid == gameEvents.MAP_MOVE){
            return cc.instantiate(this.elementMoveableSquare);
        }
        else if(elementid == gameEvents.MAP_PLAYER){
            return cc.instantiate(this.elementPlayerSquare);
        }
        else if (elementid == gameEvents.MAP_TARGET) {
            return cc.instantiate(this.elementTargetSquare);
        }
        else {
            return new cc.Node('empty');
        }
    },

    rotateLeft: function () {
        if (this.mapState != MapState.MAP_IDLE) {
            return;
        }
        var self = this;
        this.mapState = MapState.MAP_ROTATE;
        this.rotate = this.rotate - 90;
        var action = cc.rotateBy(0.5, -90);
        var action2 = cc.callFunc(function () {
            self.enterCheckDown();
        })
        this.node.runAction(cc.sequence(action, action2));
        mapTool.rotateLeft(this.mapArray);
        mapTool.rotateLeft(this.mapElement);
    },

    rotateRight: function () {
        if (this.mapState != MapState.MAP_IDLE) {
            return;
        }
        var self = this;
        this.mapState = MapState.MAP_ROTATE;
        this.rotate = this.rotate + 90;
        var action = cc.rotateBy(0.5, 90);
        var action2 = cc.callFunc(function () {
            self.enterCheckDown();
        })
        this.node.runAction(cc.sequence(action, action2));
        mapTool.rotateRight(this.mapArray);
        mapTool.rotateRight(this.mapElement);

    },

    enterCheckDown: function () {
        var self = this;
        var isEnd = false;
        this.mapState = MapState.MAP_DOWN;
        var n =  this.mapArray.length;
        for(var i = this.mapArray.length - 1; i >= 0; i--){
            var line =  this.mapArray[i];
            for(var j = 0; j < line.length; j++){
                if(line[j] == gameEvents.MAP_MOVE || line[j] == gameEvents.MAP_PLAYER){
                    var downLength = 0;
                    var next = i + 1;
                    while(next < n){
                        if (line[j] == gameEvents.MAP_PLAYER && this.mapArray[next][j] == gameEvents.MAP_TARGET) {
                            downLength++;
                            next++;
                            isEnd = true;                    
                        }
                        else if(this.mapArray[next][j] == gameEvents.MAP_EMPTY) {
                            downLength++;
                            next++;
                        }
                        else{
                            break;
                        }
                    }
                    next--;
                    if(downLength > 0){
                        var temp = this.mapArray[i][j];
                        this.mapArray[i][j] =  gameEvents.MAP_EMPTY;
                        this.mapArray[next][j] = temp;

                        var temp2 = this.mapElement[i][j];
                        this.mapElement[i][j] = this.mapElement[next][j];
                        this.mapElement[next][j] = temp2;               
                        
                        var worldPos = temp2.convertToWorldSpaceAR(cc.v2(0, 0));
                        worldPos.y = worldPos.y - downLength * this.tiledSize;
                        var newVec2 = temp2.parent.convertToNodeSpaceAR(worldPos);
                        moveMgr.addMove(temp2, newVec2, 0.1 * downLength);
                    }
                }
            }
        }

        moveMgr.doMove(this.node, function(){
            self.mapState = MapState.MAP_IDLE;
            if(isEnd){
                self.mapState = MapState.MAP_FINISH;
                cc.zsb.eventControl.doGameWin()
            }
        });

    },

    loadNext: function(idx){
        this.mapState = MapState.MAP_IDLE
        var testMap = [
            [1, 1, 1, 1, 1,1,1],
            [1, 2, 0, 0, 0,0,1],
            [1, 0, 1, 0, 0,0,1],
            [1, 0, 0, 1, 2,0,1],
            [1, 0, 1, 3, 1,0,1],
            [1, 4, 0, 0, 0,0,1],
            [1, 1, 1, 1, 1,1,1],
        ];
        this.node.rotation = 0;
        this.createMap(testMap);
    },

    registerEvent: function () {
        this.node.on(gameEvents.EVENT_ROTATE_LEFT, this.rotateLeft, this);
        this.node.on(gameEvents.EVENT_ROTATE_RIGHT, this.rotateRight, this);
        this.node.on(gameEvents.EVENT_NEXT, this.loadNext, this);
    },

    unregisterEvent: function () {
        this.node.off(gameEvents.EVENT_ROTATE_LEFT, this.rotateLeft, this);
        this.node.off(gameEvents.EVENT_ROTATE_RIGHT, this.rotateRight, this);
        this.node.off(gameEvents.EVENT_NEXT, this.loadNext, this);
    },

    onEnable: function () {
        this.registerEvent();
    },

    onDisable: function () {
        this.unregisterEvent();
    },
});
