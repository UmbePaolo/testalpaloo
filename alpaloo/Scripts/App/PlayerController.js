/// <reference path="Common.ts" />
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
        SetData();
    }
    else if (state == 'play' || state == 'resume') {
        state = 'pause';
        $("#button_play i").attr('class', "fa fa-play");
    }
    else if (state == 'pause') {
        state = 'resume';
        $("#button_play i").attr('class', "fa fa-pause");
    }
    console.log("button play pressed, play was " + state);
}
function buttonStopPress() {
    state = 'stop';
    var button = $("#button_play i");
    button.attr('class', "fa fa-play");
    console.log("button stop invoked.");
}
//# sourceMappingURL=PlayerController.js.map