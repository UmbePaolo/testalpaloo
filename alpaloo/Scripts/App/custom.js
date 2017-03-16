/// <reference path="Common.ts" />
/// <reference path="SkiDay.ts" />
var token;
var hdnUserId;
// ***************** Funzioni per le api
function SetToken() {
    // url
    var uri = 'api/auth/login';
    // Data obj
    var processObj = null;
    // Send
    SendAjaxRequest(uri, processObj, setHeaderForLogin, "GetMessageLogin");
}
var setHeaderForLogin = function setHeaderForLogin(xhr) {
    xhr.setRequestHeader('Authorization', 'Basic "' + Base64.encode(hackUsername + ':' + hackPassword) + '"');
    //xhr.setRequestHeader('Access-Control-Allow-Origin','http://wsapi.alpaloo.com')
};
var setCustomHeaderToken = function setCustomHeaderToken(xhr) {
    xhr.setRequestHeader('Authorization', 'JWT ' + token);
};
function SendAjaxRequest(uri, processObj, beforeSendObj, methodName) {
    // Send an AJAX request
    $.ajax({
        url: domain + uri,
        type: 'POST',
        dataType: 'json',
        data: processObj,
        processData: false,
        success: function (data) {
            // Get controller
            var ctrl = new ControllerRequest();
            // Call function
            ctrl[methodName](data);
        },
        error: function (a, b, c) { },
        beforeSend: beforeSendObj
    });
}
var ControllerRequest = function () {
    this.GetMessageLogin = function (x) {
        // Set message
        token = x.token;
        hdnUserId = x.UserID;
        SetData();
    },
        this.GetMessage = function (x) {
            //load data
            setData(x);
        };
};
// ***************** Fine funzioni per le api
function SetData() {
    // url
    var uri = 'api/skiday';
    //querystring = ?uid=<nnnnn>&date=<dd/mm/yyyy>&loc=<>
    var dateParts = qs["date"].split("/");
    var dateObject = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    // Data obj
    var processObj = {
        "UserId": qs["uid"],
        "userRequestId": qs["uid"],
        "Date": dateObject
    };
    var obj = JSON.stringify(processObj);
    // Send
    SendAjaxRequest(uri, obj, setCustomHeaderToken, "GetMessage");
}
//# sourceMappingURL=ApiCaller.js.map
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
var canvas;
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
    $('meta[property=og\\:title]').attr('content', 'La mia giornata sci a ' + data.resortName);
    var desc = 'Metri risaliti: ' + data.mtTotRisaliti + ' – Ore di attività: ' + data.hTotAttivita + ' – Impianti presi: ' + data.liftsTaken.length;
    $('meta[property=og\\:description]').attr('content', desc);
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
            case 'La Thuile':
                img.src = 'img/LaThuile.png';
                break;
            default:
                img.src = 'img/Courmayeur.png';
        }
    }
    img.onload = function () {
        canvas = document.getElementById("imgCanvas");
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
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}
function ShareFB2() {
    var encoder = new GIFEncoder();
    encoder.setRepeat(0); //0  -> loop forever
    //1+ -> loop n times then stop
    encoder.setDelay(1000); //go to next frame every n milliseconds
    encoder.start();
    //canvas.width = canvas.width / 3;
    //canvas.height = canvas.height / 3;
    var ctx = canvas.getContext("2d");
    indiceWayPoint.Index = 0;
    updateAvatar();
    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index], 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);
    indiceWayPoint.Index = 1;
    updateAvatar();
    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index], 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);
    indiceWayPoint.Index = 2;
    updateAvatar();
    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index], 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);
    indiceWayPoint.Index = 3;
    updateAvatar();
    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index], 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);
    //$.each(data.liftsTaken, function (key, d) {
    //    indiceWayPoint.increaseIndex();
    //    updateAvatar();
    //    encoder.addFrame(ctx);
    //});
    encoder.finish();
    var binary_gif = encoder.stream().getData(); //notice this is different from the as3gif package!
    var imageData = encode64(binary_gif);
    console.log(imageData);
    var l = (location.origin + '/');
    var userName = data.userName + data.userSurname;
    $.ajax({
        type: 'POST',
        url: 'UploadImageService.asmx/UploadImage',
        data: JSON.stringify({ imageData: imageData, name: userName }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).done(function (img_url) {
        $('body').append('<meta property="og:image" content="' + l + img_url.d + '" />');
        FB.ui({
            method: 'share',
            href: window.location.href,
            picture: l + img_url.d,
        }, function (response) { });
    });
}
function encode64(input) {
    var output = "", i = 0, l = input.length, key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    while (i < l) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2))
            enc3 = enc4 = 64;
        else if (isNaN(chr3))
            enc4 = 64;
        output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
    }
    return output;
}
function ShareFB() {
    var dataString = canvas.toDataURL("image/png");
    var blob;
    try {
        blob = dataURItoBlob(dataString);
    }
    catch (e) {
        console.log(e);
    }
    $('#divFB').data('href', window.location.href);
    //$('#aFB').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(window.location.href));
    /*Save to server*/
    var imageData = canvas.toDataURL("image/png");
    imageData = imageData.replace('data:image/png;base64,', '');
    var userName = data.userName + data.userSurname;
    var l = (location.origin + '/');
    //var p = l.substring(0, l.lastIndexOf('/') + 1);
    $.ajax({
        type: 'POST',
        url: 'UploadImageService.asmx/UploadImage',
        data: JSON.stringify({ imageData: imageData, name: userName }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).done(function (img_url) {
        $('body').append('<meta property="og:image" content="' + l + img_url.d + '" />');
        FB.ui({
            method: 'share',
            href: window.location.href,
            picture: l + img_url.d,
        }, function (response) { });
    });
}
function postImageToFacebook(token, filename, mimeType, imageData, message) {
    var fd = new FormData();
    fd.append("access_token", token);
    fd.append("source", imageData);
    fd.append("no_story", true);
    // Upload image to facebook without story(post to feed)
    $.ajax({
        url: "https://graph.facebook.com/me/photos?access_token=" + token,
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            console.log("success: ", data);
            // Get image source url
            FB.api("/" + data.id + "?fields=images", function (response) {
                if (response && !response.error) {
                    //console.log(response.images[0].source);
                    // Create facebook post using image
                    FB.api("/me/feed", "POST", {
                        "message": "",
                        "picture": response.images[0].source,
                        "link": window.location.href,
                        "name": 'Look at the cute panda!',
                        "description": message,
                        "privacy": {
                            value: 'SELF'
                        }
                    }, function (response) {
                        if (response && !response.error) {
                            /* handle the result */
                            console.log("Posted story to facebook");
                            console.log(response);
                        }
                    });
                }
            });
        },
        error: function (shr, status, data) {
            console.log("error " + data + " Status " + shr.status);
        },
        complete: function (data) {
            //console.log('Post to facebook Complete');
        }
    });
}
//# sourceMappingURL=FbScript.js.map
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
function drawLines(ctx) {
    var lts = [], nums = [];
    contaOccorrenze(lts, nums);
    var larghezzaMappaX = canvas.width;
    var altezzaMappaY = canvas.height;
    for (var i = 0; i < lts.length; i++) {
        var x2 = getPoint(lts[i].liftStartLeft, larghezzaMappaX) + 35;
        var x1 = getPoint(lts[i].liftEndLeft, larghezzaMappaX) + 35;
        var y2 = getPoint(lts[i].liftStartTop, altezzaMappaY) + 65;
        var y1 = getPoint(lts[i].liftEndTop, altezzaMappaY) + 65;
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
    var prev;
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
            b.push(0);
        }
        else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }
    var s = squash(b);
    if (s.length = 2) {
        var m = Math.max(s[0], s[1]);
        for (var i = 0; i < b.length; i++) {
            if (b[i] == m) {
                b[i] = heatMap.length - 1;
            }
        }
    }
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
/// <reference path="../typings/jquery/jquery.d.ts" />
function prepareAvatar() {
    avatar.hide();
    avatar.find('img').attr('src', data.avatar);
    //map.width = $(window).width();
    //Dati necessari: 
    // 1) nello skiday:
    // aggiungere coordinate Skir_Top,	Skir_Left per ogni passaggio attualmente restituito
    //le coordinate devono però essere quelle esatte dei tornelli di partenza ed arrivo degli impianti
    //___1___CALCOLO LE POSIZIONI IN PIXEL___ 
    var larghezzaMappaX = canvas.width;
    var altezzaMappaY = canvas.height;
    $.each(data.liftsTaken, function (key, d) {
        arrayDistanzaX.push(getPoint(d.liftEndLeft, larghezzaMappaX) + 10);
        arrayDistanzaY.push(getPoint(d.liftEndTop, altezzaMappaY) + 55);
        arrayDistanzaX.push(getPoint(d.liftStartLeft, larghezzaMappaX) + 10);
        arrayDistanzaY.push(getPoint(d.liftStartTop, altezzaMappaY) + 55);
    });
    avatar.css("top", arrayDistanzaY[0] + 'px');
    avatar.css("left", arrayDistanzaX[0] + 'px');
    indiceWayPoint.increaseIndex();
    var an = $("#avatarName");
    an.text(data.userName + ' ' + data.userSurname);
    an.css('margin-left', -(avatar.width() / 2) + 20 + 'px');
    avatar.show();
    avatarReady = true;
}
function doMove() {
    if ((indiceWayPoint.Index % 2) == 0) {
        avatar.addClass('notransition');
    }
    updateAvatar();
    myChart.series[0].points[indiceWayPoint.Index].select();
    if (indiceWayPoint.Index === arrayDistanzaX.length - 1) {
        buttonStopPress();
        return;
    }
    indiceWayPoint.increaseIndex();
}
function updateAvatar() {
    avatar.css("top", arrayDistanzaY[indiceWayPoint.Index] + 'px');
    avatar.css("left", arrayDistanzaX[indiceWayPoint.Index] + 'px');
    avatar[0].offsetHeight;
    avatar.removeClass('notransition');
}
function doMoveAtPoint(indice) {
    clearInterval(timer);
    indiceWayPoint.Index = indice;
    updateAvatar();
    if (state == 'play' || state == 'resume') {
        timer = setInterval(doMove, 1100);
    }
}
//# sourceMappingURL=PathController.js.map
/// <reference path="Common.ts" />
/// <reference path="pathcontroller.ts" />
function buttonBackPress() {
    console.log("button back invoked.");
}
function buttonForwardPress() {
    console.log("button forward invoked.");
}
function buttonRewindPress() {
    console.log("button rewind invoked.");
}
function buttonFastforwardPress() {
    console.log("button fast forward invoked.");
}
function buttonPlayPress() {
    if (state == 'stop') {
        state = 'play';
        var button = $("#button_play i");
        button.attr('class', "fa fa-pause");
        //___3___FACCIO PARTIRE IL PERCORSO___
        doMove;
        timer = setInterval(doMove, 1100);
    }
    else if (state == 'play' || state == 'resume') {
        state = 'pause';
        $("#button_play i").attr('class', "fa fa-play");
        clearInterval(timer);
    }
    else if (state == 'pause') {
        state = 'resume';
        $("#button_play i").attr('class', "fa fa-pause");
        doMove;
        timer = setInterval(doMove, 1100);
    }
    console.log("button play pressed, play was " + state);
}
function buttonStopPress() {
    state = 'stop';
    clearInterval(timer);
    var button = $("#button_play i");
    button.attr('class', "fa fa-play");
    doMoveAtPoint(0);
    myChart.series[0].points[0].select();
    console.log("button stop invoked.");
}
//# sourceMappingURL=PlayerController.js.map
//# sourceMappingURL=SkiDay.js.map
/// <reference path="Common.ts" />
/// <reference path="highcharts.js"/>


function loadGrafico() {
    var seriesArr = [];

    var highchartsOptions = Highcharts.setOptions({
        lang:
            {
                loading: 'Sto caricando...',
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                weekdays: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                shortMonths: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lugl', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                exportButtonTitle: "Esporta",
                printButtonTitle: "Importa",
                rangeSelectorFrom: "Da",
                rangeSelectorTo: "A",
                rangeSelectorZoom: "Periodo",
                downloadPNG: 'Download immagine PNG',
                downloadJPEG: 'Download immagine JPEG',
                downloadPDF: 'Download documento PDF',
                downloadSVG: 'Download immagine SVG',
                printChart: 'Stampa grafico',
                thousandsSep: ".",
                decimalPoint: ','
            }
    });

    $.each(data.liftsTaken, function (key, d) {
        //var series = { name: data.userSurname, data: [], color: '#e84e1b' };

        //series.data.push(new Date(d.liftTime), d.arrAlt);
        //seriesArr.push(d.arrAlt);
        var t = new Date(d.liftTime);
        var dt = Date.UTC(t.getFullYear(), t.getMonth(), t.getDay(), t.getHours(), t.getMinutes(), t.getSeconds());

        var punto = {
            x: dt,
            y: d.arrAlt - d.difAlt,
            custImg: 'img/' + d.icon.replace("svg", "png"),
            custResort: d.liftName
            //,marker: {
            //    symbol: 'url(img/' + d.icon.replace("svg", "png") + ')'
            //}
        };

        seriesArr.push(punto);

        var punto = {
            x: dt + 300000, //metto attualmente un viaggio di 5 minuti
            y: d.arrAlt,
            custImg: 'img/' + d.icon.replace("svg", "png"),
            custResort: d.liftName
        };

        seriesArr.push(punto);
    });

    var options = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                 '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        tooltip: {
            useHTML: true,
            formatter: function () {
                var custImg = this.point.custImg;
                var custResort = this.point.custResort;
                var dato = '';// '<b>' + new Date(this.point.category).toTimeString().split(' ')[0] + '</b><br/>' + this.point.y + ' mt';
                if (custImg) {
                    dato = '<img src="' + custImg + '" title="" alt="" border="0">' + dato;
                }
                if (custResort) {
                    dato = dato + '<b>' + custResort + '</b><br/>';
                }
                return '<div style="width:100px; height:50px;">' + dato + this.point.y + ' mt</div>';
            },
            backgroundColor: '#e84e1b'
        },
        //tooltip: {
        //    //headerFormat: '<b>{point.key}</b><br/>',
        //    //pointFormat: '{point.y} mt',
        //    seHTML: true,
        //    formatter: function () {
        //        var cust = this.point.cust;
        //        if (cust) {
        //            return '<img src="' + cust + '" />' + '<b>' + this.point.y + '</b>';
        //        }
        //    }
        //},
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                minute: '%H:%M:%S'
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                text: '',
                style: {
                    color: '#A0A0A3'
                }
            }, stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                marker: {
                    enabled:true,
                    states: {
                        select: {
                            enabled:true,
                            fillColor: 'red',
                            radius: 6
                        }
                    }
                },
                point: {
                    events: {
                        click: function (e) {
                            doMoveAtPoint(this.index);
                        }
                    }
                }
            }
        },
        chart: {
            color: '',
            //width:1263,
            renderTo: $("#myChart")[0],
            type: 'line',
            plotBorderColor: '#606063'
        },
        series: [{}]
    };

    options.series[0].data = seriesArr;
    myChart = new Highcharts.Chart(options);
    myChart.series[0].points[0].select();
    
    $(".highcharts-button").hide();

}