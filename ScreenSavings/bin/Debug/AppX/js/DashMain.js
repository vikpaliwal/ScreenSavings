"use strict";

var Global_AllDashServices = new Array();;



function ProceedWithVerifiedAccount(AccountIdentification)
{
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This tries to retrieve the social accounts bound to an intel account. If it cannot find an account it switches over to an interface to select social Network bimds
    */
    Global_CacheData.Profile.UserID.AccountID = AccountIdentification.AccountID;
    Global_CacheData.Profile.UserID.CacheID = AccountIdentification.CacheId;
    Global_CacheData.Profile.LastLogInDateTime = new Date();
    Global_CacheIO.WriteJSONToFile(Global_CacheData);
    userId = Global_CacheData.Profile.UserID.AccountID;//this is a hack to cause initialization of userid
    PopulateAppBar_ini();
    var BoundSocialNetworkToIntelAccountPromise = new WinJS.Promise
        (
            function (BoundSocialNetworkToIntelAccountComp, BoundSocialNetworkToIntelAccountErr, prog)
            {
                getBoundSocialNetworkData(BoundSocialNetworkToIntelAccountComp, BoundSocialNetworkToIntelAccountErr, AccountIdentification);
            }
        )
    BoundSocialNetworkToIntelAccountPromise.done
    (
        function (BoundDashServicesToIntelAccount)
        {
            if (isBoundedSocialNetworks(BoundDashServicesToIntelAccount))
            {
                new CacheDataAccess().UpdateCacheFile(BoundDashServicesToIntelAccount);
                UpdateScreen(BoundDashServicesToIntelAccount);
                //comp(BoundDashServicesToIntelAccount);
                DisplayDataInCache();
                Global_AllDashServices = GenerateServiceArray(BoundDashServicesToIntelAccount);
                
                if (DeleteAllBoundAccounts)//Just tries to delete all accounts if DeleteAllBoundAccounts is set just for troubleshooting
                {

                    var title = "Delete All Dash Service Accounts :("
                    var content = "Do you Want to Delete all Dash service accounts?"
                    var result, resultOptions = ["Yes", "No"];
                    var cmd;
                    var messageDialog = new Windows.UI.Popups.MessageDialog(content, title);
                    for (var i = 0; i < resultOptions.length; i++) {
                        cmd = new Windows.UI.Popups.UICommand();
                        cmd.label = resultOptions[i];
                        cmd.invoked = function (c) {
                            result = c.label;
                        }
                        messageDialog.commands.append(cmd);
                    }


                    messageDialog.showAsync().then
                    (
                        function SettingUpNewAccounts(command) {
                            ShowUpperRightMessage(command.id, 10);
                            if (result == "Yes") {
                                var DeleteAccountsURL = BASE_URL_TEST + "/jerome/eraseAllAccounts.php?SignUpServiceID=" + AccountIdentification.AccountID;
                                WinJS.xhr({ url: DeleteAccountsURL }).done(function () { }, function () { alert("Error in deleting accounts"); })
                                SetupIntialServiceBindingPromise.done(
                                    function () {
                                        ProceedWithVerifiedAccount(AccountIdentification);
                                    }
                                )


                            }
                            else {

                                return;

                            }

                        }
                    )
                    
                }
                getLocation();
            }
            else
            {
                new CacheDataAccess.resetCache();
                var title = "No Accounts Found :("
                var content = "Dash Could Not Find Any Bound Accounts\n Do you Want to Setup an Account?"
                var result, resultOptions = ["Yes", "No"];
                var cmd;
                var messageDialog = new Windows.UI.Popups.MessageDialog(content, title);
                for (var i = 0; i < resultOptions.length; i++) {
                    cmd = new Windows.UI.Popups.UICommand();
                    cmd.label = resultOptions[i];
                    cmd.invoked = function (c) {
                        result = c.label;
                    }
                    messageDialog.commands.append(cmd);
                }


                messageDialog.showAsync().then
                (
                    function SettingUpNewAccounts(command)
                    {
                        ShowUpperRightMessage(command.id, 10);
                        if (result == "Yes")
                        {
                            var SetupIntialServiceBindingPromise= new WinJS.Promise(function (AddedNewDashServicesFun)
                            {
                                BindSocialNetworksWithIntelUserAccount(AddedNewDashServicesFun);
                            })
                            SetupIntialServiceBindingPromise.done(
                                function ()
                                {
                                    ProceedWithVerifiedAccount(AccountIdentification);
                                }
                            )

                            
                        }
                        else
                        {
                            
                            GoToDefaultScreen("No Dash Services Found");

                        }

                    }
                )
            }

        },
        function(err)
        {
            var BoundedData ="Just Data with Bounded Intel User Account"
            new CacheDataAccess().UpdateCacheFile(BoundedData);
            if(err==undefined)
            { err = "Could Not get Dash Service Accounts"; }
            GoToDefaultScreen(err);
            //UpdateScreen(BoundedData);
            
        }
    )
}

function BindSocialNetworksWithIntelUserAccount(AddedNewDashServiceCallBack, FailedToAddService)
{
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This generates the UI  that allows a user to select and Bind multiple Social networks with the intel dash. 
    */
    $("#appcontainer").hide();
    $("#InitialSetupContainer").css('visibility', 'visible');
    $("#InitialSetupContainer").show();
    /*Social Services*/
    //var TwitterServiceInitialization = new Service("Twitter", "images/twitter", TwitterLogin);
    var TwitterServiceInitialization = new Service("Twitter", "images/TwitterLogo.png", TwitterAuthenticateAccess, RegisterTwitterAccountWithDash, RegisteredWithTwitter, refreshTwitter);
    //var FacebookServiceInitialization = new Service("FaceBook", "images/facebook", FaceBookLogin);
    var FacebookServiceInitialization = new Service("FaceBook", "images/FacebookLogo.png", FacebookAuthenticateAccess, RegisterFacebookAccountWithDash, RegisteredWithFacebook, refreshFB)
    var SocialServices = new Array(TwitterServiceInitialization, FacebookServiceInitialization);

    /*News Services*/
    var SunNewsServiceInitializarion = new Service("Sun News", "images/SunnewsLogo.png", SunNewsRSS);
    var GoogleNewsServiceInitialization = new Service("Google News", "images/GoogleNewsLogo.png", GoogleNewsAuthenticateAccess, RegisterGoogleNewsWithDash, RegisteredWithGoogleNews, refreshGoogleNews);
    var NewsServices = new Array(SunNewsServiceInitializarion, GoogleNewsServiceInitialization);

    /*Mail Services*/
    var GoogleMailServiceInitialization = new Service("GMAIL", "images/GmailLogo.png", GmailAuthenticateAccess, RegisterGoogleAccountWithDash, RegisteredWithGmail, refreshGmail);
    var YahooMailServiceInitialization = new Service("Yahoo Mail", "images/YahooMailLogo.png", YahooMailLogin)
    var MailServices = new Array(GoogleMailServiceInitialization, YahooMailServiceInitialization);

    /*Picture Services*/
    //var FlickrServiceInitialization = new Service("Flickr", "images/flikr.png", FlickrLogin);
    var FlickrServiceInitialization = new Service("Flickr", "images/flickrLogo.png", FlickrAuthenticateAccess, RegisterFlickrAccountWithDash, RegisteredWithFlickr, refreshFlickr);
    var InstagramLoginServiceInitialization = new Service("Instagram", "images/InstagramLogo.png", InstagramLogin)
    var PictureServices = new Array(FlickrServiceInitialization, InstagramLoginServiceInitialization);

    /*Deals Services*/
    var GrouponServiceInitialization = new Service("Groupon", "images/GrouponLogo.png", GrouponLogin);
    var LivingSocialLoginServiceInitialization = new Service("Living Social", "images/LivingSocialLogo.png", LivingSocialLogin)
    var DealServices = new Array(GrouponServiceInitialization, LivingSocialLoginServiceInitialization)
    var NewsInitializaationPhase;
    var MailInitializaationPhase;
    var PictureInitializaationPhase;
    var SocialInitializaationPhase;
    var DealInitializationPhase;
    NewsInitializaationPhase = new InitializationPhase("NEWS", NewsServices, "Add A Social Service", null, MailInitializaationPhase, "images/news_Icon.png");
    MailInitializaationPhase = new InitializationPhase("Mail", MailServices, "Add A Mail Service", NewsInitializaationPhase, PictureInitializaationPhase, "images/Email_Icon.png");
    PictureInitializaationPhase = new InitializationPhase("PHOTOS", PictureServices, "Add A Picture Media Service", MailInitializaationPhase, SocialInitializaationPhase, "images/Pictures_Icon.png");
    SocialInitializaationPhase = new InitializationPhase("Social", SocialServices, "Add A Social Service", PictureInitializaationPhase, DealInitializationPhase, "images/social_network.png");
    DealInitializationPhase = new InitializationPhase("DEALS", DealServices, "Add A Deal Seaching Service", SocialInitializaationPhase, null, "images/Deals_Icon.png");
    var AllPhases = new Array(NewsInitializaationPhase, MailInitializaationPhase, PictureInitializaationPhase, SocialInitializaationPhase, DealInitializationPhase);
    Global_AllDashServices = AllPhases = GenerateServiceArray()
    var AllPhaseCopy = new DuplicateObject(AllPhases);
    var GenerateUIForPhasePromise = new WinJS.Promise(function InitialAccountBinding(SuccessfulDashServiceBind, FailedDashServiceBind)
    {
        var DomForSetupPhases;
        var WelcomeScreenPromise = new WinJS.Promise
            (
                function (ContinueSelectedFunction, BackSelectedFunction)
                {
                    /*
                        Name: Jerome Biotidara
                        Description: This Essential shows you a Welcome Screen, Where you will be given an option to continue or cancel the initial setup
                    */
                    var TopCenterTitleDiv = document.getElementById("TopCenterBar");
                    TopCenterTitleDiv.innerHTML = "Welcome to the Dash Service Setup..."
                    var MiddleContentDiv = document.getElementById("MiddleContent");
                    var WelcomeScreenTextDiv = document.createElement("div");
                    EmptyDom(MiddleContentDiv);
                    WelcomeScreenTextDiv.innerHTML = "We will be walking you through the process of selecting a number of desired services that you want easy access to on your Intel Dash. Hit \"Continue\" to proceed with thwe setup or the back button to go back.";
                    WelcomeScreenTextDiv.setAttribute("class", "MiddleContentWelcomeContent");
                    MiddleContentDiv.appendChild(WelcomeScreenTextDiv);
                    //var WinBackButton = document.getElementById("win-backbutton");
                    ShowWinBackButton(BackSelectedFunction);
                    //$(WinBackButton).click(BackSelectedFunction);//This is a hack it should first detect all current bound events and then save them before binding
                    var InitialBindScreen_ContinueButton = document.createElement("div");
                    InitialBindScreen_ContinueButton.innerHTML = "Continue";
                    MiddleContentDiv.appendChild(InitialBindScreen_ContinueButton);
                    InitialBindScreen_ContinueButton.setAttribute("class", "win-type-x-large");
                    InitialBindScreen_ContinueButton.setAttribute("class", "InitialServiceBindWelcomeScreenContinueButton");
                    DomForSetupPhases = MiddleContentDiv;
                    $(InitialBindScreen_ContinueButton).click(ContinueSelectedFunction);
                }
            );

        WelcomeScreenPromise.then
        (
            function ()
            {
                ContinueSelectedOnInitialBindingScreen(SuccessfulDashServiceBind, FailedDashServiceBind, DomForSetupPhases);
            },
            function CancellInitialSetup(err)
            {
                FailedDashServiceBind();
            }
        )

        function ContinueSelectedOnInitialBindingScreen(ContinueWithServiceBinding, CancelAccountBinding, MiddleContentDiv)
        {
            GenerateUIForPhases(AllPhases, MiddleContentDiv, ContinueWithServiceBinding, CancelAccountBinding);
        }


    });
    GenerateUIForPhasePromise.done
    (
        function FinishedInitialSetup()
        {
            AddedNewDashServiceCallBack();
            $("#InitialSetupContainer").hide();
        },

        function CancelledInitalSetup()
        {
            ReverseAllPossibleChanges(AllPhaseCopy);
            AddedNewDashServiceCallBack();
            $("#InitialSetupContainer").hide()
        }
    );
    function ReverseAllPossibleChanges(InitialPhaseArray) {
        /*
        Name: Jerome Biotidara
        Description: function Tries to Reverse any changes made if use selected to cancel the Initial Setup. It reverts to whatever the inital setting is suppose to be.
        */
    }

    function DuplicateObject(source) {
        /*function explicitly tries to duplicate a given object*/
        var i = 0;
        for (i in source) {
            if (typeof source[i] == 'source') {
                this[i] = new DuplicateObject(source[i]);
            }
            else {
                this[i] = source[i];
            }
        }
    }

}

function isBoundedSocialNetworks(BoundData) {
    /*
        Name: Jerome Biotidara
        Description: function Tries to check if there are any Bounded Social services.
    */
    var isThereData = false;
    if (ForceNonBoundedDashServicesOnIntel) {
        isThereData = false;
        return isThereData;
    }

    try {
        if ((BoundData.GrouponId != null) || (BoundData.FacebookToken != null) || (BoundData.FacebookId != null) || (BoundData.GoogleNews != 0) || (BoundData.GoogleNews != "0") || (BoundData.Email != null) || (BoundData.TwitterToken != null) || (BoundData.TwitterVerifier != null) || (BoundData.FlickrToken != null) || (BoundData.FlickrVerifier != null) || (BoundData.GmailToken != null) || (BoundData.GmailVerifier != null)) {
            isThereData = true;
            return isThereData;
        }
    }
    catch (e) {
        return false;
    }

    return false;
}

function GenerateServiceArray(BoundData)
{

    /*Social Services*/
    //var TwitterServiceInitialization = new Service("Twitter", "images/twitter", TwitterLogin);
    var TwitterServiceInitialization = new Service("Twitter", "images/TwitterLogo.png", TwitterAuthenticateAccess, RegisterTwitterAccountWithDash, RegisteredWithTwitter, refreshTwitter);
    //var FacebookServiceInitialization = new Service("FaceBook", "images/facebook", FaceBookLogin);
    var FacebookServiceInitialization = new Service("FaceBook", "images/FacebookLogo.png", FacebookAuthenticateAccess, RegisterFacebookAccountWithDash, RegisteredWithFacebook, refreshFB)
    var SocialServices = new Array(TwitterServiceInitialization, FacebookServiceInitialization);

    /*News Services*/
    var SunNewsServiceInitializarion = new Service("Sun News", "images/SunnewsLogo.png", SunNewsRSS);
    var GoogleNewsServiceInitialization = new Service("Google News", "images/GoogleNewsLogo.png", GoogleNewsAuthenticateAccess, RegisterGoogleNewsWithDash, RegisteredWithGoogleNews, refreshGoogleNews);
    var NewsServices = new Array(SunNewsServiceInitializarion, GoogleNewsServiceInitialization);

    /*Mail Services*/
    var GoogleMailServiceInitialization = new Service("Google Mail", "images/GmailLogo.png", GmailAuthenticateAccess, RegisterGoogleAccountWithDash, RegisteredWithGmail, refreshGmail);
    var YahooMailServiceInitialization = new Service("Yahoo Mail", "images/YahooMailLogo.png", YahooMailLogin)
    var MailServices = new Array(GoogleMailServiceInitialization, YahooMailServiceInitialization);

    /*Picture Services*/
    //var FlickrServiceInitialization = new Service("Flickr", "images/flikr.png", FlickrLogin);
    var FlickrServiceInitialization = new Service("Flickr", "images/flickrLogo.png", FlickrAuthenticateAccess, RegisterFlickrAccountWithDash, RegisteredWithFlickr, refreshFlickr);
    var InstagramLoginServiceInitialization = new Service("Instagram", "images/InstagramLogo.png", InstagramLogin)
    var PictureServices = new Array(FlickrServiceInitialization, InstagramLoginServiceInitialization);

    /*Deals Services*/
    var GrouponServiceInitialization = new Service("Groupon", "images/GrouponLogo.png", GrouponLogin);
    var LivingSocialLoginServiceInitialization = new Service("Living Social", "images/LivingSocialLogo.png", LivingSocialLogin)
    var DealServices = new Array(GrouponServiceInitialization, LivingSocialLoginServiceInitialization)
    var NewsInitializaationPhase;
    var MailInitializaationPhase;
    var PictureInitializaationPhase;
    var SocialInitializaationPhase;
    var DealInitializationPhase;
    NewsInitializaationPhase = new InitializationPhase("News", NewsServices, "Add A Social Service", null, MailInitializaationPhase, "images/news_Icon.png");
    MailInitializaationPhase = new InitializationPhase("Mail", MailServices, "Add A Mail Service", NewsInitializaationPhase, PictureInitializaationPhase, "images/Email_Icon.png");
    PictureInitializaationPhase = new InitializationPhase("Photos", PictureServices, "Add A Picture Media Service", MailInitializaationPhase, SocialInitializaationPhase, "images/Pictures_Icon.png");
    SocialInitializaationPhase = new InitializationPhase("Social", SocialServices, "Add A Social Service", PictureInitializaationPhase, DealInitializationPhase, "images/social_network.png");
    DealInitializationPhase = new InitializationPhase("Deals", DealServices, "Add A Deal Seaching Service", SocialInitializaationPhase, null, "images/Deals_Icon.png");

    var AllPhases = new Array(NewsInitializaationPhase, MailInitializaationPhase, PictureInitializaationPhase, SocialInitializaationPhase, DealInitializationPhase);
    var i = 0;
    var j = 0;
    for (; i < AllPhases.length; i++)
    {
        j = 0;
        for (; j < AllPhases[i].PhaseServices.length; j++)
        {
            AllPhases[i].PhaseServices[j].checkIfRegistered(BoundData);
        }

    }
    return AllPhases;
}

function UpdateScreen(Data)
{
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This uses the passed argument "Data" to Update The Screen of the User. If the data has no valid data(like say user cancels initial setup) it goes on to launch the default screen with just weather and BING
    */

    ValidatedAccountLaunch();
}


