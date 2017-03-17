var heatMap = ['#f8c9b9', '#f4a58b', '#f19374', '#ef815d', '#ea5d2e', '#e84e1b'];
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;
        // 1. Let o be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        // 2. Let lenValue be the result of calling the Get
        //    internal method of o with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = o.length >>> 0;
        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }
        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = fromIndex | 0;
        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }
        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of o with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of o with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}
function drawLines() {
    var ctx = canvas.getContext("2d");
    var lts = [], nums = [];
    contaOccorrenze(lts, nums);
    var larghezzaMappaX = canvas.width;
    var altezzaMappaY = canvas.height;
    var xr = larghezzaMappaX / 36.08;
    var yr = altezzaMappaY / 15.06;
    for (var i = 0; i < indiceWayPoint.Index + 1; i += 2) {
        var j = Math.floor(i / 2);
        var x2 = getPoint(data.liftsTaken[j].liftStartLeft, larghezzaMappaX) + xr;
        var x1 = getPoint(data.liftsTaken[j].liftEndLeft, larghezzaMappaX) + xr;
        var y2 = getPoint(data.liftsTaken[j].liftStartTop, altezzaMappaY) + yr;
        var y1 = getPoint(data.liftsTaken[j].liftEndTop, altezzaMappaY) + yr;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = getHeatMap(nums[j]);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x1, y1, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#506d7a';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#506d7a';
        ctx.fill();
    }
    //for (var i = 0; i < lts.length; i++) {
    //    var x2 = getPoint(lts[i].liftStartLeft, larghezzaMappaX) + 35;
    //    var x1 = getPoint(lts[i].liftEndLeft, larghezzaMappaX) + 35;
    //    var y2 = getPoint(lts[i].liftStartTop, altezzaMappaY) + 65 ;
    //    var y1 = getPoint(lts[i].liftEndTop, altezzaMappaY) + 65;
    //    ctx.beginPath();
    //    ctx.moveTo(x1, y1);
    //    ctx.lineTo(x2, y2);
    //    ctx.lineWidth = 4;
    //    ctx.strokeStyle = getHeatMap(nums[i]);
    //    ctx.stroke();
    //    ctx.beginPath();
    //    ctx.arc(x1, y1, 5, 0, 2 * Math.PI, false);
    //    ctx.fillStyle = '#506d7a';
    //    ctx.fill();
    //    ctx.beginPath();
    //    ctx.arc(x2, y2, 5, 0, 2 * Math.PI, false);
    //    ctx.fillStyle = '#506d7a';
    //    ctx.fill();
    //}
}
//function contaOccorrenze(a, b) {
//    var prev: namespace.ILiftsTaken;
//    var arr = data.liftsTaken.slice();
//    arr.sort(function (lt1, lt2) {
//        if (lt1.liftName < lt2.liftName)
//            return -1;
//        if (lt1.liftName > lt2.liftName)
//            return 1;
//        return 0;
//    });
//    for (var i = 0; i < arr.length; i++) {
//        if (!LiftsTakenEquals(arr[i], prev)) {
//            a.push(arr[i]);
//            b.push(0);
//        } else {
//            b[b.length - 1]++;
//        }
//        prev = arr[i];
//    }
//    var s = squash(b);
//    if (s.length = 2) {
//        var m = Math.max(s[0], s[1]);
//        for (var i = 0; i < b.length; i++) {
//            if (b[i] == m) {
//                b[i] = heatMap.length - 1;
//            }
//        }
//    }
//}
function contaOccorrenze(a, b) {
    var i, j;
    var lt = data.liftsTaken;
    for (i = 0, j = lt.length; i < j; i++) {
        a.push(lt[i]);
        b.push(findOccurrences(lt.slice(0, i), lt[i]));
    }
    //    var s = squash(b);
    //if (s.length = 2) {
    //    var m = Math.max(s[0], s[1]);
    //    for (i = 0; i < b.length; i++) {
    //        if (b[i] == m) {
    //            b[i] = heatMap.length - 1;
    //        }
    //    }
    //}
}
function findOccurrences(arr, val) {
    var i, j, count = 1;
    for (i = 0, j = arr.length; i < j; i++) {
        (LiftsTakenEquals(arr[i], val)) && count++;
    }
    return count;
}
function getHeatMap(i) {
    if (i > heatMap.length)
        return heatMap[heatMap.length];
    return heatMap[i];
}
function squash(arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmp.indexOf(arr[i]) == -1) {
            tmp.push(arr[i]);
        }
    }
    return tmp;
}
//# sourceMappingURL=LineMaker.js.map