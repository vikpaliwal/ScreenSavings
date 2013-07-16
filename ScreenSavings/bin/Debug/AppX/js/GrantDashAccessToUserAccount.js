/// <reference group="Dedicated Worker" />

//Google Authentication and Registration
function GmailAuthenticateAccess(SuccessFunction, FailureFunction) {
    var getgMailAccessPromise = new WinJS.Promise
        (
            function (SuccessfulAccessToGoogle,FailureToAccessGoogle)
            {
                try
                {
                    var requestUrl = "https://www.google.com/accounts/OAuthGetRequestToken";
                    var authorizeUrl = "https://www.google.com/accounts/OAuthAuthorizeToken";
                    var accessUrl = "https://www.google.com/accounts/OAuthGetAccessToken";
                    var callbackUrl = "http://198.101.207.173/shilpa/two-legged.php";
                    var scope = "https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
                    var clientID = "198.101.234.220";
                    var clientSecret = "p1_QaRDYcgZXdB_kC8scaINW";
                    var timestamp = Math.round(new Date().getTime() / 1000.0);
                    var nonce = (new Date()).getTime();
                    var params = new Array();
                    params["oauth_callback"] = encodeURI(callbackUrl);
                    params["oauth_consumer_key"] = clientID;
                    params["oauth_timestamp"] = timestamp;
                    params["oauth_nonce"] = nonce;
                    params["oauth_signature_method"] = "HMAC-SHA1";
                    params["scope"] = scope;
                    var paramString = normalizeParams(params);
                    var sigBaseString = "GET&" + encodeURIComponent(requestUrl) + "&" + encodeURIComponent(paramString);
                    var keyText = encodeURIComponent(clientSecret) + "&";
                    var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                    var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                    var key = macAlgorithmProvider.createKey(keyMaterial);
                    var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                    var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                    var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);
                    paramString += "&oauth_signature=" + encodeURIComponent(signature);
                    requestUrl = encodeURI(requestUrl);
                    requestUrl += "?" + paramString;
                    var response = sendGetRequest(requestUrl);
                    //requestUrl += "?scope="+encodeURIComponent(scope);
                    //var response = sendGetRequest(requestUrl, dataToPost, null);
                    var keyValPairs = response.split("&");
                    var oauth_token;
                    var oauth_token_secret;
                    for (var i = 0; i < keyValPairs.length; i++) {
                        var splits = keyValPairs[i].split("=");
                        switch (splits[0]) {
                            case "oauth_token":
                                oauth_token = splits[1];
                                break;
                            case "oauth_token_secret":
                                oauth_token_secret = splits[1];
                                break;
                        }
                    }

                    // Send the user to authorization
                    authorizeUrl += "?oauth_token=" + oauth_token;

                    // document.getElementById("TwitterDebugArea").value += "\r\nNavigating to: " + twitterURL + "\r\n";
                    var startURI = new Windows.Foundation.Uri(authorizeUrl);
                    var endURI = new Windows.Foundation.Uri(callbackUrl);

                    //authzInProgress = true;   

                    authzInProgress = true;
                    Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                    Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI).done
                    (
                        function (result) 
                        {
                            var value = result.responseData;
                            var callbackPrefix = callbackUrl + "?";
                            var dataPart = value.substring(callbackPrefix.length);
                            var keyValPairs = dataPart.split("&");
                            var authorize_token;
                            var oauth_verifier;
                            for (var i = 0; i < keyValPairs.length; i++) 
                            {
                                var splits = keyValPairs[i].split("=");
                                switch (splits[0]) 
                                {
                                    case "oauth_token":
                                        authorize_token = splits[1];
                                        break;
                                    case "oauth_verifier":
                                        oauth_verifier = splits[1];
                                        break;
                                }
                            }
                            if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                                //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                            }
                            //form the header and send the verifier in the request to accesstokenurl
                            var params = [];
                            var timestamp = Math.round(new Date().getTime() / 1000.0);
                            var nonce = (new Date()).getTime();
                            params["oauth_consumer_key"] = clientID;
                            params["oauth_nonce"] = nonce;
                            params["oauth_signature_method"] = "HMAC-SHA1";
                            params["oauth_timestamp"] = timestamp;
                            params["oauth_token"] = authorize_token;
                            params["oauth_verifier"] = oauth_verifier;
                            var paramString = normalizeParams(params);

                            var sigBaseString = "GET&" + rfcEncoding(accessUrl) + "&" + rfcEncoding(paramString);
                            var keyText = rfcEncoding(clientSecret) + "&" + rfcEncoding(oauth_token_secret);
                            var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                            var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                            var key = macAlgorithmProvider.createKey(keyMaterial);
                            var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                            var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                            var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);
                            paramString += "&oauth_signature=" + rfcEncoding(signature);
                            accessUrl = encodeURI(accessUrl);
                            accessUrl += "?" + paramString;
                            var response = sendGetRequest(accessUrl);

                            var tokenstartpos = response.indexOf("oauth_token") + 12;
                            var tokenendpos = response.indexOf("&oauth_token_secret");
                            var secretstartpos = tokenendpos + 20;
                            var token = response.substring(tokenstartpos, tokenendpos);
                            var secret = response.substring(secretstartpos);
                            //var gmailinfourl = "https://www.googleapis.com/userinfo/email?access_token="+token;
                            SuccessfulAccessToGoogle( [[token,secret], SuccessFunction]);
                        },
                        function (e)
                        {
                            FailureToAccessGoogle([[e, "Error Connecting To Google"], FailureFunction]);
                        }
                    )

                }
                catch (e)
                {
                    FailureToAccessGoogle([[e, "Error Connecting To Google"], FailureFunction]);
                }
            }
        )
    getgMailAccessPromise.done(PackageAndSendDataFromGoogleAccess, NotifyOfGoogleAccessFailure)
}

function PackageAndSendDataFromGoogleAccess(Data)
{
    /*
        Name: Jerome Biotidara
        Description: This Funciton helps afford the separation between the Request for Access tokens for a service and Registering the access tokens with Intel. It gets the retrieved data as an array and creates a google access object. Sends this object over to the call back function
    */
    var RetrievedData = new GoogleAccess(Data[0][0], Data[0][1]);
    Data[1](RetrievedData);

}

function GoogleAccess(Token,Secret)
{
    var DecodedToken = decodeURIComponent(Token);
    var DecodedSecret = decodeURIComponent(Secret);
    this.getToken = getToken;
    this.getSecret = getSecret;
    this.isValid = checkValidData;
    this.clearEntry = false;
    function checkValidData()
    {
        var invalidToken= "The token i";
        var invalidSecret="d.\n\n";
        if ((DecodedToken!=invalidToken)&&(DecodedSecret!=invalidSecret))
        {
            return true;
        }
        DecodedToken = null;
        DecodedSecret = null
        return false;
    }

    function getSecret()
    {
        return DecodedSecret;
    }

    function getToken()
    {
        return DecodedToken;
    }

}

function NotifyOfGoogleAccessFailure(FailureObject)
{
    FailureObject[1](FailureObject[0]);
}

function RegisterGoogleAccountWithDash(GoogleAccessData,LoopbackSuccess,LoopBackFailure)
{
    /*if(!GoogleAccessData.isValid())
    {
        LoopBackFailure("Cannot Register With Google");
        return;
    }*/
    
    if ((!GoogleAccessData) || (GoogleAccessData.clearEntry)) {
        var xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=gmail&win_id=" + userId + "&oauth_token=&oauth_verifier=&email=" ;
    }
    else
    {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=gmail&win_id=" + userId + "&oauth_token=" + GoogleAccessData.getToken() + "&oauth_verifier=" + GoogleAccessData.getSecret() + "&email=" + "dummy@gmail.com";
    }
    WinJS.xhr({ url: xhrUrl }).done
        (
            function SuccessFromIntelServers(result)
            {
                var results = result.resonseText;
                LoopbackSuccess(result.resonseText);
            },
            function (errorFromIntelServers)
            {
                LoopBackFailure("Dash Servers In Accessible");
            }
        )
}


//Flickr Authentication and Registration
function FlickrAuthenticateAccess(SuccessFunction, FailureFunction)
{
    var FlickrAccessPromise = new WinJS.Promise
    (
        function (SuccesfullAccesToFlickr, FailureToAccessFlickr)
        {
            try
            {
                var flickrURL = "https://secure.flickr.com/services/oauth/request_token";
                var accessTokenUrl = "http://www.flickr.com/services/oauth/access_token";
                // Get all the parameters from the user
                var clientID = "698637b46e1640dc47bb878246328e95";
                var clientSecret = "0e0d30a1d78038fd";
                var callbackURL = "http://198.101.207.173/shilpa/flickrcallback.php";

                // Acquiring a request token
                var timestamp = Math.round(new Date().getTime() / 1000.0);
                var nonce = Math.random();
                nonce = Math.floor(nonce * 1000000000);

                // Compute base signature string and sign it.
                // This is a common operation that is required for all requests even after the token is obtained.
                // Parameters need to be sorted in alphabetical order
                // Keys and values should be URL Encoded.
                var sigBaseStringParams = "oauth_callback=" + encodeURIComponent(callbackURL);
                sigBaseStringParams += "&" + "oauth_consumer_key=" + clientID;
                sigBaseStringParams += "&" + "oauth_nonce=" + nonce;
                sigBaseStringParams += "&" + "oauth_signature_method=HMAC-SHA1";
                sigBaseStringParams += "&" + "oauth_timestamp=" + timestamp;
                sigBaseStringParams += "&" + "oauth_version=1.0";
                var sigBaseString = "GET&";
                sigBaseString += encodeURIComponent(flickrURL) + "&" + encodeURIComponent(sigBaseStringParams);
                var keyText = clientSecret + "&";
                var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                var key = macAlgorithmProvider.createKey(keyMaterial);
                var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);

                flickrURL += "?" + sigBaseStringParams + "&oauth_signature=" + encodeURIComponent(signature);
                var response = sendGetRequest(flickrURL);

                var oauth_token;
                var oauth_token_secret;
                var keyValPairs = response.split("&");

                for (var i = 0; i < keyValPairs.length; i++) {
                    var splits = keyValPairs[i].split("=");
                    switch (splits[0]) {
                        case "oauth_token":
                            oauth_token = splits[1];
                            break;
                        case "oauth_token_secret":
                            oauth_token_secret = splits[1];
                            break;
                    }
                }

                // Send the user to authorization
                flickrURL = "https://secure.flickr.com/services/oauth/authorize?oauth_token=" + oauth_token + "&perms=read";

                var startURI = new Windows.Foundation.Uri(flickrURL);
                var endURI = new Windows.Foundation.Uri(callbackURL);
                Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                    Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI).done
                    (
                        function (result)
                        {
                            var value = result.responseData;

                            var startpos = value.indexOf("oauth_token") + 12;
                            var endpos = value.indexOf("&oauth_verifier");
                            var oauthtoken = value.substring(startpos, endpos);
                            var oauthverifier = value.substring(endpos + 16);
                            if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                                //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                            }
                            //form the header and send the verifier in the request to accesstokenurl
                            var timestamp = Math.round(new Date().getTime() / 1000.0);
                            var nonce = Math.random();
                            nonce = Math.floor(nonce * 1000000000);
                            // Compute base signature string and sign it.
                            // This is a common operation that is required for all requests even after the token is obtained.
                            // Parameters need to be sorted in alphabetical order
                            // Keys and values should be URL Encoded.

                            var sigBaseStringParams = "oauth_consumer_key=" + clientID;
                            sigBaseStringParams += "&" + "oauth_nonce=" + nonce;
                            sigBaseStringParams += "&" + "oauth_signature_method=HMAC-SHA1";
                            sigBaseStringParams += "&" + "oauth_timestamp=" + timestamp;
                            sigBaseStringParams += "&" + "oauth_token=" + oauthtoken;
                            sigBaseStringParams += "&" + "oauth_verifier=" + oauthverifier;
                            sigBaseStringParams += "&" + "oauth_version=1.0";

                            var sigBaseString = "GET&";
                            sigBaseString += encodeURIComponent(accessTokenUrl) + "&" + encodeURIComponent(sigBaseStringParams);
                            var keyText = clientSecret + "&" + oauth_token_secret;
                            var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                            var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                            var key = macAlgorithmProvider.createKey(keyMaterial);
                            var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                            var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                            var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);

                            accessTokenUrl += "?" + sigBaseStringParams + "&oauth_signature=" + encodeURIComponent(signature);
                            var response = sendGetRequest(accessTokenUrl);
                            var tokenstartpos = response.indexOf("oauth_token") + 12;
                            var tokenendpos = response.indexOf("&oauth_token_secret");
                            var secretstartpos = tokenendpos + 20;
                            var secretendpos = response.indexOf("&user_nsid");
                            var useridstartpos = secretendpos + 11;
                            var useridendpos = response.indexOf("&username");
                            var token = response.substring(tokenstartpos, tokenendpos);
                            var secret = response.substring(secretstartpos, secretendpos);
                            var user = response.substring(useridstartpos, useridendpos);
                            SuccesfullAccesToFlickr([[token, secret], SuccessFunction]);
                        }
                    )
            }
            catch (e)
            {
                FailureToAccessFlickr([[e, "Failed To Log Into Flickr"],FailureFunction]);
            }
        }
    )
    FlickrAccessPromise.done(PackageAndSendDataFromFlickrAccess, NotifyOfFlickrAccessFailure);
}

function PackageAndSendDataFromFlickrAccess(Data)
{
    var RetrievedData = new FlickrAccess(Data[0][0], Data[0][1]);
    Data[1](RetrievedData);
}

function FlickrAccess(Token, Secret)
{
    var DecodedToken = decodeURIComponent(Token);
    var DecodedSecret = decodeURIComponent(Secret);
    this.getToken = getToken;
    this.getSecret = getSecret;
    this.isValid = checkValidData;
    this.clearEntry = false;
    function checkValidData() {
        var invalidToken = "oauth_probl";
        var invalidSecret = "oauth_problem=token";
        if ((DecodedToken != invalidToken) && (DecodedSecret != invalidSecret))
        {
            return true;
        }
        DecodedSecret = null;
        DecodedToken = null;
        return false;
    }

    function getToken()
    {
        return DecodedToken;
    }

    function getSecret()
    {
        return DecodedSecret;
    }
}

function NotifyOfFlickrAccessFailure(FailureObject)
{
    FailureObject[1](FailureObject[0])
}

function RegisterFlickrAccountWithDash(FlickrAccessData, LoopbackSuccess, LoopBackFailure)
{
    /*if (!FlickrAccessData.isValid()) {
        LoopBackFailure("Cannot Register With Flickr");
        return;
    }*/
    var xhrUrl;
    if ((!FlickrAccessData)||(FlickrAccessData.clearEntry)) {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=flickr&win_id=" + userId + "&oauth_token=&oauth_verifier=";
    }
    else
    {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=flickr&win_id=" + userId + "&oauth_token=" + FlickrAccessData.getToken() + "&oauth_verifier=" + FlickrAccessData.getSecret();
    }
    //var xhrUrl = BASE_URL_TEST + "/gaomin/register_user.php?service=flickr&win_id=" + userId + "&oauth_token=" + FlickrAccessData.getToken() + "&oauth_verifier=" + getFlickrAccessData.Secret();
    WinJS.xhr({ url: xhrUrl }).done
        (
            function SuccessFromIntelServers(result) {
                var results = result.resonseText;
                LoopbackSuccess(result.resonseText);
            },
            function (errorFromIntelServers) {
                LoopBackFailure("Dash Servers In Accessible");
            }
        )
}

//Facebook Authentication and Registration
function FacebookAuthenticateAccess(SuccessFunction, FailureFunction)
{
    var FacebookAccessPromise = new WinJS.Promise
   (
       function (SuccesfullAccesToFacebook, FailureToAccessFacebook) {
           try
           {
               var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
               var clientID = "358452557528632";//Vikas' profile ID
               //var clientID = "280893205388923";//Jerome's Developer ID
               //var developerSecret = "35f68443f8b54c7dc2ff0d950416c19b"
               if (clientID === null || clientID === "") {
                   WinJS.log("Enter a ClientID", "Web Authentication SDK Sample", "error");
                   return;
               }

               var callbackURL = "https://www.facebook.com/connect/login_success.html";

               facebookURL += clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=read_stream,user_likes&display=popup&response_type=token";

               var startURI = new Windows.Foundation.Uri(facebookURL);
               var endURI = new Windows.Foundation.Uri(callbackURL);

               //  document.getElementById("FacebookDebugArea").value += "Navigating to: " + facebookURL + "\r\n";

               authzInProgress = true;
               Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                   Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI).done
                   (
                       function (result)
                       {
                           var value = result.responseData;
                           var startpos = value.indexOf("access_token") + 13;
                           var endpos = value.indexOf("&expires_in");
                           var accesstoken = value.substring(startpos, endpos);
                           if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                               //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                           }
                           var fb_id_url = "https://graph.facebook.com/me?access_token=" + accesstoken;
                          
                           WinJS.xhr({ type: "GET", url: fb_id_url }).done
                            (
                               function success(result)
                               {
                                   try
                                   {
                                       if (result.status === 200) {
                                           var fb_id = JSON.parse(result.responseText).id;
                                           SuccesfullAccesToFacebook([[accesstoken, fb_id], SuccessFunction]);
                                       }
                                       //else { }
                                   }
                                   catch(e)
                                   {
                                       FailureToAccessFacebook([[e, "Facebook Invalid Response. Check sent access token"], FailureFunction]);
                                   }
                                   
                               },
                               function (e)
                               {
                                   FailureToAccessFacebook([[e, "Unable to get fbid"], FailureFunction]);
                               }
                            )
                       }, function (e)
                       {
                           FailureToAccessFacebook([[e, "Failed To authentify facebook Account"], FailureFunction]);
                       }
                    )

           }
           catch (e)
           {
               FailureToAccessFacebook([[e, "Failed To Log Into Facebook"], FailureFunction]);
           }
       }
   )

    FacebookAccessPromise.done(PackageAndSendDataFromFacebookAccess, NotifyOfFacebookAccessFailure);
}

function PackageAndSendDataFromFacebookAccess(Data)
{
    var RetrievedData = new FacebookAccess(Data[0][0], Data[0][1]);
    Data[1](RetrievedData);

}

function FacebookAccess(Token, FbID)
{
    var DecodedToken = decodeURIComponent(Token);
    var DecodedFbID= decodeURIComponent(FbID);
    this.getToken = getToken;
    this.getFbID = getFbID;
    this.isValid = checkValidData;
    this.clearEntry = false;
    function checkValidData() {
        var invalidToken = ""
        //var invalidSecret = "d.\n\n";
        if ((DecodedToken !== invalidToken))
        {
            return true;
        }

        DecodedToken = null
        FbID = null;
        return false;
    }

    function getToken()
    {
        return DecodedToken;
    }

    function getFbID()
    {
        return DecodedFbID;
    }
}

function NotifyOfFacebookAccessFailure(FailureObject)
{
    FailureObject[1](FailureObject[0]);
}

function RegisterFacebookAccountWithDash(FacebookAccessData, LoopbackSuccess, LoopBackFailure)
{
    /*if (!FacebookAccessData.isValid()) {
        LoopBackFailure("Cannot Register With Facebook Account");
        return;
    }*/
    var xhrUrl;
    if ((!FacebookAccessData)||(FacebookAccessData.clearEntry)) {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=fb&win_id=" + userId + "&fb_token=&fb_id=" ;
    }
    else
    {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=fb&win_id=" + userId + "&fb_token=" + FacebookAccessData.getToken() + "&fb_id=" + FacebookAccessData.getFbID();
    }

    WinJS.xhr({ url: xhrUrl }).done
        (
            function SuccessFromIntelServers(result)
            {
                var results = result.resonseText;
                LoopbackSuccess(result.resonseText);
            },
            function (errorFromIntelServers)
            {
                LoopBackFailure("Dash Servers In Accessible");
            }
        )
}

//Twitter Authentication and Registration
function TwitterAuthenticateAccess(SuccessFunction, FailureFunction)
{
    var TwitterAccessPromise = new WinJS.Promise
    (
        function (SuccessfulAccessToTwitter,FailureToAccessTwitter)
        {
            try
            {
                var twitterURL = "https://api.twitter.com/oauth/request_token";
                var accessTokenUrl = "https://api.twitter.com/oauth/access_token";
                // Get all the parameters from the user
                var clientID = "hk7hZzZVSGMd6nJNztYw";
                var clientSecret = "HqoWMS3qvKh0kb2qigzz9DSE8rzXZ9gnxdPEu2ZMXU";
                //var callbackURL = "http://198.101.207.173/shilpa/callback.php";
                var callbackURL = "http://198.101.207.173/jerome/twittercallback.php"
                // Acquiring a request token
                var timestamp = Math.round(new Date().getTime() / 1000.0);
                var nonce = Math.random();
                nonce = Math.floor(nonce * 1000000000);

                // Compute base signature string and sign it.
                //    This is a common operation that is required for all requests even after the token is obtained.
                //    Parameters need to be sorted in alphabetical order
                //    Keys and values should be URL Encoded.
                var sigBaseStringParams = "oauth_callback=" + encodeURIComponent(callbackURL);
                sigBaseStringParams += "&" + "oauth_consumer_key=" + clientID;
                sigBaseStringParams += "&" + "oauth_nonce=" + nonce;
                sigBaseStringParams += "&" + "oauth_signature_method=HMAC-SHA1";
                sigBaseStringParams += "&" + "oauth_timestamp=" + timestamp;
                sigBaseStringParams += "&" + "oauth_version=1.0";
                var sigBaseString = "POST&";
                sigBaseString += encodeURIComponent(twitterURL) + "&" + encodeURIComponent(sigBaseStringParams);

                var keyText = clientSecret + "&";
                var keyMaterial = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(keyText, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var macAlgorithmProvider = Windows.Security.Cryptography.Core.MacAlgorithmProvider.openAlgorithm("HMAC_SHA1");
                var key = macAlgorithmProvider.createKey(keyMaterial);
                var tbs = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(sigBaseString, Windows.Security.Cryptography.BinaryStringEncoding.Utf8);
                var signatureBuffer = Windows.Security.Cryptography.Core.CryptographicEngine.sign(key, tbs);
                var signature = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(signatureBuffer);
                var dataToPost = "OAuth oauth_callback=\"" + encodeURIComponent(callbackURL) + "\", oauth_consumer_key=\"" + clientID + "\", oauth_nonce=\"" + nonce + "\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"" + timestamp + "\", oauth_version=\"1.0\", oauth_signature=\"" + encodeURIComponent(signature) + "\"";
                var response = sendPostRequest(twitterURL, dataToPost, null);
                var oauth_token;
                var oauth_token_secret;
                var keyValPairs = response.split("&");

                for (var i = 0; i < keyValPairs.length; i++) {
                    var splits = keyValPairs[i].split("=");
                    switch (splits[0]) {
                        case "oauth_token":
                            oauth_token = splits[1];
                            break;
                        case "oauth_token_secret":
                            oauth_token_secret = splits[1];
                            break;
                    }
                }

                // Send the user to authorization
                twitterURL = "https://api.twitter.com/oauth/authorize?oauth_token=" + oauth_token;

                // document.getElementById("TwitterDebugArea").value += "\r\nNavigating to: " + twitterURL + "\r\n";
                var startURI = new Windows.Foundation.Uri(twitterURL);
                var endURI = new Windows.Foundation.Uri(callbackURL);

                //authzInProgress = true;   
                Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                     Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI).done
                     (
                         function (result)
                         {
                             var value = result.responseData;

                             var startpos = value.indexOf("oauth_token") + 12;
                             var endpos = value.indexOf("&oauth_verifier");
                             var oauthtoken = value.substring(startpos, endpos);
                             var oauthverifier = value.substring(endpos + 16);
                             if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                                 //document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                             }
                             //form the header and send the verifier in the request to accesstokenurl
                             var accessdataToPost = "OAuth oauth_consumer_key=\"" + clientID + "\", oauth_nonce=\"" + nonce + "\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"" + timestamp + "\", oauth_token=\"" + oauth_token + "\", oauth_version=\"1.0\"";
                             var param = "oauth_verifier=" + encodeURIComponent(oauthverifier);
                             accessdataToPost += ", oauth_verifier=\""+encodeURIComponent(oauthverifier)+"\"";
                             var response = sendPostRequest(accessTokenUrl, accessdataToPost, param);
                             var tokenstartpos = response.indexOf("oauth_token") + 12;
                             var tokenendpos = response.indexOf("&oauth_token_secret");
                             var secretstartpos = tokenendpos + 20;
                             var secretendpos = response.indexOf("&user_id");
                             var useridstartpos = secretendpos + 9;
                             var useridendpos = response.indexOf("&screen_name");
                             var token = response.substring(tokenstartpos, tokenendpos);
                             var secret = response.substring(secretstartpos, secretendpos);
                             var user = response.substring(useridstartpos, useridendpos);
                            SuccessfulAccessToTwitter([[token, secret], SuccessFunction]);
                        },
                        function (e)
                        {
                            FailureToAccessTwitter([[e, "Error Connecting To Twitter"], FailureFunction]);
                        }
                    )

            }
            catch (e)
            {
                ShowUpperRightMessage("Error Connecting To Twitter");
                FailureToAccessTwitter([[e, "Error Connecting To Twitter"], FailureFunction]);
            }
        }
        )

    TwitterAccessPromise.done(PackageAndSendDataFromTwitterAccess, NotifyOfTwitterAccessFailure);
    


}

function PackageAndSendDataFromTwitterAccess(Data)
{ 
    var RetrievedData = new TwitterAccess(Data[0][0], Data[0][1]);
    Data[1](RetrievedData);
}

function TwitterAccess(Token, Secret)
{ 
    var DecodedToken = decodeURIComponent(Token);
    var DecodedSecret = decodeURIComponent(Secret);
    this.getToken = getDecodedToken;
    this.getSecret = getDecodedSecret;
    this.isValid = checkValidData;
    this.clearEntry = false;
    function checkValidData()
    {
        var invalidToken = "Invalid req";
        var invalidSecret = "Invalid request tok";
        if ((DecodedToken!==invalidToken)&&(DecodedSecret!==invalidSecret))
        {
            return true;
        }
        DecodedToken = null;
        DecodedSecret = null;
        return false;
    }

    function getDecodedToken()
    {
        /*
            Name: Jerome Biotidara
            Description: Just Returns Decoded Token. Function is used in order to maintain reference to the Decoded token after possible changes to values
        */

        return DecodedToken;
    }

    function getDecodedSecret()
    {


        return DecodedSecret;
    }
}

function NotifyOfTwitterAccessFailure(FailureObject)
{
    FailureObject[1](FailureObject[0]);
}

function RegisterTwitterAccountWithDash(TwitterAccessData, LoopbackSuccess, LoopBackFailure)
{ 
    var xhrUrl;
    if ((!TwitterAccessData)||(TwitterAccessData.clearEntry)) {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=twitter&win_id=" + userId + "&oauth_token=&oauth_verifier=";
    }
    else
    {
        xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=twitter&win_id=" + userId + "&oauth_token=" + TwitterAccessData.getToken() + "&oauth_verifier=" + TwitterAccessData.getSecret();
    }


    WinJS.xhr({ url: xhrUrl }).done
        (
            function SuccessFromIntelServers(result)
            {
                var results = result.resonseText;
                LoopbackSuccess(result.resonseText);
            },
            function (errorFromIntelServers)
            {
                LoopBackFailure("Dash Servers In Accessible");
            }
        )
}

//Google News Authentication and Registration

function GoogleNewsAuthenticateAccess(SuccessFunction, FailureFunction)
{
    SuccessFunction(new GoogleNewsDataAccess(true));
}

function GoogleNewsDataAccess(isEnabled)
{
    this.Enabled = isEnabled;
    this.isValid = function () { return isEnabled; }
}

function RegisterGoogleNewsWithDash(NewsDataAccess, LoopbackSuccess, LoopBackFailure)
{
    var xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=googlenews&win_id=" + userId + "&google_news=1";
    if ((!NewsDataAccess.Enabled) || (NewsDataAccess.clearEntry))
    { xhrUrl = BASE_URL_TEST + "/jerome/register_user.php?service=googlenews&win_id=" + userId + "&google_news="; }

    WinJS.xhr({ url: xhrUrl }).done
    (
        function SuccessFromIntelServers(result) {
            var results = result.resonseText;
            LoopbackSuccess(result.resonseText);
        },
        function (errorFromIntelServers) {
            LoopBackFailure("Dash Servers In Accessible");
        }
    )
}


function InstagramAuthenticateAccess(SuccessFunction, FailureFunction) {

}

function YahoomailAuthenticateAccess(SuccessFunction, FailureFunction) {

}

function LivingSocialAuthenticateAccess(SuccessFunction, FailureFunction) {

}

function SunNewsAuthenticateAccess(SuccessFunction, FailureFunction) {

}


function GrouponAuthenticateAccess(SuccessFunction, FailureFunction) {

}