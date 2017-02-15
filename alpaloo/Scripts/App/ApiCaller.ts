/// <reference path="Common.ts" />
/// <reference path="SkiDay.ts" />

// ********* hack ********
var domain = "http://testapib2c.alpaloo.com/";
var hackUsername = 'mia@tua.it';
var hackPassword = 'nessuna';

declare var Base64: any;

// ********* fine hack ********

var token;
var hdnUserId;

$(document).ready(function () {
    SetToken();
});


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
}

var setCustomHeaderToken = function setCustomHeaderToken(xhr) {
    xhr.setRequestHeader('Authorization', 'JWT ' + token);
}

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
    }
}

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
