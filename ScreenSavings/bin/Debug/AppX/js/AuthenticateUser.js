/// <reference group="Dedicated Worker" />



function AuthenticateAccount(SuccessCallBack, FailureCallBack, AuthenticationProgress, AccountIdentification)
{
    /*
        Name: Jerome Biotidara
        Date: 6/12/2013
        Description: This function attempts to Validate the AccountIdentification provided with the Intel Servers. The Identification will be tied to a windows LiveID account. If it has success it simply calls SuccessCallBack, if it fails it simply makes a call to FailureCallBack, with a message. It makes a call to AuthenticationProgress, while in progress
    */



    "use strict";
    AuthenticationProgress(1);
    var AuthenticationPromise = new WinJS.Promise(function (AuthenticationSuccessFunction, AuthenticationFailureFunction, AuthenticationProgressFunction) {
        /*
            Name: Jerome Biotidara
            Description: This content will have direct php scripts that'll try to verify accounts. They'll be wrapped in WinJS.xhr functions
        */
        var AuthenticateURL = BASE_URL_TEST + "/jerome/AuthenticateAccount.php?loginid=" + AccountIdentification.AccountID
        WinJS.xhr({ url: AuthenticateURL }).done
        (
            function SuccessfulAccessToDashServers(ReceivedData)
            {
                AuthenticationSuccessFunction(ReceivedData.response);
                //AuthenticationSuccessFunction(true);
            },
            function FailedAccesToDashServers()
            {
                AuthenticationFailureFunction("Unable To Access Dash Servers");
            }

        )
        
        

    });
    AuthenticationPromise.done
    (
        function AuthenticationSuccess(UserProfileData)
        {
            if (UserProfileData !="0")
            {
                SuccessCallBack({ AccountID: UserProfileData, CacheId: UserProfileData })//Hack For WindowsID
            }
            else
            {
                FailureCallBack("Invalid Account")
            }
        },
        function AuthenticationFailure(error)
        {
            FailureCallBack(error);
        }
    )
}