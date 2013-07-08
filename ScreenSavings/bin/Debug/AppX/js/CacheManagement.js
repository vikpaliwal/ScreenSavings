function CacheDataIO() {

    var NameOfCacheFile = "User.DashProfile";
    var CacheFile = null;
    this.CreateCacheFile = CreateCacheFile
    var WriteRequest = new Array();
    function CreateCacheFile(CallBackSuccess, CallBackFailure, InProgress) {

        Windows.Storage.KnownFolders.documentsLibrary.createFileAsync(NameOfCacheFile, Windows.Storage.CreationCollisionOption.replaceExisting).done
        (
            function (file) {
                CacheFile = file;
                if (isFunction(CallBackSuccess))
                { CallBackSuccess(CacheFile); }
            },
        function () {
            ShowUpperRightMessage("Failed To Create Dash profile, please if you have permissions")
            if (isFunction(CallBackFailure))
            { CallBackFailure(CacheFile); }
        }

        )
    }
    this.InitializeFile = InitializeFile;
    function InitializeFile(CallBackSuccess, CallBackFailure, InProgress) {
        var InitializationString = "{ \"Profile\":{ \"UserID\":{\"AccountID\": \"\", \"CacheID\": \"\"}, \"LoggedInName\":\"\", \"LastLogInDateTime\":\"\", \"LastSavedDateTime\":\"\", \"DashSavedScreenFileName\":\"\", \"Phases\":{ \"PHOTOS\":[{}], \"MAIL\":[{}], \"DEALS\":[{}], \"NEWS\":[{}], \"SOCIAL\":[{}] } } }"
        InitializationString = JSON.stringify(Global_CacheInitializationData);
        var CreateFilePromise = new WinJS.Promise
        (
            function (SuccessCreatingFile, FailedCreatingFile, ProgressCreatingFile) {
                CreateCacheFile(SuccessCreatingFile, FailedCreatingFile, ProgressCreatingFile);
            }
        )
        CreateFilePromise.done
        (
            function (MyFile) {
                Windows.Storage.FileIO.writeTextAsync(MyFile, InitializationString).then
                (
                    function WriteToFileSuccess() {
                        if (isFunction(CallBackSuccess))//checks if callback function is a function object and then calls
                        {
                            CallBackSuccess()
                        }
                    },
                    function WriteToFileFailure() {
                        if (isFunction(CallBackFailure))//checks if callback function is a function object and then calls
                        {
                            CallBackFailure(e)
                        }
                    }

                )
            },
            function (e) {
                if (isFunction(CallBackFailure))//checks if callback function is a function object and then calls
                {
                    CallBackFailure(e)
                }
            }
        )
    }
    this.ResetCacheFile = ResetCacheFile;
    function ResetCacheFile()
    { }

    this.ReadCacheFile_ToText = ReadCacheFile_ToText;
    function ReadCacheFile_ToText(CallBackSuccess, CallBackFailure, InProgress) {
        Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(NameOfCacheFile).done
        (
            function FileFoundSuccess(file) {
                CacheFile = file;
                Windows.Storage.FileIO.readTextAsync(file).done
                (
                    function FileReadSuccess(fileContent) {
                        if (isFunction(CallBackSuccess))
                        { CallBackSuccess(fileContent); }
                        //var cached_data = JSON.parse(fileContent);

                        //RetrievedFileSuccesCallBack(cached_data);
                    },
                    function FileReadFailure(error) {
                        ShowUpperRightMessage("!Could Not Read Settings File\n Possibly Corrupt, Reinitializing profile");
                        InitializeFile(CallBackSuccess, CallBackFailure, CallBackFailure);
                    }
                );
            },
            function FileFoundFailure(err) {
                ShowUpperRightMessage("Initializing Profile")
                InitializeFile(CallBackSuccess, CallBackFailure, InProgress);
            }
        );
    }
    this.WriteJSONToFile = WriteJSONToFile;
    function WriteJSONToFile(JSONObject, CallBackSuccess, CallBackFailure) {
        var CopiedObject = JSON.stringify(JSONObject);
        Windows.Storage.FileIO.writeTextAsync(CacheFile, CopiedObject).then
                (
                    function WriteToFileSuccess() {
                        if (isFunction(CallBackSuccess))//checks if callback function is a function object and then calls
                        {
                            CallBackSuccess();
                        }
                    },
                    function WriteToFileFailure() {
                        if (isFunction(CallBackFailure))//checks if callback function is a function object and then calls
                        {
                            CallBackFailure(e);
                        }
                    }
                )
    }
}

function UpdateCacheFile() {
    Global_CacheIO.WriteJSONToFile(Global_CacheData);
}

function CacheDataAccess()
{
    this.getPhase = function getPhase(PhaseName)
    {
        return Global_CacheData.Profile.Phases[PhaseName.toUpperCase()];
    }
    this.getService=function getService(PhaseName, ServiceName)
    {
        return Global_CacheData.Profile.Phases[PhaseName.toUpperCase()][ServiceName.toUpperCase()];
    }
}