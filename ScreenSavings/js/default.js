// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var userId = null;
var openNotificationChannel;

function alert(content, title) {//This implementation allows for alert boxes to get called like regular javascript::Jerome Biotidara jeromebiotidara@gmail.com
    if (title == undefined)
    {
        title= "ALERT!";
    }
    
    var messageDialog = new Windows.UI.Popups.MessageDialog(content, title);
    messageDialog.showAsync();
}

function InProgress(ProgressMessage, EncasingDom) {
    "use strict";
        /*
            Name: Jerome Biotidara
            Description: This is a class that generates an indeterminate progression icon. The object has both a start and stop functions. The former triggers the bar to show up while the stops the progression bar.
        */

    var ProgressDOMElement = null;
    var ProgressImageElement = null;
    var ProgressBackground = null;
    this.Node = function ()
    {
        return ProgressDOMElement;
    };
    this.Start = function () {
        InProgressManager(1, ProgressMessage, null);
    }
    this.Stop= function () {
        InProgressManager(0, "", ProgressDOMElement);
    }
    function InProgressManager(StartOrEnd, DisplayText, DomElementToCancel)
    {
        if (StartOrEnd) {
            ProgressBackground = document.createElement("div");
            ProgressDOMElement = document.createElement("label");
            ProgressDOMElement.style.color = "rgba(200,200,200,1)"
            ProgressBackground.style.textAlign = "center";
            ProgressImageElement = document.createElement("progress");
            ProgressBackground.style.position = "absolute";
            ProgressBackground.style.height = "100px";
            ProgressBackground.style.width = "300px";
            ProgressBackground.style.top = "50%"
            ProgressBackground.style.left = "50%"
            ProgressBackground.style.marginTop = "-50px"
            ProgressBackground.style.marginLeft = "-150px"
            ProgressBackground.style.background = "rgba(74,0,122,1)";
            ProgressBackground.style.borderRadius = "3px";
            ProgressBackground.style.boxShadow=" 0px 0px 7px #888888"
            ProgressBackground.style.overflow = "hidden";
            ProgressDOMElement.style.zIndex = 10;
            ProgressImageElement.setAttribute("class", "win-ring");
            ProgressImageElement.setAttribute("class", "withText");
            ProgressDOMElement.appendChild(ProgressImageElement);
            ProgressBackground.appendChild(ProgressDOMElement);
            if (DisplayText == undefined) {
                DisplayText = "...Loading";
            }
            ProgressBackground.innerHTML += DisplayText;
            if (EncasingDom==undefined)
            {
                EncasingDom = document.createElement("div");
                EncasingDom.setAttribute("class", "defaultProgressEncasingDiv");
            }
            var BodyDom = document.getElementById("Main");
            BodyDom.appendChild(EncasingDom);
            EncasingDom.appendChild(ProgressBackground);
            ProgressDOMElement.style.visibility = "visible";
        }
        else
        {
            if (DomElementToCancel == null)
            {
                $(EncasingDom).remove();
                return;
            }
            else
            {
                $(EncasingDom).hide();
                DomElementToCancel.removeNode(true)
                $(EncasingDom).remove();
                return;
            }
        }
    }
}


function ShowUpperRightMessage(Message, stayTime) {
    if (stayTime == undefined) {
        stayTime = 2;
    }
    else {
        if (!(typeof (stayTime) == Number)) {
            stayTime = 2;
        }
    }
    stayTime *= 1000;
    var MyDisplayBox = document.createElement("div");
    MyDisplayBox.setAttribute("id", "DropDownBox");
    MyDisplayBox.innerHTML = Message;
    MyDisplayBox.style.opacity = 1; MyDisplayBox.style.top = "0%";
    setTimeout(function () {
        MyDisplayBox.style.opacity = 0; MyDisplayBox.style.top = "-100%";
        //MyDisplayBox.removeNode(true);
    }, stayTime);
}

    (function () {
        "use strict";
        function ShowUpperRightMessage(Message, stayTime) {
            if (stayTime == undefined) {
                stayTime = 2;
            }
            else {
                if (!(typeof (stayTime) == Number)) {
                    stayTime = 1;
                }
            }
            stayTime *= 1000;
            var MyDisplayBox = document.getElementById("DropDownBox");
            MyDisplayBox.innerHTML = Message;
            MyDisplayBox.style.opacity = 1; MyDisplayBox.style.top = "0%";
            setTimeout(function () {
                MyDisplayBox.style.opacity = 0; MyDisplayBox.style.top = "-100%";
            }, stayTime);
        }
        var BackgroundTask = {
            "BackgroundTaskEntryPoint": "BackgroundTask.ScreenSavingsTask",
            "BackgroundTaskName": "ScreenSavingsTask",

            "registerBackgroundTask": function (taskEntryPoint, taskName, trigger, condition) {
                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

                builder.name = taskName;
                builder.taskEntryPoint = taskEntryPoint;
                builder.setTrigger(trigger);

                if (condition !== null) {
                    builder.addCondition(condition);
                }

                var task = builder.register();

            },

            //
            // Unregister all background tasks with given name.
            //
            "unregisterBackgroundTasks": function (taskName) {
                //
                // Loop through all background tasks and unregister any with SampleBackgroundTaskName or
                // SampleBackgroundTaskWithConditionName or timeTriggerTaskName.
                //
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
        var app = WinJS.Application;
        var activation = Windows.ApplicationModel.Activation;
        //var userId = null;
        var channelUri = null;
        var channelExpiration = null;

        WinJS.strictProcessing();

        app.onactivated = function (args) {
            if (args.detail.kind === activation.ActivationKind.launch) {
                if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

                    ValidatedAccountLaunch();
                    //StartIntelDash();
   
                
                } else {
                    // TODO: This application has been reactivated from suspension.
                    // Restore application state here.
                    ResumeIntelDash();
                }
                args.setPromise(WinJS.UI.processAll());
            }
        };

    
    
        openNotificationChannel = function () {
            if (userId == null) {
                loginFailed('user not cunnected');
                return;
            }
            Windows.ApplicationModel.Background.BackgroundExecutionManager
                .requestAccessAsync().then(function (backgroundStatus) {
                    if (backgroundStatus != Windows.ApplicationModel.Background.BackgroundAccessStatus.denied
                            && backgroundStatus != Windows.ApplicationModel.Background.BackgroundAccessStatus.unspecified) {

                        Windows.Networking.PushNotifications.PushNotificationChannelManager
                            .createPushNotificationChannelForApplicationAsync().then(
                                function (channelOperation) {
                                    registerNotificationChannel(channelOperation.uri, channelOperation.expirationTime);
                                });
                    } else {
                        //user did not allow lock screen access. hence no push notification.
                    }
                });
        };
        /*
        function getLocation() {
            var latitude, longitude;
            var coord;
            var geolocator = Windows.Devices.Geolocation.Geolocator();
            promise = geolocator.getGeopositionAsync();
            promise.done(
            function (pos) {
                //openNotificationChannel();
                coord = pos.coordinate;
                latitude = coord.latitude;
                longitude = coord.longitude;
              
                        //store result in win_id global var to access win_id throughout the app.
                        win_id = result;
                        //send data to intelscreensavings server's register groupon page
                        WinJS.xhr({ url: BASE_URL_TEST + "/gaomin/register_user.php?service=groupon&win_id=" + userId + "&lat=" + latitude + "&lng=" + longitude }).done();
        
                       WinJS.xhr({ url: "http://maps.google.com/maps/geo?q="+latitude+","+longitude}).done(
                       function success(result) {
                          if (result.status === 200) {
                              var data = JSON.parse(result.response);
                              weather_zipcode = data.Placemark[0].AddressDetails.Country.AdministrativeArea.Locality.PostalCode.PostalCodeNumber;
                             // loadData();
                          }
                          else {
                              loadData();
                          }
                      },
                      function err(result) {
                          loadData();
                      }
                      );                    
            },
             function (err) {
                 loadData();
                 WinJS.log && WinJS.log(err.message, "sample", "error");
             });
        }
        */
        var registerBackgroundTask = function () {
            BackgroundTask.unregisterBackgroundTasks(BackgroundTask.BackgroundTaskName);
            BackgroundTask.registerBackgroundTask(BackgroundTask.BackgroundTaskEntryPoint,
                                                    BackgroundTask.BackgroundTaskName,
                                                    new Windows.ApplicationModel.Background.PushNotificationTrigger(),
                                                    null);
        };

        var registerNotificationChannel = function (newChannel, newExpiration) {
            if (newChannel != channelUri) {
                registerBackgroundTask();

                WCFClientRuntimeComponent.WCFServiceCaller.registerNotificationChannelAsync(userId, newChannel, newExpiration).then(
                    function (result) {
                        if (result == 'Success') {
                            channelUri = newChannel;
                            channelExpiration = newExpiration;
                            $('#dump').text("UserId:" + userId
                                + "\n\nChannel:" + channelUri);
                        }
                    });
            }
        };

        var loginFailed = function (errorMessage) {
            $('#dump').text(errorMessage);
            //$.getScript("DefaultInterface.js", function () { });//gets script for default window with just Weather and news from BING:: Jerome Biotidara jeromebiotidara@gmail.com
            //probably exit from app with an error.
        }

        var resuming = function () {
            openNotificationChannel();
        };


        app.oncheckpoint = function (args) {
            // TODO: This application is about to be suspended. Save any state
            // that needs to persist across suspensions here. You might use the
            // WinJS.Application.sessionState object, which is automatically
            // saved and restored across suspension. If you need to complete an
            // asynchronous operation before your application is suspended, call
            // args.setPromise().
        };

        Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resuming, false);
        app.start();

    })();
