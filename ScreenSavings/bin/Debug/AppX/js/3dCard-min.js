var cardCount = 0;
var TwoDTranslateYStartingPos = 500;
var ThreeDTranslateYStartingPos = 320;
var ThreeDTranslateZStartingPos = 60;
var TwoDYDelta = 200;
var ThreeDZDelta = 80;
var scrolling = 0;
var currentHoverFace = undefined;
var hoverLineNum = 0;
var transitionComplete = 0;
var cumulativeX = 0;
var cumulativeY = 0;
var BASE_URL_TEST = "http://198.101.207.173";
var BASE_URL_TEST2 = "http://198.101.234.220";

var BASE_URL_LIVE = "http://50.56.189.202";
var weather_zipcode = 97124;
var HORIZONTAL_DRAG_RATIO = 0.30;
var pagePosition = 0;
var pageDelta = 190;
var POINTER_TOUCH = 2;
var win_id;
var groupon_dummy_url = "https://s3.grouponcdn.com/images/site_images/2071/9571/IMAGE-Curry-Leaf_medium.jpg";
var matrix;
var cache_filename = "data.txt";
var cached_data;
var twitter_last_card_time = 0;
var fb_last_card_time = 0;
var gmail_last_card_time = 0;
var news_last_card_time = 0;
var flickrcache = [];
var twittercache = [];
var fbcache = [];
var gmailcache = [];
var grouponcache = [];

function convertTimeToString(timeVal) {
    if (timeVal.getHours() > 12) {
        if (("" + timeVal.getMinutes() + "").length == 1) {
            timeVal = (timeVal.getHours() - 12) + ":0" + timeVal.getMinutes() + " PM";
        } else {
            timeVal = (timeVal.getHours() - 12) + ":" + timeVal.getMinutes() + " PM";
        }
    } else if (timeVal.getHours() == 12) {
        if (("" + timeVal.getMinutes() + "").length == 1) {
            timeVal = timeVal.getHours() + ":0" + timeVal.getMinutes() + " PM";
        } else {
            timeVal = timeVal.getHours() + ":" + timeVal.getMinutes() + " PM";
        }
    } else {
        if (("" + timeVal.getMinutes() + "").length == 1) {

            timeVal = timeVal.getHours() + ":0" + timeVal.getMinutes() + " AM";
        } else {
            timeVal = timeVal.getHours() + ":" + timeVal.getMinutes() + " AM";
        }
    }
    return timeVal;
}

function updateTime() {
    var currentTime = new Date();
    var timeVal;
    var dateVal;
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    if (currentTime.getHours() > 12) {
        if (("" + currentTime.getMinutes() + "").length == 1) {

            timeVal = (currentTime.getHours() - 12) + ":0" + currentTime.getMinutes();
        } else {
            timeVal = (currentTime.getHours() - 12) + ":" + currentTime.getMinutes();
        }
    } else if (currentTime.getHours() == 0) {
        if (("" + currentTime.getMinutes() + "").length == 1) {

            timeVal = "12:0" + currentTime.getMinutes();
        } else {
            timeVal = "12:" + currentTime.getMinutes();
        }
    } else {
        if (("" + currentTime.getMinutes() + "").length == 1) {

            timeVal = currentTime.getHours() + ":0" + currentTime.getMinutes();
        } else {
            timeVal = currentTime.getHours() + ":" + currentTime.getMinutes();
        }
    }

    dateVal = currentTime.getDate() + "th " + month[currentTime.getMonth()] + " " + currentTime.getFullYear();

    $('#hrsMins').text(timeVal);
    $('#date').text(dateVal);
    setTimeout(updateTime, 500);
}

function getLocation() {
    var latitude, longitude;
    var coord;
    var geolocator = Windows.Devices.Geolocation.Geolocator();
    promise = geolocator.getGeopositionAsync();
    promise.done(
    function (pos) {
        openNotificationChannel();
        coord = pos.coordinate;
        latitude = coord.latitude;
        longitude = coord.longitude;
        Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done
            (function success(result) {
                //store result in win_id global var to access win_id throughout the app.
                win_id = result;
                //send data to intelscreensavings server's register groupon page
                WinJS.xhr({ url: BASE_URL_TEST + "/gaomin/register_user.php?service=groupon&win_id=" + userId + "&lat=" + latitude + "&lng=" + longitude }).done();

                WinJS.xhr({ url: "http://maps.google.com/maps/geo?q=" + latitude + "," + longitude }).done(
                function success(result) {
                    if (result.status === 200) {
                        var data = JSON.parse(result.response);
                        weather_zipcode = data.Placemark[0].AddressDetails.Country.AdministrativeArea.Locality.PostalCode.PostalCodeNumber;
                        loadData();
                    }
                    else {
                        loadData();
                    }
                },
               function err(result) {
                   loadData();
               }
               );
            });

    },
     function (err) {
         loadData();
         WinJS.log && WinJS.log(err.message, "sample", "error");
     });
}



$(document).ready(function () {
    updateTime();


    Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(cache_filename).done(
            function (file) {
                Windows.Storage.FileIO.readTextAsync(file).done(function (fileContent) {
                    cached_data = JSON.parse(fileContent);
                    matrix = createCardArray(5, 4, 4);
                    //loadData();
                    for (var i = 0; i < matrix.length; i++) {
                        for (var j = 0; j < matrix[i].length; j++) {
                            $('#card' + matrix[i][j][0]).css('transform', 'translateY(' + matrix[i][j][1] + 'px)');
                        }
                    }
                },
                function (error) {
                    WinJS.log && WinJS.log(error, "sample", "error");
                });
            });
    /*
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            for (var k = 0; k < matrix[i][j].length; k++) {
                console.log("[" + i + ", " + j + ", " + k + "] = " + matrix[i][j][k]);
            }
        }
    }
    */
    function createCardArray(d1, d2, d3) {
        var x = new Array(d1);
        for (var i = 0; i < d1; i++) {
            x[i] = new Array(d2);
        }
        for (var i = 0; i < d1; i++) {
            for (var j = 0; j < d2; j++) {
                if (i == 0)
                    d3 = 8;
                if (i == 1)
                    d3 = 11;
                if (i == 2)
                    d3 = 11;
                if (i == 3)
                    d3 = 11;
                if (i == 4)
                    d3 = 11;
                x[i][j] = new Array(d3);
                x[i][j][0] = cardCount;
                if (j == 0) {
                    x[i][j][1] = TwoDTranslateYStartingPos;
                    x[i][j][2] = ThreeDTranslateYStartingPos;
                    x[i][j][3] = ThreeDTranslateZStartingPos;
                } else {
                    x[i][j][1] = x[i][j - 1][1] - TwoDYDelta;
                    x[i][j][2] = ThreeDTranslateYStartingPos;
                    x[i][j][3] = x[i][j - 1][3] - ThreeDZDelta;
                }
                var myGenericCard = document.createElement("div");
                //var myTwitContent = makeTwitterCard();
                myGenericCard.setAttribute("id", "card" + cardCount);
                myGenericCard.setAttribute("class", "row" + (i + 1) + " face");
                myGenericCard.setAttribute("style", "z-index: " + -(j + 1) + ";");
                if (i == 0) {
                    myGenericCard.innerHTML = '<div class="FLICKR_content"><img class="FLICKR_PIC" src="images/rose.jpg"/><span class="FLICKR_time">11:11</span><span class="FLICKR_title">New @Reply from Levonmaa</span> </div>';
                } else if (i == 1) {
                    myGenericCard.innerHTML = '<img src="images/mail1.png" class="card"/>';
                } else if (i == 4) {
                    myGenericCard.innerHTML = '<div class="FB_content"><img class="FB_PIC" src=""/><span class="FB_time">11:11</span><span class="FB_title">New @Reply from Levonmaa</span><span class="FB_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span> </div>';
                } else if (i == 2) {
                    myGenericCard.innerHTML = '<div class="GROUPON_content"><img class="GROUPON_PIC" src=""/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">New @Reply from Levonmaa</span><span class="GROUPON_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span> </div>';
                } else if (i == 3) {
                    myGenericCard.innerHTML = '<img src="images/news2.png" class="card"/>';
                }
                if (i == 0) {
                    // $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);      
                    if (j < cached_data.flickr_feed.length) {
                        x[i][j][4] = "flickr";
                        x[i][j][5] = "timestampTBD";
                        x[i][j][6] = cached_data.flickr_feed[j].user;
                        x[i][j][7] = cached_data.flickr_feed[j].photo + "b.jpg";
                        myGenericCard.innerHTML = '<div class="FLICKR_content"><img id="profilePic" class="FLICKR_PIC" src="' + x[i][j][7] + '"/><span id="Span13" class="FLICKR_time">11:11</span><span id="Span14" class="FLICKR_title">' + x[i][j][6] + '</span> </div>';
                    }
                }
                else if (i == 1) {
                    if (j < cached_data.gmail_feed.length) {
                        var timeVal = new Date(cached_data.gmail_feed[i].date);
                        timeVal = convertTimeToString(timeVal);
                        x[i][j][4] = "gmail";
                        x[i][j][5] = timeVal;
                        x[i][j][6] = cached_data.gmail_feed[j].from;
                        x[i][j][7] = cached_data.gmail_feed[j].subject;
                        x[i][j][8] = cached_data.gmail_feed[j].plain_text;
                        x[i][j][9] = cached_data.gmail_feed[j].to;
                        x[i][j][10] = cached_data.gmail_feed[j].truncated_text;
                        myGenericCard.innerHTML = '<div class="GM_content"><span class="GM_time">' + toStaticHTML(x[i][j][5]) + '</span><span class="GM_From">From: ' + toStaticHTML(x[i][j][6]) + '</span><span class="GM_subject">Subject: ' + x[i][j][7] + '</span><span class="GM_message">' + toStaticHTML(x[i][j][10]) + '</span> <span class="hiddenData">' + toStaticHTML(x[i][j][8]) + '</span> </div>';
                    }
                }
                else if (i == 2) {
                    if (j < cached_data.deals.length) {
                        x[i][j][4] = "groupon";
                        x[i][j][5] = "timestampTBD";
                        x[i][j][6] = cached_data.deals[j].title;
                        x[i][j][7] = cached_data.deals[j].highlightsHtml;
                        x[i][j][8] = cached_data.deals[j].largeImageUrl;
                        myGenericCard.innerHTML = '<div class="GROUPON_content"><img class="GROUPON_PIC" src="' + x[i][j][8] + '"/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">' + x[i][j][6] + '</span><span class="GROUPON_message">' + x[i][j][7] + '</span> </div>';
                    }
                }
                else if (i == 4) {
                        //  if (matrix[lineNum - 1][0][4] == "facebook") {
                    if (j < cached_data.facebookPosts.length) {
                        var time = parseFloat(cached_data.facebookPosts[j].time) * 1000;
                        var timeVal = new Date(time);
                        //console.log(timeVal);
                        timeVal = convertTimeToString(timeVal);
                        x[i][j][4] = "facebook";
                        x[i][j][5] = time;
                        x[i][j][6] = cached_data.facebookPosts[j].posterName;
                        x[i][j][7] = cached_data.facebookPosts[j].text;
                        x[i][j][8] = cached_data.facebookPosts[j].link;
                        x[i][j][9] = cached_data.facebookPosts[j].posterId;
                        x[i][j][10] = timeVal;
                        myGenericCard.innerHTML = '<div class="FB_content"><img class="FB_PIC" src="http://graph.facebook.com/' + x[i][j][9] + '/picture?type=large"/><span class="FB_time">' + x[i][j][10] + '</span><span class="FB_title">' + x[i][j][6] + '</span><span class="FB_message">' + x[i][j][7] + '</span> </div>';
                    }
                    // }
                    //else if (matrix[lineNum - 1][0][4] == "twitter") {
                    //   myGenericCard.html('<div class="TWIT_content"><img class="TWIT_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="TWIT_time">' + matrix[lineNum - 1][0][9] + '</span><span class="TWIT_title">' + matrix[lineNum - 1][0][6] + '</span><span class="TWIT_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
                    //}
                } else if (i == 3) {
                        /*
                        timeVal = convertTimeToString(time);
                        x[i][j][4] = "news";
                        x[i][j][5] = time;
                        x[i][j][6] = newsImageURL;
                        x[i][j][7] = newsHeading;
                        x[i][j][8] = newsData;
                        x[i][j][9] = timeVal;
                        x[i][j][10] = newsURL[1];
                        x[i][j][11] = newsSource[1];
                        myGenericCard.innerHTML = toStaticHTML('<div class="NEWS_content"><img class="NEWS_PIC" src="' + x[i][j][6] + '"/><span class="NEWS_time">' + x[i][j][9] + '</span><span class="NEWS_source">' + x[i][j][11] + '</span><span class="NEWS_title">' + x[i][j][7] + '</span><span class="NEWS_message">' + x[i][j][8] + '</span><span class="hiddenData">' + toStaticHTML(x[i][j][10]) + '</span></div>');
                    */
                }
                document.getElementById("element" + (i + 1)).appendChild(myGenericCard);
                cardCount++;
            }
        }
        return x;
    }

    setTimeout(function () {
        $('.bgOne').css({ "width": "190px", "margin-left": "10px" });
        $('.bgFive').css({ "width": "190px", "margin-left": "-18px" });
        $('.bgPerspective').css({ "transform": "rotateX(-85deg) translateZ(-118px)" });
        $('.linePerspective').css({ "transform": "rotateX(-85deg) translateZ(-120px)" });

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                $('#card' + matrix[i][j][0]).css('transform', 'translateY(' + matrix[i][j][2] + 'px) translateZ(' + matrix[i][j][3] + 'px)');
            }
        }

        $('.face').each(function (index) {

            var name = $(this).attr('class');

            switch (name) {

                case "row1 face name1-2d":
                    $(this).removeClass('name1-2d').addClass('name1-3d');
                    break;
                case "row2 face name2-2d":
                    $(this).removeClass('name2-2d').addClass('name2-3d');
                    break;
                case "row3 face name3-2d":
                    $(this).removeClass('name3-2d').addClass('name3-3d');
                    break;
                case "row4 face name4-2d":
                    $(this).removeClass('name4-2d').addClass('name4-3d');
                    break;
                case "row5 face name5-2d":
                    $(this).removeClass('name5-2d').addClass('name5-3d');
                    break;
            }
        });
        /*
        $('body').keypress(function (event) {
            var key = event.charCode - 48;
            var elementId = "element" + key;
            if (key > 0 && key < 6) {
                pushNewCard(key);
            }
        });
        */
        function updateShadow1(lineNum) {
            //var dateInMs = new Date();
            if (updateShadow1.opt) {
                $('#line' + lineNum + 'id').toggleClass('lineShadow' + lineNum);
                setTimeout(function () { updateShadow1(lineNum) }, 200);
            } else {
                $('#line' + lineNum + 'id').removeClass('lineShadow' + lineNum);
            }
        }
        function updateShadow2(lineNum) {
            //var dateInMs = new Date();
            if (updateShadow2.opt) {
                $('#line' + lineNum + 'id').toggleClass('lineShadow' + lineNum);
                setTimeout(function () { updateShadow2(lineNum) }, 200);
            } else {
                $('#line' + lineNum + 'id').removeClass('lineShadow' + lineNum);
            }
        }
        function updateShadow3(lineNum) {
            //var dateInMs = new Date();
            if (updateShadow3.opt) {
                $('#line' + lineNum + 'id').toggleClass('lineShadow' + lineNum);
                setTimeout(function () { updateShadow3(lineNum) }, 200);
            } else {
                $('#line' + lineNum + 'id').removeClass('lineShadow' + lineNum);
            }
        }

        function updateShadow4(lineNum) {
            //var dateInMs = new Date();
            if (updateShadow4.opt) {
                $('#line' + lineNum + 'id').toggleClass('lineShadow' + lineNum);
                setTimeout(function () { updateShadow4(lineNum) }, 200);
            } else {
                $('#line' + lineNum + 'id').removeClass('lineShadow' + lineNum);
            }
        }
        function updateShadow5(lineNum) {
            //var dateInMs = new Date();
            if (updateShadow5.opt) {
                $('#line' + lineNum + 'id').toggleClass('lineShadow' + lineNum);
                setTimeout(function () { updateShadow5(lineNum) }, 200);
            } else {
                $('#line' + lineNum + 'id').removeClass('lineShadow' + lineNum);
            }
        }
        setTimeout(function () {
            $('.line1, .line2, .line3, .line4, .line5').css({ "transition": "all 200ms ease" });
        }, 500);

        $('#element1, #element2, #element3, #element4, #element5').hover(function () {
            var parentID = $(this).attr("id");
            if (parentID == 'element1') {
                hoverLineNum = 1;
                updateShadow1.opt = true;
                updateShadow1(1);
            } else if (parentID == 'element2') {
                hoverLineNum = 2;
                updateShadow2.opt = true;
                updateShadow2(2);
            } else if (parentID == 'element3') {
                hoverLineNum = 3;
                updateShadow3.opt = true;
                updateShadow3(3);
            } else if (parentID == 'element4') {
                hoverLineNum = 4;
                updateShadow4.opt = true;
                updateShadow4(4);
            } else if (parentID == 'element5') {
                hoverLineNum = 5;
                updateShadow5.opt = true;
                updateShadow5(5);
            } else {
                hoverLineNum = 0;
            }
            //   $('#dump').text(hoverLineNum);
        }, function () {
            hoverLineNum = 0;
            //   $('#dump').text(hoverLineNum);
            updateShadow1.opt = false;
            updateShadow2.opt = false;
            updateShadow3.opt = false;
            updateShadow4.opt = false;
            updateShadow5.opt = false;
        });
        bindKeys();
        $('#element1, #element2, #element3, #element4, #element5').bind('mousewheel', function (e) {
            scrolling = 1;
            $('.face').unbind();
            //    if (currentHoverFace == undefined) {
            if (hoverLineNum > 0) {
                //    scrollCards(hoverLineNum, 0);
            }
            var pixels = 0;
            if (e.originalEvent === undefined) {
                pixels = 0;
            } else {
                pixels = (e.originalEvent.wheelDelta) / 3;
                //$('.face').css({ 'transition': 'all 100ms ease' });
            }
            if (hoverLineNum > 0) {
                scrollCards(hoverLineNum, pixels);
            }
            scrolling = 0;
            $('body').bind('scrollend', function () {
                $('body').unbind('scrollend');
                bindFace();
            });
        });

        var container = document.getElementById('appcontainer');
        //listen to  the gesture start and gesture end on the body
        //find end and start points
        //find the angle,if it's < 20 deg make a pan else pass the event down
        // Creating event listeners for gesture elements 
        container.addEventListener("MSPointerDown", onPointerDownContainer, true);
        //el3.addEventListener("MSGestureTap", onGestureChange, false);
        container.addEventListener("MSGestureEnd", onGestureEndContainer, true);
        container.addEventListener("MSGestureChange", onGestureChange, true);
        var gObjContainer = new MSGesture();             // Creating a gesture object for each element
        gObjContainer.target = container;
        gObjContainer.srcElt = container;
        container.gestureObject = gObjContainer;
        container.gesture = gObjContainer;                     // Expando gesture poroperty for each element.
        container.gesture.pointerType = POINTER_TOUCH;
        var elements = document.getElementsByClassName('serviceLine');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var gObj = new MSGesture();             // Creating a gesture object for each element
            gObj.target = element;
            gObj.srcElt = element;
            element.gestureObject = gObj;
            element.gesture = gObj;                     // Expando gesture poroperty for each element.
            element.gesture.pointerType = POINTER_TOUCH;         // Expando property to capture pointer type to handle multiple pointer sources
            // Creating event listeners for gesture elements 
            element.addEventListener("MSPointerDown", onPointerDown, true);
            //element.addEventListener("MSGestureChange", onGestureChange, true);
            element.addEventListener("MSGestureEnd", onGestureEnd, true);
        }
        //add the event listener for 
        //capture the drag event
        //count the number of pixels it needs to move       
        //on msgesturestart record x and y
        //on msgestureend take x and y
        //find delta z
        //pass to scrollcards function
        // on every msgesture change count the cumulative transx and transy
        //on gesture end count transz
        bindFace();

        $('.pan').click(function () {
            if ($(this).hasClass('panRight')) {
                panRight();
            } else if ($(this).hasClass('panLeft')) {
                panLeft();
            }
        });
        $('body').trigger('flickr');
        $('body').trigger('gmail');
        $('body').trigger('fb_and_twitter');
        $('body').trigger('groupon');
        $('body').trigger('news');
        setTimeout(function () { transitionComplete = 1; }, 500);
        $('#settings').click(function () {

            //  $('#dump').text("Clicked Settings!");
            //$('#elements').css({ "transition": "transform 1s ease", "transform": "scale(0.6)" });
            //$('#elements').animate({ 'margin-left': '+=-100px', 'margin-top': '+=-200px' }, 1000);
            //$('#elements').slideUp('slow');
            $('#elements').css({ "transform": "scale(0.7)", "margin-left": "+=-100px", "margin-top": "+=-200px" });
            $('#settingsMenu').css({ "transform": "translateX(0px)" });
            $('#line2dContainerBg').css({ "transform": "translateX(0px)" });
        });

        $('#settingsIcon').click(function () {

            //  $('#dump').text("Clicked Settings!");
            //$('#elements').css({ "transition": "transform 1s ease", "transform": "scale(0.6)" });
            //$('#elements').animate({ 'margin-left': '+=100px', 'margin-top': '+=200px' }, 1000);
            //$('#elements').slideUp('slow');
            $('#elements').css({ "transform": "", "margin-left": "+=100px", "margin-top": "+=200px" });
            $('#settingsMenu').css({ "transform": "translateX(250px)" });
            $('#line2dContainerBg').css({ "transform": "translateY(350px)" });
        });
    }, 3000);
    setTimeout(refreshData, 25000);
    setTimeout(saveData, 50000);
    $('#FB_BUTTON').click(function () {
        var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
        var clientID = "358452557528632";
        var client_secret = "bd48908a2f2e8d608fd43889d9f66b5e";
        if (clientID === null || clientID === "") {
            WinJS.log("Enter a ClientID", "Web Authentication SDK Sample", "error");
            return;
        }

        var callbackURL = "https://www.facebook.com/connect/login_success.html";

        facebookURL += clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=read_stream,user_likes&display=popup&response_type=token";

        var startURI = new Windows.Foundation.Uri(facebookURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        //  document.getElementById("FacebookDebugArea").value += "Navigating to: " + facebookURL + "\r\n";

        authzInProgress = true;
        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
                var value = result.responseData;
                var startpos = value.indexOf("access_token") + 13;
                var endpos = value.indexOf("&expires_in");
                var accesstoken = value.substring(startpos, endpos);
                if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                    //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                }
                var get_longlivedtoken_url = "https://graph.facebook.com/oauth/access_token?client_id=" + clientID + "&client_secret=" + client_secret + "&grant_type=fb_exchange_token&fb_exchange_token=" + accesstoken;
                WinJS.xhr({ url: get_longlivedtoken_url }).done(function register(result) {
                    var token_data = result.responseText;
                    var startpos_token = token_data.indexOf("access_token") + 13;
                    var endpos_token = token_data.indexOf("&expires");
                    var long_lived_token = token_data.substring(startpos_token, endpos_token);
                    var fb_id_url = "https://graph.facebook.com/me?access_token=" + long_lived_token;
                    WinJS.xhr({ url: fb_id_url }).done(function success(result) {
                        var fb_id = JSON.parse(result.responseText).id;
                        Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function success(result) {
                            //send data to intelscreensavings server
                            WinJS.xhr({ url: BASE_URL_TEST + "/gaomin/register_user.php?service=fb&win_id=" + userId + "&fb_token=" + long_lived_token + "&fb_id=" + fb_id }).done(
                                function (result) {
                                    var results = result.responseData;
                                }
                           );
                        });
                    });

                }, function (err) {
                    WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
                    // document.getElementById("FacebookDebugArea").value += " Error Message: " + err.message + "\r\n";
                    // authzInProgress = false;
                });
            })
    })
    function sendGetRequest(url) {
        try {
            var request = new XMLHttpRequest();
            request.open("GET", url, false);
            request.send(null);
            return request.responseText;
        } catch (err) {
            WinJS.log("Error sending request: " + err, "Web Authentication SDK Sample", "error");
        }
    }
    function sendPostRequest(url, authzheader, params) {
        try {
            var request = new XMLHttpRequest();
            request.open("POST", url, false);
            request.setRequestHeader("Authorization", authzheader);
            request.send(params);
            return request.responseText;
        } catch (err) {
            WinJS.log("Error sending request: " + err, "Web Authentication SDK Sample", "error");
        }
    }
    $('#TWITTER_BUTTON').click(function () {
        var twitterURL = "https://api.twitter.com/oauth/request_token";
        var accessTokenUrl = "https://api.twitter.com/oauth/access_token";
        // Get all the parameters from the user
        var clientID = "hk7hZzZVSGMd6nJNztYw";
        var clientSecret = "HqoWMS3qvKh0kb2qigzz9DSE8rzXZ9gnxdPEu2ZMXU";
        var callbackURL = "http://198.101.207.173/shilpa/callback.php";

        // Acquiring a request token
        var timestamp = Math.round(new Date().getTime() / 1000.0);
        var nonce = Math.random();
        nonce = Math.floor(nonce * 1000000000);

        // Compute base signature string and sign it.
        //    This is a common operation that is required for all requests even after the token is obtained.
        //    Parameters need to be sorted in alphabetical order
        //    Keys and values should be URL Encoded.
        var sigBaseStringParams = "oauth_callback=" + encodeURIComponent(callbackURL);
        sigBaseStringParams += "&" + "oauth_consumer_key=" + clientID;
        sigBaseStringParams += "&" + "oauth_nonce=" + nonce;
        sigBaseStringParams += "&" + "oauth_signature_method=HMAC-SHA1";
        sigBaseStringParams += "&" + "oauth_timestamp=" + timestamp;
        sigBaseStringParams += "&" + "oauth_version=1.0";
        var sigBaseString = "POST&";
        sigBaseString += encodeURIComponent(twitterURL) + "&" + encodeURIComponent(sigBaseStringParams);

        var keyText = clientSecret + "&";
        var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
        var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
        var key = macAlgorithmProvider.createKey(keyMaterial);
        var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
        var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
        var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);
        var dataToPost = "OAuth oauth_callback=\"" + encodeURIComponent(callbackURL) + "\", oauth_consumer_key=\"" + clientID + "\", oauth_nonce=\"" + nonce + "\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"" + timestamp + "\", oauth_version=\"1.0\", oauth_signature=\"" + encodeURIComponent(signature) + "\"";
        var response = sendPostRequest(twitterURL, dataToPost, null);
        var oauth_token;
        var oauth_token_secret;
        var keyValPairs = response.split("&");

        for (var i = 0; i < keyValPairs.length; i++) {
            var splits = keyValPairs[i].split("=");
            switch (splits[0]) {
                case "oauth_token":
                    oauth_token = splits[1];
                    break;
                case "oauth_token_secret":
                    oauth_token_secret = splits[1];
                    break;
            }
        }

        // Send the user to authorization
        twitterURL = "https://api.twitter.com/oauth/authorize?oauth_token=" + oauth_token;

        // document.getElementById("TwitterDebugArea").value += "\r\nNavigating to: " + twitterURL + "\r\n";
        var startURI = new Windows.Foundation.Uri(twitterURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        //authzInProgress = true;
        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
                var value = result.responseData;

                var startpos = value.indexOf("oauth_token") + 12;
                var endpos = value.indexOf("&oauth_verifier");
                var oauthtoken = value.substring(startpos, endpos);
                var oauthverifier = value.substring(endpos + 16);
                if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                    //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                }
                //form the header and send the verifier in the request to accesstokenurl
                var accessdataToPost = "OAuth oauth_consumer_key=\"" + clientID + "\", oauth_nonce=\"" + nonce + "\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"" + timestamp + "\", oauth_token=\"" + oauth_token + "\", oauth_version=\"1.0\"";
                var param = "oauth_verifier=" + oauthverifier;
                var response = sendPostRequest(accessTokenUrl, accessdataToPost, param);
                var tokenstartpos = response.indexOf("oauth_token") + 12;
                var tokenendpos = response.indexOf("&oauth_token_secret");
                var secretstartpos = tokenendpos + 20;
                var secretendpos = response.indexOf("&user_id");
                var useridstartpos = secretendpos + 9;
                var useridendpos = response.indexOf("&screen_name");
                var token = response.substring(tokenstartpos, tokenendpos);
                var secret = response.substring(secretstartpos, secretendpos);
                var user = response.substring(useridstartpos, useridendpos);

                Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function success(result) {
                    //send data to intelscreensavings server
                    WinJS.xhr({ url: BASE_URL_TEST + "/gaomin/register_user.php?service=twitter&win_id=" + userId + "&oauth_token=" + token + "&oauth_verifier=" + secret }).done(
                        function (result) {
                            var results = result.responseData;
                        }
                   );
                });

            }, function (err) {
                WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
            });
    })

    $('#FLICKR_BUTTON').click(function () {
        var flickrURL = "https://secure.flickr.com/services/oauth/request_token";
        var accessTokenUrl = "http://www.flickr.com/services/oauth/access_token";
        // Get all the parameters from the user
        var clientID = "698637b46e1640dc47bb878246328e95";
        var clientSecret = "0e0d30a1d78038fd";
        var callbackURL = "http://198.101.207.173/shilpa/flickrcallback.php";

        // Acquiring a request token
        var timestamp = Math.round(new Date().getTime() / 1000.0);
        var nonce = Math.random();
        nonce = Math.floor(nonce * 1000000000);

        // Compute base signature string and sign it.
        // This is a common operation that is required for all requests even after the token is obtained.
        // Parameters need to be sorted in alphabetical order
        // Keys and values should be URL Encoded.
        var sigBaseStringParams = "oauth_callback=" + encodeURIComponent(callbackURL);
        sigBaseStringParams += "&" + "oauth_consumer_key=" + clientID;
        sigBaseStringParams += "&" + "oauth_nonce=" + nonce;
        sigBaseStringParams += "&" + "oauth_signature_method=HMAC-SHA1";
        sigBaseStringParams += "&" + "oauth_timestamp=" + timestamp;
        sigBaseStringParams += "&" + "oauth_version=1.0";
        var sigBaseString = "GET&";
        sigBaseString += encodeURIComponent(flickrURL) + "&" + encodeURIComponent(sigBaseStringParams);
        var keyText = clientSecret + "&";
        var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
        var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
        var key = macAlgorithmProvider.createKey(keyMaterial);
        var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
        var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
        var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);

        flickrURL += "?" + sigBaseStringParams + "&oauth_signature=" + encodeURIComponent(signature);
        var response = sendGetRequest(flickrURL);

        var oauth_token;
        var oauth_token_secret;
        var keyValPairs = response.split("&");

        for (var i = 0; i < keyValPairs.length; i++) {
            var splits = keyValPairs[i].split("=");
            switch (splits[0]) {
                case "oauth_token":
                    oauth_token = splits[1];
                    break;
                case "oauth_token_secret":
                    oauth_token_secret = splits[1];
                    break;
            }
        }

        // Send the user to authorization
        flickrURL = "https://secure.flickr.com/services/oauth/authorize?oauth_token=" + oauth_token + "&perms=read";

        var startURI = new Windows.Foundation.Uri(flickrURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
                var value = result.responseData;

                var startpos = value.indexOf("oauth_token") + 12;
                var endpos = value.indexOf("&oauth_verifier");
                var oauthtoken = value.substring(startpos, endpos);
                var oauthverifier = value.substring(endpos + 16);
                if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                    //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                }
                //form the header and send the verifier in the request to accesstokenurl
                var timestamp = Math.round(new Date().getTime() / 1000.0);
                var nonce = Math.random();
                nonce = Math.floor(nonce * 1000000000);
                // Compute base signature string and sign it.
                // This is a common operation that is required for all requests even after the token is obtained.
                // Parameters need to be sorted in alphabetical order
                // Keys and values should be URL Encoded.

                var sigBaseStringParams = "oauth_consumer_key=" + clientID;
                sigBaseStringParams += "&" + "oauth_nonce=" + nonce;
                sigBaseStringParams += "&" + "oauth_signature_method=HMAC-SHA1";
                sigBaseStringParams += "&" + "oauth_timestamp=" + timestamp;
                sigBaseStringParams += "&" + "oauth_token=" + oauthtoken;
                sigBaseStringParams += "&" + "oauth_verifier=" + oauthverifier;
                sigBaseStringParams += "&" + "oauth_version=1.0";

                var sigBaseString = "GET&";
                sigBaseString += encodeURIComponent(accessTokenUrl) + "&" + encodeURIComponent(sigBaseStringParams);
                var keyText = clientSecret + "&" + oauth_token_secret;
                var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                var key = macAlgorithmProvider.createKey(keyMaterial);
                var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);

                accessTokenUrl += "?" + sigBaseStringParams + "&oauth_signature=" + encodeURIComponent(signature);
                var response = sendGetRequest(accessTokenUrl);
                var tokenstartpos = response.indexOf("oauth_token") + 12;
                var tokenendpos = response.indexOf("&oauth_token_secret");
                var secretstartpos = tokenendpos + 20;
                var secretendpos = response.indexOf("&user_nsid");
                var useridstartpos = secretendpos + 11;
                var useridendpos = response.indexOf("&username");
                var token = response.substring(tokenstartpos, tokenendpos);
                var secret = response.substring(secretstartpos, secretendpos);
                var user = response.substring(useridstartpos, useridendpos);
                Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function success(result) {
                    //send data to intelscreensavings server
                    WinJS.xhr({ url: BASE_URL_TEST + "/gaomin/register_user.php?service=flickr&win_id=" + userId + "&oauth_token=" + token + "&oauth_verifier=" + secret }).done(
                        function (result) {
                            var results = result.responseData;
                        }
                   );
                });
            }, function (err) {
                WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
            });
    });
    $('#GMAIL_BUTTON').click(function () {
        //oauth1 approach similar to twitter
        var requestUrl = "https://www.google.com/accounts/OAuthGetRequestToken";
        var authorizeUrl = "https://www.google.com/accounts/OAuthAuthorizeToken";
        var accessUrl = "https://www.google.com/accounts/OAuthGetAccessToken";
        var callbackUrl = "http://198.101.207.173/shilpa/two-legged.php";
        var scope = "https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
        var clientID = "198.101.234.220";
        var clientSecret = "p1_QaRDYcgZXdB_kC8scaINW";
        var timestamp = Math.round(new Date().getTime() / 1000.0);
        var nonce = (new Date()).getTime();
        var params = [];
        params["oauth_callback"] = encodeURI(callbackUrl);
        params["oauth_consumer_key"] = clientID;
        params["oauth_timestamp"] = timestamp;
        params["oauth_nonce"] = nonce;
        params["oauth_signature_method"] = "HMAC-SHA1";
        params["scope"] = scope;
        var paramString = normalizeParams(params);
        var sigBaseString = "GET&" + encodeURIComponent(requestUrl) + "&" + encodeURIComponent(paramString);
        var keyText = encodeURIComponent(clientSecret) + "&";
        var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
        var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
        var key = macAlgorithmProvider.createKey(keyMaterial);
        var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
        var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
        var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);
        paramString += "&oauth_signature=" + encodeURIComponent(signature);
        requestUrl = encodeURI(requestUrl);
        requestUrl += "?" + paramString;
        var response = sendGetRequest(requestUrl);
        //requestUrl += "?scope="+encodeURIComponent(scope);
        //var response = sendGetRequest(requestUrl, dataToPost, null);
        var keyValPairs = response.split("&");
        var oauth_token;
        var oauth_token_secret;
        for (var i = 0; i < keyValPairs.length; i++) {
            var splits = keyValPairs[i].split("=");
            switch (splits[0]) {
                case "oauth_token":
                    oauth_token = splits[1];
                    break;
                case "oauth_token_secret":
                    oauth_token_secret = splits[1];
                    break;
            }
        }

        // Send the user to authorization
        authorizeUrl += "?oauth_token=" + oauth_token;

        // document.getElementById("TwitterDebugArea").value += "\r\nNavigating to: " + twitterURL + "\r\n";
        var startURI = new Windows.Foundation.Uri(authorizeUrl);
        var endURI = new Windows.Foundation.Uri(callbackUrl);

        //authzInProgress = true;
        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
                var value = result.responseData;
                var callbackPrefix = callbackUrl + "?";
                var dataPart = value.substring(callbackPrefix.length);
                var keyValPairs = dataPart.split("&");
                var authorize_token;
                var oauth_verifier;
                for (var i = 0; i < keyValPairs.length; i++) {
                    var splits = keyValPairs[i].split("=");
                    switch (splits[0]) {
                        case "oauth_token":
                            authorize_token = splits[1];
                            break;
                        case "oauth_verifier":
                            oauth_verifier = splits[1];
                            break;
                    }
                }
                if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                    //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                }
                //form the header and send the verifier in the request to accesstokenurl
                var params = [];
                var timestamp = Math.round(new Date().getTime() / 1000.0);
                var nonce = (new Date()).getTime();
                params["oauth_consumer_key"] = clientID;
                params["oauth_nonce"] = nonce;
                params["oauth_signature_method"] = "HMAC-SHA1";
                params["oauth_timestamp"] = timestamp;
                params["oauth_token"] = authorize_token;
                params["oauth_verifier"] = oauth_verifier;
                var paramString = normalizeParams(params);

                var sigBaseString = "GET&" + rfcEncoding(accessUrl) + "&" + rfcEncoding(paramString);
                var keyText = rfcEncoding(clientSecret) + "&" + rfcEncoding(oauth_token_secret);
                var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                var key = macAlgorithmProvider.createKey(keyMaterial);
                var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);
                paramString += "&oauth_signature=" + rfcEncoding(signature);
                accessUrl = encodeURI(accessUrl);
                accessUrl += "?" + paramString;
                var response = sendGetRequest(accessUrl);

                var tokenstartpos = response.indexOf("oauth_token") + 12;
                var tokenendpos = response.indexOf("&oauth_token_secret");
                var secretstartpos = tokenendpos + 20;
                var token = response.substring(tokenstartpos, tokenendpos);
                var secret = response.substring(secretstartpos);
                //var gmailinfourl = "https://www.googleapis.com/userinfo/email?access_token="+token;

                Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function success(result) {
                    //send data to intelscreensavings server
                    WinJS.xhr({ url: BASE_URL_TEST + "/gaomin/register_user.php?service=gmail&win_id=" + userId + "&oauth_token=" + decodeURIComponent(token) + "&oauth_verifier=" + decodeURIComponent(secret) + "&email=" + "dummy@gmail.com" }).done(
                        function (result) {
                            var results = result.responseData;
                        }
                   );
                });
            }, function (err) {
                WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
            });
    });


    function normalizeParams(params) {
        for (var key in params) {
            if (key != "oauth_token")
                params[key] = encodeURIComponent(params[key]);
        }
        return join("&", "=", params, true);
    }

    function join(separator1, separator2, arr, sort) {
        var arrKeys = [];
        for (var key in arr) {
            arrKeys.push(key);
        }
        if (sort)
            arrKeys.sort();

        var newArr = [];
        for (var i = 0; i < arrKeys.length; i++) {
            if (separator2 != "") {
                newArr.push(arrKeys[i] + separator2 + arr[arrKeys[i]]);
            }
            else {
                newArr.push(arrKeys[i]);
                newArr.push(arr[arrKeys[i]]);
            }
        }
        return newArr.join(separator1);
    }

    //encodes the special characters according to the RFC standard
    function rfcEncoding(str) {
        var tmp = encodeURIComponent(str);
        tmp = tmp.replace('!', '%21');
        tmp = tmp.replace('*', '%2A');
        tmp = tmp.replace('(', '%28');
        tmp = tmp.replace(')', '%29');
        tmp = tmp.replace("'", '%27');
        return tmp;
    }

    // Handler for transformation on gesture elements 

    function onGestureChange(e) {
        cumulativeX += e.translationX;
        cumulativeY += e.translationY;
        scrolling = 1;
        //$('.face').unbind();
        scrolling = 0;
        $('body').unbind('scrollend');
        $('body').bind('scrollend', function () {
            $('body').unbind('scrollend');
            bindFace();
        });
    }

    function onGestureEnd(e) {
        var elementId = e.currentTarget.id;
        var lineNum = elementId.substr(7);
        var deltaX = cumulativeX;
        var deltaY = cumulativeY;
        cumulativeX = 0;
        cumulativeY = 0;
        var deltaZ = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        if (deltaY > 0)
            scrollCards(lineNum, deltaZ / 2);
        else
            scrollCards(lineNum, -deltaZ / 2);
        // e.stopPropagation();
        //e.currentTarget.gesture = null;
    }
    function onGestureEndContainer(e) {
        var elementId = e.currentTarget.id;
        var lineNum = elementId.substr(7);
        var deltaX = cumulativeX;
        var deltaY = cumulativeY;
        var ratio = Math.abs(deltaY / deltaX);
        if (ratio < HORIZONTAL_DRAG_RATIO) {
            //do panning and bindface again
            cumulativeX = 0;
            cumulativeY = 0;
            e.stopPropagation();
            if (deltaX < 0)
                panLeft();
            else
                panRight();
            bindFace();
        }
        //e.currentTarget.gesture = null;
    }

    function onPointerDown(e) {
        if (e.currentTarget.gesture.pointerType == e.pointerType) {
            e.currentTarget.gesture.addPointer(e.pointerId);                   // Attaches pointer to element (e.target is the element)
            e.currentTarget.gesture.pointerType = e.pointerType;
            //e.target.freeCapture = 1;
        }
    }
    function onPointerDownContainer(e) {
        if (e.currentTarget.gesture.pointerType == e.pointerType) {
            e.currentTarget.gesture.addPointer(e.pointerId);                   // Attaches pointer to element (e.target is the element)
            e.currentTarget.gesture.pointerType = e.pointerType;
            //e.target.freeCapture = 1;
        }
    }
    function panRight() {
        pagePosition -= pageDelta;
        $('#elements').animate({ 'margin-left': -pagePosition + 'px' }, 500);
        $('#element1').animate({ 'border': '1px' }, 500);
        $('#element2').animate({ 'border': '1px' }, 500);
        $('#element3').animate({ 'border': '1px' }, 500);
        $('#element4').animate({ 'border': '1px' }, 500);
        $('#element5').animate({ 'border': '1px' }, 500);
        $('.panRight').animate({ right: '-=' + pageDelta }, 500);
        $('.panLeft').animate({ left: '+=' + pageDelta }, 500);
    }
    function panLeft() {
        pagePosition += pageDelta;
        $('#elements').animate({ 'margin-left': -pagePosition + 'px' }, 500);
        $('#element1').animate({ 'border': '1px' }, 500);
        $('#element2').animate({ 'border': '1px' }, 500);
        $('#element3').animate({ 'border': '1px' }, 500);
        $('#element4').animate({ 'border': '1px' }, 500);
        $('#element5').animate({ 'border': '1px' }, 500);
        $('.panRight').animate({ right: '+=' + pageDelta }, 500);
        $('.panLeft').animate({ left: '-=' + pageDelta }, 500);
    }
});
function loadData() {
    /*
        WinJS.xhr({ url: "http://google.com/ig/api?weather=" + weather_zipcode }).done(
            function fulfilled(result) {
                if (result.status === 200) {

                    var data = result.responseXML;
                    //     $('#dump').text($(data).children().children('weather').children('forecast_information').children('city').attr('data') + " : " +  + " : " + $(data).children().children('weather').children('current_conditions').children('icon').attr('data'));
                    var myLocationData = $(data).children().children('weather').children('forecast_information').children('city').attr('data').split(", ");

                    $('#location').text(myLocationData[0]);
                    $('#weatherIcon').attr('src', "http://www.google.com" + $(data).children().children('weather').children('current_conditions').children('icon').attr('data'));
                    $('#temperature').text($(data).children().children('weather').children('current_conditions').children('temp_f').attr('data') + toStaticHTML("&deg;F"));
                }
            });    
            */
    WinJS.xhr({ url: "http://news.google.com/news?topic=h&output=rss" }).done(
        function fulfilled(result) {
            if (result.status === 200) {
                var i;
                var data = result.responseXML;
                var lineNum = 4;
                var tempArray = new Array();
                jQuery.fn.reverse = [].reverse;

                $(data).children('rss').children('channel').children('item').reverse().each(function () {
                    var description = $(this).children('description').text();
                    description = toStaticHTML(description);
                    var newsImageURL = "http:" + $(description).children('tbody').children('tr').children('td').children('font').children('a').children('img').attr('src');
                    newsImageURL = newsImageURL.replace("6.jpg", "1.jpg");
                    var newsHeading = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('a').text();
                    var newsAuthor = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('font')[0].innerText;
                    var newsData = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('font')[1].innerText;
                    var newsPubDate = $(this).children('pubDate').text();
                    var time = new Date(newsPubDate);
                    var newsURL = ($(this).children('link').text()).split("&url=");
                    var newsSource = ($(this).children('title').text()).split(" - ");
                    //var newsData = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('font').text();

                    $('#dump').text($('#dump').text() + newsURL[1] + "\n\n");
                    timeVal = convertTimeToString(time);
                    var newCard = new Array(12);
                    newCard[4] = "news";
                    newCard[5] = time;
                    newCard[6] = newsImageURL;
                    newCard[7] = newsHeading;
                    newCard[8] = newsData;
                    newCard[9] = timeVal;
                    newCard[10] = newsURL[1];
                    newCard[11] = newsSource[1];
                    //pushNewDataCard(lineNum, newCard);
                    tempArray.push(newCard);
                });
                tempArray.sort(function (a, b) { return a[5] - b[5] });
                news_last_card_time = tempArray[tempArray.length - 1][5];
                if (transitionComplete == 1) {
                    for (i = 0; i < tempArray.length; i++) {
                        pushNewDataCard(lineNum, tempArray[i]);
                    }
                } else {
                    $('body').bind('news', function () {
                        setTimeout(function () {
                            for (i = 0; i < tempArray.length; i++) {
                                pushNewDataCard(lineNum, tempArray[i]);
                            }
                        }, 500);
                    });
                }
                //$('#dump').text(i);

                //$('#dump').text($('#dump').text() + $(data).children('rss').children('channel').children('item')[i].children('title') + 'HAHAHAH');


                //var myLocationData = $(data).children().children('weather').children('forecast_information').children('city').attr('data').split(", ");

                //$('#location').text(myLocationData[0]);
                //$('#weatherIcon').attr('src', "http://www.google.com" + $(data).children().children('weather').children('current_conditions').children('icon').attr('data'));
                //$('#temperature').text($(data).children().children('weather').children('current_conditions').children('temp_f').attr('data') + toStaticHTML("&deg;F"));
            }
        });


    WinJS.xhr({ url: BASE_URL_TEST + "/shilpa/client/flickr_client.php?win_id=" + userId }).done(
        function fulfilled(result) {
            if (result.status === 200) {
                var data = JSON.parse(result.response);
                var i;
                var lineNum = 1;
                if (transitionComplete == 1) {
                    var ctr = 0;
                    for (i = data.flickr_feed.length - 1; i >= 0 ; i--) {
                        // $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);
                        var newCard = new Array(8);
                        newCard[4] = "flickr";
                        newCard[5] = "timestampTBD";
                        newCard[6] = data.flickr_feed[i].user;
                        newCard[7] = data.flickr_feed[i].photo + "b.jpg";
                        if (ctr < 4) {
                            var temp = { "user": data.flickr_feed[i].user, "photo": data.flickr_feed[i].photo };
                            flickrcache.unshift(temp);
                            ctr++;
                        }
                        pushNewDataCard(lineNum, newCard);
                        //scrollCards(lineNum, -160);
                    }
                } else {
                    $('body').bind('flickr', function () {

                        setTimeout(function () {
                            var ctr = 0;
                            for (i = data.flickr_feed.length - 1; i >= 0 ; i--) {
                                // $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);
                                //save 4 cards into a JSON format                                
                                var newCard = new Array(8);
                                newCard[4] = "flickr";
                                newCard[5] = "timestampTBD";
                                newCard[6] = data.flickr_feed[i].user;
                                newCard[7] = data.flickr_feed[i].photo + "b.jpg";
                                if (ctr < 4) {
                                    var temp = { "user": data.flickr_feed[i].user, "photo": data.flickr_feed[i].photo };
                                    flickrcache.unshift(temp);
                                    ctr++;
                                }
                                pushNewDataCard(lineNum, newCard);
                                //scrollCards(lineNum, -160);
                            }
                        }, 500);
                    });
                }
            }
        });

    WinJS.xhr({ url: BASE_URL_TEST2 + "/shilpa/gmail_client.php?win_id=" + userId }).done(
        function fulfilled(result) {
            if (result.status === 200) {
                var data = JSON.parse(result.response);
                var i;
                var lineNum = 2;
                if (transitionComplete == 1) {
                    var ctr = 0;
                    for (i = (data.gmail_feed.length - 1) ; i >= 0; i--) {
                        // $('#dump').text($('#dump').val() + " ---- " + data.gmail_feed[i].user);
                        gmail_last_card_time = data.gmail_feed[0].date
                        var timeVal = new Date(data.gmail_feed[i].date);
                        timeVal = convertTimeToString(timeVal);
                        var newCard = new Array(11);
                        newCard[4] = "gmail";
                        newCard[5] = timeVal;
                        newCard[6] = data.gmail_feed[i].from;
                        newCard[7] = data.gmail_feed[i].subject;
                        newCard[8] = data.gmail_feed[i].plain_text;
                        newCard[9] = data.gmail_feed[i].to;
                        newCard[10] = data.gmail_feed[i].truncated_text;
                        if (ctr < 4) {
                            var temp = { "from": data.gmail_feed[i].from, "to": data.gmail_feed[i].to, "date": data.gmail_feed[i].date, "subject": data.gmail_feed[i].subject, "plain_text": data.gmail_feed[i].plain_text, "truncated_text": data.gmail_feed[i].truncated_text };
                            gmailcache.unshift(temp);
                            ctr++;
                        }
                        pushNewDataCard(lineNum, newCard);
                        //scrollCards(lineNum, -160);
                    }
                } else {

                    $('body').bind('gmail', function () {
                        setTimeout(function () {
                            var ctr = 0;
                            for (i = (data.gmail_feed.length - 1) ; i >= 0; i--) {

                                //  $('#dump').text($('#dump').val() + " ---- " + data.gmail_feed[i].user);

                                var timeVal = new Date(data.gmail_feed[i].date);


                                timeVal = convertTimeToString(timeVal);


                                var newCard = new Array(11);
                                newCard[4] = "gmail";
                                newCard[5] = timeVal;
                                newCard[6] = data.gmail_feed[i].from;
                                newCard[7] = data.gmail_feed[i].subject;
                                newCard[8] = data.gmail_feed[i].plain_text;
                                newCard[9] = data.gmail_feed[i].to;
                                newCard[10] = data.gmail_feed[i].truncated_text;
                                if (ctr < 4) {
                                    var temp = { "from": data.gmail_feed[i].from, "to": data.gmail_feed[i].to, "date": data.gmail_feed[i].date, "subject": data.gmail_feed[i].subject, "plain_text": data.gmail_feed[i].plain_text, "truncated_text": data.gmail_feed[i].truncated_text };
                                    gmailcache.unshift(temp);
                                    ctr++;
                                }
                                pushNewDataCard(lineNum, newCard);

                                //scrollCards(lineNum, -160);

                            }
                        }, 500);
                    });
                }
            }
        });

    var fbPromise = WinJS.xhr({ url: BASE_URL_LIVE + "/gaomin/client/fb_json.php" });

    var TwitPromise = WinJS.xhr({ url: BASE_URL_TEST + "/shilpa/client/twitter_client.php?win_id=" + userId });

    WinJS.Promise.join([fbPromise, TwitPromise]).done(
        function () {

            var lineNum = 5;
            var tempArray = new Array();
            var i;

            fbPromise.done(
                function fulfilled(result) {
                    if (result.status === 200) {
                        var data = JSON.parse(result.response);
                        fb_last_card_time = data.facebookPosts[0].time;
                        var ctr = 0;
                        for (i = (data.facebookPosts.length - 1) ; i >= 0; i--) {
                            var time = parseFloat(data.facebookPosts[i].time) * 1000;
                            var timeVal = new Date(time);
                            //console.log(timeVal);
                            timeVal = convertTimeToString(timeVal);
                            var newCard = new Array(11);
                            newCard[4] = "facebook";
                            newCard[5] = time;
                            newCard[6] = data.facebookPosts[i].posterName;
                            newCard[7] = data.facebookPosts[i].text;
                            newCard[8] = data.facebookPosts[i].link;
                            newCard[9] = data.facebookPosts[i].posterId;
                            newCard[10] = timeVal;
                            if (ctr < 4) {
                                var temp = { "serviceName": "Facebook", "type": data.facebookPosts[i].type, "posterName": data.facebookPosts[i].posterName, "posterId": data.facebookPosts[i].posterId, "time": data.facebookPosts[i].time, "text": data.facebookPosts[i].text, "link": data.facebookPosts[i].link, "likeUrl": data.facebookPosts[i].likeUrl, "commentUrl": data.facebookPosts[i].commentUrl };
                                fbcache.unshift(temp);
                                ctr++;
                            }
                            tempArray.push(newCard);
                            //scrollCards(lineNum, -160);
                        }
                    }
                });
            TwitPromise.done(
                function fulfilled(result) {
                    if (result.status === 200) {
                        var data = JSON.parse(result.response);
                        twitter_last_card_time = (data.twitter_feed[0].time);
                        var ctr = 0;
                        for (i = (data.twitter_feed.length - 1) ; i >= 0; i--) {

                            //                           $('#dump').text($('#dump').val() + " ---- " + data.twitter_feed[i].user);
                            var time = parseFloat(data.twitter_feed[i].time) * 1000;
                            var timeVal = new Date(time);
                            timeVal = convertTimeToString(timeVal);
                            var newCard = new Array(10);
                            newCard[4] = "twitter";
                            newCard[5] = time;
                            newCard[6] = data.twitter_feed[i].user;
                            newCard[7] = data.twitter_feed[i].tweet;
                            newCard[8] = (data.twitter_feed[i].photo).replace("_normal", "");
                            newCard[9] = timeVal;
                            if (ctr < 4) {
                                var temp = { "user": data.twitter_feed[i].user, "photo": data.twitter_feed[i].photo, "tweet": data.twitter_feed[i].tweet, "time": data.twitter_feed[i].time };
                                twittercache.unshift(temp);
                                ctr++;
                            }
                            tempArray.push(newCard);
                            //scrollCards(lineNum, -160);
                        }
                    }
                });

            tempArray.sort(function (a, b) { return a[5] - b[5] });
            if (transitionComplete == 1) {
                for (i = 0; i < tempArray.length; i++) {
                    pushNewDataCard(lineNum, tempArray[i]);
                }
            } else {

                $('body').bind('fb_and_twitter', function () {
                    setTimeout(function () {
                        for (i = 0; i < tempArray.length; i++) {
                            pushNewDataCard(lineNum, tempArray[i]);
                        }
                    }, 500);
                });
            }
            //console.log(FacebookData.status);
        });


    WinJS.xhr({ url: BASE_URL_LIVE + "/gaomin/client/groupon_json.php" }).done(
        function fulfilled(result) {
            if (result.status === 200) {
                var data = JSON.parse(result.response);
                var i;

                var lineNum = 3;

                if (transitionComplete == 1) {
                    var ctr = 0;
                    for (i = (data.deals.length - 1) ; i >= 0 ; i--) {

                        //                                $('#dump').text($('#dump').val() + " ---- " + data.deals[i].user);

                        var newCard = new Array(9);
                        newCard[4] = "groupon";
                        newCard[5] = "timestampTBD";
                        newCard[6] = data.deals[i].title;
                        newCard[7] = data.deals[i].highlightsHtml;
                        newCard[8] = data.deals[i].largeImageUrl;
                        if (ctr < 4) {
                            var temp = { "title": data.deals[i].title, "highlightsHtml": data.deals[i].highlightsHtml, "largeImageUrl": data.deals[i].largeImageUrl };
                            grouponcache.unshift(temp);
                            ctr++;
                        }
                        pushNewDataCard(lineNum, newCard);

                        //scrollCards(lineNum, -160);
                    }
                } else {
                    $('body').bind('groupon', function () {
                        setTimeout(function () {
                            var ctr = 0;
                            for (i = (data.deals.length - 1) ; i >= 0 ; i--) {

                                //                                $('#dump').text($('#dump').val() + " ---- " + data.deals[i].user);

                                var newCard = new Array(9);
                                newCard[4] = "groupon";
                                newCard[5] = "timestampTBD";
                                newCard[6] = data.deals[i].title;
                                newCard[7] = data.deals[i].highlightsHtml;
                                newCard[8] = data.deals[i].largeImageUrl;
                                if (ctr < 4) {
                                    var temp = { "title": data.deals[i].title, "highlightsHtml": data.deals[i].highlightsHtml, "largeImageUrl": data.deals[i].largeImageUrl };
                                    grouponcache.unshift(temp);
                                    ctr++;
                                }
                                pushNewDataCard(lineNum, newCard);
                                //scrollCards(lineNum, -160);
                            }
                        }, 500);
                    });
                }
            }
        });

}
function pushNewDataCard(lineNum, newCard) {
    //console.log(lineNum);
    var numCardsInLine = matrix[lineNum - 1].length;
    //var newCard = new Array(4);
    newCard[0] = cardCount;
    newCard[1] = matrix[lineNum - 1][0][1];
    newCard[2] = matrix[lineNum - 1][0][2];
    newCard[3] = matrix[lineNum - 1][0][3];
    scrollCards(lineNum, -80);
    matrix[lineNum - 1].unshift(newCard);

    var myGenericCard = document.createElement("div");

    myGenericCard.setAttribute("id", "card" + cardCount);
    myGenericCard.setAttribute("class", "row" + lineNum + " position0");
    myGenericCard.setAttribute('style', 'transition: all 500ms ease;');
    document.getElementById("element" + lineNum).appendChild(myGenericCard);
    $('#card' + cardCount).addClass('face');
    if (lineNum == 1) {
        $('#card' + cardCount).html('<div class="FLICKR_content"><img id="profilePic" class="FLICKR_PIC" src="' + matrix[lineNum - 1][0][7] + '"/><span id="Span13" class="FLICKR_time">11:11</span><span id="Span14" class="FLICKR_title">' + matrix[lineNum - 1][0][6] + '</span> </div>');
    } else if (lineNum == 2) {
        var text = ('<div class="GM_content"><span class="GM_time">' + (matrix[lineNum - 1][0][5]) + '</span><span class="GM_From">From: ' + (matrix[lineNum - 1][0][6]) + '</span><span class="GM_subject">Subject: ' + toStaticHTML(matrix[lineNum - 1][0][7]) + '</span><span class="GM_message">' + (matrix[lineNum - 1][0][10]) + '</span> <span class="hiddenData">' + (matrix[lineNum - 1][0][8]) + '</span> </div>');
        WinJS.Utilities.setInnerHTMLUnsafe(myGenericCard, text);

    } else if (lineNum == 5) {
        if (matrix[lineNum - 1][0][4] == "facebook") {
            $('#card' + cardCount).html('<div class="FB_content"><img class="FB_PIC" src="http://graph.facebook.com/' + matrix[lineNum - 1][0][9] + '/picture?type=large"/><span class="FB_time">' + matrix[lineNum - 1][0][10] + '</span><span class="FB_title">' + matrix[lineNum - 1][0][6] + '</span><span class="FB_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
        } else if (matrix[lineNum - 1][0][4] == "twitter") {
            $('#card' + cardCount).html('<div class="TWIT_content"><img class="TWIT_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="TWIT_time">' + matrix[lineNum - 1][0][9] + '</span><span class="TWIT_title">' + matrix[lineNum - 1][0][6] + '</span><span class="TWIT_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
        }
    } else if (lineNum == 3) {
        $('#card' + cardCount).html('<div class="GROUPON_content"><img class="GROUPON_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">' + matrix[lineNum - 1][0][6] + '</span><span class="GROUPON_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
    } else if (lineNum == 4) {
        $('#card' + cardCount).html(toStaticHTML('<div class="NEWS_content"><img class="NEWS_PIC" src="' + matrix[lineNum - 1][0][6] + '"/><span class="NEWS_time">' + matrix[lineNum - 1][0][9] + '</span><span class="NEWS_source">' + matrix[lineNum - 1][0][11] + '</span><span class="NEWS_title">' + matrix[lineNum - 1][0][7] + '</span><span class="NEWS_message">' + matrix[lineNum - 1][0][8] + '</span><span class="hiddenData">' + toStaticHTML(matrix[lineNum - 1][0][10]) + '</span></div>'));
    }
    $('#card' + cardCount).fadeTo('fast', 1);
    $('.face').unbind();
    bindFace();
    // $('#card' + cardCount).css({'transition':'all 500ms ease', 'transform':'translateY(' + (matrix[lineNum - 1][0][2]) + 'px) translateZ(' + (matrix[lineNum - 1][0][3]) + 'px)'});
    //
    cardCount++;
    setTimeout(function () {
        scrollCards(lineNum, 0);
    }, 1);
}
function scrollCards(lineNum, pixels) {
    // $('.face').unbind();
    var currentCard;
    var numCardsInLine = matrix[lineNum - 1].length;
    for (var i = 0; i < numCardsInLine; i++) {
        matrix[lineNum - 1][i][3] += pixels;
        currentCard = '#card' + matrix[lineNum - 1][i][0];
        $(currentCard).css('transform', 'translateY(' + matrix[lineNum - 1][i][2] + 'px) translateZ(' + matrix[lineNum - 1][i][3] + 'px)');
    }

    $(currentCard).bind('transitionend', function () {
        $('body').trigger("scrollend");
    });
    //bindFace();
}
function bindFace() {
    $('.face').hover(
            function () {
                if (scrolling == 0) {
                    var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');
                    //$('#dump').text($(this).attr('id'));
                    //$(this).children('.face').each(function () { $('#dump').append($(this).attr('id')) });
                    $(this).css({ "transform": "translateY(290px) translateZ(" + transformMatrix[14] + "px)" });
                    currentHoverFace = $(this).attr('id');
                    //$('#dump').text($(this).parent().attr('id'));
                }
            },
            function () {
                if (scrolling == 0) {
                    var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');


                    $(this).css({ "transform": "translateY(320px) translateZ(" + transformMatrix[14] + "px)" });
                    //$(this).css({ "transform": "translateY(20px)" });

                    //$(this).bind('transitionend', function () {
                    currentHoverFace = undefined;
                    //});
                    //  $('#dump').text($(this).parent().attr('id'));
                }
            });
    $('.face').bind('click', mouseClickFace);
}

function bindKeys() {

    var arrowKeyLock = 0;

    $('body').keyup(function (event) {
        var key = event.keyCode - 48;
        //console.log("key " +key+ " is up!"); 
        var elementId = "element" + key;
        if (key > 0 && key < 6) {
            arrowKeyLock = 0;
        } else if (key == -8) {
            arrowKeyLock = 0;
        } else if (key == -10) {
            arrowKeyLock = 0;
        } else if (key == -14) {
            arrowKeyLock = 0;
        } else if (key == -15) {
            arrowKeyLock = 0;
        }
    });

    $('body').keydown(function (event) {
        var key = event.keyCode - 48;
        var elementId = "element" + key;
        if (key > 0 && key < 5) {
            pushNewCard(key);
            arrowKeyLock = 1;

        } else if (key == -8) {
            if (hoverLineNum > 0 && arrowKeyLock == 0) {
                scrollCards(hoverLineNum, 40);
                arrowKeyLock = 1;
            }
        } else if (key == -10) {
            if (hoverLineNum > 0 && arrowKeyLock == 0) {
                scrollCards(hoverLineNum, -40);
                arrowKeyLock = 1;
            }
        } else if (key == -14) {
            if (hoverLineNum > 0 && arrowKeyLock == 0) {
                scrollCards(hoverLineNum, 320);
                arrowKeyLock = 1;
            }
        } else if (key == -15) {
            if (hoverLineNum > 0 && arrowKeyLock == 0) {
                scrollCards(hoverLineNum, -320);
                arrowKeyLock = 1;
            }
        }
    });
}
function mouseClickFace(event) {
    event.stopPropagation();
    $('body').unbind('keydown');
    $('body').unbind('keyup');

    $('.face').unbind('click');


    var matrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');

    var overlay = $('#overlays').children();

    var newFace = $(this).clone();
    newFace.attr('id', 'newFace');

    var oldFace = $(this);
    oldFace.hide();
    // $('#dump').text(oldFace.children('.FLICKR_content').children('.FLICKR_PIC').attr('src'));
    var cube = $(this).parent().clone().empty();

    newFace.appendTo(cube);
    //cube.appendTo(element);
    cube.appendTo("#page-wrapper");
    cube.css({ "z-index": "9999" });
    overlay.show();
    //	var width = $('body').width() * 0.7;
    var height = $('body').height() * 0.7;
    var width = height * 1.6;
    //var value = parseFloat($(cube).css('perspective-origin').split("px ")[0]) - ($(cube).offsetParent().left - 440) + (($('body').width() - width) / 2);
    //var value = (parseFloat($(cube).css('perspective-origin').split("px ")[0])-114*4.5);
    //var value = ;
    //$('#dump').text(value);
    var transX = ((parseFloat($(cube).css('perspective-origin').split("px ")[0]) - 114 * 2) * 1.78 - (($('body').width() - width) / 2)) + 114;
    var transY = $('body').height() / 2 - height / 2 - 114;

    $(newFace).css({
        "background-color": "rgba(255, 255, 255, 1.0)",
        "transition": "all 1s ease",
        "transform": "translateZ(0px) translateY(" + transY + "px) translateX(" + transX + "px) rotateX(0deg)",
        "height": height + "px",
        "width": width + "px",
        "z-index": "999999999",
    });

    if ($(newFace).children().attr('class') == "FLICKR_content") {
        //    $('#dump').text("in Flickr");
    } else if ($(newFace).children().attr('class') == "GM_content") {
            //   $('#dump').text("in GMAIL");
        $(newFace).children().css({ "background-image": "url(../images/Gmail_detail.png)", "background-size": "100% 100%", "z-index": "9999999999999" });
        $(newFace).children().children('.GM_From').css({ "transition": "font 1s ease", "max-width": "100%", "height": "auto", "max-height": "10%", "left": "17%", "top": "3%", "font-weight": "100", "font-size": "200%", "color": "#FFF", "overflow-x": "hidden" });
        if ($(newFace).children().children('.GM_From').text().length > 40) {
            $(newFace).children().children('.GM_From').text($(newFace).children().children('.GM_From').text().substr(0, 40) + "...");
        }


        $(newFace).children().children('.GM_subject').css({ "transition": "font 1s ease", "max-width": "90%", "height": "auto", "max-height": "8%", "left": "2.5%", "top": "17%", "font-weight": "100", "font-size": "200%", "color": "#000" });
        if ($(newFace).children().children('.GM_subject').text().length > 60) {
            $(newFace).children().children('.GM_subject').text($(newFace).children().children('.GM_subject').text().substr(0, 60) + "...");
        }
        $(newFace).children().children('.GM_message').css({ "transition": "font 1s ease", "max-width": "93%", "height": "auto", "max-height": "30%", "left": "2.5%", "top": "28%", "font-weight": "100", "font-size": "150%", "color": "#666", "overflow": "hidden", "overflow-y": "scroll", "padding-right": "2%" });
        $(newFace).children().children('.GM_message').text($(newFace).children().children('.hiddenData').text());
        $(newFace).children().append("<textarea class='gmailReply'>Click here to reply</textarea>");
        $(newFace).children().children('.gmailReply').css({ "font-weight": "100", "font-size": "200%" });
        $(newFace).children().children('.GM_time').css({ "transition": "font 1s ease", "height": "auto", "max-height": "10%", "right": "2%", "top": "2%", "font-weight": "normal", "font-size": "200%", "color": "#FFF" });


    } else if ($(newFace).children().attr('class') == "FB_content") {

            //    $('#dump').text("in FACEBOOK");

        $(newFace).children().css({ "background-image": "url(../images/facebook_detail.png)", "background-size": "100% 100%" });
        $(newFace).children().children('.FB_PIC').css({ "min-width": "20%", "max-width": "20.4%", "height": "auto", "max-height": "45%", "left": "5.1%", "top": "auto", "bottom": "40%" });
        $(newFace).children().children('.FB_title').css({ "transition": "font 1s ease", "max-width": "25%", "height": "auto", "max-height": "45%", "left": "4.1%", "top": "61%", "font-weight": "bold", "font-size": "200%", "color": "#666" });
        $(newFace).children().children('.FB_message').css({ "transition": "font 1s ease", "max-width": "67%", "height": "auto", "max-height": "30%", "left": "30%", "top": "18%", "font-weight": "100", "font-size": "200%", "color": "#000" });
        $(newFace).children().children('.FB_time').css({ "transition": "font 1s ease", "height": "auto", "max-height": "10%", "right": "2%", "top": "2%", "font-weight": "normal", "font-size": "200%", "color": "#FFF" });

    } else if ($(newFace).children().attr('class') == "TWIT_content") {
            //   $('#dump').text("in TWITTER");

        $(newFace).children().css({ "background-image": "url(../images/twitter_detail.png)", "background-size": "100% 100%" });
        $(newFace).children().children('.TWIT_PIC').css({ "min-width": "20%", "max-width": "20.4%", "height": "auto", "max-height": "45%", "left": "5.1%", "top": "auto", "bottom": "40%" });
        $(newFace).children().children('.TWIT_title').css({ "transition": "font 1s ease", "max-width": "25%", "height": "auto", "max-height": "45%", "left": "4.1%", "top": "61%", "font-weight": "bold", "font-size": "200%", "color": "#666" });
        $(newFace).children().children('.TWIT_message').css({ "transition": "font 1s ease", "max-width": "67%", "height": "auto", "max-height": "30%", "left": "30%", "top": "38%", "font-weight": "100", "font-size": "200%", "color": "#000" });
        $(newFace).children().children('.TWIT_time').css({ "transition": "font 1s ease", "height": "auto", "max-height": "10%", "right": "2%", "top": "2%", "font-weight": "normal", "font-size": "200%", "color": "#FFF" });




    } else if ($(newFace).children().attr('class') == "GROUPON_content") {
            //    $('#dump').text("in GRPN");
        $(newFace).children().css({ "background-image": "url(../images/Groupon_detail.png)", "background-size": "100% 100%" });
        $(newFace).children().children('.GROUPON_PIC').css({ "width": "54%", "height": "auto", "left": "43%", "top": "auto", "bottom": "14%" });
        $(newFace).children().children('.GROUPON_title').css({ "transition": "font 1s ease", "max-width": "40%", "height": "auto", "max-height": "40%", "left": "1.5%", "top": "20%", "font-weight": "700", "font-size": "200%", "color": "#000", "text-align": "center" });
        $(newFace).children().children('.GROUPON_message').css({ "transition": "font 1s ease", "max-width": "40%", "height": "auto", "max-height": "35%", "left": "1.5%", "top": "60%", "font-weight": "500", "font-size": "200%", "color": "#2F4215" });
        $(newFace).children().children('.GROUPON_time').css({ "transition": "font 1s ease", "height": "auto", "max-height": "10%", "right": "2%", "top": "2%", "font-weight": "normal", "font-size": "200%", "color": "#FFF" });

    } else if ($(newFace).children().attr('class') == "NEWS_content") {


        $(newFace).children().children('.NEWS_message').css({ "transition": "font 1s ease", "max-width": "80%", "height": "auto", "max-height": "80%", "left": "20%", "top": "38%", "font-weight": "100", "font-size": "200%", "color": "#000" });
        $(newFace).children().children('.NEWS_PIC').css({ "width": "15%", "height": "25%", "left": "3%", "top": "40%" });
        $(newFace).children().children('.NEWS_title').html(toStaticHTML("<a href=\"" + $(newFace).children().children('.hiddenData').text() + "\" >" + $(newFace).children().children('.NEWS_title').text() + "</a>"));
        $(newFace).children().children('.NEWS_title').css({ "transition": "font 1s ease", "max-width": "93%", "height": "auto", "max-height": "30%", "left": "2.5%", "top": "22%", "font-weight": "100", "font-size": "250%", "color": "#666", "overflow": "hidden", "padding-right": "2%" });

        $(newFace).children().children('.NEWS_source').css({ "transition": "font 1s ease", "height": "auto", "max-height": "10%", "left": "2%", "top": "2%", "font-weight": "normal", "font-size": "200%", "color": "#FFF" });
        $(newFace).children().children('.NEWS_time').css({ "transition": "font 1s ease", "height": "auto", "max-height": "10%", "right": "2%", "top": "2%", "font-weight": "normal", "font-size": "200%", "color": "#FFF" });


    }

    var image = "";
    if ($(cube).attr('id') == "element1") {
        //    image = oldFace.children('.FLICKR_content').children('.FLICKR_PIC').attr('src');
        //    console.log(oldFace.children('.FLICKR_content').children('.FLICKR_PIC').attr('src'));
    } else if ($(cube).attr('id') == "element2") {
        image = "images/Gmail_detail.png";
    } else if ($(cube).attr('id') == "element4") {
        image = "images/Groupon_detail.png";
    }
    /*
    if (image.length > 0) {
        $(newFace).children().remove();
        var content = $("<img src='" + image + "' />").appendTo($(newFace)).addClass('card');
    }
    */
    //$('.parentCanvas').css({ "perspective": "350px" });
    /*    $(newFace).click(function (e) {
            e.stopPropagation();
        });
        */
    /*$(cube).click(function (e) {
        $(overlay).trigger('click');
    });
    */
    $(overlay).unbind('click');

    $(newFace).bind("transitionend", function () {
        $(overlay).bind('click', function () {

            removeOverlay(matrix[14], newFace, cube, overlay, oldFace);
        });

        $('body').keydown(function (event) {
            var key = event.keyCode;
            if (key == 27) {
                removeOverlay(matrix[14], newFace, cube, overlay, oldFace);
            }
        });
    });
    //
    /*newFace.bind('mousewheel', function (e) {
        return false;
    });
    */
}
function pushNewCard(lineNum) {
    //console.log(lineNum);
    var numCardsInLine = matrix[lineNum - 1].length;
    var newCard = new Array(4);
    newCard[0] = cardCount;
    newCard[1] = matrix[lineNum - 1][0][1];
    newCard[2] = matrix[lineNum - 1][0][2];
    newCard[3] = matrix[lineNum - 1][0][3];

    scrollCards(lineNum, -80);


    matrix[lineNum - 1].unshift(newCard);

    var myGenericCard = document.createElement("div");

    myGenericCard.setAttribute("id", "card" + cardCount);
    myGenericCard.setAttribute("class", "row" + lineNum + " position0");
    myGenericCard.setAttribute('style', 'transition: all 500ms ease;');



    document.getElementById("element" + lineNum).appendChild(myGenericCard);


    $('#card' + cardCount).addClass('face');
    if (lineNum == 1) {
        $('#card' + cardCount).html('<img src="images/photo1.png" class="card"/>');
    } else if (lineNum == 2) {
        $('#card' + cardCount).html('<img src="images/mail1.png" class="card"/>');
    } else if (lineNum == 5) {
        $('#card' + cardCount).html('<div class="TWIT_content"><img id="profilePic" class="FB_PIC" src=""></img><span id="Span13" class="TWIT_time">11:11</span><span id="Span14" class="TWIT_title">New @Reply from Levonmaa</span><span id="Span15" class="TWIT_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span></div>');
    } else if (lineNum == 3) {
        $('#card' + cardCount).html('<div class="GROUPON_content"><img class="GROUPON_PIC" src="' + groupon_dummy_url + '"/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">$5 for $10 at Curry Leaf Restaurant</span><span class="GROUPON_message">Masala dosas, mutter paneer, and tandoori roti sate appetites and appease vegetarians or those with gluten allergies</span> </div>');
    } else if (lineNum == 4) {
        $('#card' + cardCount).html('<img src="images/news2.png" class="card"/>');
    }

    $('#card' + cardCount).fadeTo('fast', 1);


    $('.face').hover(
        function () {
            var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');
            // $('#dump').text($(this).attr('id'));
            //$(this).children('.face').each(function () { $('#dump').append($(this).attr('id')) });
            $(this).css({ "transition": "transform 500ms ease", "transform": "translateY(290px) translateZ(" + transformMatrix[14] + "px)" });
        },
        function () {
            var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');

            //  $('#dump').text($(this).attr('id'));
            $(this).css({ "transition": "transform 500ms ease", "transform": "translateY(320px) translateZ(" + transformMatrix[14] + "px)" });
            //$(this).css({ "transform": "translateY(20px)" });
        });

    $('.face').unbind('click');
    $('.face').click(mouseClickFace);
    // $('#card' + cardCount).css({'transition':'all 500ms ease', 'transform':'translateY(' + (matrix[lineNum - 1][0][2]) + 'px) translateZ(' + (matrix[lineNum - 1][0][3]) + 'px)'});
    //

    cardCount++;
    setTimeout(function () {

        scrollCards(lineNum, 0);

    }, 1);
}

function removeOverlay(zPos, newFace, cube, overlay, oldFace) {
    $(newFace).bind("transitionend", function () {
        //$(oldFace).css({ "transform": "translateZ(" + matrix[14] + "px) translateY(320px) rotateX(0deg)", "background-color": "rgba(255, 255, 255, 1.0)" });
        $(cube).remove();
        $(overlay).hide();
        $(oldFace).show();
        $('body').unbind('keydown');
        $('body').unbind('keyup');
        bindKeys();
        $('.face').click(mouseClickFace);

    });

    $(newFace).css({
        "transform": "translateZ(" + zPos + "px) translateY(320px) rotateX(0deg)",
        "height": "122px",
        "width": "251px"
    });



    if ($(newFace).children().attr('class') == "FLICKR_content") {
        //   $('#dump').text("in Flickr");
    } else if ($(newFace).children().attr('class') == "GM_content") {
            //   $('#dump').text("in GMAIL");

        $(newFace).children().children('.GM_From').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.GM_subject').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.GM_message').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.GM_time').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.gmailReply').css({ "font-weight": "normal", "font-size": "50%" });


    } else if ($(newFace).children().attr('class') == "FB_content") {

            //   $('#dump').text("in FACEBOOK");

        $(newFace).children().children('.FB_title').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.FB_message').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.FB_time').css({ "font-weight": "normal", "font-size": "50%" });

    } else if ($(newFace).children().attr('class') == "TWIT_content") {
            //   $('#dump').text("in TWITTER");


        $(newFace).children().children('.TWIT_title').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.TWIT_message').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.TWIT_time').css({ "font-weight": "normal", "font-size": "50%" });



    } else if ($(newFace).children().attr('class') == "GROUPON_content") {
            //   $('#dump').text("in GRPN");
        $(newFace).children().children('.GROUPON_title').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.GROUPON_message').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.GROUPON_time').css({ "font-weight": "normal", "font-size": "50%" });
    } else if ($(newFace).children().attr('class') == "NEWS_content") {
            //  $('#dump').text("in News");


        $(newFace).children().children('.NEWS_source').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.NEWS_title').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.NEWS_message').css({ "font-weight": "normal", "font-size": "50%" });
        $(newFace).children().children('.NEWS_time').css({ "font-weight": "normal", "font-size": "50%" });
    }
}

function refreshData() {
    refreshTwitter();
    //refreshFB();
    refreshGmail();
    refreshNews();
    setTimeout(refreshData, 60000);
}

function refreshTwitter() {
    //check if any new data is there for twitter
    //using timestamp
    //make a WinJS.xhr call to twitter_client.php and match the latest timestam with one already present
    var twitterPromise = WinJS.xhr({ url: BASE_URL_TEST + "/shilpa/client/twitter_client.php?win_id=" + userId });
    var tempArray = new Array();
    var lineNum = 5;
    twitterPromise.done(
        //get all data from server check with last_card_time if it is higher
        //add to the new json object
        //use the new objct to push card on the client
        //update the last_time
         function fulfilled(result) {
             if (result.status === 200) {
                 var newData = JSON.parse(result.response);
                 for (i = (newData.twitter_feed.length - 1) ; i >= 0; i--) {
                     curTime = newData.twitter_feed[i].time;
                     if (twitter_last_card_time < curTime) {
                         var time = parseFloat(newData.twitter_feed[i].time) * 1000;
                         var timeVal = new Date(time);
                         timeVal = convertTimeToString(timeVal);
                         var newCard = new Array(10);
                         newCard[4] = "twitter";
                         newCard[5] = time;
                         newCard[6] = newData.twitter_feed[i].user;
                         newCard[7] = newData.twitter_feed[i].tweet;
                         newCard[8] = (newData.twitter_feed[i].photo).replace("_normal", "");
                         newCard[9] = timeVal;
                         tempArray.push(newCard);
                     }
                     //console.log(newData.twitter_feed[i].subject);
                 }
                 twitter_last_card_time = newData.twitter_feed[0].time;
                 tempArray.sort(function (a, b) { return a[5] - b[5] });
                 for (var i = 0; i < tempArray.length; i++) {
                     var card = tempArray[i];
                     pushNewDataCard(lineNum, tempArray[i]);
                 }
             }
         }
    );
}
function refreshFB() {
    //check if any new data is there for twitter
    //using timestamp
    //make a WinJS.xhr call to twitter_client.php and match the latest timestam with one already present
    var facebookPromise = WinJS.xhr({ url: BASE_URL_LIVE + "/gaomin/client/fb_json.php" });
    var tempArray = new Array();
    var lineNum = 5;
    facebookPromise.done(
        //get all data from server check with last_card_time if it is higher
        //add to the new json object
        //use the new objct to push card on the client
        //update the last_time
         function fulfilled(result) {
             if (result.status === 200) {
                 var newData = JSON.parse(result.response);
                 for (i = (newData.facebookPosts.length - 1) ; i >= 0; i--) {
                     curTime = newData.facebookPosts[i].time;
                     if (fb_last_card_time < curTime) {
                         var time = parseFloat(newData.facebookPosts[i].time) * 1000;
                         var timeVal = new Date(time);
                         //console.log(timeVal);
                         timeVal = convertTimeToString(timeVal);
                         var newCard = new Array(11);
                         newCard[4] = "facebook";
                         newCard[5] = time;
                         newCard[6] = newData.facebookPosts[i].posterName;
                         newCard[7] = newData.facebookPosts[i].text;
                         newCard[8] = newData.facebookPosts[i].link;
                         newCard[9] = newData.facebookPosts[i].posterId;
                         newCard[10] = timeVal;
                         tempArray.push(newCard);
                     }
                     //console.log(newData.twitter_feed[i].subject);
                 }
                 fb_last_card_time = newData.facebookPosts[0].time;
                 tempArray.sort(function (a, b) { return a[5] - b[5] });
                 for (var i = 0; i < tempArray.length; i++) {
                     var card = tempArray[i];
                     pushNewDataCard(lineNum, tempArray[i]);
                 }
             }
         }
    );
}
function refreshGmail() {
    //check if any new data is there for twitter
    //using timestamp
    //make a WinJS.xhr call to twitter_client.php and match the latest timestam with one already present
    var gmailPromise = WinJS.xhr({ url: BASE_URL_TEST2 + "/shilpa/gmail_client.php?win_id=" + userId });
    var tempArray = new Array();
    var lineNum = 2;
    gmailPromise.done(
        //get all data from server check with last_card_time if it is higher
        //add to the new json object
        //use the new objct to push card on the client
        //update the last_time
         function fulfilled(result) {
             if (result.status === 200) {
                 var newData = JSON.parse(result.response);
                 for (i = (newData.gmail_feed.length - 1) ; i >= 0; i--) {
                     curTime = newData.gmail_feed[i].date;
                     var timeVal = new Date(newData.gmail_feed[i].date);
                     var last_retrieved = new Date(gmail_last_card_time);
                     if (last_retrieved < curTime) {
                         timeVal = convertTimeToString(timeVal);
                         var newCard = new Array(11);
                         newCard[4] = "gmail";
                         newCard[5] = timeVal;
                         newCard[6] = newData.gmail_feed[i].from;
                         newCard[7] = newData.gmail_feed[i].subject;
                         newCard[8] = newData.gmail_feed[i].plain_text;
                         newCard[9] = newData.gmail_feed[i].to;
                         newCard[10] = newData.gmail_feed[i].truncated_text;
                         tempArray.push(newCard);
                     }
                     //console.log(newData.twitter_feed[i].subject);
                 }
                 gmail_last_card_time = newData.gmail_feed[0].date;
                 tempArray.sort(function (a, b) { return a[5] - b[5] });
                 for (var i = 0; i < tempArray.length; i++) {
                     var card = tempArray[i];
                     pushNewDataCard(lineNum, tempArray[i]);
                 }
             }
         }
    );
}
function refreshNews() {
    //check if any new data is there for twitter
    //using timestamp
    //make a WinJS.xhr call to twitter_client.php and match the latest timestam with one already present
    var newsPromise = WinJS.xhr({ url: "http://news.google.com/news?topic=h&output=rss" });
    var tempArray = new Array();
    var lineNum = 4;
    newsPromise.done(
        //get all data from server check with last_card_time if it is higher
        //add to the new json object
        //use the new objct to push card on the client
        //update the last_time
         function fulfilled(result) {
             if (result.status === 200) {
                 var i;
                 var data = result.responseXML;
                 var tempArray = new Array();
                 jQuery.fn.reverse = [].reverse;

                 $(data).children('rss').children('channel').children('item').reverse().each(function () {
                     var description = $(this).children('description').text();
                     description = toStaticHTML(description);
                     var newsImageURL = "http:" + $(description).children('tbody').children('tr').children('td').children('font').children('a').children('img').attr('src');
                     newsImageURL = newsImageURL.replace("6.jpg", "1.jpg");
                     var newsHeading = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('a').text();
                     var newsAuthor = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('font')[0].innerText;
                     var newsData = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('font')[1].innerText;
                     var newsPubDate = $(this).children('pubDate').text();
                     var time = new Date(newsPubDate);
                     var newsURL = ($(this).children('link').text()).split("&url=");
                     var newsSource = ($(this).children('title').text()).split(" - ");
                     //var newsData = $(description).children('tbody').children('tr').children('.j').children('font').children('.lh').children('font').text();
                     timeVal = convertTimeToString(time);
                     if (news_last_card_time < time) {
                         var newCard = new Array(12);
                         newCard[4] = "news";
                         newCard[5] = time;
                         newCard[6] = newsImageURL;
                         newCard[7] = newsHeading;
                         newCard[8] = newsData;
                         newCard[9] = timeVal;
                         newCard[10] = newsURL[1];
                         newCard[11] = newsSource[1];
                         //pushNewDataCard(lineNum, newCard);
                         tempArray.push(newCard);
                     }
                 });
                 tempArray.sort(function (a, b) { return a[5] - b[5] });
                 if (tempArray.length != 0)
                     news_last_card_time = tempArray[tempArray.length - 1][5];
                 for (i = 0; i < tempArray.length; i++) {
                     pushNewDataCard(lineNum, tempArray[i]);
                 }
             }
         }
    );
}
function saveData() {
    var data = {};
    var dataobject = {};
    dataobject.flickr_feed = flickrcache;
    dataobject.twitter_feed = twittercache;
    dataobject.gmail_feed = gmailcache;
    dataobject.deals = grouponcache;
    dataobject.facebookPosts = fbcache;
    data = JSON.stringify(dataobject);
    //{ "flickr_feed": [] };
    Windows.Storage.KnownFolders.documentsLibrary.createFileAsync("data.txt", Windows.Storage.CreationCollisionOption.replaceExisting).done(function (file) {
        Windows.Storage.FileIO.writeTextAsync(file, data).done(function () {
        });
    });
}