/// <reference group="Dedicated Worker" />
"use strict";

//Force Execution path flags**Start
var DeleteAccount = false
var ForceShowYouAreLoggedInToIntelServersUsingAnySourceService = false;
var ForceYouAreBoundSuccessfullyWithIntelServersUsingWindowsLive = false;
var ForceSuccessfulSignInIntoMicrosoftWithoutNecessarilyBindingWithIntelServers = false;
var DeleteAllBoundAccounts = false;
var ForcePassAuthentication = false;
var ForceNonBoundedDashServicesOnIntel = false;
var ForceRegistationSuccessuWithIntelServers = false;
var ForceWindowsLiveLogout = false;
var DisableGetLocation = false;
//Force Execution path flags**End

new CacheDataAccess();//To force initialization of static propertie/methods in class


// Array Remove - By John Resig (MIT Licensed)
/*Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};*/

Object.defineProperty(  Array.prototype,
                        "remove",
                        {
                            value: (function (from, to) {
                                var rest = this.slice((to || from) + 1 || this.length);
                                this.length = from < 0 ? this.length + from : from;
                                return this.push.apply(this, rest);
                            }),
                            enumerable: false
                        }
)



Object.defineProperty(  Array.prototype,
                        "last",
                        {
                            value: (function () {
                                    var MyLength = this.length
                                    if ((MyLength - 1) > 0)
                                    {
                                        return this[MyLength - 1];
                                    }
                                    return undefined;
                                    }),
                            enumerable: false
                        }
)

//Array.prototype.last = 




function InitializeMainDivs()
{
    //var MainDiv = document.getElementById("Main");
    //MainDiv.innerHTML = "";
    //EmptyDom(MainDiv);
  
    //MainDiv.innerHTML = window.toStaticHTML("<div id=\"InitialSetupContainer\" >            <div id=\"TopLeft\">                <button class=\"win-backbutton\" id=\"win-backbutton\" aria-label=\"Back\"></button>            </div>            <div id=\"TopCenterBar\"></div>            <div id=\"MiddleContent\"></div>            <div id=\"FooterBar\"></div>        </div>        <div id=\"SettingsDiv\">HELLO HELLO</div>        <div class=\"fixedlayout\" id=\"appcontainer\">                                    <div id=\"time\"><span id=\"date\"></span><span id=\"hrsMins\"></span></div>            <img src=\"images/weather.png\" id=\"settings\"/><div id=\"weather\"><span id=\"location\">portland</span><img src=\"\" id=\"weatherIcon\" /><span id=\"temperature\">78</span></div>    <div id=\"page-wrapper\">        <span id=\"elements\">  <div id=\"element1\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgOne\"></div><div id=\"line1id\" class=\"linePerspective line1\"></div>                <div class=\"row1 face name1-2d\"><span claloginFailedss=\"name1\">PHOTOS</span></div>  </div>  <div id=\"element2\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgTwo\"></div><div id=\"line2id\" class=\"linePerspective line2\"></div>                            <div class=\"row2 face name2-2d\"><span class=\"name2\">MAIL</span></div>  </div>  <div id=\"element3\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgThree\"></div><div id=\"line3id\" class=\"linePerspective line3\"></div>                                         <div class=\"row3 face name3-2d\"><span class=\"name3\">DEALS</span></div>  </div>  <div id=\"element4\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgFour\"></div><div id=\"line4id\" class=\"linePerspective line4\"></div>                            <div class=\"row4 face name4-2d\"><span class=\"name4\">NEWS</span></div>  </div>  <div id=\"element5\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgFive\"></div><div id=\"line5id\" class=\"linePerspective line5\"></div>            <div class=\"row5 face name5-2d\"><span class=\"name5\">SOCIAL</span></div>  </div></span>            <div id=\"settingsMenu\"><img src=\"images/settings.png\" id=\"settingsIcon\" /><img src=\"images/accounts.png\" id=\"accounts\" />        <div id =\"FB_BUTTON\">FB LOGIN</div>        <div id =\"TWITTER_BUTTON\">TWT LOGIN</div>        <div id =\"FLICKR_BUTTON\">FLICKR LOGIN</div>        <div id =\"GMAIL_BUTTON\">GMAIL LOGIN</div><img src=\"images/add_new.png\" id=\"addNew\" /><img src=\"images/trashcan.png\" id=\"trashcanIcon\" /></div><div id=\"line2dContainerBg\"><div id=\"lineContainer\"><div id=\"element1_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineOne\"></div><div class=\"serviceContainer\">                <img src=\"images/circle_purple.png\" class=\"circle\" />                <img src=\"images/flikr.png\" class=\"serviceLabel\" /></div></div><div id=\"element2_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineTwo\"></div><div class=\"serviceContainer\"><img src=\"images/circle_pink.png\" class=\"circle\" /><img src=\"images/gmail.png\" class=\"serviceLabel\" /></div></div><div id=\"element3_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineThree\"></div><div class=\"serviceContainer\"><img src=\"images/circle_green.png\" class=\"circle\" />               <img src=\"images/groupon.png\" class=\"serviceLabel\" /></div></div><div id=\"element4_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineFour\"></div><div class=\"serviceContainer\"><img src=\"images/circle_yellow.png\" class=\"circle\" />                <img src=\"images/sun.png\" class=\"serviceLabel\" /><img src=\"images/ft.png\" class=\"serviceLabel\" /></div></div><div id=\"element5_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineFive\"></div><div class=\"serviceContainer\"><img src=\"images/circle_blue.png\" class=\"circle\" />                 <img src=\"images/facebook.png\" class=\"serviceLabel\" /><img src=\"images/twitter.png\" class=\"serviceLabel\" /></div></div></div></div>  </div>       <div class=\"pans parentCanvas\">        <div class=\"panLeft pan\"></div>        <div class=\"panRight pan\"></div>    </div>       <span id=\"overlays\"><div class=\"overlay\"></div></span>            <div id=\"InitialSetupContainer\" >            <div id=\"TopLeft\">                <button class=\"win-backbutton\" id=\"win-backbutton\" aria-label=\"Back\"></button>            </div>            <div id=\"TopCenterBar\"></div>            <div id=\"MiddleContent\"></div>            <div id=\"FooterBar\"></div>        </div>        <div id=\"SettingsDiv\"></div>        <div class=\"TopRight\" id=\"TopRight\"></div>        <div class=\"fixedlayout\" id=\"appcontainer\">            <div id=\"time\"><span id=\"date\"></span><span id=\"hrsMins\"></span></div>            <img src=\"images/weather.png\" id=\"settings\"/><div id=\"weather\"><span id=\"location\">portland</span><img src=\"\" id=\"weatherIcon\" /><span id=\"temperature\">78</span></div>    <div id=\"page-wrapper\">        <span id=\"elements\">  <div id=\"element1\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgOne\"></div><div id=\"line1id\" class=\"linePerspective line1\"></div>                <div class=\"row1 face name1-2d\"><span claloginFailedss=\"name1\">PHOTOS</span></div>  </div>  <div id=\"element2\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgTwo\"></div><div id=\"line2id\" class=\"linePerspective line2\"></div>                            <div class=\"row2 face name2-2d\"><span class=\"name2\">MAIL</span></div>  </div>  <div id=\"element3\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgThree\"></div><div id=\"line3id\" class=\"linePerspective line3\"></div>                                         <div class=\"row3 face name3-2d\"><span class=\"name3\">DEALS</span></div>  </div>  <div id=\"element4\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgFour\"></div><div id=\"line4id\" class=\"linePerspective line4\"></div>                            <div class=\"row4 face name4-2d\"><span class=\"name4\">NEWS</span></div>  </div>  <div id=\"element5\" class=\"parentCanvas serviceLine\"><div class=\"bgPerspective bgFive\"></div><div id=\"line5id\" class=\"linePerspective line5\"></div>            <div class=\"row5 face name5-2d\"><span class=\"name5\">SOCIAL</span></div>  </div></span>            <div id=\"settingsMenu\"><img src=\"images/settings.png\" id=\"settingsIcon\" /><img src=\"images/accounts.png\" id=\"accounts\" />        <div id =\"FB_BUTTON\">FB LOGIN</div>        <div id =\"TWITTER_BUTTON\">TWT LOGIN</div>        <div id =\"FLICKR_BUTTON\">FLICKR LOGIN</div>        <div id =\"GMAIL_BUTTON\">GMAIL LOGIN</div><img src=\"images/add_new.png\" id=\"addNew\" /><img src=\"images/trashcan.png\" id=\"trashcanIcon\" /></div><div id=\"line2dContainerBg\"><div id=\"lineContainer\"><div id=\"element1_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineOne\"></div><div class=\"serviceContainer\">                <img src=\"images/circle_purple.png\" class=\"circle\" />                <img src=\"images/flikr.png\" class=\"serviceLabel\" /></div></div><div id=\"element2_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineTwo\"></div><div class=\"serviceContainer\"><img src=\"images/circle_pink.png\" class=\"circle\" /><img src=\"images/gmail.png\" class=\"serviceLabel\" /></div></div><div id=\"element3_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineThree\"></div><div class=\"serviceContainer\"><img src=\"images/circle_green.png\" class=\"circle\" />               <img src=\"images/groupon.png\" class=\"serviceLabel\" /></div></div><div id=\"element4_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineFour\"></div><div class=\"serviceContainer\"><img src=\"images/circle_yellow.png\" class=\"circle\" />                <img src=\"images/sun.png\" class=\"serviceLabel\" /><img src=\"images/ft.png\" class=\"serviceLabel\" /></div></div><div id=\"element5_2d\" class=\"parentCanvas2d\"><div class=\"line2d lineFive\"></div><div class=\"serviceContainer\"><img src=\"images/circle_blue.png\" class=\"circle\" />                 <img src=\"images/facebook.png\" class=\"serviceLabel\" /><img src=\"images/twitter.png\" class=\"serviceLabel\" /></div></div></div></div>  </div>       <div class=\"pans parentCanvas\">        <div class=\"panLeft pan\"></div>        <div class=\"panRight pan\"></div>    </div><span id=\"overlays\"><div class=\"overlay\"></div></span>        </div>        </div>");
}

function isInternet()
{
    /*
        Name: Jerome Biotidara
        Description: Function checks to see if there's internet access;
    */
    var myNetworkinfo = Windows.Networking.Connectivity.NetworkInformation;
    var myConnectionProfile = myNetworkinfo.getInternetConnectionProfile();
    return ((myConnectionProfile != null) && ((myConnectionProfile.getNetworkConnectivityLevel()==Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess)))
}


function StartIntelDash()
{
    /*
    Name: Jerome Biotidara
    Description: Function is called when dash is fully closed and opened
    */
    "use strict";

    var CheckIfCacheHasValidUserPromise = new WinJS.Promise(function (success, fail, progress)
        {
            new CacheDataAccess.isValidUser(success, fail, progress);
        }

    )
    CheckIfCacheHasValidUserPromise.done
    (
        function (validUserStatus)
        {
            if (validUserStatus) {
                if (!isInternet()) {
                    $("#SettingsDiv").hide()//this is a hack for hiding the initial settings greyed out case
                    DisplayDataInCache();
                    ShowUpperRightMessage("Dash is having issues connecting to the Web")
                    return;
                }
                else {
                    ValidUserFoundPath()
                }
            }
            else
            {
                ValidUserFoundPath();
            }
        }
    )


    function ValidUserFoundPath()
    {
        InitializeMainDivs();
        var RetrieveInProgress = new InProgress("...Loading");
        var FailedToAuthenticateRetrievedFile = null;
        var SettingsDom = document.getElementById("SettingsDiv");



        $("#SettingsDiv").hide()//this is a hack for hiding the initial settings greyed out case


        var RetrievedCachedFilePromise = new WinJS.Promise
        (
            function (RetrieveCachedFileSuccess, RetrieveCachedFileFailure, RetrievedCacheInProgress) {
                try {
                    RetrieveLocalSaved(RetrieveCachedFileSuccess, RetrieveCachedFileFailure, RetrievedCacheInProgress);
                    FailedToAuthenticateRetrievedFile = RetrieveCachedFileFailure;//this is a hack to fix failure to authenticate cache file
                }
                catch (e) {
                    RetrieveCachedFileFailure(e);
                }
            }
        );
        RetrievedCachedFilePromise.then
        (
            function CacheRetrievedSuccess(CachedData) {
                RetrieveInProgress.Stop();
                var AccountAuthenticationProgressUI = new InProgress("...Updating Account");
                Global_CacheData = CachedData;
                var AuthenticateAccountWithIntelPromise = new WinJS.Promise
                (
                    function (IntelAccountAuthenticationSuccessFunction, IntelAccountAuthenticationFailedFunction, IntelAccountAuthenticationInProgressFunction) {
                        //$.ajax({type: "GET",url: "js/AuthenticateUser.js",dataType: "script",async: false});
                        AuthenticateAccount(IntelAccountAuthenticationSuccessFunction, IntelAccountAuthenticationFailedFunction, IntelAccountAuthenticationInProgressFunction, CachedData.Profile.UserID);
                    }
                );
                AuthenticateAccountWithIntelPromise.then
                (
                    function AccountAuthenticated(ProofOfAuthentication) {
                        AccountAuthenticationProgressUI.Stop();
                        ProceedWithVerifiedAccount(ProofOfAuthentication);
                    },
                    function AccountAuthenticationFailure(err) {
                        AccountAuthenticationProgressUI.Stop();
                        ShowUpperRightMessage(err);
                        var InitialConfigurationPromise = new WinJS.Promise(NoAccountsVerifiedSetup);
                        InitialConfigurationPromise.done
                        (
                            function SuccessfullyBoundToIntelServers(ProofOfAuthentication) {
                                ProceedWithVerifiedAccount(ProofOfAuthentication);
                            },
                            function FailedToBindWithIntel(err) {
                                if (err == undefined)
                                { err = "Failed To Authenticate Saved Account With Intel Servers"; }
                                GoToDefaultScreen(err);
                            }
                        )
                    },
                    function AccountAuthenticationInProgress(progReport) {
                        AccountAuthenticationProgressUI.Start();
                    }
                );
            },
            function CacheRetrievedFailure(err) {
                RetrieveInProgress.Stop();
                var InitialConfigurationPromise = new WinJS.Promise(NoAccountsVerifiedSetup);
                Global_CacheData = Global_CacheInitializationData;
                InitialConfigurationPromise.done
                (
                    function SuccessfullyBoundToIntelServers(ProofOfAuthentication) {
                        ProceedWithVerifiedAccount(ProofOfAuthentication);
                    },
                    function FailedToBindWithIntel(err) {
                        err = "Failed To Read Cache File"
                        GoToDefaultScreen(err);
                    }
                )
            },
            function CacheRetrieveInProgress() {
                RetrieveInProgress.Start();
            }
        );
    }
    
}

function DisplayDataInCache()
{
    var MyCacheData;
    var waitingForReadPromise = new WinJS.Promise(function (Success, failure)
    {
        MyCacheData = new CacheDataAccess().getProfile(Success,failure);
    }).done
    (
        function (Profile)
        {
            MyCacheData = Profile;
            if (!Profile.UserID.AccountID)
            {
                return;
            }
            else
            {
                Populate(MyCacheData); 
            }
            },
            function ()
            {
                ShowUpperRightMessage("No cache data")
            }
        )
    
    

    function Populate(MyCacheData)
    {
        var Phases = new Array();
        ValidatedAccountLaunch();
        Phases = Object.getOwnPropertyNames(MyCacheData.Phases);
        if (Phases != undefined) {
            Phases.forEach
            (
                function (MyPhaseName) {
                    MyPhaseName = MyPhaseName.toUpperCase()
                    switch (MyPhaseName) {
                        case "NEWS":
                            {
                                var CacheServiceNames = Object.getOwnPropertyNames(MyCacheData.Phases[MyPhaseName]);
                                CacheServiceNames.forEach
                                (
                                    function (ServiceName) {
                                        ServiceName = ServiceName.toUpperCase()
                                        switch (ServiceName) {
                                            case "GOOGLENEWS":
                                                {
                                                    MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                    (
                                                        function (MyGoogleData) {
                                                            var newCard = new Array(12);
                                                            newCard[4] = "news";
                                                            newCard[5] = new Date(MyGoogleData.PostTime);//time when news was poste
                                                            newCard[6] = MyGoogleData.TitleImageURI.Load;
                                                            newCard[7] = MyGoogleData.Title;
                                                            newCard[8] = MyGoogleData.Data;
                                                            newCard[9] = new Date(MyGoogleData.PostTime);//just time without date
                                                            newCard[10] = MyGoogleData.DataURI;
                                                            newCard[11] = MyGoogleData.ScrubbedSource;
                                                            pushNewDataCard(MyPhaseName, newCard);
                                                        }
                                                    )
                                                }
                                                break;
                                            case "SUNNEWS":
                                                {

                                                }
                                                break;
                                            default:
                                                ShowUpperRightMessage("unknown Cache Service");

                                        }

                                    }
                                )
                            }
                            break;
                        case "SOCIAL":
                            {
                                var CacheServiceNames = Object.getOwnPropertyNames(MyCacheData.Phases[MyPhaseName]);
                                CacheServiceNames.forEach
                                (
                                    function (ServiceName) {
                                        ServiceName = ServiceName.toUpperCase()
                                        switch (ServiceName) {
                                            case "FACEBOOK":
                                                {
                                                    MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                    (
                                                        function (MyFacebook) {
                                                            var newCard = new Array(11);
                                                            newCard[4] = "facebook";
                                                            newCard[5] = new Date(MyFacebook.PostTime);//time when Posts was poste
                                                            newCard[6] = MyFacebook.User;
                                                            newCard[7] = MyFacebook.Data;
                                                            newCard[8] = MyFacebook.DataURI;
                                                            newCard[9] = MyFacebook.PosterID;//just time without date
                                                            newCard[10] = new Date(MyFacebook.PostTime);
                                                            pushNewDataCard(MyPhaseName, newCard);
                                                        }
                                                    )
                                                }
                                                break;
                                            case "TWITTER":
                                                {
                                                    MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                    (
                                                        function (MyTwitter) {
                                                            var newCard = new Array(10);
                                                            newCard[4] = "twitter";
                                                            newCard[5] = new Date(MyTwitter.PostTime);//time when Posts was poste
                                                            newCard[6] = MyTwitter.User;
                                                            newCard[7] = MyTwitter.Data;
                                                            newCard[8] = MyTwitter.Photo;
                                                            newCard[9] = new Date(MyTwitter.PostTime);
                                                            pushNewDataCard(MyPhaseName, newCard);
                                                        }
                                                    )
                                                }
                                                break;
                                            default:
                                                ShowUpperRightMessage("unknown Cache Service");

                                        }

                                    }
                                )
                            }
                            break;
                        case "MAIL":
                            {
                                var CacheServiceNames = Object.getOwnPropertyNames(MyCacheData.Phases[MyPhaseName]);
                                CacheServiceNames.forEach
                                (
                                    function (ServiceName) {
                                        ServiceName = ServiceName.toUpperCase()
                                        switch (ServiceName) {
                                            case "GOOGLEMAIL":
                                                {
                                                    MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                    (
                                                        function (MyGoogleMail) {
                                                            var newCard = new Array(11);
                                                            newCard[4] = "gmail";
                                                            newCard[5] = new Date(MyGoogleMail.PostTime);
                                                            newCard[6] = MyGoogleMail.From;
                                                            newCard[7] = MyGoogleMail.Subject;
                                                            newCard[8] = MyGoogleMail.EmailContext;
                                                            newCard[9] = MyGoogleMail.To;
                                                            newCard[10] = MyGoogleMail.TruncatedText;
                                                            pushNewDataCard(MyPhaseName, newCard);
                                                        }
                                                    )
                                                }
                                                break;
                                            case "YAHOOMAIL":
                                                {
                                                    MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                    (
                                                        function (MyTwitter) {
                                                            var newCard = new Array(10);
                                                            newCard[4] = "twitter";
                                                            newCard[5] = new Date(MyTwitter.PostTime);//time when Posts was poste
                                                            newCard[6] = MyTwitter.User;
                                                            newCard[7] = MyTwitter.Data;
                                                            newCard[8] = MyTwitter.Photo;
                                                            newCard[9] = new Date(MyTwitter.PostTime);
                                                            pushNewDataCard(MyPhaseName, newCard);
                                                        }
                                                    )
                                                }
                                                break;
                                            default:
                                                ShowUpperRightMessage("unknown Cache Service");

                                        }

                                    }
                                )
                            }
                            break;
                        case "PHOTOS":
                            break;
                        case "FINANCE":
                            break;
                    }
                }
            )
        }
    }
}

function WindowsLoggedInAccount(LoginStatus, UserID)
{
    
}

function NoAccountsVerifiedSetup(SuccessfullyBoundToIntelNetworkFunction, FailedToBindToIntelNetwork)
{
    InitialSetupScreen_FirstTimeEver(SuccessfullyBoundToIntelNetworkFunction, FailedToBindToIntelNetwork);
}

function ResumeIntelDash()
{
    "use strict";
    /*
        Name: Jerome Biotidara
        Description: Function is called when dash is woken from sleep, pause state
    */
    alert("called resume");
}

function InitialSetupScreen_FirstTimeEver(comp, err)
{
    "use strict";
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This explicitly launches the inital setup process for a user to start Connecting to the intelServer. 
        *               It'll request user to go on to select some social network from which to tie the other social networks(Currently using Windows Live because of ease). In other words setting up an intel account.
    */
    //var UserProfileData = SelectSocialNetworkForSourcingProfileInfo(comp, err);
    CacheDataAccess.resetCache();
    var SelectSocialNetworkForSourcingProfileInfoPromise = new WinJS.Promise(function (SelectSocialNetworkComplete, SelectSocialNetworkErr, prog) { SelectSocialNetworkForSourcingIntelProfileInfo(SelectSocialNetworkComplete, SelectSocialNetworkErr) });
    SelectSocialNetworkForSourcingProfileInfoPromise.then(
        function SuccessfullySignedIn(UserProfileData)
        {
            comp(UserProfileData);
        },
        function FailedToSignIn(errMessage)
        {
            err();
        }
    )


}

function GoToDefaultScreen(DisplayMessage)
{
    $("#appcontainer").hide();
    $.ajax({ type: "GET", url: "js/DefaultInterface.js", dataType: "script", async: false }); LoadDefaultInterfaceUI(DisplayMessage);
}

function SelectSocialNetworkForSourcingIntelProfileInfo(comp, err)
{
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This generates the UI for users to select a social network of their choice for sourcing the data that will be used to populate the intel profile page. It returns the ID of the user logged into the Intel Servers.
    */
    var SocialNetworkIndex = 0;
    var PopulateIntelSourceUsingSocialNetwork
    switch (SocialNetworkIndex)//switch statement selects which network to source Intel initialization data
    {
        case 0:
            {
                PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingWindowsLive;
                break;
            }
        case 1:
            {
                PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingFacebook;
                break;
            }
        case 2:
            {
                PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingGoogle;
                break;
            }
        case 3:
            {
                PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingTwitter;
                break;
            }
    }
    var IntelSourcedDataPromise = new WinJS.Promise(function (PopulateUsingSocialNetworkComplete, PopulateUsingSocialNetworkErr, prog) { PopulateIntelSourceUsingSocialNetwork(PopulateUsingSocialNetworkComplete, PopulateUsingSocialNetworkErr, SocialNetworkIndex) });
    IntelSourcedDataPromise.done
    (
        function (IntelSourceData)
        {
            userId = IntelSourceData.AccountID;
            ShowUpperRightMessage("Successfully Logged In " + userId);
            PopulateAppBar_ini()
            
            comp(IntelSourceData);
            

        },
        function (IntelSourceDataError)
        {
            if (ForceShowYouAreLoggedInToIntelServersUsingAnySourceService)
            {
                comp(IntelSourceDataError);
            }
            else
            {
                err(IntelSourceDataError);
            }

        }
    )
}


function PopulateAppBar_ini()
{
    PopulateWindowsLoginButton(document.getElementById("DashAppBar"), ToggleWindowsLogin)
}
function PopulateIntelSourceAccountUsingTwitter(comp, err, TypeIdentifier)
{ }

function PopulateIntelSourceAccountUsingFacebook(comp, err, TypeIdentifier)
{ }

function PopulateIntelSourceAccountUsingGoogle(comp, err, TypeIdentifier)
{ }

function PopulateIntelSourceAccountUsingWindowsLive(comp, err, TypeIdentifier, ForceWindowsLiveLogoutFlag)
{
    WL.init({
        scope: ["wl.signin", "wl.basic"]
    });

    if (ForceWindowsLiveLogoutFlag != undefined)
    {
        ForceWindowsLiveLogout = true;
    }
    if (ForceWindowsLiveLogout)
    {
        var LogOutPromise=WL.logout();//Will be deleted, just used to force log out of current user
        LogOutPromise.then
        (
            function SuccessfullyLoggedOut()
            {
                WL.login().then
                    (
                        function (response) {
                            if (response.status == 'connected')
                            {
                                BindMicrosoftIDWithIntelServers(comp, err, TypeIdentifier);
                            }
                            else
                            {
                                err("having connection issues")
                                ShowUpperRightMessage("having connection issues");
                            }
                        },
                        function (responseFailed) {
                            if (ForceSuccessfulSignInIntoMicrosoftWithoutNecessarilyBindingWithIntelServers) {
                                var Message = "False Sign Into microsoft. No. Did not attempt to bind"
                                comp(Message);
                                ShowUpperRightMessage(Message);
                            }
                            else {
                                err("Windows Live is InAccessible At the moment!")
                            }
                        }
                    );
            }
        )
    }
    else
    {
        WL.login().then
        (
            function (response) {
                if (response.status == 'connected')
                {
                    BindMicrosoftIDWithIntelServers(comp, err,TypeIdentifier);
                    comp(userid)
                }
                else {
                    ShowUpperRightMessage("having connection issues");
                }
            },
            function (responseFailed) {
                if (ForceSuccessfulSignInIntoMicrosoftWithoutNecessarilyBindingWithIntelServers) {
                    var Message = "False Sign Into microsoft. No. Did not attempt to bind"
                    comp(Message);
                    ShowUpperRightMessage(Message);
                }
                else {
                    err("Windows Live is InAccessible At the moment!")
                }
            }
        );
    }
    

    var BindMicrosoftIDWithIntelServers = function (SuccessInBindingWithIntelFunction, FailureInBindingWithIntelFunction, TypeIdentifier)
    {
        /*
            Description: This function is called after the user succesfully signs in with Windows Live ID. 
        */
        WL.api({
            path: "me",
            method: "GET"
        }).then(
            function (response)
            {
                var LoginSuccess = new SignedInAccount(response.id, TypeIdentifier);
                var RegisterWitRIntelPromise=RegisterAccountWithIntelServers(LoginSuccess);
                RegisterWitRIntelPromise.done
                (
                    function SuccessWithAccessingIntelServers(ReturnData)
                    {
                        var DataRetrieved;


                        try
                        {
                            DataRetrieved = JSON.parse(ReturnData.response);
                            if ((DataRetrieved.AccountID != null) || (DataRetrieved.AccountID != "null"))
                            {

                                SuccessInBindingWithIntelFunction(DataRetrieved);
                            }
                            else
                            {
                                throw "Invalid Data After Sign in"
                            }
                        }
                        catch (e)
                        {
                            FailureInBindingWithIntelFunction(e);
                        }
                    },
                    function FailureInAccessingIntelServers(Error)
                    {
                        FailureInBindingWithIntelFunction("Sorry Failed To Sign you Up with Intel Servers")
                    }
                );                
            },
            function (responseFailed)
            {
                if (ForceYouAreBoundSuccessfullyWithIntelServersUsingWindowsLive)
                {
                    userId = responseFailed.id;
                    SuccessInBindingWithIntelFunction(userId);
                }
                else
                {
                    PopulateIntelSourceAccountUsingWindowsLive(comp, err, TypeIdentifier, true);
                    //FailureInBindingWithIntelFunction("Unable To Retrieve Windows Live ID after LogIn");
                }
            }
        );
    };


}

function SignedInAccount(AccountID, AccountType)
{
    this.Id = AccountID;
    this.Type = AccountType;
}

function RetrieveLocalSaved(RetrievedFileSuccesCallBack, RetrievedFileFailureCallBack, RetrievedFileFailureProgreess)
{
    "use strict";
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This reads the User.DashProfile and goes on to parse the data into JSON format which is then used to retrieve validate account from IntelServers
    */
    var ReadCacheDatPromise = new WinJS.Promise
        (
            function (Success, Failure, Progress)
            {
                Global_CacheIO.ReadCacheFile_ToText(Success, Failure, Progress);
            }
        )
    ReadCacheDatPromise.done
    (
        function (MyTextData)
        {
            try
            {
                var CacheData_JSON = JSON.parse(MyTextData);

                if (isFunction(RetrievedFileSuccesCallBack))
                {
                    RetrievedFileSuccesCallBack(CacheData_JSON);
                }
            }
            catch (e)
            {
                //ar CacheData_JSON = JSON.parse(MyTextData);
                var CallToInitializePromise = new WinJS.Promise
                (
                    function (success, failure, progress)
                    {
                        Global_CacheIO.InitializeFile(success, failure, progress);
                    }
                )
                CallToInitializePromise.done
                (
                    function InitializationSuccess()
                    {
                        RetrieveLocalSaved(RetrievedFileSuccesCallBack, RetrievedFileFailureCallBack, RetrievedFileFailureProgreess)
                    }, function InitializationFailure()
                    {
                        ShowUpperRightMessage("\nCannot Initialize Dash. Please Check Write Permissions");
                        if (isFunction(RetrievedFileFailureCallBack))
                        { RetrievedFileFailureCallBack("Corrupt Profile Data"); }
                    }
                )
            }
        },
        function ()
        {
            var CallToInitializePromise = new WinJS.Promise
                (
                    function (success, failure, progress) {
                        Global_CacheIO.InitializeFile(success, failure, progress);
                    }
                )
            CallToInitializePromise.done
            (
                function InitializationSuccess() {
                    RetrieveLocalSaved(RetrievedFileSuccesCallBack, RetrievedFileFailureCallBack, RetrievedFileFailureProgreess)
                }, function InitializationFailure() {
                    ShowUpperRightMessage("\nCannot Initialize Dash. Please Check Write Permissions");
                    if (isFunction(RetrievedFileFailureCallBack))
                    { RetrievedFileFailureCallBack("Corrupt Profile Data"); }
                }
            )
        }
    )


    //CurrentLog = "User.txt";
    //var cached_data = JSON.parse(CurrentLog);
    
}

/*function InitializeDashCache(RetrieveLocalSaved,RetrievedFileSuccesCallBack, RetrievedFileFailureCallBack, RetrievedFileFailureProgreess)
{

    

    
}*/

function RegisterAccountWithIntelServers(LoggedInServiceIdentification)
{
    /*
        Name: Jerome Biotidara
        Description: This is called only after the User ID has been retrived. It registers a user account with the Intel Servers. It also tries to bind retrived ID with the GeoLocation and Notification services
    */
    var LatterURLString="/jerome/SignUp_User.php?SignUpServiceID=" + LoggedInServiceIdentification.Id + "&TypeOfService=" + LoggedInServiceIdentification.Type;
    return WinJS.xhr({ url: BASE_URL_TEST + LatterURLString });
}

function getLocation()
{
    /*
        Name:Jerome Biotidara
        Function: This gets the current location of the user and also registers to with the intel servers. The implementation was written by gaomin but updated by Jerome Biotidara by separting the code
    */

    var latitude, longitude;
    var coord;
    var geolocator = Windows.Devices.Geolocation.Geolocator();
    
    if (DisableGetLocation)
    {
        return;
    }
    var promise = geolocator.getGeopositionAsync();
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
                        //weather_zipcode = data.Placemark[0].AddressDetails.Country.AdministrativeArea.Locality.PostalCode.PostalCodeNumber;
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
            }
            );

    },
     function (err) {
         loadData();
         WinJS.log && WinJS.log(err.message, "sample", "error");
     });
}


//utility function
function isFunction(MyVar) {
    return (typeof (MyVar) === "function")
}

function isString(MyVar) {
    return (typeof (MyVar) === "string")
}
