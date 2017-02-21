//Variabili modificabili

// ********* hack ********
var domain = "http://testapib2c.alpaloo.com/";
var hackUsername = 'mia@tua.it';
var hackPassword = 'nessuna';
// ********* fine hack ********

//Fine variabili modificabili


var data: namespace.ISkiDay;
var indiceWayPoint: number = 0;
var timer: number; //timer per il movimento del WayPoint
var avatarReady: boolean = false;
var avatar: JQuery; //la div dell'avatar
var arrayDistanzaX: number[] = [];
var arrayDistanzaY: number[] = [];
var state = 'stop';
var mioBody;

declare function loadGrafico(): void;
$(document).ready(function () {
    mioBody = $("body");
    SetToken();
    avatar = $("#avatar");
});

var qs = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

function setData(d) {
    data = d;
    data.liftsTaken.sort(function (lt1, lt2) {
        if (lt1.liftTime < lt2.liftTime)
            return -1;
        if (lt1.liftTime > lt2.liftTime)
            return 1;
        return 0;
    });
    loadImage();
}

function LiftsTakenEquals(lt1: namespace.ILiftsTaken, lt2: namespace.ILiftsTaken) {
    //return lt1.liftStartTop === lt2.liftStartTop && lt1.liftStartLeft === lt2.liftStartLeft
    //    && lt1.liftEndTop === lt2.liftEndTop && lt1.liftEndLeft === lt2.liftEndLeft;
    if (!lt1 || !lt2)
        return false;
    return lt1.liftName === lt2.liftName;
}

function loadImage() {
    var img: HTMLImageElement = document.createElement("img");
    img.src = 'img/Courmayeur.png';

    img.onload = function () {
        var canvas = <HTMLCanvasElement>document.getElementById("imgCanvas");
        var ctx = canvas.getContext("2d");
        var ratio = img.width / $(window).innerWidth();
        canvas.height = img.height * ratio;
        canvas.width = $(window).innerWidth();

        var imgSize = calculateAspectRatioFit(img.width, img.height, canvas.width, canvas.height);

        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, imgSize.width, imgSize.height);
        drawLines(ctx);
        prepareAvatar();
        //mioBody.show();
        loadGrafico();
    }

    //var imgCanvas = $("#imgCanvas");
    //if (imgCanvas) {
    //    switch (data.resortName) {
    //        case 'Courmayeur':
    //            imgCanvas.css('background-image',  'url(img/Courmayeur.png)');
    //            break;
    //        case 'Monterosa':
    //            imgCanvas.css('background-image', 'url(img/skirama-monterosa.png)');
    //            break;
    //        default:
    //            imgCanvas.css('background-image', 'url(img/Courmayeur.png)');
    //    }
    //}
}

function getPoint(val: number,hundredPercent: number) {
    return Math.floor((val / 100) * hundredPercent);
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    var rtnWidth = srcWidth * ratio;
    var rtnHeight = srcHeight * ratio;
    return {
        width: rtnWidth,
        height: rtnHeight
    };
}