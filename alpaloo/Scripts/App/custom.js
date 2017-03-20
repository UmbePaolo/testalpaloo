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
var imgSize;
var imgResort;
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
        canvas = document.getElementById("imgCanvas");
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
    };
}
function drawImage() {
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgResort, 0, 0, imgSize.width, imgSize.height);
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
        this.Index = this._index + 1;
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
/// <reference path="../typings/jquery/jquery.d.ts" />
function prepareAvatar() {
    avatar.hide();
    var img = avatar.find('img');
    img.attr('src', data.avatar);
    if (window.innerWidth > 768) {
        img.attr('style', 'height:40px; width:40px;');
    }
    else {
        img.attr('style', 'height:20px; width:20px;');
    }
    //map.width = $(window).width();
    //Dati necessari: 
    // 1) nello skiday:
    // aggiungere coordinate Skir_Top,	Skir_Left per ogni passaggio attualmente restituito
    //le coordinate devono però essere quelle esatte dei tornelli di partenza ed arrivo degli impianti
    //___1___CALCOLO LE POSIZIONI IN PIXEL___ 
    var larghezzaMappaX = canvas.width;
    var altezzaMappaY = canvas.height;
    var xr = larghezzaMappaX / 126.6;
    var yr = altezzaMappaY / 17.8;
    $.each(data.liftsTaken, function (key, d) {
        arrayDistanzaX.push(getPoint(d.liftEndLeft, larghezzaMappaX) + xr);
        arrayDistanzaY.push(getPoint(d.liftEndTop, altezzaMappaY) + yr);
        arrayDistanzaX.push(getPoint(d.liftStartLeft, larghezzaMappaX) + xr);
        arrayDistanzaY.push(getPoint(d.liftStartTop, altezzaMappaY) + yr);
    });
    avatar.css("top", arrayDistanzaY[0] + 'px');
    avatar.css("left", arrayDistanzaX[0] + 'px');
    //indiceWayPoint.increaseIndex();
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
    //myChart.series[0].points[indiceWayPoint.Index].select();
    if (indiceWayPoint.Index === arrayDistanzaX.length - 1) {
        buttonStopPress(true);
        return;
    }
    indiceWayPoint.increaseIndex();
}
function updateAvatar() {
    avatar.css("top", arrayDistanzaY[indiceWayPoint.Index] + 'px');
    avatar.css("left", arrayDistanzaX[indiceWayPoint.Index] + 'px');
    avatar[0].offsetHeight;
    avatar.removeClass('notransition');
    if ((indiceWayPoint.Index % 2) == 1) {
        drawImage();
        drawLines();
    }
    if (indiceWayPoint.Index == 0) {
        drawImage();
    }
}
function doMoveAtPoint(indice) {
    clearInterval(timer);
    indiceWayPoint.Index = indice;
    updateAvatar();
    if (state == 'play' || state == 'resume') {
        timer = setInterval(doMove, 1100);
    }
}
function doMoveAtLift(lift) {
    clearInterval(timer);
    var i = data.liftsTaken.indexOf(lift);
    if (i == -1) {
        return;
    }
    indiceWayPoint.Index = i;
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
function buttonStopPress(x) {
    state = 'stop';
    clearInterval(timer);
    var button = $("#button_play i");
    button.attr('class', "fa fa-play");
    if (!x) {
        doMoveAtPoint(0);
    }
    console.log("button stop invoked.");
}
//# sourceMappingURL=PlayerController.js.map
//# sourceMappingURL=SkiDay.js.map
var Chart;
var myLineChart;
function loadGraph() {
    var chartQuoteData = [];
    var chartLiftData = [];
    var chartDiffData = [];
    var chartLabels = [];
    var chartLiftLabels = [];
    var chartLiftDisliv = [];
    var chartLiftSeconds = [];
    var chartLiftNames = [];
    var chartLifts = [];
    var chartOverrided = [];
    function getTime(arrAlt, date) {
        var minutes = arrAlt / 53;
        var t = moment(date).add(minutes, 'minutes');
        return t;
    }
    var startOfDay = moment(data.liftsTaken[0].liftTime).startOf('day');
    $.each(data.liftsTaken, function (key, lift) {
        //var series = { name: data.userSurname, data: [], color: '#e84e1b' };
        //series.data.push(new Date(d.liftTime), d.arrAlt);
        //seriesArr.push(d.arrAlt);
        //var t = new Date(d.liftTime);
        //var dt = Date.UTC(t.getFullYear(), t.getMonth(), t.getDay(), t.getHours(), t.getMinutes(), t.getSeconds());
        //var punto = {
        //    x: dt,
        //    y: d.arrAlt - d.difAlt,
        //    custImg: 'img/' + d.icon.replace("svg", "png"),
        //    custResort: d.liftName
        //    //,marker: {
        //    //    symbol: 'url(img/' + d.icon.replace("svg", "png") + ')'
        //    //}
        //};
        //seriesArr1.push(punto);
        //var punto = {
        //    x: dt + 300000, //metto attualmente un viaggio di 5 minuti
        //    y: d.arrAlt,
        //    custImg: 'img/' + d.icon.replace("svg", "png"),
        //    custResort: d.liftName
        //};
        //seriesArr2.push(punto);
        chartQuoteData.push(lift.arrAlt);
        chartDiffData.push(lift.difAlt);
        chartLabels.push(lift.liftTime);
        chartLiftData.push(lift.startAlt);
        chartLiftData.push(lift.arrAlt);
        chartLiftData.push(NaN);
        chartLiftLabels.push(moment(lift.liftTime).format('H:mm'));
        chartLiftLabels.push('');
        chartLiftLabels.push('');
        chartLifts.push(lift);
        chartLifts.push(lift);
        chartLifts.push(lift);
        chartLiftNames.push(lift.liftName);
        chartLiftNames.push(lift.liftName);
        chartLiftNames.push(lift.liftName);
        chartLiftSeconds.push(Math.abs(startOfDay.diff(lift.liftTime, 'seconds')));
        chartLiftSeconds.push(Math.abs(startOfDay.diff(getTime(lift.difAlt, lift.liftTime), 'seconds')));
    });
    var dislivChartOptions = {
        responsive: false,
        spanGaps: true,
        hover: {
            animationDuration: 0
        },
        elements: {
            line: {
                borderWidth: 2,
                tension: 0.4,
                borderColor: 'rgba(232, 78, 27, 0.43)',
                backgroundColor: '#e84e1b',
                fill: false
            },
            point: {
                pointBorderColor: '#506d7a',
                pointBackgroundColor: '#e84e1b',
                radius: 5
            }
        },
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'right',
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: false,
                        userCallback: function (meters) {
                            return meters + 'mt';
                        }
                    }
                }
            ],
            xAxes: [
                {
                    id: 'x-axis-1',
                    display: true,
                    position: 'bottom'
                }
            ]
        }
    };
    var liftChartOptions = {
        responsive: false,
        legend: {
            display: false
        },
        hover: {
            animationDuration: 0
        },
        animation: {
            duration: 1,
            onComplete: function () {
                var chartInstance = this.chart, ctx = chartInstance.ctx;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontColor);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                //this.data.datasets.forEach(function (dataset, i) {
                //    var meta = chartInstance.controller.getDatasetMeta(i);
                //    meta.data.forEach(function (bar, index) {
                //        var dato = chartLiftNames[index]
                //        //if (dato != '') {
                //        //    ctx.fillText(dato, bar._model.x, bar._model.y - 20);
                //        //}
                //    });
                //});
            }
        },
        elements: {
            line: {
                borderWidth: 4,
                tension: 0.0,
                borderColor: '#e84e1b',
                backgroundColor: '#e84e1b',
                fill: false
            },
            point: {
                pointBorderColor: '#506d7a',
                radius: 15
            }
        },
        tooltips: {
            enabled: false,
            custom: function (tooltip) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');
                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = '0';
                    return;
                }
                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                    tooltipEl.classList.add(tooltip.yAlign);
                }
                else {
                    tooltipEl.classList.add('no-transform');
                }
                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
                var indice = tooltip.dataPoints[0].index;
                var lift = chartLifts[indice];
                // Set Text
                if (tooltip.body) {
                    var liftName = chartLiftNames[indice];
                    var d = chartLiftData[indice];
                    var i = lift.icon;
                    var custImg = '';
                    if (i) {
                        custImg = 'img/' + i.replace("svg", "png");
                    }
                    var titleLines = tooltip.title || [];
                    var bodyLines = tooltip.body.map(getBody);
                    var innerHtml = '<tr><td rowspan="2">' + '<img src="' + custImg + '" title="" alt="" border="0">' + '</td>';
                    innerHtml += '<th>' + liftName + '</th></tr>';
                    bodyLines.forEach(function (body, i) {
                        var colors = tooltip.labelColors[i];
                        var style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                        innerHtml += '<tr><td>' + span + d + ' mt</td></tr>';
                    });
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
                var position = this._chart.canvas; //.getBoundingClientRect();
                // Display, position, and set styles for font
                tooltipEl.style.opacity = '1';
                tooltipEl.style.left = position.offsetLeft + tooltip.caretX + 'px';
                tooltipEl.style.top = position.offsetTop + tooltip.caretY + 'px';
                //tooltipEl.style.left = tooltip.chart.canvas.offsetLeft + tooltip.x + 'px';
                //tooltipEl.style.top = tooltip.chart.canvas.offsetTop + tooltip.y + 'px';
                tooltipEl.style.fontFamily = tooltip._fontFamily;
                tooltipEl.style.fontSize = tooltip.fontSize;
                tooltipEl.style.fontStyle = tooltip._fontStyle;
                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
                doMoveAtPoint(Math.round(indice * 2 / 3));
            }
        },
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left',
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        beginAtZero: false,
                        userCallback: function (meters, index) {
                            return meters + 'mt';
                        }
                    }
                },
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'right',
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        beginAtZero: false,
                        userCallback: function (meters, index) {
                            return meters + 'mt';
                        }
                    }
                }
            ],
            xAxes: [
                {
                    id: 'x-axis-1',
                    display: true,
                    position: 'bottom'
                }
            ]
        }
    };
    var ctx = document.getElementById("myChart").getContext("2d");
    var chartData = {
        labels: chartLiftLabels,
        datasets: [
            {
                data: chartLiftData,
                borderWidth: 0,
                type: 'line',
                spanGaps: false,
                beginAtZero: false,
                pointRadius: 5,
                pointHoverRadius: 5,
                pointHitRadius: 5,
                pointBackgroundColor: '#506d7a'
            },
            {
                data: chartLiftData,
                borderWidth: 10,
                type: 'line',
                borderDash: [6, 3],
                borderColor: '#e84e1b',
                pointBorderWidth: 1,
                radius: 0,
                beginAtZero: false
            },
            {
                data: chartLiftData,
                borderWidth: 0,
                borderColor: 'rgba(80, 109, 122, 0.41)',
                type: 'line',
                spanGaps: true,
                radius: 0,
                beginAtZero: false
            }
        ]
    };
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: liftChartOptions
    });
}
//# sourceMappingURL=CustomChart.js.map