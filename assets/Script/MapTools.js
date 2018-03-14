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

module.exports = MapTools;