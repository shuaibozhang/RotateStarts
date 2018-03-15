var gameEvents = {}

gameEvents.EVENT_ROTATE_LEFT = "rotate_left";
gameEvents.EVENT_ROTATE_RIGHT = "rotate_right";

gameEvents.MAP_EMPTY = 0;
gameEvents.MAP_STATIC = 1;
gameEvents.MAP_MOVE = 2;
gameEvents.MAP_PLAYER = 3;
gameEvents.MAP_TARGET = 4;

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
                    else if (mapArray[next][j] == gameEvents.MAP_EMPTY) {
                        downLength++;
                        next++;
                    }
                    else {
                        break;
                    }
                }
                next--;
                if (downLength > 0) {
                    var temp = mapArray[i][j];
                    mapArray[i][j] = gameEvents.MAP_EMPTY;
                    mapArray[next][j] = temp;
                }
            }
        }
    }

    return false;
}

function copyArr(arr) {
    let res = []
    for (let i = 0; i < arr.length; i++) {
        let inarray = [];
        for (let j = 0; j < arr[i].length; j++){
            inarray.push(arr[i][j]);
        }
        res.push(inarray)
    }
    return res
}

var calculateFastStep = function (arrayObject) {
    var actions = [];
    var checkElements = [];

    var idx = 0;
    var find = false;
    
    var lefta = copyArr(arrayObject);
    var righta = copyArr(arrayObject);

    MapTools.rotateLeft(lefta);
    var left = { 'action': "left", 'array': lefta, 'parent':"o"};
    MapTools.rotateRight(righta);
    var right = { 'action': "right", 'array': righta, 'parent': "o"};
    checkElements.push(left);
    checkElements.push(right);

    while (find == false) {
        var temp = checkElements[idx];
        idx++;
        find = checkIsFinish(temp.array);
        actions.push(temp);
        if (find == false) {
            var lefta = copyArr(temp.array);
            var righta = copyArr(temp.array);

            MapTools.rotateLeft(lefta);
            var left = { 'action': "left", 'array': lefta, 'parent': temp};
            MapTools.rotateRight(righta);
            var right = { 'action': "right", 'array': righta, 'parent': temp};
            checkElements.push(left);
            checkElements.push(right);
        }
    }

    var outAction = [];
    var last = actions.pop();
    while (last && last != "o" && last.parent)  {
        outAction.push(last.action);
        last = last.parent;
    }

    return outAction.reverse();
}

var testMap = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 2, 0, 0, 1],
    [1, 1, 2, 2, 0, 1],
    [1, 0, 4, 1, 0, 1],
    [1, 0, 1, 3, 0, 1],
    [1, 1, 1, 1, 1, 1],
];

var a = calculateFastStep(testMap);
console.log(a);