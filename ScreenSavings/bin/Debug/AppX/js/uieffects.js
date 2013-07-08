function MoveBackgroundImage(DomElement, backgroundURL,Name, TextBackgroundColor, ImageBackgroundCOlor)
{
    EmptyDom(DomElement);
    var ImgCaseDiv = document.createElement("div");
    ImgCaseDiv.style.position = "absolute";
    ImgCaseDiv.style.top = "0%";
    ImgCaseDiv.style.left = "0%";
    ImgCaseDiv.style.height = "70%";
    ImgCaseDiv.style.width = "100%";
    var MyDiv = document.createElement("div");
    MyDiv.style.backgroundImage = "url(\'" + backgroundURL + "\')";
    MyDiv.style.position = "absolute"
    ImgCaseDiv.appendChild(MyDiv);
    var HorizontalMotion = (80 * Math.random());
    var VerticalMotion = (80 * Math.random());
    var MyWidth = 100// + HorizontalMotion
    var MyHeight =100// + VerticalMotion
    MyDiv.style.width = MyWidth + "%"
    MyDiv.style.height = MyHeight + "%"
    MyDiv.style.backgroundSize = "100% 100%";
    $(MyDiv).addClass("MovingBackground");
    var MyTop=(Math.random() * MyHeight)
    var MyLeft=(Math.random() * MyWidth)
    //MyDiv.style.top = MyTop+"px";
    //MyDiv.style.left = MyLeft+"px";
    DomElement.style.overflow = "hidden";
    DomElement.appendChild(ImgCaseDiv)
    setInterval(MoveDomElement(MyDiv, VerticalMotion, HorizontalMotion), 7000);
    DomElement.appendChild(MyDiv);
    var MyText = DomElement.innerHTMl;
    var MyTextDiv = document.createElement("div");
    MyTextDiv.style.height = "30%";
    MyTextDiv.style.width = "100%";
    MyTextDiv.style.position = "absolute"
    MyTextDiv.style.top = "70%"
    MyTextDiv.style.backgroundColor = TextBackgroundColor;
    MyTextDiv.innerHTML = Name;
    //MyDiv.style.color = "rgb(" + textRed + "," + textBlue + "," + textBlue + ")"
    MyDiv.style.backgroundColor = "transparent"
    DomElement.appendChild(MyTextDiv);
}

function MoveDomElement(DomElement, YRange, XRange)
{
   return  function()
    {
        var MyYMultiplier=(Math.random()*3);
        if(MyYMultiplier>2)
        {
            DomElement.style.top=((YRange*Math.random()))+"%"
        }
        else
        {
            if(MyYMultiplier<1)
            {
                DomElement.style.top = ( ((-1) * YRange * Math.random())) + "%";
            }
            else
            {
                DomElement.style.top="0%"
            }
        }

        var MyXMultiplier=(Math.random()*3);
        if(MyXMultiplier>2)
        {
            DomElement.style.left=((XRange*Math.random()))+"%"
        }
        else
        {
            if(MyXMultiplier<1)
            {
                DomElement.style.left=(((-1)*XRange*Math.random()))+"%"
            }
            else
            {
                DomElement.style.left="0%";
            }
        }
    }
}

