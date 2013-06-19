/// <reference group="Dedicated Worker" />
"use strict";
var ForceWindowsLiveLogout = false;
var DisableGetLocation = true;
var ForceShowYouAreLoggedInToIntelServersUsingAnySourceService = false;
var ForceYouAreBoundSuccessfullyWithIntelServersUsingWindowsLive = false;
var ForceSuccessfulSignInIntoMicrosoftWithoutNecessarilyBindingWithIntelServers = false;
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
                    //$.ajax({type: "GET",url: "js/AuthenticateUser.js",dataType: "script",async: false});
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
                            if (err == undefined)
                            { err = "Failed To Authenticate Saved Account With Intel Servers"; }
                            GoToDefaultScreen(err);
                        }
                    )
                },
                function AccountAuthenticationInProgress(progReport)
                {
                    AccountAuthenticationProgressUI.Start();
                }
            );
        },
        function CacheRetrievedFailure(err)
        {
            RetrieveInProgress.Stop();
            var InitialConfigurationPromise = new WinJS.Promise(NoAccountsVerifiedSetup);
            InitialConfigurationPromise.done
            (
                function SuccessfullyBoundToIntelServers(ProofOfAuthentication) {
                    ProceedWithVerifiedAccount(ProofOfAuthentication);
                },
                function FailedToBindWithIntel(err)
                {
                    err = "Failed To Read Cache File"
                    GoToDefaultScreen(err);
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
            getLocation(IntelSourceData.AccountID);
            ShowUpperRightMessage("Successfully Logged In" + userId);
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
        LogOutPromise.then(
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
                if (response.status == 'connected') {
                    BindMicrosoftIDWithIntelServers(comp, err,TypeIdentifier);
                    getLocation();
                    ShowUpperRightMessage("Successfully Logged In" + userid);
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
                            if ((DataRetrieved.LoginID != null) || (DataRetrieved.LoginID != "null"))
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

function RegisterAccountWithIntelServers(LoggedInServiceIdentification)
{
    /*
        Name: Jerome Biotidara
        Description: This is called only after the User ID has been retrived. It registers a user account with the Intel Servers. It also tries to bind retrived ID with the GeoLocation and Notification services
    */
    var LatterURLString="/jerome/SignUp_User.php?SignUpServiceID=" + LoggedInServiceIdentification.Id + "&TypeOfService=" + LoggedInServiceIdentification.Type;
    return WinJS.xhr({ url: BASE_URL_TEST + LatterURLString });
}

function getLocation() {
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