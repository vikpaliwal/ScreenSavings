/// <reference group="Dedicated Worker" />
"use strict";

var ForceNonBoundedDashServicesOnIntel = true;
function getBoundSocialNetworkData(comp, err, IntelAccountID)
{
    /*
        *Name: Jerome Biotidara
        *Date: 6/6/2013
        *Description:   This tries to retrieve the social accounts bound to an intel account. If it cannot find an account it switches over to an interface to select social Network bimds
    */

    
    
    var getCurrentlyBoundAccounts = function ()
    {
        var getCurrentlyBoundSocialAccountsPromise = new WinJS.Promise
        (
            function (SuccessInRetrievingAmbiguousDataFromIntelServersFunction, FailureInRetrievingAmbiguousDataFromIntelServersFunction, RetrievingAmbiguousDataFromIntelServersInProgress)
            {
                /*
                    Name: Jerome Biotidara
                    Plan: This section will have php scripts that go directly to Intel servers and downloads all currently bound dash service data;
                */
                SuccessInRetrievingAmbiguousDataFromIntelServersFunction("");
            }
        )
        getCurrentlyBoundSocialAccountsPromise.done
        (
            function SuccessfullyGainedAccessToIntelServers(DataRetrieved)
            {
                if (isBoundedSocialNetworks(DataRetrieved))
                {
                    comp(DataRetrieved)
                }
                else
                {
                    var title="No Accounts Found :("
                    var content = "Dash Could Not Find Any Bound Accounts\n Do you Want to Setup an Account?"
                    var result, resultOptions = ["Yes", "No"];
                    var cmd;
                    var messageDialog = new Windows.UI.Popups.MessageDialog(content, title);
                    for (var i = 0; i < resultOptions.length; i++)
                    {
                        cmd = new Windows.UI.Popups.UICommand();
                        cmd.label = resultOptions[i];
                        cmd.invoked = function (c)
                        {
                            result = c.label;
                        }
                        messageDialog.commands.append(cmd);
                    }
                    
                    
                    messageDialog.showAsync().then
                    (
                        function SettingUpNewAccounts(command)
                        {
                            ShowUpperRightMessage(command.id, 10);
                            if (result == "Yes")
                            {
                                BindSocialNetworksWithIntelUserAccount(getCurrentlyBoundAccounts);
                            }
                            else
                            {
                                err()
                            }

                        }
                    )
                }
            },
            function FailedToGetAccesToIntelServers(ErrorConnectingToDataBae)
            {
                err();
            }
        )
    }

    getCurrentlyBoundAccounts();

    function BindSocialNetworksWithIntelUserAccount(CallBackFunctionAfterSignUp)
    {
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
        var AllPhaseCopy = new DuplicateObject(AllPhases);
        var MiddleContentDiv = document.getElementById("MiddleContent")
        var GenerateUIForPhasePromise = new WinJS.Promise
        (
            function (SuccessfulDashServiceBind, FailedDashServiceBind)
            {
                GenerateUIForPhases(AllPhases, MiddleContentDiv, SuccessfulDashServiceBind, FailedDashServiceBind);
            }
        )
        GenerateUIForPhasePromise.done
        (
            function FinishedInitialSetup() {
                CallBackFunctionAfterSignUp();
            },

            function CancelledInitalSetup() {
                ReverseAllPossibleChanges(AllPhaseCopy);
            }
        );
        function ReverseAllPossibleChanges(InitialPhaseArray)
        {
            /*
            Name: Jerome Biotidara
            Description: function Tries to Reverse any changes made if use selected to cancel the Initial Setup. It reverts to whatever the inital setting is suppose to be.
            */
        }

        function DuplicateObject(source)
        {
            /*function explicitly tries to duplicate a given object*/
            var i = 0;
            for (i in source) {
                if (typeof source[i] == 'source') {
                    this[i] = new DuplicateObject(source[i]);
                }
                else {
                    this[i] = source[i];
                }
            }
        }

    }

    function isBoundedSocialNetworks(BoundData)
    {
        /*
            Name: Jerome Biotidara
            Description: function Tries to check if there are any Bounded Social services.
        */
        var isThereData;

        if (ForceNonBoundedDashServicesOnIntel)
        {
            isThereData = false;
        }

        return isThereData;
    }

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

function GenerateUIForPhases(AllPhases, DomForUIGeneration, BindingSuccessFullLoopBackFunction, BindingCancelFullLoopBack) {
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
    BindingProcessPromise.done
        (
            function FinishedBinding(ReturnedValue)
            {
                ShowUpperRightMessage("Finished Setting Up Account"); BindingSuccessFullLoopBackFunction()
            },
            function IncompleteBinding()
            {
                ShowUpperRightMessage("Are you sure you want to quit?"); BindingCancelFullLoopBack();
            }
        )

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
