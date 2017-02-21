/// <reference path="../typings/jquery/jquery.d.ts" />

function prepareAvatar() {
    avatar.hide();
    var map = <HTMLCanvasElement>document.getElementById("imgCanvas");
    //map.width = $(window).width();
  
    //Dati necessari: 
    // 1) nello skiday:
    // aggiungere coordinate Skir_Top,	Skir_Left per ogni passaggio attualmente restituito
    //le coordinate devono però essere quelle esatte dei tornelli di partenza ed arrivo degli impianti

    //___1___CALCOLO LE POSIZIONI IN PIXEL___ 
    var larghezzaMappaX = map.width;
    var altezzaMappaY = map.height;

    $.each(data.liftsTaken, function (key, d) {
        arrayDistanzaX.push(getPoint(d.liftStartLeft, larghezzaMappaX) - 20);
        arrayDistanzaY.push(getPoint(d.liftStartTop, altezzaMappaY) + 30);
        arrayDistanzaX.push(getPoint(d.liftEndLeft, larghezzaMappaX) - 20);
        arrayDistanzaY.push(getPoint(d.liftEndTop, altezzaMappaY) + 30);
    });

    avatar.css("top", arrayDistanzaY[0] + 'px');
    avatar.css("left", arrayDistanzaX[0] + 'px');
    indiceWayPoint++;
    var an = $("#avatarName");
    an.text(data.userName + ' ' + data.userSurname);
    an.css('margin-left', -(avatar.width() / 2) + 20 + 'px');
    avatar.show();
    avatarReady = true;
}

function doMove() {
    if ((indiceWayPoint % 2) == 0) {
        avatar.addClass('notransition');
    }
    avatar.css("top", arrayDistanzaY[indiceWayPoint] + 'px');
    avatar.css("left", arrayDistanzaX[indiceWayPoint] + 'px');
    avatar[0].offsetHeight;
    avatar.removeClass('notransition');
    indiceWayPoint++;
}

function doMoveAtPoint(indice: number) {
    clearInterval(timer);
    indiceWayPoint = indice;
    doMove();
}