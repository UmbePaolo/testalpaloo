var data;
var indiceWayPoint = 0;
var timer; //timer per il movimento del WayPoint
var avatarReady = false;
var avatar; //la div dell'avatar
var arrayDistanzaX = [];
var arrayDistanzaY = [];
var state = 'stop';
var mioBody;
$(document).ready(function () {
    mioBody = $("body");
    mioBody.addClass("loading");
    SetToken();
    avatar = $("#avatar");
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
    data = d;
    data.liftsTaken.sort(function (lt1, lt2) {
        if (lt1.liftTime < lt2.liftTime)
            return -1;
        if (lt1.liftTime > lt2.liftTime)
            return 1;
        return 0;
    });
    prepareAvatar();
    loadImage();
    loadGrafico();
    mioBody.removeClass("loading");
}
function loadImage() {
    var imgCanvas = $("#imgCanvas");
    if (imgCanvas) {
        switch (data.resortName) {
            case 'Courmayeur':
                imgCanvas.css('background-image', 'url(http://www.esmnovara.it/TEST_ALPALOO/skirama-courmayeur-v2.png)');
                break;
            case 'Monterosa':
                imgCanvas.css('background-image', 'url(img/skirama-monterosa.png)');
                break;
            default:
                imgCanvas.css('background-image', 'url(img/skirama-courmayeur.png)');
        }
    }
}
//# sourceMappingURL=Common.js.map