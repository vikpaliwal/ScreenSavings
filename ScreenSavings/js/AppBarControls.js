"use strict";


window.ShowMenuSettings = WinJS.UI.eventHandler(function ShowMenuSettings()
{
    var AppBarDom = document.getElementById("DashAppBar");
    EmptyDom(AppBarDom);
    document.createElement("button");
    var UpdateCurrentServicesPromise = new WinJS.Promise
    (
        function (SuccessGettingBoundServices, FailureGettingBoundServices)
        {
            getBoundSocialNetworkData(SuccessGettingBoundServices, FailureGettingBoundServices,userId)
        }
    )

    UpdateCurrentServicesPromise.done
    (
        function getBoundServicesSuccess()
        {

        },
        function getBoundServicesFailure()
        {

        }
    )
})

function generatePhaseArrayDataAvainlable(RetrievedData)
{
    
}

Window.ToggleWindowsLogin = WinJS.UI.eventHandler
(
    ToggleWindowsLogin
)
Window.SettingsMenu_OnClick = WinJS.UI.eventHandler
(SettingsMenu_OnClick)

function ToggleWindowsLogin()
{
    WL.init({
        scope: ["wl.signin", "wl.basic"]
    });



    WL.getLoginStatus().then
    (
        function (response) {
            if (response.status == "connected") {
                //location.reload();
                WindowsLogOutOfDash(StartIntelDash);
            }
            else
            {
                //location.reload();
                WindowsLoginToDash()
            }
        }
        ,
        function () {
            //location.reload();
            WindowsLogOutOfDash(StartIntelDash)
        }
    );
}

function WindowsLogOutOfDash(CallBackFunction)
{
    var LogInDom = document.getElementById("LogInLogOutButton");
    ApplicationCleanup();
    var LogOutPromise = WL.logout();
    LogOutPromise.then
    (
        function SuccessfullyLoggedOut(response)
        {
            var cmd = LogInDom.winControl;
            cmd.icon = 'openpane';
            cmd.label = 'Login';
            cmd.onclick = loadLoginUI;
            cmd.tooltip = "LogIn to Dash";
            Global_DashAppBarWinjSControl.winControl.showOnlyCommands([LogInDom]);
            //$("#appcontainer").hide();//this is a hack fix. The right fix willl be to deleete the DOM and upon reinitalization another dom will be created that maintain the structure
            loadLoginUI();
        },
        function UnSuccessfullyLoggedOut(errorResponse)
        {
            var cmd = LogInDom.winControl;
            cmd.icon = 'openpane';
            cmd.label = 'Login';
            cmd.onclick = loadLoginUI;
            cmd.tooltip = "LogIn to Dash"
            Global_DashAppBarWinjSControl.winControl.showOnlyCommands([LogInDom]);
            //$("#appcontainer").hide();//this is a hack fix. The right fix willl be to deleete the DOM and upon reinitalization another dom will be created that maintain the structure
            loadLoginUI()
        }
    )
}

function loadLoginUI()
{
    var LoginPromise = WL.login({ scope: ["wl.signin"] });
    LoginPromise.then(
        function (data)
        {
            StartIntelDash();
        },
        function (error)
        {
            loadLoginUI();
        }
    )
}

function ApplicationCleanup()
{
    cardCount = 0;
    CacheDataAccess.resetCache();
    var MainDiv = document.getElementById("Main");
    MainDiv.style.visibility = "hidden";
    //MainDiv.innerHTML = "";
    var JustCoverScreen = document.createElement("div");
    
    clearTimeout(Global_RefreshDataSetTimeOutValue);
}


function WindowsLoginToDash()
{
    var LogInPromise = new WinJS.Promise
        (
            NoAccountsVerifiedSetup
        );

    LogInPromise.done
        (
            function LoginSuccess()
            {
                return;
            },
            function LoginFail(err)
            {
                GoToDefaultScreen(err)
            }
        )
}

function PopulateWindowsLoginButton(AppBarDom,LoginButtonFunctionName)
{
    var LogInDom = document.getElementById("LogInLogOutButton");
    AppBarDom.winControl.disabled = false;
    var cmd = LogInDom.winControl;
    cmd.icon = 'closepane';
    cmd.label = 'LogOut';
    cmd.onclick = LoginButtonFunctionName;
    cmd.tooltip = "Logout of Dash"
    $("#appcontainer").show();
    InitializeAppBar();
    var DashAppBar = document.getElementById("DashAppBar").winControl;
    /*Global_DashAppBarWinjSControl = new AppBar(document.getElementById("DashAppBar"));
    Global_DashAppBarLeftSeparator = new LeftSeparator(document.getElementById("LeftAppBarSeparator"));
    Global_DashAppBarRightSeparator = new RightSeparator(document.getElementById("RightAppBarSeparator"));
    var EditServiceButton = document.getElementById("EditServiceButton")
    Global_DashAppBarEditSettingsButton = document.getElementById("EditServiceButton");
    var CancelButton = document.getElementById("CancelButton")
    var AppBarBackButton = document.getElementById("AppBarBackButton")
    Global_DashAppBarBackButton = new DashAppBarBackButton(AppBarBackButton);
    var UpdateServiceButton = document.getElementById("UpdateServiceButton")
    DashAppBar.hideCommands(CancelButton);
    DashAppBar.hideCommands(AppBarBackButton);
    DashAppBar.hideCommands(EditServiceButton);
    DashAppBar.hideCommands(UpdateServiceButton);
    DashAppBar.hideCommands(Global_DashAppBarRightSeparator.getDomElement);
    DashAppBar.hideCommands(Global_DashAppBarLeftSeparator.getDomElement);*/
    DashAppBar.hide();
    
}

function DashAppBarBackButton(WinJSDomElement)
{
    var BackButtonFunctionArray = new Array();
    var CurrentFunction = null;
    this.Update= function (CallBackFunction)
    {
        BackButtonFunctionArray.push(CurrentFunction);
        CurrentFunction = CallBackFunction;
    }
    this.Hide= function ()
    {
        BackButtonFunctionArray.pop()
        Hide;
    }
    this.JustHide = HideButton;

    function HideButton()
    {
        Global_DashAppBarWinjSControl.hideCommands(WinJSDomElement);
    }

    this.JustShow = ShowButton; 
    function ShowButton()
    {
        Global_DashAppBarWinjSControl.showCommands(WinJSDomElement);
    }

    this.clear = ClearBackButton;

    function ClearBackButton()
    {
        BackButtonFunctionArray = new Array(BackButtonFunctionArray[0])
    }
    this.getDomElement = WinJSDomElement;
}



function AppBar(AppBarDomElement)
{
    this.HideAllCommands = UnShowAllCommands;
    this.winControl = AppBarDomElement.winControl;
    var winControl = AppBarDomElement.winControl;

    function UnShowAllCommands()
    {
        var i=0;
        for (; i < AppBarDomElement.childNodes.length; i++)
        {
            winControl.hide((AppBarDomElement.childNodes[i]))
        }
    }

    function hideCommands(WinJSDOmElement)
    {
        winControl.hideCommands(WinJSDOmElement)
    }

    function showCommands(WinJSDOmElement)
    {
        winControl.showCommands(WinJSDOmElement)
    }

    this.hideCommands = hideCommands;
    this.showCommands = showCommands;
    this.getDomElement = AppBarDomElement;
}

function LeftSeparator(WinJSDomElement)
{

    this.JustShowSeparator = JustShowSeparator;
    this.JustHideSeparator = JustHideSeparator;
    function JustShowSeparator()
    {
        Global_DashAppBarWinjSControl.showCommands(WinJSDomElement);
    }

    function JustHideSeparator() {
        Global_DashAppBarWinjSControl.hideCommands(WinJSDomElement);
    }
    this.getDomElement = WinJSDomElement;
}

function RightSeparator(WinJSDomElement)
{
    this.JustShowSeparator = JustShowSeparator;
    this.JustHideSeparator = JustHideSeparator;
    function JustShowSeparator() {
        Global_DashAppBarWinjSControl.showCommands(WinJSDomElement);
    }

    function JustHideSeparator() {
        Global_DashAppBarWinjSControl.hideCommands(WinJSDomElement);
    }
    this.getDomElement = WinJSDomElement;
}


function InitializeAppBar()
{
    var DashAppBar = document.getElementById("DashAppBar").winControl;
    Global_DashAppBarWinjSControl = new AppBar(document.getElementById("DashAppBar"));
    Global_DashAppBarLeftSeparator = new LeftSeparator(document.getElementById("LeftAppBarSeparator"));
    Global_DashAppBarRightSeparator = new RightSeparator(document.getElementById("RightAppBarSeparator"));
    Global_DashAppBarSettingsButton = document.getElementById("SettingsButton")
    Global_DashAppBarEditServiceButton = document.getElementById("EditServiceButton");
    Global_DashAppBarCancelButton = document.getElementById("CancelButton")
    Global_DashAppBarLogInLogOutButton = document.getElementById("LogInLogOutButton");
    Global_DashAppBarNewsButton = document.getElementById("NewsButton");
    Global_DashAppBarMailButton = document.getElementById('MailButton');
    Global_DashAppBarUpdateServiceButton = document.getElementById('UpdateServiceButton');
    Global_DashAppBarSocialButton = document.getElementById("SocialServiceButton");
    Global_DashAppBarPhotosButton = document.getElementById("PicturesButton");
    Global_DashAppBarFinanceButton = document.getElementById("FinanceButton");
    var AppBarBackButton = document.getElementById("AppBarBackButton");
    Global_DashAppBarBackButton = new DashAppBarBackButton(AppBarBackButton);
    var UpdateServiceButton = document.getElementById("UpdateServiceButton")
    Global_DashAppBarWinjSControl.winControl.showOnlyCommands([Global_DashAppBarSettingsButton, Global_DashAppBarLogInLogOutButton]);
    Global_DashAppBarSettingsButton.winControl.onclick = SettingsMenu_OnClick;
    Global_DashAppBarEditServiceButton.winControl.onclick = EditService_OnClick;
    /*DashAppBar.hideCommands(Global_DashAppBarCancelButton);
    DashAppBar.hideCommands(Global_DashAppBarBackButton);
    DashAppBar.hideCommands(Global_DashAppBarEditSettingsButton);
    DashAppBar.hideCommands(UpdateServiceButton);
    DashAppBar.hideCommands(Global_DashAppBarRightSeparator.getDomElement);
    DashAppBar.hideCommands(Global_DashAppBarLeftSeparator.getDomElement);*/
}

function SettingsMenu_OnClick()
{
    Global_DashAppBarWinjSControl.winControl.showOnlyCommands([Global_DashAppBarBackButton.getDomElement, Global_DashAppBarLeftSeparator.getDomElement, Global_DashAppBarEditServiceButton]);
    var BackButton = Global_DashAppBarBackButton.getDomElement.winControl;
    HideSettingsSubElements();
    Global_DashAppBarEditServiceButton.winControl.onclick = EditService_OnClick;
    BackButton.onclick = InitializeAppBar;
    
}

function HideSettingsSubElements()
{
    var SettingsDom = document.getElementById("SettingsDiv");
    var i = 0;
    for (; i < SettingsDom.childNodes.length; i++)
    {
        $(SettingsDom.childNodes[i]).hide();
    }
}

function EditService_OnClick()
{
    var ArrayOfServices = Global_AllDashServices;
    refreshData.pause = 1;
    var EditServiceButtons = [Global_DashAppBarNewsButton, Global_DashAppBarMailButton, Global_DashAppBarSocialButton, Global_DashAppBarFinanceButton]
    var EditServicePromise = new WinJS.Promise
    (
        function (DoneButtonClick,CancelButtonClick)
        {
            Global_DashAppBarWinjSControl.winControl.showOnlyCommands([Global_DashAppBarFinanceButton,Global_DashAppBarPhotosButton, Global_DashAppBarNewsButton, Global_DashAppBarCancelButton, Global_DashAppBarUpdateServiceButton, Global_DashAppBarMailButton, Global_DashAppBarSocialButton, Global_DashAppBarLeftSeparator.getDomElement, Global_DashAppBarRightSeparator.getDomElement]);
            Global_DashAppBarCancelButton.winControl.onclick = CancelButtonClick;
            Global_DashAppBarUpdateServiceButton.winControl.onclick = DoneButtonClick;
            var SettingsDom = document.getElementById("SettingsDiv");
            EmptyDom(SettingsDom);
            $(SettingsDom).show();
            var EditServiceDom = document.createElement("div");
            EditServiceDom.setAttribute("id", "EditServiceDiv");
            var EachPhase = null;
            var idOfPhaseDiv = "";
            var PhaseTop = "";
            var PhaseTopID = "";
            var PhaseCenter = "";
            var PhaseCenterID = "";
            var PhaseBottom = "";
            var ArrayOfServiceDOMElements = new Array();

            var EditServiceInfoScreen = document.createElement("div");
            $(EditServiceInfoScreen).addClass("EditServiceInfoScreen")

            var EditServiceInfoScreenTop = document.createElement("div");
            EditServiceInfoScreen.appendChild(EditServiceInfoScreenTop);
            EditServiceInfoScreenTop.innerHTML = "Dash Services Services";
            $(EditServiceInfoScreenTop).addClass("EditServiceInfoScreenTop")
            

            var EditServiceInfoScreenContent = document.createElement("div");
            EditServiceInfoScreen.appendChild(EditServiceInfoScreenContent);
            $(EditServiceInfoScreenContent).addClass("EditServiceInfoScreenContent")
            EditServiceInfoScreenContent.innerHTML = "Click One of the Services below to get Live updates through Dash..."
            
            
            var i = 0;
            for (; i < ArrayOfServices.length; i++)
            {
                EachPhase = document.createElement("div");
                idOfPhaseDiv = "InitializationBindingPhase" + i.toString();
                EachPhase.setAttribute("id", idOfPhaseDiv);//Sets ID
                EachPhase.setAttribute("class", "PhaseDiv");//Sets a class for the DOM element
                /*PhaseTop DomElement Creation*/
                PhaseTop = document.createElement("div");
                PhaseTopID = idOfPhaseDiv + "Top";//"creates ID string"
                PhaseTop.setAttribute("id", PhaseTopID);//sets ID
                PhaseTop.setAttribute("class", "PhaseTopDiv");//Sets a class for the DOM element
                $(PhaseTop).addClass("win-type-xx-large");// this was included to take advantage of some of the CSS features of windows WinJS css //Microsoft.WinJS.1.0/css/ui-dark.css
                EachPhase.appendChild(PhaseTop);//Adds DOM element to the parent Phase DOM

                PhaseTop.innerHTML = "  " + ArrayOfServices[i].Name + " Section...";
                
                /*PhaseCenter DomElement Creation*/
                PhaseCenter = document.createElement("div");
                PhaseCenterID = idOfPhaseDiv + "Center";
                PhaseCenter.setAttribute("id", PhaseCenterID);
                PhaseCenter.setAttribute("class", "PhaseCenterDiv");
                EachPhase.appendChild(PhaseCenter);
                EditServiceDom.appendChild(EachPhase);
                PopulateInitializationPhase(ArrayOfServices[i], PhaseCenter);
                GenerateFunctionForEditServicesClick(ArrayOfServiceDOMElements, ArrayOfServices, i, EditServiceInfoScreen)
                ArrayOfServiceDOMElements.push(EachPhase)
                //$(EachPhase).hide();
            }
            EditServiceDom.appendChild(EditServiceInfoScreen);
            SettingsDom.appendChild(EditServiceDom);
            
            
        }
    );

    EditServicePromise.done
    (
        function DoneButtonClicked(Data)
        {
            var FinalizePhasesPromise = new WinJS.Promise
            (
                function (Success, Failuremprogress)
                {
                    FinalizePhases(ArrayOfServices, Success, Failuremprogress);
                }
            )

            var SettingsDom = document.getElementById("SettingsDiv");
            $(SettingsDom).hide();
            FinalizePhasesPromise.done
            (
                function (PhasesFinalized)
                {
                    refreshData.pause = 0
                    SettingsMenu_OnClick();
                },
                function ErrorInFinalizing()
                {
                    refreshData.pause = 0
                    SettingsMenu_OnClick();
                }

            );
        },
        function CancelButtonClicked(Data)
        {
            var SettingsDom = document.getElementById("SettingsDiv");
            $(SettingsDom).hide();
            SettingsMenu_OnClick();
        }
    );

}


function FinalizePhases(AllPhases, FinalCompletionLoopBackSuccess, FinalCompletionLoopBackFailure)
{
    /*
        Name: Jerome Biotidara
        Description:
    */
    var i = 0;
    var j = 0;
    var FlagsForRegistrationUpdate = new Array(AllPhases.length)
    for (; i < AllPhases.length; i++) {
        FlagsForRegistrationUpdate[i] = new Array(AllPhases[i].PhaseServices.length);
    }

    i = 0
    //Toss this whole for-loop into WinJS.promise and count each phase return before validating the bound services to avoid the call before services are added
    for (; i < AllPhases.length; i++) {
        FlagsForRegistrationUpdate[i] = new Array(AllPhases[i].PhaseServices.length);
        j = 0;
        for (; j < AllPhases[i].PhaseServices.length; j++) {

            var MyServiceRegistrationPromise = new WinJS.Promise(function (SuccessInRegistering, FailureInRegistering) {
                AllPhases[i].PhaseServices[j].RegisterServiceAccountWithDashServers(SuccessInRegistering, FailureInRegistering)//this can cause possible issues with multiple records being updated

            }
            )
            MyServiceRegistrationPromise.done
            (
            Success(i, j),
            Failure(i, j)
            )


        }
    }

    function Success(a, b) {
        return (function () { RegistrationCounterUpdate(a, b); })
    }

    function Failure(a, b) {
        return (function () { RegistrationCounterUpdate(a, b); })
    }

    function RegistrationCounterUpdate(PhaseIndex, ServiceIndex) {
        FlagsForRegistrationUpdate[PhaseIndex][ServiceIndex] = true;
        var i = 0;
        var j = 0;
        var NotFinishedRegisteringAllPhases = true;
        for (; i < FlagsForRegistrationUpdate.length; i++) {
            j = 0;
            for (; j < FlagsForRegistrationUpdate[i].length; j++) {
                if (!FlagsForRegistrationUpdate[i][j]) {
                    NotFinishedRegisteringAllPhases = true;
                    break;
                }
                NotFinishedRegisteringAllPhases = false;
            }
            if (NotFinishedRegisteringAllPhases) {
                break;
            }
        }

        if (!NotFinishedRegisteringAllPhases) {
            FinalCompletionLoopBackSuccess(AllPhases);
            new CacheDataAccess().UpdateCacheFile();//Call to update Cache File
        }
    }



}

function PopulatePhaseServices(MyPhase, MyPhaseDom)
{
    var i=0
    for (; i < MyPhase.PhaseServices.length; i++)
    {
        
    }
}

function GenerateFunctionForEditServicesClick(AllServicesDoms, AllServices, ServicesIndex,QuickHideDOM)
{
    
    function ServiceFunction()
    {
        var i = 0;
        //QuickHideDOM.removeNode(true);
        //$(QuickHideDOM).children().hide();
        $(QuickHideDOM).hide()
        var MyArrayOfGridElements = new Array();
        var j = 0;
        for (; i < AllServicesDoms.length; i++)//hides all possible phaseDoms
        {
            $(AllServicesDoms[i]).hide();

        }
       
        var DomToBeDisplayed = AllServicesDoms[ServicesIndex];
        var ArrayOfGridElements = getAllChildNodesWithClassName("GridElement", DomToBeDisplayed);
        j = 0;
        var imageRed = Math.round(Math.random() * 255)
        var imageBlue = Math.round(Math.random() * 255)
        var imageGreen = Math.round(Math.random() * 255)
        var textRed = Math.round(Math.random() * 192)
        var textBlue = Math.round(Math.random() * 192)
        var textGreen = Math.round(Math.random() * 192)
        var TextBackgroundColor = "rgba(" + textRed + "," + textGreen + "," + textBlue + ",.7)";
        var GridBackgroundColor = "rgba(" + imageRed + "," + imageGreen + "," + imageBlue + ",1)";
        for (;j<AllServices[ServicesIndex].PhaseServices.length;j++)
        {
            ArrayOfGridElements[j].style.backgroundColor = GridBackgroundColor;
            MoveBackgroundImage(ArrayOfGridElements[j], AllServices[ServicesIndex].PhaseServices[j].Image, AllServices[ServicesIndex].PhaseServices[j].Name, TextBackgroundColor, GridBackgroundColor);
        }
        
        $(DomToBeDisplayed).show();
    }

    var EditServiceButtons=[Global_DashAppBarMailButton,Global_DashAppBarSocialButton,Global_DashAppBarNewsButton,Global_DashAppBarPhotosButton,Global_DashAppBarFinanceButton]

    function GenerateEditServiceFullFunction(MyButton,MyServiceFunction)
    {
        
        function MyFunction()
        {
            var i = 0;
            for (; i < EditServiceButtons.length; i++) {
                EditServiceButtons[i].winControl.selected = false;
            }
            MyButton.winControl.selected = true;
            MyServiceFunction();
        }
        return MyFunction;
    }

    switch (AllServices[ServicesIndex].Name)
    {
        case "MAIL":
            {
                Global_DashAppBarMailButton.winControl.onclick = GenerateEditServiceFullFunction(Global_DashAppBarMailButton,ServiceFunction)
            }
            break;
        case "SOCIAL":
            {
                Global_DashAppBarSocialButton.winControl.onclick = GenerateEditServiceFullFunction(Global_DashAppBarSocialButton, ServiceFunction)
            }
            break;
        case "NEWS":
            {
                Global_DashAppBarNewsButton.winControl.onclick = GenerateEditServiceFullFunction(Global_DashAppBarNewsButton, ServiceFunction);
            }
            break;
        case "DEALS":
            {
                Global_DashAppBarFinanceButton.winControl.onclick = GenerateEditServiceFullFunction(Global_DashAppBarFinanceButton, ServiceFunction);
            }
            break;
        case "PHOTOS":
            {
                Global_DashAppBarPhotosButton.winControl.onclick = GenerateEditServiceFullFunction(Global_DashAppBarPhotosButton, ServiceFunction);
            }
            break;
    }

}
