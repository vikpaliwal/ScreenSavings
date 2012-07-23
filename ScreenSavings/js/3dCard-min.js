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




$(document).ready(function () {

    //removeRandomCards();
    updateTime();

    var matrix = createCardArray(5, 4, 4);
    loadData();

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            $('#card' + matrix[i][j][0]).css('transform', 'translateY(' + matrix[i][j][1] + 'px)');
        }
    }








    /*
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            for (var k = 0; k < matrix[i][j].length; k++) {
                console.log("[" + i + ", " + j + ", " + k + "] = " + matrix[i][j][k]);
            }
        }
    }
    */


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
        } else if (lineNum == 3) {
            $('#card' + cardCount).html('<div class="TWIT_content"><img id="profilePic" class="FB_PIC" src=""></img><span id="Span13" class="TWIT_time">11:11</span><span id="Span14" class="TWIT_title">New @Reply from Levonmaa</span><span id="Span15" class="TWIT_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span></div>');
        } else if (lineNum == 4) {
            $('#card' + cardCount).html('<img src="images/commerce1.png" class="card"/>');
        } else if (lineNum == 5) {
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
            $('#card' + cardCount).html('<div class="GM_content"><span class="GM_time">' + matrix[lineNum - 1][0][5] + '</span><span class="GM_From">From: ' + matrix[lineNum - 1][0][6] + '</span><span class="GM_subject">Subject: ' + matrix[lineNum - 1][0][7] + '</span><span class="GM_message">' + toStaticHTML(matrix[lineNum - 1][0][10]) + '</span> <span class="hiddenData">' + toStaticHTML(matrix[lineNum - 1][0][8]) + '</span> </div>');
        } else if (lineNum == 3) {
            if (matrix[lineNum - 1][0][4] == "facebook") {
                $('#card' + cardCount).html('<div class="FB_content"><img class="FB_PIC" src="http://graph.facebook.com/' + matrix[lineNum - 1][0][9] + '/picture?type=large"/><span class="FB_time">' + matrix[lineNum - 1][0][10] + '</span><span class="FB_title">' + matrix[lineNum - 1][0][6] + '</span><span class="FB_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
            } else if (matrix[lineNum - 1][0][4] == "twitter") {
                $('#card' + cardCount).html('<div class="TWIT_content"><img class="TWIT_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="TWIT_time">' + matrix[lineNum - 1][0][9] + '</span><span class="TWIT_title">' + matrix[lineNum - 1][0][6] + '</span><span class="TWIT_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
            }
        } else if (lineNum == 4) {
            $('#card' + cardCount).html('<div class="GROUPON_content"><img class="GROUPON_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">' + matrix[lineNum - 1][0][6] + '</span><span class="GROUPON_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
        } else if (lineNum == 5) {
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





























    function createCardArray(d1, d2, d3) {
        var x = new Array(d1);

        for (var i = 0; i < d1; i++) {
            x[i] = new Array(d2);
        }
        for (var i = 0; i < d1; i++) {
            for (var j = 0; j < d2; j++) {
                x[i][j] = new Array(d3);
                if (d3 == 4) {
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
                    } else if (i == 2) {
                        myGenericCard.innerHTML = '<div class="FB_content"><img class="FB_PIC" src=""/><span class="FB_time">11:11</span><span class="FB_title">New @Reply from Levonmaa</span><span class="FB_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span> </div>';
                    } else if (i == 3) {
                        myGenericCard.innerHTML = '<div class="GROUPON_content"><img class="GROUPON_PIC" src=""/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">New @Reply from Levonmaa</span><span class="GROUPON_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span> </div>';
                    } else if (i == 4) {
                        myGenericCard.innerHTML = '<img src="images/news2.png" class="card"/>';
                    }

                    document.getElementById("element" + (i + 1)).appendChild(myGenericCard);

                    cardCount++;

                }
            }
        }

        return x;
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
            if (key > 0 && key < 6) {
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



        /*$('.linePerspective, .bgPerspective, .face').mouseover(function () {
            var parentID = $(this).parent().attr("id");
            if (parentID == 'element1') {
                hoverLineNum = 1;
            } else if (parentID == 'element2') {
                hoverLineNum = 2;
            } else if (parentID == 'element3') {
                hoverLineNum = 3;
            } else if (parentID == 'element4') {
                hoverLineNum = 4;
            } else if (parentID == 'element5') {
                hoverLineNum = 5;
            } else {
                hoverLineNum = 0;
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


            var direction;
            var pixels = 0;
            if (e.originalEvent === undefined) {
                direction = -120;
                pixels = 0;
            } else {
                direction = e.originalEvent.wheelDelta;
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
            /*       } else {
                       $(currentHoverFace).css({"transition": ""});
                       if (hoverLineNum > 0) {
       
       
                           //    scrollCards(hoverLineNum, 0);
                       }
       
       
                       var direction;
                       var pixels = 0;
                       if (e.originalEvent === undefined) {
                           direction = -120;
                           pixels = 0;
                       } else {
                           direction = e.originalEvent.wheelDelta;
                           pixels = (e.originalEvent.wheelDelta) / 3;
                           //$('.face').css({ 'transition': 'all 100ms ease' });
                       }
       
       
                       if (hoverLineNum > 0) {
       
       
                           scrollCards(hoverLineNum, pixels);
                       }
                       scrolling = 0;
                       $('body').bind('scrollend', function () {
                           bindFace();
                       });
                   }*/

        });

        bindFace();



        var pagePosition = 0;
        var pageDelta = 190;
        $('.pan').click(function () {

            if ($(this).hasClass('panRight')) {
                pagePosition -= pageDelta;
                $('#elements').animate({ 'margin-left': pagePosition + 'px' }, 500);
                $('#element3').animate({ 'border': '1px' }, 500);
                $('.panRight').animate({ right: '+=' + pageDelta }, 500);
                $('.panLeft').animate({ left: '-=' + pageDelta }, 500);
                // $('#page-wrapper').css({"transform":"translateX(" + pagePosition + "px)"});
            } else if ($(this).hasClass('panLeft')) {
                pagePosition += pageDelta;
                $('#elements').animate({ 'margin-left': pagePosition + 'px' }, 500);
                $('#element3').animate({ 'border': '1px' }, 500);
                $('.panRight').animate({ right: '-=' + pageDelta }, 500);
                $('.panLeft').animate({ left: '+=' + pageDelta }, 500);
            }
        });
        // loadData();



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
            $('#elements').css({ "transition": "all 500ms linear", "transform": "scale(0.7)", "margin-left": "+=-100px", "margin-top": "+=-200px" });
            $('#settingsMenu').css({ "transform": "translateX(0px)" });
            $('#line2dContainerBg').css({ "transform": "translateX(0px)" });
        });

        $('#settingsIcon').click(function () {

            //  $('#dump').text("Clicked Settings!");
            //$('#elements').css({ "transition": "transform 1s ease", "transform": "scale(0.6)" });
            //$('#elements').animate({ 'margin-left': '+=100px', 'margin-top': '+=200px' }, 1000);
            //$('#elements').slideUp('slow');
            $('#elements').css({ "transition": "all 500ms linear", "transform": "", "margin-left": "+=100px", "margin-top": "+=200px" });
            $('#settingsMenu').css({ "transform": "translateX(250px)" });
            $('#line2dContainerBg').css({ "transform": "translateY(350px)" });
        });

        /*
        $('#twitterButton').click(function () {
            var myIframe = document.createElement("a");
            $(myIframe).attr("href", "http://198.101.207.173/shilpa/connect.php");
            $(myIframe).text("Hello World! Click Me!");
            //$(myIframe).css({ "position": "fixed", "left": "20%", "top": "20%", "width": "60%", "height": "60%", "z-index":"9999999999", "background-color":"#f3f3f3" });
            $('settingsMenu').append(myIframe);
        });
        */
    }, 3000);



    function loadData() {

        WinJS.xhr({ url: "http://google.com/ig/api?weather=97229" }).done(
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


        WinJS.xhr({ url: "http://news.google.com/?output=rss" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var i;
                    var data = result.responseXML;
                    var lineNum = 5;
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


        WinJS.xhr({ url: "http://198.101.207.173/shilpa/flickr_trial.php" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var data = JSON.parse(result.response);
                    var i;

                    var lineNum = 1;

                    if (transitionComplete == 1) {

                        for (i = 0; i < data.flickr_feed.length; i++) {

                            // $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);

                            var newCard = new Array(8);
                            newCard[4] = "flickr";
                            newCard[5] = "timestampTBD";
                            newCard[6] = data.flickr_feed[i].user;
                            newCard[7] = data.flickr_feed[i].photo + "b.jpg";

                            pushNewDataCard(lineNum, newCard);

                            //scrollCards(lineNum, -160);

                        }

                    } else {

                        $('body').bind('flickr', function () {

                            setTimeout(function () {
                                for (i = 0; i < data.flickr_feed.length; i++) {

                                    // $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);

                                    var newCard = new Array(8);
                                    newCard[4] = "flickr";
                                    newCard[5] = "timestampTBD";
                                    newCard[6] = data.flickr_feed[i].user;
                                    newCard[7] = data.flickr_feed[i].photo + "b.jpg";

                                    pushNewDataCard(lineNum, newCard);

                                    //scrollCards(lineNum, -160);

                                }
                            }, 500);
                        });
                    }
                }
            });


        /*
        WinJS.xhr({ url: "http://198.101.207.173/shilpa/mygmail.php?email_address=screensavingsapp@gmail.com" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var data = JSON.parse(result.response);
                    var i;

                    var lineNum = 2;

                    if (transitionComplete == 1) {
                        for (i = (data.gmail_feed.length - 1) ; i >= 0; i--) {

                           // $('#dump').text($('#dump').val() + " ---- " + data.gmail_feed[i].user);

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

                            pushNewDataCard(lineNum, newCard);

                            //scrollCards(lineNum, -160);

                        }
                    } else {

                        $('body').bind('gmail', function () {
                            setTimeout(function () {
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

                                    pushNewDataCard(lineNum, newCard);

                                    //scrollCards(lineNum, -160);

                                }
                            }, 500);
                        });
                    }
                }
            });
            
           
        */
        var fbPromise = WinJS.xhr({ url: "http://198.101.207.173/gaomin/client/fb_json_new.php" });


        /*   
        var TwitPromise = WinJS.xhr({ url: "http://198.101.207.173/shilpa/twitter_trial.php" });
        
       
        WinJS.Promise.join([fbPromise, TwitPromise]).done(
            function () {
                

                var lineNum = 3;
                var tempArray = new Array();
                var i;

                fbPromise.done(
                    function fulfilled(result) {
                        if (result.status === 200) {
                            var data = JSON.parse(result.response);
                            

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

                                        tempArray.push(newCard);

                                        //scrollCards(lineNum, -160);

                                    }
                         }
                    });
                TwitPromise.done(
                    function fulfilled(result) {
                        if (result.status === 200) {
                            var data = JSON.parse(result.response);

                            
                            
                                    for (i = (data.twitter_feed.length - 1) ; i >= 0; i--) {

                                        //                           $('#dump').text($('#dump').val() + " ---- " + data.twitter_feed[i].user);

                                        var time = parseFloat(data.twitter_feed[i].time)*1000;
                                        var timeVal = new Date(time);


                                        timeVal = convertTimeToString(timeVal);



                                        
                                        var newCard = new Array(10);
                                        newCard[4] = "twitter";
                                        newCard[5] = time;
                                        newCard[6] = data.twitter_feed[i].user;
                                        newCard[7] = data.twitter_feed[i].tweet;
                                        newCard[8] = (data.twitter_feed[i].photo).replace("_normal","");
                                        newCard[9] = timeVal;

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
        */
        WinJS.xhr({ url: "http://198.101.207.173/gaomin/client/groupon_json.php" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var data = JSON.parse(result.response);
                    var i;

                    var lineNum = 4;

                    if (transitionComplete == 1) {
                        for (i = (data.deals.length - 1) ; i >= 0 ; i--) {

                            //                                $('#dump').text($('#dump').val() + " ---- " + data.deals[i].user);

                            var newCard = new Array(9);
                            newCard[4] = "groupon";
                            newCard[5] = "timestampTBD";
                            newCard[6] = data.deals[i].title;
                            newCard[7] = data.deals[i].highlightsHtml;
                            newCard[8] = data.deals[i].largeImageUrl;

                            pushNewDataCard(lineNum, newCard);

                            //scrollCards(lineNum, -160);

                        }
                    } else {
                        $('body').bind('groupon', function () {
                            setTimeout(function () {
                                for (i = (data.deals.length - 1) ; i >= 0 ; i--) {

                                    //                                $('#dump').text($('#dump').val() + " ---- " + data.deals[i].user);

                                    var newCard = new Array(9);
                                    newCard[4] = "groupon";
                                    newCard[5] = "timestampTBD";
                                    newCard[6] = data.deals[i].title;
                                    newCard[7] = data.deals[i].highlightsHtml;
                                    newCard[8] = data.deals[i].largeImageUrl;

                                    pushNewDataCard(lineNum, newCard);

                                    //scrollCards(lineNum, -160);

                                }
                            }, 500);
                        });
                    }
                }
            });





    }
    $('#FB_BUTTON').click(function () {
        var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
        var clientID = "358452557528632";
        if (clientID === null || clientID === "") {
            WinJS.log("Enter a ClientID", "Web Authentication SDK Sample", "error");
            return;
        }

        var callbackURL = "https://www.facebook.com/connect/login_success.html";

        facebookURL += clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=read_stream&display=popup&response_type=token";

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
                var fb_id_url = "https://graph.facebook.com/me?access_token=" + accesstoken;
                WinJS.xhr({ url: fb_id_url }).done(function success(result) {
                    var fb_id = JSON.parse(result.responseText).id;
                    Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function success(result) {
                        //send data to intelscreensavings server
                        WinJS.xhr({ url: "http://198.101.207.173/gaomin/register_user.php?service=fb&win_id=" + result + "&token=" + accesstoken + "&fb_id=" + fb_id }).done(
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
                    WinJS.xhr({ url: "http://198.101.207.173/gaomin/register_user.php?service=twitter&win_id="+result+ "&oauth_token=" + oauthtoken + "&oauth_verifier=" + oauthverifier }).done(
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
                    WinJS.xhr({ url: "http://198.101.207.173/gaomin/register_user.php?service=flickr&win_id=" + result + "&oauth_token=" + token + "&oauth_verifier=" + secret }).done(
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
        var clientID = "198.101.207.173";
        var clientSecret = "GZuBybtQi1QnKnKh-GCzVCIA";
        //var clientID = "anonymous";
        //var clientSecret = "anonymous";
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

                    WinJS.xhr({ url: "http://198.101.207.173/gaomin/register_user.php?service=gmail&win_id=" + result + "&oauth_token=" + decodeURIComponent(token) + "&oauth_verifier=" + decodeURIComponent(secret) + "&email=" + "dummy@gmail.com" }).done(
                        function (result) {
                            var results = result.responseData;
                        }
                   );
                });          
               
            }, function (err) {
                WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
            });
    });    
   

     function normalizeParams (params) {
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
});



