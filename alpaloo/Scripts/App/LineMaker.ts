var heatMap = ['#f8c9b9', '#f4a58b', '#f19374', '#ef815d', '#ea5d2e', '#e84e1b'];

function drawLines(ctx) {
    var canvas = <HTMLCanvasElement>document.getElementById('imgCanvas');

    var lts: namespace.ILiftsTaken[] = [], nums: number[] = [];
    contaOccorrenze(lts, nums);

    var larghezzaMappaX = canvas.width;
    var altezzaMappaY = canvas.height;

    for (var i = 0; i < lts.length; i++) {
        var x1 = getPoint(lts[i].liftStartLeft, larghezzaMappaX);
        var x2 = getPoint(lts[i].liftEndLeft, larghezzaMappaX);
        var y1 = getPoint(lts[i].liftStartTop, altezzaMappaY) + 50;
        var y2 = getPoint(lts[i].liftEndTop, altezzaMappaY) + 50;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = getHeatMap(nums[i]);
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
}

function contaOccorrenze(a, b) {

    var prev: namespace.ILiftsTaken;

    var arr = data.liftsTaken.slice();
    arr.sort(function (lt1, lt2) {
        if (lt1.liftName < lt2.liftName)
            return -1;
        if (lt1.liftName > lt2.liftName)
            return 1;
        return 0;
    });

    for (var i = 0; i < arr.length; i++) {
        if (!LiftsTakenEquals(arr[i], prev)) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }
}

function getHeatMap(i: number) {
    if (i > heatMap.length)
        return heatMap[heatMap.length];
    return heatMap[i];
}