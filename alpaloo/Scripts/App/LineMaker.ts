function drawLines() {
    var canvas = <HTMLCanvasElement>document.getElementById('imgCanvas');
    canvas.width = $(window).width();
    var ctx = canvas.getContext('2d');

    var lts: namespace.ILiftsTaken[] = [], nums: number[] = [];
    contaOccorrenze(lts, nums);

    var larghezzaMappaX = canvas.clientWidth;
    var altezzaMappaY = canvas.clientHeight;

    for (var i = 0; i < lts.length; i++) {
        ctx.beginPath();
        ctx.moveTo(getPoint(lts[i].liftStartLeft, larghezzaMappaX), getPoint(lts[i].liftStartTop, altezzaMappaY) + 50);
        ctx.lineWidth = nums[i] * lineWidth;
        ctx.lineTo(getPoint(lts[i].liftEndLeft, larghezzaMappaX), getPoint(lts[i].liftEndTop, altezzaMappaY) + 50);
        ctx.stroke();
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
        if (!LiftsTakenEquals( arr[i], prev)) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }
}