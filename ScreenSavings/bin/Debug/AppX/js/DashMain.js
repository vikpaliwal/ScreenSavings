"use strict";

function UpdateCacheFile(UpdatedData)
{
    //THis will detect sign up changes
}

function ResetCacheFile()
{

}

function ProceedWithVerifiedAccount(AccountIdentification)
{
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This tries to retrieve the social accounts bound to an intel account. If it cannot find an account it switches over to an interface to select social Network bimds
    */
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
                UpdateCacheFile(BoundDashServicesToIntelAccount);
                UpdateScreen(BoundDashServicesToIntelAccount);
                //comp(BoundDashServicesToIntelAccount);
            }
            else
            {
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
                    function SettingUpNewAccounts(command) {
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
                        else {
                            err();
                        }

                    }
                )
            }
        },
        function(err)
        {
            var BoundedData ="Just Data with Bounded Intel User Account"
            UpdateCacheFile(BoundedData);
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
    $("#appcontainer").css('visibility', 'hidden');
    $("#InitialSetupContainer").css('visibility', 'visible');
    /*Social Services*/
    var TwitterServiceInitialization = new Service("Twitter", "images/twitter", TwitterLogin);
    var FacebookServiceInitialization = new Service("FaceBook", "images/facebook", FaceBookLogin);
    var SocialServices = new Array(TwitterServiceInitialization, FacebookServiceInitialization);

    /*News Services*/
    var SunNewsServiceInitializarion = new Service("Sun News", "images/sun.png", SunNewsRSS);
    var GoogleNewsServiceInitialization = new Service("Google News", "images/google_news.png", GoogleNewsRss);
    var NewsServices = new Array(SunNewsServiceInitializarion, GoogleNewsServiceInitialization);

    /*Mail Services*/
    var GoogleMailServiceInitialization = new Service("Google Mail", "images/gmail.png", GmailLogin);
    var YahooMailServiceInitialization = new Service("Yahoo Mail", "images/yahoo_mail.png", YahooMailLogin)
    var MailServices = new Array(GoogleMailServiceInitialization, YahooMailServiceInitialization);

    /*Picture Services*/
    var FlickrServiceInitialization = new Service("Flickr", "images/flikr.png", FlickrLogin);
    var InstagramLoginServiceInitialization = new Service("Instagram", "images/Instagram.png", YahooMailLogin)
    var PictureServices = new Array(FlickrServiceInitialization, InstagramLoginServiceInitialization);

    /*Deals Services*/
    var GrouponServiceInitialization = new Service("Groupon", "images/groupon.png", FlickrLogin);
    var LivingSocialLoginServiceInitialization = new Service("Living Social", "images/Living_Social.png", YahooMailLogin)
    var DealServices = new Array(GrouponServiceInitialization, LivingSocialLoginServiceInitialization)
    var NewsInitializaationPhase;
    var MailInitializaationPhase;
    var PictureInitializaationPhase;
    var SocialInitializaationPhase;
    var DealInitializationPhase;
    NewsInitializaationPhase = new InitializationPhase("News", NewsServices, "Add A Social Service", null, MailInitializaationPhase, "images/news_Icon.png");
    MailInitializaationPhase = new InitializationPhase("Mails", MailServices, "Add A Mail Service", NewsInitializaationPhase, PictureInitializaationPhase, "images/Email_Icon.png");
    PictureInitializaationPhase = new InitializationPhase("Picture", PictureServices, "Add A Picture Media Service", MailInitializaationPhase, SocialInitializaationPhase, "images/Pictures_Icon.png");
    SocialInitializaationPhase = new InitializationPhase("Social Network", SocialServices, "Add A Social Service", PictureInitializaationPhase, DealInitializationPhase, "images/social_network.png");
    DealInitializationPhase = new InitializationPhase("Deal", DealServices, "Add A Deal Seaching Service", SocialInitializaationPhase, null, "images/Deals_Icon.png");
    var AllPhases = new Array(NewsInitializaationPhase, MailInitializaationPhase, PictureInitializaationPhase, SocialInitializaationPhase, DealInitializationPhase);
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
                    EmptyDOm(MiddleContentDiv);
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
        },

        function CancelledInitalSetup()
        {
            ReverseAllPossibleChanges(AllPhaseCopy);
            AddedNewDashServiceCallBack();
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
        if ((BoundData.GrouponId != null) || (BoundData.FaceBookToken != null) || (BoundData.Email != null) || (BoundData.TwitterToken != null) || (BoundData.TwitterVerifier != null) || (BoundData.FlickrToken != null) || (BoundData.FlickrVerifier != null) || (BoundData.GmailToken != null) || (BoundData.GmailVerifier != null)) {
            isThereData = true;
            return isThereData;
        }
    }
    catch (e) {
        return false;
    }

    return false;
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