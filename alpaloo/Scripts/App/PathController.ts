/// <reference path="../typings/jquery/jquery.d.ts" />

function prepareAvatar() {
    avatar.hide();
    var img = avatar.find('img');
    img.attr('src', data.avatar);
    if (window.innerWidth > 768) {
        img.attr('style', 'height:40px; width:40px;');
    } else {
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

function doMoveAtPoint(indice: number) {
    clearInterval(timer);
    indiceWayPoint.Index = indice;
    updateAvatar();
    if (state == 'play' || state == 'resume') {
        timer = setInterval(doMove, 1100);
    }
}

function doMoveAtLift(lift: namespace.ILiftsTaken) {
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