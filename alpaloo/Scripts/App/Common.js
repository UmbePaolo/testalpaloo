//Variabili modificabili
// ********* hack ********
var domain = "http://testapib2c.alpaloo.com/";
var hackUsername = 'mia@tua.it';
var hackPassword = 'nessuna';
// ********* fine hack ********
//Fine variabili modificabili
var myChart;
var data;
var indiceWayPoint;
var timer; //timer per il movimento del WayPoint
var avatarReady = false;
var avatar; //la div dell'avatar
var arrayDistanzaX = [];
var arrayDistanzaY = [];
var state = 'stop';
var mioBody;
$(document).ready(function () {
    mioBody = $("body");
    indiceWayPoint = new WayPointIndex();
    SetToken();
    avatar = $("#avatar");
    jQuery(document).on('click', '#divFB', function (e) {
        ShareFB();
    });
});
var qs = (function (a) {
    if (a == "")
        return {};
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
    $('meta[name=og\\:title]').attr('content', 'La mia giornata sci a ' + data.resortName);
    var desc = 'Metri risaliti: ' + data.mtTotRisaliti + ' – Ore di attività: ' + data.hTotAttivita + ' – Impianti presi: ' + data.liftsTaken.length;
    $('meta[name=og\\:description]').attr('content', desc);
    loadImage();
}
function LiftsTakenEquals(lt1, lt2) {
    //return lt1.liftStartTop === lt2.liftStartTop && lt1.liftStartLeft === lt2.liftStartLeft
    //    && lt1.liftEndTop === lt2.liftEndTop && lt1.liftEndLeft === lt2.liftEndLeft;
    if (!lt1 || !lt2)
        return false;
    return lt1.liftName === lt2.liftName;
}
function loadImage() {
    var img = document.createElement("img");
    if (img) {
        switch (data.resortName) {
            case 'Courmayeur':
                img.src = 'img/Courmayeur.png';
                break;
            case 'Monterosa':
                img.src = 'img/Monterosa.png';
            case 'la thuile':
                img.src = 'img/LaThuile.png';
                break;
            default:
                img.src = 'img/Courmayeur.png';
        }
    }
    img.onload = function () {
        var canvas = document.getElementById("imgCanvas");
        var ctx = canvas.getContext("2d");
        var ratio = $(window).innerWidth() / img.width;
        canvas.height = img.height * ratio;
        canvas.width = $(window).innerWidth();
        var imgSize = calculateAspectRatioFit(img.width, img.height, canvas.width, canvas.height);
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, imgSize.width, imgSize.height);
        drawLines(ctx);
        prepareAvatar();
        //mioBody.show();
        loadGrafico();
    };
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
function getPoint(val, hundredPercent) {
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
var WayPointIndex = (function () {
    function WayPointIndex() {
        this._index = 0;
    }
    Object.defineProperty(WayPointIndex.prototype, "Index", {
        get: function () {
            return this._index;
        },
        set: function (newIndex) {
            this._index = newIndex;
        },
        enumerable: true,
        configurable: true
    });
    WayPointIndex.prototype.increaseIndex = function () {
        this._index++;
    };
    return WayPointIndex;
})();
//# sourceMappingURL=Common.js.map