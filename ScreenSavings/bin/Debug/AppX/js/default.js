// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var userId = null;
var openNotificationChannel;
(function () {
    "use strict";
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

                WL.init({
                    scope: ["wl.signin", "wl.basic"]
                });
                WL.login().then(
                    function (response) {
                        if (response.status == 'connected') {
                            getUserId();
                        }
                        else {
                            loginFailed(response.status);
                        }
                    },
                    function (responseFailed) {
                        loginFailed(responseFailed.error);
                    });

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

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
