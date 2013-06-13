
    var AuthenticateUser = function () {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This tries to authenticate user profile with intel servers. If user has an account with the intel servers. It retrieves all pertitnent accounts or Directs users to use the initial social network hook up screen.
                            If user has no account with intel it prompts user to log social service("windows live" at the moment) and then Directs users to use the initial social network hook up screen. 
        */
        RetrieveLocalSaved()
        return Object.Success = false;
    }

    function RetrieveLocalSaved() {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This reads the User.DashProfile and goes on to parse the data into JSON format which is then used to retrieve validate account from IntelServers
        */

        var CurrentLog = "User.DashProfile"
        CurrentLog = "User.txt";
        var cached_data = JSON.parse("[{\"1\":\"lmao\"}]");
        Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(CurrentLog).done(
            function (file) {
                Windows.Storage.FileIO.readTextAsync(file).done(function (fileContent) {
                    cached_data = JSON.parse(fileContent);
                    var RetrievedAccount = ValidateCachedAccountWithServer(cached_data.User);//validates if the locally saved account account and retrieves user intel profile
                    if (RetrievedAccount.Access)//Checks if retrieved Intel profie has valid access
                    {
                        UpdateScreen(cached_data);//Temporarily updates the screen with last saved data.
                        var DisplayIntelValidatedAccountDataPromise = new WinJS.Promise(function (DisplayIntelValidatedAccountDataPromiseComp, DisplayIntelValidatedAccountDataPromiseErr, DisplayIntelValidatedAccountDataPromiseProg) {
                            getBoundSocialNetworkData(DisplayIntelValidatedAccountDataPromiseComp, DisplayIntelValidatedAccountDataPromiseErr, RetrievedAccount.ID);
                        })
                        DisplayIntelValidatedAccountDataPromise.then(function (BoundDataToUserAccount) {
                            cached_data[0][0].Data = BoundDataToUserAccount//Goes To Database and retrieves the bounded accounts
                            UpdateScreen(cached_data[0][0].Data);
                        }
                        )
                    }
                    else//force an intial account creation 
                    {
                        var getInitialSetupScreenData = new WinJS.Promise(//This promise calls InitialSetupScreen_FirstTimeEver and which tries to set you with an Intel Account data and then uses the data populate the retrievedData
                            function (comp, err, prog) {
                                InitialSetupScreen_FirstTimeEver(comp, err);
                            }
                            )
                        getInitialSetupScreenData.then(function (RetrievedData) {
                            var RetrievedAccount = new Object();//This is just created to satisfy 
                            RetrievedAccount.ID = RetrievedData;
                            AfterIntelAccoutnSetupConclusion(RetrievedAccount);
                        }
                        )
                    }
                },
                    function (error) {
                        alert("Error Readling Current Profile\n Please Create Another One")
                        WinJS.log && WinJS.log(error, "sample", "error");
                    });
            });
    }

    function AfterIntelAccoutnSetupConclusion(RetrievedAccount) {
        /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This function is supposed to be called after the intel dash account has been created. It takes the intel account data as input. It tries to see if it can get bounded social networks.
        */
        var DisplayIntelValidatedAccountDataPromise1 = new WinJS.Promise(
                                           function (comp, err, prog) {
                                               getBoundSocialNetworkData(comp, err, RetrievedAccount);
                                           }
                                               );
        DisplayIntelValidatedAccountDataPromise1.then(function (BoundDataToUserAccount) {
            cached_data[0][0].Data = BoundDataToUserAccount//Goes To Database and retrieves the bounded accounts
            UpdateScreen(cached_data[0][0].Data);
        }
        )
    }

    function ValidateCachedAccountWithServer(RetrievedData) {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This uses the passed argument "RetrievedData" to check the database for a current valid intel account
        */
        var Random = new Object();
        Random.Access = false;
        return Random;
    }

    function InitialSetupScreen_FirstTimeEver(comp, err) {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This explicitly launches the inital setup process for a user to start Connecting to the intelServer. 
            *               It'll request user to go on to select some social network from which to tie the other social networks(Currently using Windows Live because of ease). In other words setting up an intel account.
        */
        //var UserProfileData = SelectSocialNetworkForSourcingProfileInfo(comp, err);
        var SelectSocialNetworkForSourcingProfileInfoPromise = new WinJS.Promise(function (SelectSocialNetworkComplete, SelectSocialNetworkErr, prog) { SelectSocialNetworkForSourcingIntelProfileInfo(SelectSocialNetworkComplete, SelectSocialNetworkErr) });
        SelectSocialNetworkForSourcingProfileInfoPromise.then(function (UserProfileData) {
            comp(UserProfileData)
        }
        )

    }

    function SelectSocialNetworkForSourcingIntelProfileInfo(comp, err) {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This generates the UI for users to select a social network of their choice for sourcing the data that will be used to populate the intel profile page.
        */
        var SocialNetworkIndex = 0
        var PopulateIntelSourceUsingSocialNetwork
        switch (SocialNetworkIndex)//switch statement selects which network to source Intel initialization data
        {
            case 0:
                {
                    PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingWindowsLive;
                    break;
                }
            case 1:
                {
                    PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingFacebook;
                    break;
                }
            case 2:
                {
                    PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingGoogle;
                    break;
                }
            case 3:
                {
                    PopulateIntelSourceUsingSocialNetwork = PopulateIntelSourceAccountUsingTwitter;
                    break;
                }
        }
        var IntelSourcedDataPromise = new WinJS.Promise(function (PopulateUsingSocialNetworkComplete, PopulateUsingSocialNetworkErr, prog) { PopulateIntelSourceUsingSocialNetwork(PopulateUsingSocialNetworkComplete, PopulateUsingSocialNetworkErr) });
        IntelSourcedDataPromise.then(function (IntelSourceData) {
            comp(IntelSourceData);
        }, function (IntelSourceDataError) {
            comp(IntelSourceData);
        }
        )
    }

    function getBoundSocialNetworkData(IntelAccountIdentifier) {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This tries to retrieve the social accounts bound to an intel account. If it cannot find an account it switches over to an interface to select social Network bimds
        */
        var BoundSocialNetworkToIntelAccountPromise = new WinJS.Promise(function (BoundSocialNetworkToIntelAccountComp, BoundSocialNetworkToIntelAccountErr, prog) { getCurrentlyBoundAccounts(BoundSocialNetworkToIntelAccountComp, BoundSocialNetworkToIntelAccountErr, IntelAccountIdentifier); })
        BoundSocialNetworkToIntelAccountPromise.then(function (BoundSocialNetworkToIntelAccount) {
            if (BoundSocialNetworkToIntelAccount.isBound)//checks to see if it is currently bound. If it is not it'll make a call to the BindSocialNetworkWithIntelUserAccout
            {

            }
            else {
                BindSocialNetworksWithIntelUserAccount();
            }

        }
        )

    }

    function getCurrentlyBoundAccounts(comp, err, IntelAccountID) {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This tries to retrieve the social accounts bound to an intel account. If it cannot find an account it switches over to an interface to select social Network bimds
        */
        var Random = new Object();
        Random.isBound = false;
        comp(Random);
    }

    function BindSocialNetworksWithIntelUserAccount() {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This generates the UI  that allows a user to select and Bind multiple Social networks with the intel dash. 
        */
        $("#appcontainer").css('visibility', 'hidden');
        $("#InitialSetupContainer").css('visibility', 'visible');
        /*Social Services*/
        var TwitterServiceInitialization = new Service("Twitter", "images/twitter", TwitterLogin);
        var FacebookServiceInitialization = new Service("FaceBook", "images/facebook", FaceBookLogin);
        var SocialServices = new Array(TwitterServiceInitialization, FacebookServiceInitialization);

        /*News Services*/
        var SunNewsServiceInitializarion = new Service("Sun News", "images/sun.png", SunNewsRSS);
        var GoogleNewsServiceInitialization = new Service("Google News", "images/google_news.png", GoogleNewsRss);
        var NewsServices = new Array(SunNewsServiceInitializarion, GoogleNewsServiceInitialization);

        /*Mail Services*/
        var GoogleMailServiceInitialization = new Service("Google Mail", "images/gmail.png", GmailLogin);
        var YahooMailServiceInitialization = new Service("Yahoo Mail", "images/yahoo_mail.png", YahooMailLogin)
        var MailServices = new Array(GoogleMailServiceInitialization, YahooMailServiceInitialization);

        /*Picture Services*/
        var FlickrServiceInitialization = new Service("Flickr", "images/flikr.png", FlickrLogin);
        var InstagramLoginServiceInitialization = new Service("Instagram", "images/Instagram.png", YahooMailLogin)
        var PictureServices = new Array(FlickrServiceInitialization, InstagramLoginServiceInitialization);

        /*Deals Services*/
        var GrouponServiceInitialization = new Service("Groupon", "images/groupon.png", FlickrLogin);
        var LivingSocialLoginServiceInitialization = new Service("Living Social", "images/Living_Social.png", YahooMailLogin)
        var DealServices = new Array(GrouponServiceInitialization, LivingSocialLoginServiceInitialization)
        var NewsInitializaationPhase;
        var MailInitializaationPhase;
        var PictureInitializaationPhase;
        var SocialInitializaationPhase;
        var DealInitializationPhase;
        NewsInitializaationPhase = new InitializationPhase("News", NewsServices, "Add A Social Service", null, MailInitializaationPhase, "images/news_Icon.png");
        MailInitializaationPhase = new InitializationPhase("Mails", MailServices, "Add A Mail Service", NewsInitializaationPhase, PictureInitializaationPhase, "images/Email_Icon.png");
        PictureInitializaationPhase = new InitializationPhase("Picture", PictureServices, "Add A Picture Media Service", MailInitializaationPhase, SocialInitializaationPhase, "images/Pictures_Icon.png");
        SocialInitializaationPhase = new InitializationPhase("Social Network", SocialServices, "Add A Social Service", PictureInitializaationPhase, DealInitializationPhase, "images/social_network.png");
        DealInitializationPhase = new InitializationPhase("Deal", DealServices, "Add A Deal Seaching Service", SocialInitializaationPhase, null, "images/Deals_Icon.png");
        var AllPhases = new Array(NewsInitializaationPhase, MailInitializaationPhase, PictureInitializaationPhase, SocialInitializaationPhase, DealInitializationPhase);
        var MiddleContentDiv = document.getElementById("MiddleContent")
        GenerateUIForPhases(AllPhases, MiddleContentDiv);
        //PopulateInitializationPhase(AllPhases[0]);

    }

    function GenerateUIForPhases(AllPhases, DomForUIGeneration) {
        /*
            *Name:Jerome Biotidara
            *Date: 6/6/2013
            *Description: This handles the UI generation for the several phases. It makes a call to PopulateInitializationPhase which generates the UI for each phase. It takes The array of phase as its parameter.
        */
        var MyBoundPhaseDiv = document.createElement("div");
        MyBoundPhaseDiv.setAttribute("id", "InitializationBindingDiv");
        DomForUIGeneration.appendChild(MyBoundPhaseDiv);
        var ArrayOfPhaseDOMElements = new Array()// Array stores DOM elements to of each Phase. Each phase DOM will be used as referemces for appending more child element that have binding function. see PopulateBottomSection implementation for more description
        var i = 0;
        var EachPhase = null;
        var idOfPhaseDiv = "";
        var PhaseTop = "";
        var PhaseTopID = "";
        var PhaseCenter = "";
        var PhaseCenterID = "";
        var PhaseBottom = "";
        for (; i < AllPhases.length; i++) {
            EachPhase = document.createElement("div");
            idOfPhaseDiv = "InitializationBindingPhase" + i.toString();
            EachPhase.setAttribute("id", idOfPhaseDiv);//Sets ID
            EachPhase.setAttribute("class", "PhaseDiv");//Sets a class for the DOM element
            /*PhaseTop DomElement Creation*/
            PhaseTop = document.createElement("div");
            PhaseTopID = idOfPhaseDiv + "Top";//"creates ID string"
            PhaseTop.setAttribute("id", PhaseTopID);//sets ID
            PhaseTop.setAttribute("class", "PhaseTopDiv");//Sets a class for the DOM element
            PhaseTop.setAttribute("class", "win-type-xx-large");// this was included to take advantage of some of the CSS features of windows WinJS css //Microsoft.WinJS.1.0/css/ui-dark.css
            EachPhase.appendChild(PhaseTop);//Adds DOM element to the parent Phase DOM

            PhaseTop.innerHTML = "  " + AllPhases[i].Name + " Section...";

            /*PhaseCenter DomElement Creation*/
            PhaseCenter = document.createElement("div");
            PhaseCenterID = idOfPhaseDiv + "Center";
            PhaseCenter.setAttribute("id", PhaseCenterID);
            PhaseCenter.setAttribute("class", "PhaseCenterDiv");
            EachPhase.appendChild(PhaseCenter);
            PopulateInitializationPhase(AllPhases[i], PhaseCenter);
            MyBoundPhaseDiv.appendChild(EachPhase);
            ArrayOfPhaseDOMElements.push(EachPhase);//THis appends the phase DOM to the An array. The
        }
        //alert(DomForUIGeneration.innerHTML);
        var BindingProcessPromise = new WinJS.Promise(function (BindingFinish, BindingCancelled) {
            GoThoroughAllBindingPhases(AllPhases, ArrayOfPhaseDOMElements, 0, BindingFinish, BindingCancelled);
        })
        BindingProcessPromise.done(function FinishedBinding(ReturnedValue) { ShowUpperRightMessage("Finished Setting Up Account"); }, function IncompleteBinding() { ShowUpperRightMessage("Are you sure you want to quit?") })

        function GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction) {
            /*
                Name: Jerome Biotidara
                Description: This function actually is looped over to progress through the various phase options. It takes a the following parameters:
                PhaseArray: An array of Service Objects, 
                ArrayPhaseDOms: This is an array of DOM elements. The Dom Elements are the parent Doms for each phase
                PhaseIndex: THe current phase index;
                BindingProcessFinishFunction: This is the callback function to be called when the user is "Finishes" with progressing through all the phases;
                BindingProcessCancelFunction: This is the callback function to be called when the user "Cancels" or uses the Back button from the first phase;
            */
            var i = 0;
            if (PhaseIndex >= PhaseArray.length) {
                BindingProcessFinishFunction("Finished");
                return;
            }

            if (PhaseIndex < 0) {
                BindingProcessCancelFunction();
                return;
            }
            for (; i < ArrayOfPhaseDoms.length; i++)//hides all possible phaseDoms
            {
                $(ArrayOfPhaseDoms[i]).hide();
            }
            $(ArrayOfPhaseDoms[PhaseIndex]).show();//Displays/Unhides Only the pertinent phaseoOm
            var PhaseLaunchPromise = new WinJS.Promise(function (onSkipOrContinueClick, onCancelOrBackCLick, onProgress) {

                function ContinueFunction() {
                    onSkipOrContinueClick(1);
                }

                function SkipFunction() {
                    onSkipOrContinueClick(0);
                }

                function CancelFunction() {
                    onCancelOrBackCLick(0);
                }

                function BackFunction() {
                    onCancelOrBackCLick(1);
                }

                PopulateBottomSection(ArrayOfPhaseDoms[PhaseIndex], PhaseArray[PhaseIndex].Description, ContinueFunction, SkipFunction, CancelFunction, BackFunction);
            })
            PhaseLaunchPromise.done
            (
                function (SkipOrContinueFlag) {
                    if (SkipOrContinueFlag)//True means "continue" was selected
                    {
                        LoadPhaseServicesSignUp();
                    }
                    else {
                        PhaseIndex++;
                        GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction);
                    }

                    function LoadPhaseServicesSignUp() {
                        /*
                            *Name: Jerome Biotidara
                            *Description:This Handles the call to sign up for each phase selected
                        */

                        var SignUpPromise = new WinJS.Promise(function (DoneWithList, PossibleError) {
                            var i = 0;
                            var ArrayOfPhaseSelectedServices = new Array();
                            for (; i < PhaseArray[PhaseIndex].PhaseServices.length; i++) {
                                if (PhaseArray[PhaseIndex].PhaseServices[i].getSelectStatus()) {
                                    ArrayOfPhaseSelectedServices.push(PhaseArray[PhaseIndex].PhaseServices[i]);
                                }
                            }
                            function GoThroughSelectedElementList(CurrentIndex, SelectedPhaseServiceArray, DoneWithSelectedList) {
                                if (CurrentIndex >= SelectedPhaseServiceArray.length) {
                                    DoneWithSelectedList();
                                    return;
                                }

                                var LaunchSignUpPromise = new WinJS.Promise(function (GoToNextElementFunction, FailureToSignUp) {
                                    SelectedPhaseServiceArray[CurrentIndex].Authentify(GoToNextElementFunction, FailureToSignUp);
                                }
                                    )
                                LaunchSignUpPromise.done
                                (
                                    function (SuccessMessage) {
                                        ShowUpperRightMessage("Successfully Signed Up for " + SelectedPhaseServiceArray[CurrentIndex].Name);
                                        var MyIndex = CurrentIndex + 1;
                                        GoThroughSelectedElementList(MyIndex, SelectedPhaseServiceArray, DoneWithSelectedList);
                                    },
                                    function (FailureMEssage) {
                                        ShowUpperRightMessage("Failed To Add" + SelectedPhaseServiceArray[CurrentIndex].Name);
                                        //Check out link to get Confirmation Box "http://stackoverflow.com/questions/15866550/how-to-implement-a-confirm-dialog-in-winjs-and-return-the-users-choice"
                                        var MyIndex = CurrentIndex + 1;
                                        GoThroughSelectedElementList(MyIndex, SelectedPhaseServiceArray, DoneWithSelectedList);
                                    }
                                )

                            }
                            //YOU ALSO NEED TO WRITE A CALL TO GoThroughSelectedElementList
                            try { GoThroughSelectedElementList(0, ArrayOfPhaseSelectedServices, DoneWithList) }
                            catch (e) {
                                PossibleError(e);
                            }
                            //YOU STILL NEED TO IMPLEMENT THEN OF SignUpPromise
                        })
                        SignUpPromise.done(function () {
                            PhaseIndex++;
                            GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction);
                        },
                            function (e) {
                                ShowUpperRightMessage("CouldNotSign You up for any of your preceding services");
                                PhaseIndex++;
                                GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction);
                            }
                            )

                    }

                },
                function (CancelOrBackFlag) {
                    if (CancelOrBackFlag)//True means "Back" was selected
                    {
                        PhaseIndex--;
                        GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction);
                    }
                    else {
                        BindingProcessCancelFunction();
                    }
                }
            );

        }
    }

    function PopulateBottomSection(ParentDom, Description, ContinueFunction, SkipFunction, CancelFunction, backFunction) {
        /*
            Name: Jerome Biotidara
            Date: 6/12/2013
            Description: this populates the bottom DOM Div. THe bottom dom has two sections. The Left and right sections. Tleft section just has descriptions. The right section has the skip, cancel and continue button. These buttons and bound to the SkipFunction, CancelFunction and SkipFunction parameters respectively. It additionally has an explicit binding of the back button to the backFunction;
            Parameters:
                ParentDom: This is a DOM element for the current phase to which the Bottom will be plugged in as a child.
                Descrition: This is a string variable that just has a quick description of the currrent  Div. It will be used to populate the innerHTML of the bottom right
                ContinueFunction: This funciton is bound to the BottomRightRightTop DOM element Which is used to continue;
                SkipFunction: This funciton is bound to the BottomRightRightCenter DOM element Which is used to trigger the skip functionality;
                Cancel: This funciton is bound to the BottomRightRightBottom DOM element Which is used to trigger the Cancel functionality;
        */

        /*PhaseBottom DomElement Creation*/
        var idOfPhaseDiv = $(ParentDom).attr('id');
        var PhaseBottom = document.createElement("div");
        var PhaseBottomID = idOfPhaseDiv + "Bottom";
        PhaseBottom.setAttribute("id", PhaseBottomID);
        PhaseBottom.setAttribute("class", "PhaseBottomDiv");
        ParentDom.appendChild(PhaseBottom)
        var BottomDOM = PhaseBottom;

        var BottomRight = document.createElement("div");
        var BottomRightID = PhaseBottomID + "Right"
        BottomRight.setAttribute("id", BottomRightID);
        BottomRight.setAttribute("class", "PhaseBottomRight");

        var winBackbutton = document.getElementById("win-backbutton");
        $(winBackbutton).click(backFunction);

        var BottomLeft = document.createElement("div");
        var BottomLeftID = PhaseBottomID + "Left"
        BottomLeft.setAttribute("id", BottomLeftID);
        BottomLeft.setAttribute("class", "PhaseBottomLeft");
        BottomLeft.innerHTML = "Description:" + Description;

        BottomDOM.appendChild(BottomLeft)
        BottomDOM.appendChild(BottomRight)




        var BottomRightRight = document.createElement("div");
        var BottomRightRightID = BottomRightID + "Right"
        BottomRightRight.setAttribute("id", BottomRightRightID);
        BottomRightRight.setAttribute("class", "PhaseBottomRightRight");

        BottomRight.appendChild(BottomRightRight);

        //alert(BottomRight.innerHTML)




        var BottomRightRightTop = document.createElement("div");
        var BottomRightRightTopID = BottomRightRightID + "Top"
        BottomRightRightTop.setAttribute("id", BottomRightRightTopID);
        BottomRightRightTop.setAttribute("class", "PhaseBottomRightRightTop");
        BottomRightRightTop.innerHTML = "Continue"
        $(BottomRightRightTop).click(ContinueFunction);

        BottomRightRight.appendChild(BottomRightRightTop);



        var BottomRightRightCenter = document.createElement("div");
        var BottomRightRightCenterID = BottomRightRightID + "Center"
        BottomRightRightCenter.setAttribute("id", BottomRightRightCenterID);
        BottomRightRightCenter.setAttribute("class", "PhaseBottomRightRightCenter");
        BottomRightRightCenter.innerHTML = "Skip"
        $(BottomRightRightCenter).click(SkipFunction);
        BottomRightRight.appendChild(BottomRightRightCenter);


        var BottomRightRightBottom = document.createElement("div");
        var BottomRightRightBottomID = BottomRightRight + "Bottom"
        BottomRightRightBottom.setAttribute("id", BottomRightRightID);
        BottomRightRightBottom.setAttribute("class", "PhaseBottomRightRightBottom");
        $(BottomRightRightBottom).click(CancelFunction);
        BottomRightRightBottom.innerHTML = "Cancel"
        BottomRightRight.appendChild(BottomRightRightBottom);

    }

    function PopulateInitializationPhase(MyPhase, MyPhaseDom) {
        /*
            Name: Jerome Biotidara
            Description: This function creates a grid for a Phase entered. It also uses jquery to add function a toggle for the sub UI elemets.
        */
        var DivCounter = 0;
        var MiddleSectionDomObject = MyPhaseDom;

        var GridContentHolder = document.createElement("div");
        GridContentHolder.setAttribute("id", "GridHolder");
        //GridContentHolder.childNodes
        var i = 0;
        var TrimmedPhaseName = MyPhase.Name.replace(' ', '');
        var ListOfDivIds = new Array();
        var ListOfFunctions = new Array();
        for (; i < MyPhase.PhaseServices.length; i++) {
            var SubElementID = "";
            SubElementID = TrimmedPhaseName + (i).toString();
            ListOfDivIds.push(SubElementID);
            var MySubDom = document.createElement("div");
            MySubDom.setAttribute("id", SubElementID);
            MySubDom.setAttribute("class", "GridElement");
            MySubDom.innerHTML = MyPhase.PhaseServices[i].Name;
            var SubElementToggle = MyPhase.PhaseServices[i].ToggleSelection;
            var OnClickOfSubDiv = GenetateAFunction(SubElementID, SubElementToggle)
            $(MySubDom).click(OnClickOfSubDiv);
            GridContentHolder.appendChild(MySubDom);
        }

        MiddleSectionDomObject.appendChild(GridContentHolder);
        SetDomObjectLocationInTableFormat(GridContentHolder, 2, 20, 20, 10, 10, 1, 2);

    }

    function GenetateAFunction(SubElementID, SubElementToggle) {/*
        Name: Jerome Biotidara
        Date:6/11/2013
        Description: This function is responsible for generating the function for the variable OnClickOfSubDiv in PopulateInitializationPhase. I call it separately because of issues with scoping. 
        If I have the implementation in the PopulateInitializationPhase the scoping of SubElementID, SubElementToggle will default to the last selected created objects which is because of the scope and how variables are passed 
    */


        var GeneratedFunction = function () {
            $('#' + SubElementID).toggleClass("selectedGridElement");
            SubElementToggle();
        }

        return GeneratedFunction
    }

    function GetSupportedNewsServices() {

    }

    function GetSupportedEmailServices() {

    }

    function GetSupportedSocialNetworkServices() {

    }

    function GetSupportedDealsNetworkServices() {

    }

    function GetSupportedPhotoSharingServices() {

    }

    function InitializationPhase(name, phaseSupportedService, description, nextService, precedingService, PhaseIcon) {
        this.Name = name;
        this.PhaseServices = phaseSupportedService;
        this.Description = description;
        this.NextPhase = nextService;
        this.PreviousPhase = precedingService;
        this.Icon = PhaseIcon;
    }

    function Service(name, imageURL, authentication) {
        /*
            Name: Jerome Biotidara
            Description: THis is  responsible for building an object for each service. And Some of its display properties. It takes the names, Image URL and AuthenticationFunction as parameters
        */

        this.Name = name;
        this.Image = imageURL;
        var SelectedFlag = false;
        this.getSelectStatus = function () {
            return SelectedFlag;
        }
        this.ToggleSelection = function () {
            if (SelectedFlag) {
                SelectedFlag = false;
            }
            else {
                SelectedFlag = true;
            }
        }

        this.SetSelectionFlag = function (UpdatedSelectedFlag) {
            SelectedFlag = UpdatedSelectedFlag;
        }


        var Verified = false;
        this.UpdateVerify = function (status) {
            Verified = status;
        }
        //this.LoginCredentials = loginCredentials;
        var Authentication = new ServiceAuthentication(authentication);
        this.Authentify = function (SuccessFunction, FailureFunction) {
            var AuthentifyAccountPromise = new WinJS.Promise(function (AuthenticationSuccess, AuthenticationFail, VerificationProgress) {
                Authentication.Authentify(AuthenticationSuccess, AuthenticationFail);
                //AuthenticationSuccess();
            });
            AuthentifyAccountPromise.done(function (SuccessMessage) { SuccessFunction(SuccessMessage) }, function (FailureMessage) { FailureFunction(FailureMessage) });
        }
    }

    function ServiceAuthentication(authentificationFunction) {
        /*
         *Name: Jerome Biotidara
         *Description: THis class is responsibility is  essentially for encapsulating the possible error of communicating with a social network. 
         *It takes the function which directly handles the XmlHTTPRequest, as a parameter. 
         *It is not responsible for the entry of passwords or any thing of that  nature.*
         *It only makes a call to the function that launches the UI for Login. The call to the xmlhttprequest function is embedded in a promise.
        */
        var Authentication = authentificationFunction;
        if (typeof (Authentification) == undefined) {
            ShowUpperRightMessage("Sorry No Authentication Function");
        }
        else {
            this.Authentication = authentificationFunction;
        }
        this.Authentify = function (SuccessFunction, FailureFunction) {
            this.AuthentifyAccountPromise = new WinJS.Promise(function (VerificationSuccess, VerificationFail, VerificationProgress) {
                Authentication(VerificationSuccess, VerificationFail);
            })
            this.AuthentifyAccountPromise.done(
                function (SuccessMessage) { SuccessFunction(SuccessMessage) }, function (FailureMessage) { FailureFunction(FailureMessage) });
        }

    }

    function SetDomObjectLocationInTableFormat(ArrayOfTreeOfDoms, ViewableDomObjectPerLine, PercentageVerticalForSpace, PercentageHorizontalForSpace, SpaceForTopAndLowerBorder, SpaceForLeftAndRightBorder, RowsPerFullScreen, DomObjectPerLine, FunctionForEachDivElement) {

        ArrayOfTreeOfDoms.style.width = "100%";
        ArrayOfTreeOfDoms.style.height = "100%";
        if (typeof (DomObjectPerLine) == "undefined") {
            DomObjectPerLine = ViewableDomObjectPerLine;
        }
        if (DomObjectPerLine < ViewableDomObjectPerLine) {
            ShowUpperRightMessage("Error in ResetDomObjectLocationInTableFormat!\nInvalid values for DomObjectPerLine and ViewableDomObjectPerLine. \nDomObjectPerLine less than ViewableDomObjectPerLine");
            return;
        }
        var x = 0;
        for (; x < ArrayOfTreeOfDoms.childNodes.length; x++) {
            ArrayOfTreeOfDoms.childNodes[x].style.left = 0;
            ArrayOfTreeOfDoms.childNodes[x].style.top = 0;
        }
        var TopMargin = (SpaceForTopAndLowerBorder / 2)
        var LeftMargin = (SpaceForLeftAndRightBorder / 2)
        var NumberOfRows = Math.round(((ArrayOfTreeOfDoms.childNodes.length) / ViewableDomObjectPerLine))
        var SpaceBetweenRows = ((PercentageVerticalForSpace - SpaceForTopAndLowerBorder) / (NumberOfRows - 1));
        if (NumberOfRows == 1) {
            SpaceBetweenRows = 0;
        }
        var SpaceBetweenColumns = ((PercentageHorizontalForSpace - SpaceForLeftAndRightBorder) / (ViewableDomObjectPerLine - 1));
        if (ViewableDomObjectPerLine == 1) {
            SpaceBetweenColumns = SpaceForLeftAndRightBorder / 2;
        }
        if (DomObjectPerLine == 1) {
            SpaceBetweenColumns = 0;
        }

        var HeightPerDomObject = ((100 - PercentageVerticalForSpace) / RowsPerFullScreen)

        //alert("height is " +HeightPerDomObject +" Space is "+ SpaceBetweenRows)

        var WidthPerDomObject = ((100 - PercentageHorizontalForSpace) / ViewableDomObjectPerLine)

        x = 0;
        for (; x < ArrayOfTreeOfDoms.childNodes.length; x++) {
            ArrayOfTreeOfDoms.childNodes[x].style.width = WidthPerDomObject + "%"
            ArrayOfTreeOfDoms.childNodes[x].style.height = HeightPerDomObject + "%"
        }
        var CurrentIndex = 0
        var VerticalCounter = 0
        var CurrentTopMargin = 0
        for (; VerticalCounter < NumberOfRows; VerticalCounter++) {
            CurrentTopMargin = TopMargin + ((HeightPerDomObject + SpaceBetweenRows) * VerticalCounter)
            //alert(NumberOfRows)
            var HorizontalCounter = 0
            var CurrentLeftMargin = 0
            //DomObjectPerLine
            for (; (HorizontalCounter < DomObjectPerLine) && (CurrentIndex < ArrayOfTreeOfDoms.childNodes.length) ; HorizontalCounter++) {
                CurrentLeftMargin = LeftMargin + ((WidthPerDomObject + SpaceBetweenColumns) * HorizontalCounter)
                ArrayOfTreeOfDoms.childNodes[CurrentIndex].style.left = CurrentLeftMargin + "%"
                ArrayOfTreeOfDoms.childNodes[CurrentIndex].style.top = CurrentTopMargin + "%"
                CurrentIndex++;
            }

        }
    }

    function PopulateIntelSourceAccountUsingTwitter(comp, err)
    { }

    function PopulateIntelSourceAccountUsingFacebook(comp, err)
    { }

    function PopulateIntelSourceAccountUsingGoogle(comp, err)
    { }

    function PopulateIntelSourceAccountUsingWindowsLive(comp, err) {
        WL.init({
            scope: ["wl.signin", "wl.basic"]
        });
        WL.logout();//Will be deleted, just used to force log out of current user
        WL.login().then(
            function (response) {
                if (response.status == 'connected') {
                    getMircosoftUserId_InitialSetup(LoopBackFunction);
                    ShowUpperRightMessage("Successfully Logged In");
                    comp(userid)
                }
                else {
                    ShowUpperRightMessage("having connection issues");
                }
            },
            function (responseFailed) {
                //alert("failed paralized" + responseFailed.toString());
                //alert(comp);
                comp(11)
                //err(null)
            });


    }

    function UpdateScreen(Data) {
        /*
            *Name: Jerome Biotidara
            *Date: 6/6/2013
            *Description:   This uses the passed argument "Data" to Update The Screen of the User. If the data has no valid data(like say user cancels initial setup) it goes on to launch the default screen with just weather and BING
        */

        ValidatedAccountLaunch();
    }

    var getMircosoftUserId_InitialSetup = function (SetupIntelSourceNetworkBind) {
        WL.api({
            path: "me",
            method: "GET"
        }).then(
            function (response) {
                userId = response.id;
                SetupIntelSourceNetworkBind(userId);
                getLocation();
            },
            function (responseFailed) {
                SetupIntelSourceNetworkBind(null);
                loginFailed(responseFailed.error);
            }
        );
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
