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
            UpdateCacheFile(BoundDashServicesToIntelAccount);
            UpdateScreen(BoundDashServicesToIntelAccount);

        },
        function(err)
        {
            var BoundedData ="Just Data with Bounded Intel User Account"
            UpdateCacheFile(BoundedData);
            GoToDefaultScreen();
            //UpdateScreen(BoundedData);
            
        }
    )
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