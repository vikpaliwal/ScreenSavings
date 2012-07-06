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
var settingsVisible = false;
function addCard(line) {

}




$(document).ready(function () {

    //removeRandomCards();


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
        myGenericCard.setAttribute('style', 'transition: all 500ms linear;');



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
                $('#dump').text($(this).attr('id'));
                //$(this).children('.face').each(function () { $('#dump').append($(this).attr('id')) });
                $(this).css({ "transition": "transform 500ms linear", "transform": "translateY(290px) translateZ(" + transformMatrix[14] + "px)" });
            },
            function () {
                var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');

                $('#dump').text($(this).attr('id'));
                $(this).css({ "transition": "transform 500ms linear", "transform": "translateY(320px) translateZ(" + transformMatrix[14] + "px)" });
                //$(this).css({ "transform": "translateY(20px)" });
            });

        $('.face').unbind('click');
        $('.face').click(mouseClickFace);
        // $('#card' + cardCount).css({'transition':'all 500ms linear', 'transform':'translateY(' + (matrix[lineNum - 1][0][2]) + 'px) translateZ(' + (matrix[lineNum - 1][0][3]) + 'px)'});

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
        myGenericCard.setAttribute('style', 'transition: all 500ms linear;');



        document.getElementById("element" + lineNum).appendChild(myGenericCard);


        $('#card' + cardCount).addClass('face');
        if (lineNum == 1) {
            $('#card' + cardCount).html('<div class="FLICKR_content"><img id="profilePic" class="FLICKR_PIC" src="' + matrix[lineNum - 1][0][7] + '"/><span id="Span13" class="FLICKR_time">11:11</span><span id="Span14" class="FLICKR_title">' + matrix[lineNum - 1][0][6] + '</span> </div>');
        } else if (lineNum == 2) {
            $('#card' + cardCount).html('<div class="GM_content"><span class="GM_time">11:11</span><span class="GM_From">From: ' + matrix[lineNum - 1][0][6] + '</span><span class="GM_subject">Subject: ' + matrix[lineNum - 1][0][7] + '</span><span class="GM_message">' + toStaticHTML(matrix[lineNum - 1][0][10]) + '</span> </div>');
        } else if (lineNum == 3) {
            if (matrix[lineNum - 1][0][4] == "facebook") {
                $('#card' + cardCount).html('<div class="FB_content"><img class="FB_PIC" src="http://graph.facebook.com/' + matrix[lineNum - 1][0][9] + '/picture"/><span class="FB_time">' + matrix[lineNum - 1][0][5] + '</span><span class="FB_title">' + matrix[lineNum - 1][0][6] + '</span><span class="FB_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
            } else if (matrix[lineNum - 1][0][4] == "twitter") {
                $('#card' + cardCount).html('<div class="TWIT_content"><img class="TWIT_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="TWIT_time">' + matrix[lineNum - 1][0][5] + '</span><span class="TWIT_title">' + matrix[lineNum - 1][0][6] + '</span><span class="TWIT_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
            }
        } else if (lineNum == 4) {
            $('#card' + cardCount).html('<div class="GROUPON_content"><img class="GROUPON_PIC" src="' + matrix[lineNum - 1][0][8] + '"/><span class="GROUPON_time">11:11</span><span class="GROUPON_title">' + matrix[lineNum - 1][0][6] + '</span><span class="GROUPON_message">' + matrix[lineNum - 1][0][7] + '</span> </div>');
        } else if (lineNum == 5) {
            $('#card' + cardCount).html('<img src="images/news2.png" class="card"/>');
        }

        $('#card' + cardCount).fadeTo('fast', 1);


        $('.face').unbind();
        bindFace();
        // $('#card' + cardCount).css({'transition':'all 500ms linear', 'transform':'translateY(' + (matrix[lineNum - 1][0][2]) + 'px) translateZ(' + (matrix[lineNum - 1][0][3]) + 'px)'});

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
        $('#dump').text(oldFace.children('.FLICKR_content').children('.FLICKR_PIC').attr('src'));
        var cube = $(this).parent().clone().empty();

        newFace.appendTo(cube);
        //cube.appendTo(element);
        cube.appendTo("#page-wrapper");
        cube.css({ "z-index": "12" });
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

        var image = "";
        if ($(cube).attr('id') == "element1") {
            //    image = oldFace.children('.FLICKR_content').children('.FLICKR_PIC').attr('src');
            //    console.log(oldFace.children('.FLICKR_content').children('.FLICKR_PIC').attr('src'));
        } else if ($(cube).attr('id') == "element2") {
            image = "images/Gmail_detail.png";
        } else if ($(cube).attr('id') == "element4") {
            image = "images/Groupon_detail.png";
        }

        if (image.length > 0) {
            $(newFace).children().remove();
            var content = $("<img src='" + image + "' />").appendTo($(newFace)).addClass('card');
        }

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
            $('#dump').text(hoverLineNum);
        }, function () {
            hoverLineNum = 0;
            $('#dump').text(hoverLineNum);

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
                //$('.face').css({ 'transition': 'all 100ms linear' });
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
                           //$('.face').css({ 'transition': 'all 100ms linear' });
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


        setTimeout(function () { transitionComplete = 1; }, 500);
    }, 3000);



    function loadData() {

        WinJS.xhr({ url: "http://198.101.207.173/shilpa/flickr_trial.php" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var data = JSON.parse(result.response);
                    var i;

                    var lineNum = 1;

                    if (transitionComplete == 1) {

                        for (i = 0; i < data.flickr_feed.length; i++) {

                            $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);

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

                                    $('#dump').text($('#dump').val() + " ---- " + data.flickr_feed[i].user);

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



        WinJS.xhr({ url: "http://198.101.207.173/shilpa/mygmail.php?email_address=screensavingsapp@gmail.com" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var data = JSON.parse(result.response);
                    var i;

                    var lineNum = 2;

                    if (transitionComplete == 1) {
                        for (i = (data.gmail_feed.length - 1) ; i >= 0; i--) {

                            $('#dump').text($('#dump').val() + " ---- " + data.gmail_feed[i].user);

                            var newCard = new Array(11);
                            newCard[4] = "facebook";
                            newCard[5] = data.gmail_feed[i].date;
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

                                    $('#dump').text($('#dump').val() + " ---- " + data.gmail_feed[i].user);

                                    var newCard = new Array(11);
                                    newCard[4] = "facebook";
                                    newCard[5] = data.gmail_feed[i].date;
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



        var fbPromise = WinJS.xhr({ url: "http://198.101.207.173/gaomin/fb_json.php" });
        /*.done(
            );

            */


        var TwitPromise = WinJS.xhr({ url: "http://198.101.207.173/shilpa/twitter_trial.php" });

        /*.done(
            
            });
            */
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
                                var time = "" + data.facebookPosts[i].time + "";
                                time = time.replace("+0000", "");
                                time = new Date(time);
                                time = time.getTime(time) / 1000;
                                //                           $('#dump').text($('#dump').val() + " ---- " + data.facebookPosts[i].user);

                                var newCard = new Array(10);
                                newCard[4] = "facebook";
                                newCard[5] = time;
                                newCard[6] = data.facebookPosts[i].posterName;
                                newCard[7] = data.facebookPosts[i].text;
                                newCard[8] = data.facebookPosts[i].link;
                                newCard[9] = data.facebookPosts[i].posterId;

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

                                var newCard = new Array(9);
                                newCard[4] = "twitter";
                                newCard[5] = data.twitter_feed[i].time;
                                newCard[6] = data.twitter_feed[i].user;
                                newCard[7] = data.twitter_feed[i].tweet;
                                newCard[8] = data.twitter_feed[i].photo;

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

        WinJS.xhr({ url: "http://198.101.207.173/gaomin/groupon_json.php" }).done(
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


    $('#settingsIcon, #weather').click(function () {
        //console.log("show settings");
        if (settingsVisible) {
            $('#elements').css({ "transform": "" });
            $('#settings').css({ "transform": "" });
            $('#line2dContainerBg').css({ "transform": "" });
            $('#lineContainer').css({ "transform": "", "width": "" });
            $('.settingsOverlay').remove();
        } else {
            //console.log("show settings");
            $('<div></div>').appendTo('body').addClass("settingsOverlay");
            var width = parseInt($('#lineContainer').css("width")) * 0.78;
            $('#elements').css({ "transform": "scale(0.8) translateX(-130px) translateY(-430px)" });

            $('#settings').css({ "transform": "translateX(0px)" });
            $('#line2dContainerBg').css({ "transform": "translateY(-500px)" });
            $('#lineContainer').css({
                "transform": "translateX(60px)",
                "width": width + "px"
            });
        }
        settingsVisible = !settingsVisible;
    });
});



