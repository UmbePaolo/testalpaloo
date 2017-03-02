function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}
function ShareFB() {
    var canvas = document.getElementById('imgCanvas');
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
    //$.ajax({
    //    type: "POST",
    //    url: '/UploadImagePage.aspx/UploadImage',
    //    data: {
    //        action: 'raketrad_save_to_server',
    //        imgBase64: imageData
    //    }
    //}).done(function (img_url) {
    //    console.log(img_url);
    //    $('body').append('<meta property="og:image" content="' + img_url + '" />');
    //    FB.ui({
    //        method: 'share',
    //        href: window.location.href,
    //        picture: img_url,
    //    }, function (response) { });
    //}); 
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
    //FB.getLoginStatus(function (response) {
    //    console.log(response);
    //    if (response.status === "connected") {
    //        postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
    //    } else if (response.status === "not_authorized") {
    //        FB.login(function (response) {
    //            postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
    //        }, { scope: "publish_actions" });
    //    } else {
    //        FB.login(function (response) {
    //            postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
    //        }, { scope: "publish_actions" });
    //    }
    //});
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