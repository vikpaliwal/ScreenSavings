/// <reference group="Dedicated Worker" />
"use strict";
var ForceShowYouAreLoggedInToIntelServersUsingAnySourceService = true;
var ForceYouAreBoundSuccessfullyWithIntelServersUsingWindowsLive = true;
var ForceSuccessfulSignInIntoMicrosoftWithoutNecessarilyBindingWithIntelServers = true;
function StartIntelDash()
{
    /*
    Name: Jerome Biotidara
    Description: Function is called when dash is fully closed and opened
    */
    "use strict";
    var RetrieveInProgress = new InProgress("...Loading");
    var FailedToAuthenticateRetrievedFile = null;
    var RetrievedCachedFilePromise = new WinJS.Promise
    (
        function (RetrieveCachedFileSuccess, RetrieveCachedFileFailure, RetrievedCacheInProgress)
        {
            try
            {
                RetrieveLocalSaved(RetrieveCachedFileSuccess, RetrieveCachedFileFailure, RetrievedCacheInProgress);
                FailedToAuthenticateRetrievedFile = RetrieveCachedFileFailure;//this is a hack to fix failure to authenticate cache file
            }
            catch (e)
            {
                RetrieveCachedFileFailure(e);
            }
        }
    );
    RetrievedCachedFilePromise.then
    (
        function CacheRetrievedSuccess(CachedData)
        {
            RetrieveInProgress.Stop();
            var AccountAuthenticationProgressUI = new InProgress("...Updating Account");
            var AuthenticateAccountWithIntelPromise = new WinJS.Promise
            (
                function (IntelAccountAuthenticationSuccessFunction, IntelAccountAuthenticationFailedFunction, IntelAccountAuthenticationInProgressFunction)
                {
                    $.ajax({type: "GET",url: "js/AuthenticateUser.js",dataType: "script",async: false});
                    AuthenticateAccount(IntelAccountAuthenticationSuccessFunction, IntelAccountAuthenticationFailedFunction, IntelAccountAuthenticationInProgressFunction, CachedData.ID);
                }
            );
            AuthenticateAccountWithIntelPromise.then
            (
                function AccountAuthenticated(ProofOfAuthentication)
                {
                    AccountAuthenticationProgressUI.Stop();
                    ProceedWithVerifiedAccount(ProofOfAuthentication);
                },
                function AccountAuthenticationFailure(err)
                {
                    AccountAuthenticationProgressUI.Stop();
                    ShowUpperRightMessage("Your Account can't be authenticated\n Please LogIn with your Windows LiveID",3);
                    var InitialConfigurationPromise = new WinJS.Promise(NoAccountsVerifiedSetup);
                    InitialConfigurationPromise.done
                    (
                        function SuccessfullyBoundToIntelServers(ProofOfAuthentication)
                        {
                            ProceedWithVerifiedAccount(ProofOfAuthentication);
                        },
                        function FailedToBindWithIntel(err)
                        {
                            GoToDefaultScreen();
                        }
                    )
                    //Write Code For a LIVE SIGN IN call here...It'll be a promise
                },
                function AccountAuthenticationInProgress()
                {
                    AccountAuthenticationProgressUI.Start();
                }
            );
        },
        function CacheRetrievedFailure(err)
        {
            RetrieveInProgress.Stop();
            alert(err);
            var InitialConfigurationPromise = new WinJS.Promise(NoAccountsVerifiedSetup);
            InitialConfigurationPromise.done
            (
                function SuccessfullyBoundToIntelServers(ProofOfAuthentication) {
                    ProceedWithVerifiedAccount(ProofOfAuthentication);
                },
                function FailedToBindWithIntel(err)
                {
                    GoToDefaultScreen();
                }
            )
        },
        function CacheRetrieveInProgress()
        {
            RetrieveInProgress.Start();
        }
    );
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

function GoToDefaultScreen()
{
    $.ajax({ type: "GET", url: "js/DefaultInterface.js", dataType: "script", async: false }); LoadDefaultInterfaceUI();
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
    var IntelSourcedDataPromise = new WinJS.Promise(function (PopulateUsingSocialNetworkComplete, PopulateUsingSocialNetworkErr, prog) { PopulateIntelSourceUsingSocialNetwork(PopulateUsingSocialNetworkComplete, PopulateUsingSocialNetworkErr) });
    IntelSourcedDataPromise.done
    (
        function (IntelSourceData)
        {
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

function PopulateIntelSourceAccountUsingTwitter(comp, err)
{ }

function PopulateIntelSourceAccountUsingFacebook(comp, err)
{ }

function PopulateIntelSourceAccountUsingGoogle(comp, err)
{ }

function PopulateIntelSourceAccountUsingWindowsLive(comp, err)
{
    WL.init({
        scope: ["wl.signin", "wl.basic"]
    });
    WL.logout();//Will be deleted, just used to force log out of current user
    WL.login().then
        (
            function (response)
            {
                if (response.status == 'connected')
                {
                    BindMicrosoftIDWithIntelServers(comp,err);
                    ShowUpperRightMessage("Successfully Logged In");
                    comp(userid)
                }
                else {
                    ShowUpperRightMessage("having connection issues");
                }
            },
            function (responseFailed) {
                if (ForceSuccessfulSignInIntoMicrosoftWithoutNecessarilyBindingWithIntelServers)
                {
                    var Message = "False Sign Into microsoft. No. Did not attempt to bind"
                    comp(Message);
                    ShowUpperRightMessage(Message);
                }
                else
                {
                    err("Unable To SignIn To Windows Live")
                }
            }
        );

    var BindMicrosoftIDWithIntelServers = function (SuccessInBindingWithIntelFunction, FailureInBindingWithIntelFunction)
    {
        /*
            Description: This function is called after the user succesfully signs in with Windows Live ID. 
        */
        WL.api({
            path: "me",
            method: "GET"
        }).then(
            function (response) {
                userId = response.id;
                SuccessInBindingWithIntelFunction(userId);
                getLocation();
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
                    FailureInBindingWithIntelFunction("Unable To Bind Account With Intel Servers");
                }
            }
        );
    };


}

function RetrieveLocalSaved(RetrievedFileSuccesCallBack, RetrievedFileFailureCallBack, RetrievedFileFailureProgreess)
{
    "use strict";
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This reads the User.DashProfile and goes on to parse the data into JSON format which is then used to retrieve validate account from IntelServers
    */

    var CurrentLog = "User.DashProfile"
    CurrentLog = "User.txt";
    var cached_data = JSON.parse("[{\"1\":\"lmao\"}]");
    Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(CurrentLog).done
    (
        function FileFoundSuccess(file)
        {
            Windows.Storage.FileIO.readTextAsync(file).done(
                function FileReadSuccess(fileContent)
                {
                    cached_data = JSON.parse(fileContent);
                    RetrievedFileSuccesCallBack(cached_data);
                },
                function FileReadFailure(error)
                {
                    RetrievedFileFailureCallBack("!Could Not Read Settings File\n Possibly Corrupt")
                    //WinJS.log && WinJS.log(error, "sample", "error");
                });
        },
        function FileFoundFailure(err)
        {
            RetrievedFileFailureCallBack("Settings File Not Found or Inaccessible");
        }

    );
}



var getUserId = function () {
    WL.api({
        path: "me",
        method: "GET"
    }).then(
        function (response) {
            userId = response.id;
            getLocation();
        },
        function (responseFailed) {
            loginFailed(responseFailed.error);
        }
    );
};