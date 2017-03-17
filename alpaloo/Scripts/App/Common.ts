//Variabili modificabili

// ********* hack ********
var domain = "http://testapib2c.alpaloo.com/";
var hackUsername = 'mia@tua.it';
var hackPassword = 'nessuna';
// ********* fine hack ********

//Fine variabili modificabili

var myChart: any;
var data: namespace.ISkiDay;
var indiceWayPoint: WayPointIndex;
var timer: number; //timer per il movimento del WayPoint
var avatarReady: boolean = false;
var avatar: JQuery; //la div dell'avatar
var arrayDistanzaX: number[] = [];
var arrayDistanzaY: number[] = [];
var state = 'stop';
var mioBody;
var canvas: HTMLCanvasElement;
var imgSize: { width: number, height: number };
var imgResort: HTMLImageElement

declare function loadGrafico(): void;
$(document).ready(function () {
    mioBody = $("body");
    indiceWayPoint = new WayPointIndex();
    SetToken();
    avatar = $("#avatar");
    jQuery(document).on('click', '#divFB', function (e) {
        ShareFB2();
    });
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
    if (!d) {
        return;
    }
    data = d;
    if (data.liftsTaken.length < 1) {
        return;
    }

    data.liftsTaken.sort(function (lt1, lt2) {
        if (lt1.liftTime < lt2.liftTime)
            return -1;
        if (lt1.liftTime > lt2.liftTime)
            return 1;
        return 0;
    });

    $('meta[property=og\\:title]').attr('content', 'La mia giornata sci a ' + data.resortName);
    var desc = 'Metri risaliti: ' + data.mtTotRisaliti + ' – Ore di attività: ' + data.hTotAttivita + ' – Impianti presi: ' + data.liftsTaken.length;
    $('meta[property=og\\:description]').attr('content', desc);
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
    imgResort = document.createElement("img");

    if (imgResort) {
        switch (data.resortName) {
            case 'Courmayeur':
                imgResort.src = 'img/Courmayeur.png';
                break;
            case 'Monterosa':
                imgResort.src = 'img/Monterosa.png';
            case 'La Thuile':
                imgResort.src = 'img/LaThuile.png';
                break;
            default:
                imgResort.src = 'img/Courmayeur.png';
        }
    }

    imgResort.onload = function () {
        canvas = <HTMLCanvasElement>document.getElementById("imgCanvas");
        var ctx = canvas.getContext("2d");
        var ratio = $(window).innerWidth() / imgResort.width;
        canvas.height = imgResort.height * ratio;
        canvas.width = $(window).innerWidth();

        imgSize = calculateAspectRatioFit(imgResort.width, imgResort.height, canvas.width, canvas.height);

        //ctx.clearRect(0, 0, canvas.width, canvas.height);
//        ctx.drawImage(img, 0, 0, imgSize.width, imgSize.height);
        //drawLines(ctx);
        drawImage();
        prepareAvatar();
        //mioBody.show();
        loadGraph();
    }
}

function drawImage() {
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgResort, 0, 0, imgSize.width, imgSize.height);
}

function getPoint(val: number, hundredPercent: number) {
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

class WayPointIndex {
    private _index: number;
    constructor() { this._index = 0; }

    get Index(): number {
        return this._index;
    }

    set Index(newIndex: number) {
        this._index = newIndex;
    }

    increaseIndex() {
        this.Index = this._index + 1;
    }
}