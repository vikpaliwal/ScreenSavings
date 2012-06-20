// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
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
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                BackgroundTask.unregisterBackgroundTasks(BackgroundTask.BackgroundTaskName);
                BackgroundTask.registerBackgroundTask(BackgroundTask.BackgroundTaskEntryPoint,
                                                    BackgroundTask.BackgroundTaskName,
                                                    new Windows.ApplicationModel.Background.SystemTrigger(Windows.ApplicationModel.Background.SystemTriggerType.timeZoneChange, false),
                                                    null);
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
