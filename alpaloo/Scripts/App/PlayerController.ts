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
        timer = setInterval(doMove, 1500);
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
        timer = setInterval(doMove, 1500);
    }
    console.log("button play pressed, play was " + state);
}

function buttonStopPress() {
    state = 'stop';
    indiceWayPoint = 0;
    clearInterval(timer);
    var button = $("#button_play i");
    button.attr('class', "fa fa-play");
    console.log("button stop invoked.");
}