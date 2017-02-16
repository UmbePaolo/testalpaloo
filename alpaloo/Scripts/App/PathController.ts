/// <reference path="../typings/jquery/jquery.d.ts" />

function prepareAvatar() {
    avatar.hide();
    var map = document.getElementById("imgCanvas");
  
    //Dati necessari: 
    // 1) nello skiday:
    // aggiungere coordinate Skir_Top,	Skir_Left per ogni passaggio attualmente restituito
    //le coordinate devono però essere quelle esatte dei tornelli di partenza ed arrivo degli impianti

    //___1___CALCOLO LE POSIZIONI IN PIXEL___ 
    var larghezzaMappaX = map.clientWidth;
    var altezzaMappaY = map.clientHeight;

    $.each(data.liftsTaken, function (key, d) {
        arrayDistanzaX.push(Math.floor((d.liftStartLeft / 100) * larghezzaMappaX));
        arrayDistanzaY.push(Math.floor((d.liftStartTop / 100) * altezzaMappaY));
        arrayDistanzaX.push(Math.floor((d.liftEndLeft / 100) * larghezzaMappaX));
        arrayDistanzaY.push(Math.floor((d.liftEndTop / 100) * altezzaMappaY));
    });

    avatar.css("top", arrayDistanzaY[0] + 'px');
    avatar.css("left", arrayDistanzaX[0] + 'px');
    indiceWayPoint++;
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