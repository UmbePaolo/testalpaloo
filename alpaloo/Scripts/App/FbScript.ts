declare function GIFEncoder(): void;

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
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index] , 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);

    indiceWayPoint.Index = 1;
    updateAvatar();
    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index] , 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);

    indiceWayPoint.Index =2;
    updateAvatar();

    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index] , 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    encoder.addFrame(ctx);

    indiceWayPoint.Index = 3;
    updateAvatar();
    ctx.beginPath();
    ctx.arc(arrayDistanzaX[indiceWayPoint.Index] + 20, arrayDistanzaY[indiceWayPoint.Index] , 20, 0, 2 * Math.PI, false);
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
    var binary_gif = encoder.stream().getData() //notice this is different from the as3gif package!
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
    var output = "", i = 0, l = input.length,
        key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    while (i < l) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) enc3 = enc4 = 64;
        else if (isNaN(chr3)) enc4 = 64;
        output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
    }
    return output;
}

function ShareFB() {
    var dataString = canvas.toDataURL("image/png");
    var blob: Blob;
    try {
        blob = dataURItoBlob(dataString);
    } catch (e) {
        console.log(e);
    }

    $('#divFB').data('href', window.location.href);
    //$('#aFB').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(window.location.href));

    /*Save to server*/
    var imageData = canvas.toDataURL("image/png");
    imageData = imageData.replace('data:image/png;base64,', '');
    var userName = data.userName + data.userSurname;
    var l = (location.origin +'/' );
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
            FB.api(
                "/" + data.id + "?fields=images",
                function (response) {
                    if (response && !response.error) {
                        //console.log(response.images[0].source);

                        // Create facebook post using image
                        FB.api(
                            "/me/feed",
                            "POST",
                            {
                                "message": "",
                                "picture": response.images[0].source,
                                "link": window.location.href,
                                "name": 'Look at the cute panda!',
                                "description": message,
                                "privacy": {
                                    value: 'SELF'
                                }
                            },
                            function (response) {
                                if (response && !response.error) {
                                    /* handle the result */
                                    console.log("Posted story to facebook");
                                    console.log(response);
                                }
                            }
                        );
                    }
                }
            );
        },
        error: function (shr, status, data) {
            console.log("error " + data + " Status " + shr.status);
        },
        complete: function (data) {
            //console.log('Post to facebook Complete');
        }
    });
}