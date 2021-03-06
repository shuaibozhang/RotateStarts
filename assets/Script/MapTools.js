var MapTools = {}
/**
 * 旋转90 数组要求是正方形
 * @param  {Array}   arrayObject    二维数组
 * @return {Void}
 */
MapTools.rotateRight = function (arrayObject) {
    var n = arrayObject.length;
    for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {//j取i - 1, 因为对称轴是（i,i）
            var temp = arrayObject[i][j];
            arrayObject[i][j] = arrayObject[j][i];
            arrayObject[j][i] = temp;
        }
        arrayObject[i].reverse();//按竖向中轴线翻转 直接按行reverse即可
    }
}
/**
 * 旋转-90 数组要求是正方形
 * @param  {Array}   arrayObject    二维数组
 * @return {Void}
 */
MapTools.rotateLeft = function (arrayObject) {
    var n = arrayObject.length;
    for (var i = n - 1; i >= 0; i--) {
        for (var j = n - 1; j > n - i - 1; j--) {//j取i - 1, 因为对称轴是（i,i）
            var temp = arrayObject[i][j];
            var posy = n - j - 1;
            var targetx = posy;
            var targety = n - i - 1;
            arrayObject[i][j] = arrayObject[targetx][targety];
            arrayObject[targetx][targety] = temp;
        }
        arrayObject[i].reverse();//按竖向中轴线翻转 直接按行reverse即可
    }
}

var gameEvents = require('GameEvent');
var checkIsFinish = function (mapArray) {
    var n = mapArray.length;
    for (var i = mapArray.length - 1; i >= 0; i--) {
        var line = mapArray[i];
        for (var j = 0; j < line.length; j++) {
            if (line[j] == gameEvents.MAP_MOVE || line[j] == gameEvents.MAP_PLAYER) {
                var downLength = 0;
                var next = i + 1;
                while (next < n) {
                    if (line[j] == gameEvents.MAP_PLAYER && mapArray[next][j] == gameEvents.MAP_TARGET) {
                        downLength++;
                        next++;
                        return true;
                    }
                    else if (this.mapArray[next][j] == gameEvents.MAP_EMPTY) {
                        downLength++;
                        next++;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }

    return false;
}

MapTools.calculateFastStep = function (arrayObject) {
    var actions = [];
    var checkElements = [];
    
    var idx = 0;
    var find = false;

    var temp = MapTools.rotateLeft(arrayObject.slice(0));
    var left = { 'action': "left", 'array': temp};
    temp = MapTools.rotateRight(arrayObject.slice(0));
    var right = { 'action': "right", 'array': temp };
    checkElements.push(left);
    checkElements.push(right);

    while (find == false) {
        var temp = checkElements[idx];
        idx++;
        find = checkIsFinish(temp.array);
        actions.push(temp.action);
        if(find == false){
            var arrayObject = temp.array;
            var temp = MapTools.rotateLeft(arrayObject.slice(0));
            var left = { 'action': "left", 'array': temp };
            temp = MapTools.rotateRight(arrayObject.slice(0));
            var right = { 'action': "right", 'array': temp };
            checkElements.push(left);
            checkElements.push(right);
        }
    }

}

module.exports = MapTools;