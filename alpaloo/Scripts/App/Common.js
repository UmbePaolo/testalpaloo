var data;
/// <reference path="CustomGraph.js" />
var state = 'stop';
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
//import custGraph = require('CustomGraph');
function setData(d) {
    data = d;
    loadImage(data);
    loadGrafico();
}
function loadImage(d) {
    var img = $("#skiramaImg")[0];
    if (img) {
        switch (d.resortName) {
            case 'Courmayeur':
                img.src = 'img/skirama-courmayeur.png';
                break;
            case 'Monterosa':
                img.src = 'img/skirama-monterosa.png';
                break;
            default:
                img.src = 'img/skirama-courmayeur.png';
        }
    }
}
//# sourceMappingURL=Common.js.map