var Global_DashAppBarWinjSControl;
var Global_DashAppBarBackButton;
var Global_DashAppBarEditServiceButton;
var Global_DashAppBarSettingsButton;
var Global_DashAppBarNewsButton;
var Global_DashAppBarSocialButton;
var Global_DashAppBarFinanceButton;
var Global_DashAppBarMailButton;
var Global_DashAppBarPhotosButton;
var Global_DashAppBarLeftSeparator;
var Global_DashAppBarRightSeparator;
var Global_DashAppBarCancelButton;
var Global_DashAppBarUpdateServiceButton;
var Global_DashAppBarLogInLogOutButton;
var Global_RefreshDataSetTimeOutValue;


var Global_PhaseEnumerator = {"PHOTOS":1,"MAIL":2,"DEALS":3,"NEWS":4,"SOCIAL":5}

var Global_CacheIO = new CacheDataIO();
var Global_MobileServicclient = new WindowsAzure.MobileServiceClient(
                                "https://screensavingsapp.azure-mobile.net/",
                                "ZizPKVtiyWNAAXJtxWAzIHpMbkIzFE72"
                            );

var Global_notificationChannel;

var Global_CacheInitializationData = {//Make this part of CacheDataAccess as static variable. Check for possible Sideeffects
    Profile: {
        UserID: { AccountID: "", Azure: "" }, LoggedInName: "", LastLogInDateTime: "", LastSavedDateTime: "", SavedScreenFileName: "", Location: {}, Phases: {
            PHOTOS:
                {
                    FLICKRPHOTO:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        },
                    INSTAGRAMPHOTO:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        }
                },
            MAIL:
                {
                    YAHOOMAIL:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        },
                    GOOGLEMAIL:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        }
                },
            DEALS:
                {
                    GROUPON: {
                        Location: [],
                                FormerIdentifyingValue: 0,
                                LatterIdentifyingValue: 1,
                                Data: []
                            },
                    LIVINGSOCIAL: ""
                },
            NEWS:
                {
                    GOOGLENEWS:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        },
                    SUNNEWS:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        },
                },
            SOCIAL:
                {
                    TWITTER:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        },
                    FACEBOOK:
                        {
                            FormerIdentifyingValue: 0,
                            LatterIdentifyingValue: 1,
                            Data: []
                        }
                }
        }
    }
};
var Global_CacheData = null;

var Locationdata = function (Latitude, Longitude, setAsDefaultflag) {
    this.Latitude = null;
    this.Longitude = null;
    if (Latitude) {
        this.Latitude = Latitude
    }
    if (Longitude) {
        this.Longitude = Longitude
    }
    var self = this;
    if (setAsDefaultflag === true) {
        setAsDefault();
    }

    this.setAsDefault = setAsDefault
    function setAsDefault() {
        Locationdata.default = self;
    }
    this.isDefault = function () {
        if (self == Locationdata.default) {
            return true;
        }
        return false;
    }
}

Locationdata.convertforCache = function (myLocationData)
{
    var myObject = { Longitude: myLocationData.Longitude, Latitude: myLocationData.Latitude, isDefault: myLocationData.isDefault() }
    return myObject;
}