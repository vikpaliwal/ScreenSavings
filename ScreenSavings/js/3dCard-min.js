var cardCount = 0;
var TwoDTranslateYStartingPos = 500;
var ThreeDTranslateYStartingPos = 320;
var ThreeDTranslateZStartingPos = 60;
var TwoDYDelta = 200;
var ThreeDZDelta = 80;



function addCard(line){

}




$(document).ready(function () {
	
    //removeRandomCards();


    //loadData();














    var matrix = createCardArray(5, 4, 4);
    

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            $('#card' + matrix[i][j][0]).css('transform','translateY(' + matrix[i][j][1] + 'px)');
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
        var numCardsInLine = matrix[lineNum - 1].length;
        for (var i = 0; i < numCardsInLine; i++) {
            matrix[lineNum - 1][i][3] += pixels;
            $('#card' + matrix[lineNum - 1][i][0]).css('transform', 'translateY(' + matrix[lineNum - 1][i][2] + 'px) translateZ(' + matrix[lineNum - 1][i][3] + 'px)');
        }

    }


    function pushNewCard(lineNum) {
        //console.log(lineNum);
        var numCardsInLine = matrix[lineNum-1].length;
        var newCard = new Array(4);
        newCard[0] = cardCount;
        newCard[1] = matrix[lineNum - 1][0][1];
        newCard[2] = matrix[lineNum - 1][0][2];
        newCard[3] = matrix[lineNum - 1][0][3];

        scrollCards(lineNum, -80);

        
        matrix[lineNum-1].unshift(newCard);

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
            $('#card' + cardCount).html('<div class="TWIT_content"><span id="Span13" class="TWIT_time">11:11</span><span id="Span14" class="TWIT_title">New @Reply from Levonmaa</span><span id="Span15" class="TWIT_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span></div>');
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
                 $(this).css({ "transform": "translateY(290px) translateZ(" + transformMatrix[14] + "px)" });
             },
             function () {
                 var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');

                 $('#dump').text($(this).attr('id'));
                 $(this).css({ "transform": "translateY(320px) translateZ(" + transformMatrix[14] + "px)" });
                 //$(this).css({ "transform": "translateY(20px)" });
             });
            

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
                    myGenericCard.setAttribute("style", "z-index: " + -(j+1) + ";");

                    if (i == 0) {
                        myGenericCard.innerHTML = '<img src="images/photo1.png" class="card"/>';
                    } else if (i == 1) {
                        myGenericCard.innerHTML = '<img src="images/mail1.png" class="card"/>';
                    } else if (i == 2) {
                        myGenericCard.innerHTML = '<div class="TWIT_content"><span id="Span13" class="TWIT_time">11:11</span><span id="Span14" class="TWIT_title">New @Reply from Levonmaa</span><span id="Span15" class="TWIT_message">levonmaa: @korhan_b Nice concept... todo<br>list (imo) however is not the coolest domain to</span></div>';
                    } else if (i == 3) {
                        myGenericCard.innerHTML = '<img src="images/commerce1.png" class="card"/>';
                    } else if (i == 4) {
                        myGenericCard.innerHTML = '<img src="images/news2.png" class="card"/>';
                    }

                    document.getElementById("element" + (i+1)).appendChild(myGenericCard);
                    
                    cardCount++;

                }
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


        var hoverLineNum = 0;
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
        $('#element1, #element2, #element3, #element4, #element5').bind({

            mouseenter: function () {
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
            },
            mouseleave: function () {
                hoverLineNum = 0;
                $('#dump').text(hoverLineNum);

                updateShadow1.opt = false;
                updateShadow2.opt = false;
                updateShadow3.opt = false;
                updateShadow4.opt = false;
                updateShadow5.opt = false;
            }
        });



            $('.face').hover(
                function () {
                    var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');
                    $('#dump').text($(this).attr('id'));
                    //$(this).children('.face').each(function () { $('#dump').append($(this).attr('id')) });
                    $(this).css({ "transform": "translateY(290px) translateZ(" + transformMatrix[14] + "px)" });
                },
                function () {
                    var transformMatrix = String($(this).css("transform")).substr(9, String($(this).css("transform")).length - 10).split(', ');

                    $('#dump').text($(this).attr('id'));
                    $(this).css({ "transform": "translateY(320px) translateZ(" + transformMatrix[14] + "px)" });
                    //$(this).css({ "transform": "translateY(20px)" });
                });










        var arrowKeyLock = 0;

        $('body').keyup(function (event) {
            var key = event.keyCode - 48;
            //console.log("key " +key+ " is up!"); 
            var elementId = "element" + key;
            if (key == -8) {
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

        $('#element1, #element2, #element3, #element4, #element5').bind('mousewheel', function (e) {
            var direction;
            var pixels = 0;
            if (e.originalEvent === undefined) {
                direction = -120;
                pixels = 0;
            } else {
                direction = e.originalEvent.wheelDelta;
                pixels = (e.originalEvent.wheelDelta)/3;
                //$('.face').css({ 'transition': 'all 100ms linear' });
            }

            
            if (hoverLineNum > 0) {


                scrollCards(hoverLineNum, pixels);
            }
                    
            /*} else {
                $('.linePerspective, .bgPerspective, .face').mouseover(function () {
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
                    scrollCards(hoverLineNum, pixels);
                });
                   
             }
            

            
            /*if (direction > 0) {
                //scroll towards
               
                    isScrolling = true;
                    fadeCard($(this), oldPos, newPos)
                    $(this).bind("msTransitionEnd", function () { isScrolling = false });
               
            } else {
                //scroll away
                $(this).siblings('.face').each(function (index) {
                    var oldPos = refPositions[element] - index * 40;
                    var newPos = oldPos - 40;

                    if (index == 0 && newPos < 200) {
                        return false;
                    } else if (index == 0) {
                        newRefPos = newPos;
                    }
                    isScrolling = true;
                    fadeCard($(this), oldPos, newPos)
                    $(this).bind("msTransitionEnd", function () { isScrolling = false });
                    $(this).css({ "transform": "translateZ(" + newPos + "px) translateY(" + matrix[13] + "px) rotateX(-10deg)" });
                });
                $(this).children('.face').each(function (index) {
                    var oldPos = refPositions[element] - index * 40;
                    var newPos = oldPos - 40;

                    if (index == 0 && newPos < 200) {
                        return false;
                    } else if (index == 0) {
                        newRefPos = newPos;
                    }
                    isScrolling = true;
                    fadeCard($(this), oldPos, newPos)
                    $(this).bind("msTransitionEnd", function () { isScrolling = false });
                    $(this).css({ "transform": "translateZ(" + newPos + "px) translateY(" + matrix[13] + "px) rotateX(-10deg)" });
                });
            }
            refPositions[element] = newRefPos;
            return false;

            */
        });












 	}, 3000);

    function loadData() {
        /*
        var urls = [
            'http://www.example.com/',
            'http://www.example.org/',
            'http://www.example.net'
        ];

        var promises = urls.map(function (url) {
            return myWebService.get(url);
        });

        WinJS.Promise.join(promises).then(function () {
            //do the aggregation here.
        });
        */
        //var resDiv = document.getElementById("divResult");
/*
        WinJS.xhr({ url: "http://isscloud.intel.com/gaomin/fb.php" }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var data = JSON.parse(result);
                    var d = data;
                }
            });
            */
    }



 	
	
});




