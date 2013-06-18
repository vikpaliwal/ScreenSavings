function LoadDefaultInterfaceUI(DisplayMessage)
{
    alert("LOAD DEFAULT UI");

    if (DisplayMessage != null) {
        var QuickMessage = new InProgress(DisplayMessage);
        QuickMessage.Start();
        //Haha.appendChild(QuickMessage.Node());
        setTimeout(
            function () {
                QuickMessage.Stop();
            }, 10000);
    }
}


