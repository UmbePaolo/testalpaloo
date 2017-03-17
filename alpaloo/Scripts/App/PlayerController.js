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