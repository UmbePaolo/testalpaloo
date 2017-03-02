/// <reference path="../typings/jquery/jquery.d.ts" />
function prepareAvatar() {
    avatar.hide();
    var map = document.getElementById("imgCanvas");
    avatar.find('img').attr('src', data.avatar);
    //map.width = $(window).width();
    //Dati necessari: 
    // 1) nello skiday:
    // aggiungere coordinate Skir_Top,	Skir_Left per ogni passaggio attualmente restituito
    //le coordinate devono però essere quelle esatte dei tornelli di partenza ed arrivo degli impianti
    //___1___CALCOLO LE POSIZIONI IN PIXEL___ 
    var larghezzaMappaX = map.width;
    var altezzaMappaY = map.height;
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