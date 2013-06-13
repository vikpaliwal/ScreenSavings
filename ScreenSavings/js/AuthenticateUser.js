/// <reference group="Dedicated Worker" />
var ForcePassAuthentication = false;


function AuthenticateAccount(SuccessCallBack, FailureCallBack, AuthenticationProgress, AccountIdentification)
{
    /*
        Name: Jerome Biotidara
        Date: 6/12/2013
        Description: This function attempts to Validate the AccountIdentification provided with the Intel Servers. The Identification will be tied to a windows LiveID account. If it has success it simply calls SuccessCallBack, if it fails it simply makes a call to FailureCallBack, with a message. It makes a call to AuthenticationProgress, while in progress
    */



    "use strict";
    var AuthenticationPromise = new WinJS.Promise(function (AuthenticationSuccessFunction, AuthenticationFailureFunction, AuthenticationProgressFunction) {
        /*
            Name: Jerome Biotidara
            Description: This content will have direct php scripts that'll try to verify accounts. They'll be wrapped in WinJS.xhr functions
        */
        //setTimeout(function () {; }, 300);
        if (ForcePassAuthentication)
        {
            AuthenticationSuccessFunction(true);
        }
        else
        {
            AuthenticationFailureFunction(false)
        }

    });
    AuthenticationPromise.done
    (
        function AuthenticationSuccess(UserProfileData)
        {
            SuccessCallBack(UserProfileData)
        },
        function AuthenticationFailure(error)
        {
            FailureCallBack(error);

        }
    )
}