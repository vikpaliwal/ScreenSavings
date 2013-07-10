function CacheDataIO() {

    var NameOfCacheFile = "User.DashProfile";
    var CacheFile = null;
    this.CreateCacheFile = CreateCacheFile
    var WriteRequest = new Array();

    Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(NameOfCacheFile).done
    (
            function FileFoundSuccess(file)
            {
                CacheFile = file;
            },
            function FileNotFound()
            {
                try
                {CreateCacheFile()}
                catch (e)
                {
                    return;
                }
            }
    )


    function CreateCacheFile(CallBackSuccess, CallBackFailure, InProgress) {

        Windows.Storage.KnownFolders.documentsLibrary.createFileAsync(NameOfCacheFile, Windows.Storage.CreationCollisionOption.replaceExisting).done
        (
            function (file) {
                CacheFile = file;
                if (isFunction(CallBackSuccess))
                { CallBackSuccess(CacheFile); }
            },
            function () {
                ShowUpperRightMessage("Failed To Create Dash profile, check your write permissions.")
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
        Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(NameOfCacheFile).done
        (
                function FileFoundSuccess(file) {
                    CacheFile = file;
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
                },
                function FileNotFound() {
                    try
                    {
                        CreateCacheFile();
                    }
                    catch (e)
                    {
                        CallBackFailure();
                    }
                }
        )
        
    }
}



function CacheDataAccess()
{
    CacheDataAccess.ServiceObjectIndex;
    var CacheIOHandler = new CacheDataIO();
    CacheDataAccess.resetCache = resetCache;
    CacheDataAccess.CacheData = Global_CacheData;
    CacheDataAccess.isValidUser = isValidUser;
    this.getServiceObjectIndex = function getServiceObjectIndex()
    {
        if (CacheDataAccess.ServiceObjectIndex == undefined) {
            return CacheDataAccess.ServiceObjectIndex = 0;
        }
        else
        {
            return ++CacheDataAccess.ServiceObjectIndex;

        }
    }

    this.getPhase = function getPhase(PhaseName)
    {
        return CacheDataAccess.CacheData.Profile.Phases[PhaseName.toUpperCase()];
    }
    this.getService=function getService(PhaseName, ServiceName)
    {
        return CacheDataAccess.CacheData.Profile.Phases[PhaseName.toUpperCase()][ServiceName.toUpperCase()];
    }

    
    function resetCache(Success, Faiure, Progress)
    {
        CacheIOHandler.InitializeFile(Success, Faiure, Progress);
        return;
    }

    this.UpdateCacheFile=function UpdateCacheFile() {
        CacheIOHandler.WriteJSONToFile(Global_CacheData);
    }
    this.getProfile = getProfile;

    function getProfile(success,failure,progress)
    {
        if (CacheDataAccess.CacheData == null)
        {
            var getLatestCacheDataPromise = new WinJS.Promise(function (success, failure, progress) { RetrieveLocalSaved(success, failure, progress) });
            getLatestCacheDataPromise.done
            (
                function SuccessInGettingJSONData(JSONData)
                {
                    CacheDataAccess.CacheData = JSONData;
                    Global_CacheData = CacheDataAccess.CacheData
                    if (isFunction(success))
                    {
                        success(CacheDataAccess.CacheData.Profile);
                    }
                },
                function FailureInGettingJSONData()
                {
                    ShowUpperRightMessage("Cant get profile, check your cache file for errors");
                    if (isFunction(failure)) {
                        failure(null);
                    }
                }
            )
            return;
        }

        if (isFunction(success)) {
            success(CacheDataAccess.CacheData.Profile);
        }
        else
        {
            return CacheDataAccess.CacheData.Profile;
        }
    }

    this.isValidUser = isValidUser;
    function isValidUser(success, failure, progress)
    {
        if (!CacheDataAccess.CacheData)
        {
            var getMyProfilePromise = new WinJS.Promise(function (success, failure, progress)
                {
                    getProfile(success,failure,progress)
                }
            )
            getMyProfilePromise.done
            (
                function getProfileSuccess(Profile)
                {
                    if (!Profile.UserID.AccountID)
                    { success(false) }
                    else
                    {
                        success(true)
                    }
                },
                function getProfileFailure()
                {
                    success(false);
                }
            )
            
        }
    }
}