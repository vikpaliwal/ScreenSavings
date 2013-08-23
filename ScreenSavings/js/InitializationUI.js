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





function InitializeMainDivs()
{
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
    InitializeUI();
    var MainDiv = document.getElementById("Main");
    MainDiv.style.visibility = "visible";
    var CheckIfCacheHasValidUserPromise = new WinJS.Promise(function (success, fail,progress)
        {
            new CacheDataAccess.isValidUser(success, fail, progress);
        }

    )
    
    CheckIfCacheHasValidUserPromise.done
    (
        function (validUserStatus)
        {
            if (validUserStatus) {
                $("#SettingsDiv").hide()//this is a hack for hiding the initial settings greyed out case
                if (!isInternet())
                {
                    

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
        },
        function (error)
        {
            alert(error);
        },
        function ()
        {
            var MyProgress = new InProgress("checking for Interwebs");
            MyProgress.Start();
            setTimeout(function () { MyProgress.Stop() }, 3000);


        }

    )


    function updateAzurewithChannelAndAccount(data, Success, Failure, Progress)
    {
        var MobileServiceclient = new WindowsAzure.MobileServiceClient(
                "https://screensavingsapp.azure-mobile.net/",
                "klcxMZLzWaptAGKhiZXpAKbEMFfrUH22"
        );
        var DashAccountsTable = MobileServiceclient.getTable('DashAccounts');
        var todoItems = new WinJS.Binding.List();
        update(data);

        function update(Data)
        {
            var MyNumb=(Number)(data.Expiration)/1;
            var MyData = {
                AccountID: data.AccountID,
                ChannelURI: data.Channel,
                ChannelExpiration: MyNumb
            }

            //var checkdataQuery = DashAccountsTable.select({ AccountID: 911});
            //var checkdataQuery = DashAccountsTable.select(SuccessTableRead);
            var checkdataQuery = DashAccountsTable.where({ AccountID: MyData.AccountID.toString() }).read()
            .done
            (
                CreateSuccessAccessToAzureTable(DashAccountsTable, MyData, Success, Failure), function (e) { Failure(e) }
            );
            /*checkdataQuery.where(
                    {
                        success: SuccessTableRead
                    }
                )*/


            

            

            
        }
    }


    function CreateSuccessAccessToAzureTable(Table, MyData, Success, Failure)
    {
        function SuccessTableRead(Data)
        {
            //console.log(Data);
            if (Data.length > 0) {
                MyData.id = Data[0].id;
                Table.update(MyData).done
                (
                    function (data) {
                        Success(data);
                    },
                    function (error) {
                        Failure(error);
                    }
                );
            }
            else
            {
                Table.insert(MyData).done
                (
                    function (data)
                    {
                        Success(data);
                    },
                    function (error)
                    {
                        Failure(error);
                    }
                );
            }
        }

        return SuccessTableRead;
    }
    


    function initializeBackgroundProcess(AccountData, callbackSuccess, callbackFailure)
    {
        var getNotificationChannelPromise = new WinJS.Promise(function (success, failure, progress)
        {
            getPushNotifcationChannel(success, failure);
        });

        getNotificationChannelPromise.done
        (
            function (channelURI)
            {
                var updateAzurewithChannelAndAccountPromise = new WinJS.Promise(function (success, failure, progress)
                {
                    var Data = { AccountID: AccountData, Channel: channelURI.uri, Expiration: channelURI.expirationTime };
                    updateAzurewithChannelAndAccount(Data, success, failure, progress);
                })
                updateAzurewithChannelAndAccountPromise.done
                (
                    function (data)
                    {
                        createbackgroundProcess(callbackSuccess, callbackFailure);
                    },
                    function ()
                    {
                        return;
                    }
                )
                
            },
            function (error)
            {
                if (isFunction(callbackFailure))
                {
                    callbackFailure(error);
                }
            }
        )
    }

    function createbackgroundProcess(callbackSuccess,callbackFailure)
    {
        var BackgroundTask = {
            "BackgroundTaskEntryPoint": "BackgroundTask.ScreenSavingsTask",
            "BackgroundTaskName": "ScreenSavingsTask",

            "registerBackgroundTask": function (taskEntryPoint, taskName, trigger, condition) {
                ShowUpperRightMessage("Register task called");
                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

                builder.name = taskName;
                builder.taskEntryPoint = taskEntryPoint;
                builder.setTrigger(trigger);
                if (condition !== null) {
                    builder.addCondition(condition);
                }

                var task = builder.register();
                ShowUpperRightMessage("Register task finished");
            },

            //
            // Unregister all background tasks with given name.
            //
            "unregisterBackgroundTasks": function (taskName) {
                //
                // Loop through all background tasks and unregister any with SampleBackgroundTaskName or
                // SampleBackgroundTaskWithConditionName or timeTriggerTaskName.
                //
                //ShowUpperRightMessage("HMMM UNRegister task called");
                var iter = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
                var hascur = iter.hasCurrent;
                while (hascur) {
                    var cur = iter.current.value;
                    if (cur.name === taskName) {
                        cur.unregister(true);
                    }
                    hascur = iter.moveNext();
                }
            },

        };

        
        

        Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync().then
            (
                function (backgroundStatus)
                {
                    if (backgroundStatus != Windows.ApplicationModel.Background.BackgroundAccessStatus.denied && backgroundStatus != Windows.ApplicationModel.Background.BackgroundAccessStatus.unspecified)
                    {
                        BackgroundTask.unregisterBackgroundTasks(BackgroundTask.BackgroundTaskName);//unregisters current background process
                        BackgroundTask.registerBackgroundTask(BackgroundTask.BackgroundTaskEntryPoint,
                                                                    BackgroundTask.BackgroundTaskName,
                                                                    //new Windows.ApplicationModel.Background.TimeTrigger(15,false),
                                                                    new Windows.ApplicationModel.Background.PushNotificationTrigger(),
                                                                    null);
                        callbackSuccess();
                    }
                    else
                    {
                        callbackFailure("user did not allow lock screen access. hence no push notification.");
                        ShowUpperRightMessage("user did not allow lock screen access. hence no push notification.");
                        //user did not allow lock screen access. hence no push notification.
                    }
                }
            );
        }

    function ValidUserFoundPath()
    {
        InitializeMainDivs();
        var RetrieveInProgress = new InProgress("...Loading");
        var FailedToAuthenticateRetrievedFile = null;
        var SettingsDom = document.getElementById("SettingsDiv");



        $("#SettingsDiv").hide()//this is a hack for hiding the initial settings greyed out div


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
                        var initializeBackgroundProcessPromise = new WinJS.Promise(function (Success, Failure, progress)
                        {
                            initializeBackgroundProcess(ProofOfAuthentication.AccountID, Success, Failure);
                        })
                        initializeBackgroundProcessPromise.done
                        ();
                        
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
    PopulateAppBar_ini();
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
        setTimeout(
            function ()
            {
                if (Phases != undefined)
                {
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
                                                                    newCard[4] = "google news";
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
                                    {
                                        var CacheServiceNames = Object.getOwnPropertyNames(MyCacheData.Phases[MyPhaseName]);
                                        CacheServiceNames.forEach
                                        (
                                            function (ServiceName) {
                                                ServiceName = ServiceName.toUpperCase()
                                                switch (ServiceName) {
                                                    case "FLICKRPHOTO":
                                                        {
                                                            MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                            (
                                                                function (MyFlickrPhoto) {
                                                                    var newCard = new Array(8);
                                                                    newCard[4] = "flickr photo";
                                                                    newCard[5] = new Date(MyFlickrPhoto.PostTime);
                                                                    newCard[6] = MyFlickrPhoto.User;
                                                                    newCard[7] = MyFlickrPhoto.Uri;
                                                                    pushNewDataCard(MyPhaseName, newCard);
                                                                }
                                                            )
                                                        }
                                                        break;
                                                    case "INSTAGRAMPHOTO":
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
                                case "DEALS":
                                    {
                                        var CacheServiceNames = Object.getOwnPropertyNames(MyCacheData.Phases[MyPhaseName]);
                                        CacheServiceNames.forEach
                                        (
                                            function (ServiceName) {
                                                ServiceName = ServiceName.toUpperCase()
                                                switch (ServiceName) {
                                                    case "GROUPON":
                                                        {
                                                            MyCacheData.Phases[MyPhaseName][ServiceName].Data.forEach
                                                            (
                                                                function (MyGrouponData) {
                                                                    var newCard = new Array(11);
                                                                    newCard[4] = "groupon";
                                                                    newCard[5] = new Date(MyGrouponData.PostTime);
                                                                    newCard[6] = MyGrouponData.Title;
                                                                    newCard[7] = MyGrouponData.highlightsHTML;
                                                                    newCard[8] = MyGrouponData.largeImageURL;
                                                                    newCard[9] = MyGrouponData.DealURI;
                                                                    newCard[10] = MyGrouponData.Location;
                                                                    pushNewDataCard(MyPhaseName, newCard);
                                                                }
                                                            )
                                                        }
                                                        break;
                                                    case "LIVINGSOCIAL":
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
                            }
                        }
                    )
                }
            }, UIReadyTime)
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






//utility function
function isFunction(MyVar) {
    return (typeof (MyVar) === "function")
}

function isString(MyVar) {
    return (typeof (MyVar) === "string")
}
