/// <reference group="Dedicated Worker" />
"use strict";
//Force Execution path flags**Start
var ForceNonBoundedDashServicesOnIntel = false;
var ForceRegistationSuccessuWithIntelServers = true;
//Force Execution path flags**End
(function () {
    if (typeof Object.prototype.uniqueId == "undefined") {
        var id = 0;
        Object.prototype.uniqueId = function () {
            if (typeof this.__uniqueid == "undefined") {
                this.__uniqueid = ++id;
            }
            return this.__uniqueid;
        };
    }
})();

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
                var LatterURLString = "/jerome/RetrieveBoundAccounts.php?UserServiceID=" + IntelAccountID.AccountID + "&DashGeneratedID=" + IntelAccountID.CacheId;
                var fullUrlString = BASE_URL_TEST + LatterURLString;
                WinJS.xhr({ url: fullUrlString }).done
                (
                    function SuccessfulConnection(DataRetrieved)
                    {
                        var DataRetrievedJsonUpdated = JSON.parse(DataRetrieved.responseText);
                        SuccessInRetrievingAmbiguousDataFromIntelServersFunction(DataRetrievedJsonUpdated)
                    },
                    function FailedConnection(ConnectionError)
                    {
                        FailureInRetrievingAmbiguousDataFromIntelServersFunction(ConnectionError);
                    }
                );
            }
        )
        getCurrentlyBoundSocialAccountsPromise.done
        (
            function SuccessfullyGainedAccessToIntelServers(DataRetrieved)
            {
                comp(DataRetrieved);
               
            },
            function FailedToGetAccesToIntelServers(ErrorConnectingToDataBae)
            {
                err();
            }
        )
    }

    getCurrentlyBoundAccounts();

    

    /*function InitialAccountBinding(SuccessfulDashServiceBind, FailedDashServiceBind)
    {

        
    }*/

}



function InitializationPhase(name, phaseSupportedService, description, nextService, precedingService, PhaseIcon) {
    this.Name = name;
    this.PhaseServices = phaseSupportedService;
    this.Description = description;
    this.NextPhase = nextService;
    this.PreviousPhase = precedingService;
    this.Icon = PhaseIcon;
    this.ClearAllUISelectedServices = function ()
    {
        var i = 0;
        for (; i < phaseSupportedService.length;i++)
        {
            phaseSupportedService[i].SetSelectionFlag(false);
        }
    }
}

function Service(name, imageURL, authentication, RegisterWithIntel)
{
        /*
            Name: Jerome Biotidara
            Description: THis is  responsible for building an object for each service. And Some of its display properties. It takes the names, Image URL and AuthenticationFunction as parameters.
                name: refers to the name of the service been registered, it'll be shown in the population of the DOM in 
                imageUrl: a string type url used in the generating the image of the DOM for service bounding process
                authentication: a function object to be called to grant Dash access to client data. Usually the passed function returns an access token which will be stored on intel servers.
                RegisterWithIntel: a function object to be called to register the access token with intel servers. It takes whatever access token received from authentication process;
        */

        this.Name = name;
        this.Image = imageURL;
        var AuthenticationData = null;
        var SelectedFlag = false;
        var RegisterServiceAccountWithIntelServer = RegisterWithIntel;
        var DashServersUpdated = false;
        this.isRegisteredWithDashServers = function ()
        {
            return DashServersUpdated;
        }
        this.getSelectStatus = function ()
        {
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

        this.SetSelectionFlag = function (UpdatedSelectedFlag)
        {
            SelectedFlag = UpdatedSelectedFlag;
        }


        this.RegisterServiceAccountWithDashServers = function (RegistrationSuccess, RegistrationFailure)
        {
            /*
                Name: Jerome Biotidara
                Description: Function Registers retrieved account directly with Dash Servers
            */
            if (typeof (RegisterServiceAccountWithIntelServer) == undefined)//checks if there is a RegisterServiceAccountWithIntelServer function
            {
                if (ForceRegistationSuccessuWithIntelServers)
                {
                    DashServersUpdated = true;
                    RegistrationSuccess();
                }
                else {
                    RegistrationFailure("undefined Function To Register with Dash Servers")
                }
            }
            else
            {
                if (ForceRegistationSuccessuWithIntelServers) {
                    DashServersUpdated = true;
                    RegistrationSuccess();
                }
                else
                {
                    var RegistrationWithIntelPromise = new WinJS.Promise
                    (
                        function (RegistrationSuccess, RegistrationFailure)
                        {
                            RegisterServiceAccountWithIntelServer(Data, RegistrationSuccess, RegistrationFailure);
                        }
                    )
                    RegistrationWithIntelPromise.done
                    (
                        function DashServersUpdatedSuccessfully()
                        {
                            DashServersUpdated = true;
                            RegistrationSuccess();
                        },
                        function DashServersFailedToUpdate(Err)
                        {
                            RegistrationFailure(Err);
                        }
                    )
                }
            }

        }

        var Verified = false;
        this.getVerifiedStatus=function()
        {
            return Verified;
        }

        
        this.UpdateVerify = function (status) {
            Verified = status;
            if (Verified)//If an account is verified then it will be selected
            {
                SelectedFlag = Verified;
            }
        }
        //this.LoginCredentials = loginCredentials;
        var Authentication = new ServiceAuthentication(authentication);
        this.Authentify = function (SuccessFunction, FailureFunction) {
            var AuthentifyAccountPromise = new WinJS.Promise(function (AuthenticationSuccess, AuthenticationFail, VerificationProgress) {
                Authentication.Authentify(AuthenticationSuccess, AuthenticationFail);
                //AuthenticationSuccess();
            });
            AuthentifyAccountPromise.done
                (
                    function (SuccessMessage)
                    {
                        AuthenticationData = SuccessMessage;
                        SuccessFunction(SuccessMessage);
                    },
                    function (FailureMessage)
                    {
                        FailureFunction(FailureMessage)
                    }
                );
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
        if (ArrayOfTreeOfDoms.childNodes.length < DomObjectPerLine)
        {
            RowsPerFullScreen = 1;
        }
        if (typeof (DomObjectPerLine) == "undefined") {
            DomObjectPerLine = ViewableDomObjectPerLine;
        }
        if (DomObjectPerLine < ViewableDomObjectPerLine)
        {
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
            var OnClickOfSubDiv = GenetateAFunction(SubElementID, SubElementToggle);
            if (MyPhase.PhaseServices[i].getVerifiedStatus())
            {
                document.getElementById(SubElementID).setAttribute("class", "selectedGridElement");
                SubElementToggle();
            }
            $(MySubDom).click(OnClickOfSubDiv);
            GridContentHolder.appendChild(MySubDom);
        }

        MiddleSectionDomObject.appendChild(GridContentHolder);
        SetDomObjectLocationInTableFormat(GridContentHolder, 2, 20, 20, 10, 10, 1, 2);

    }


    //var ContinueCouter = 0;
    function PopulateBottomSection(ParentDom, MyPhase, ContinueFunction, SkipFunction, CancelFunction, backFunction) {
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
        
        var winBackbutton = document.getElementById("win-backbutton");
        var idOfPhaseDiv = $(ParentDom).attr('id');
        var PhaseBottomID = idOfPhaseDiv + "Bottom";
        var BottomLeftID = PhaseBottomID + "Left"
        var BottomRightID = PhaseBottomID + "Right"
        var BottomRightRightID = BottomRightID + "Right"
        var BottomRightRightTopID = BottomRightRightID + "Top"
        var BottomRightRightCenterID = BottomRightRightID + "Center"
        var BottomRightRightBottomID = BottomRightRightID + "Bottom"
        $(winBackbutton).click(backFunction);
        var PhaseBottom;
        var BottomDOM;
        var BottomRight;
        var BottomLeft;
        var BottomRightRight;
        var BottomRightRightTop;
        var BottomRightRightCenter;
        var BottomRightRightBottom;
        var CurrentBottomDiv = getAllChildNodesWithClassName("PhaseBottomDiv", ParentDom);//This gets all DOMS with the class Name
        var haha=null;//THis is just used to identify unique function declaraitons
        if (CurrentBottomDiv.length > 0)//This checks if the BottomDIV has already been created and then removes it. THis is only called when you hit cancel button or back button into a phase
        {
            CurrentBottomDiv[0].removeNode(true);//removes the node and then we repopulate after if section
        }
        
        PhaseBottom = document.createElement("div");
        
        PhaseBottom.setAttribute("id", PhaseBottomID);
        PhaseBottom.setAttribute("class", "PhaseBottomDiv");
        ParentDom.appendChild(PhaseBottom)
        BottomDOM = PhaseBottom;

        BottomRight = document.createElement("div");
        BottomRight.setAttribute("id", BottomRightID);
        BottomRight.setAttribute("class", "PhaseBottomRight");


        BottomLeft = document.createElement("div");
        BottomLeft.setAttribute("id", BottomLeftID);
        BottomLeft.setAttribute("class", "PhaseBottomLeft");
        BottomLeft.innerHTML = "Description:" + MyPhase.Description;
        BottomDOM.appendChild(BottomLeft)
        BottomDOM.appendChild(BottomRight)




        BottomRightRight = document.createElement("div");
        BottomRightRight.setAttribute("id", BottomRightRightID);
        BottomRightRight.setAttribute("class", "PhaseBottomRightRight");
        BottomRight.appendChild(BottomRightRight);

        //alert(BottomRight.innerHTML)




        BottomRightRightTop = document.createElement("div");
        BottomRightRightTop.setAttribute("id", BottomRightRightTopID);
        BottomRightRightTop.setAttribute("class", "PhaseBottomRightRightTop");
        BottomRightRightTop.innerHTML = "Continue"// + ContinueCouter;
        //BottomRightRightTop.style.visibility = "hidden";
        $(BottomRightRightTop).on("click", ContinueFunction);
        BottomRightRight.appendChild(BottomRightRightTop);
        $(BottomRightRightTop).hide();
        var i = 0;
        for (; i < MyPhase.PhaseServices.length; i++)
        {
            if (MyPhase.PhaseServices[i].getSelectStatus())
            {
                $(BottomRightRightTop).show();
            }
        }
        /*if (PhaseService.getSelectStatus()) {
            $(BottomRightRightTop).show();
        }*/



        BottomRightRightCenter = document.createElement("div");
        BottomRightRightCenter.setAttribute("id", BottomRightRightCenterID);
        BottomRightRightCenter.setAttribute("class", "PhaseBottomRightRightCenter");
        BottomRightRightCenter.innerHTML = "Skip"
        $(BottomRightRightCenter).on("click",SkipFunction);
        BottomRightRight.appendChild(BottomRightRightCenter);


        BottomRightRightBottom = document.createElement("div");
        
        BottomRightRightBottom.setAttribute("id", BottomRightRightID);
        BottomRightRightBottom.setAttribute("class", "PhaseBottomRightRightBottom");
        haha = CancelFunction.uniqueId();
        $(BottomRightRightBottom).on("click",CancelFunction);
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
            $(EachPhase).click(GenerateFunctionForPhaseClick(EachPhase, AllPhases[i].PhaseServices));
            MyBoundPhaseDiv.appendChild(EachPhase);
            ArrayOfPhaseDOMElements.push(EachPhase);//THis appends the phase DOM to the An array. The
        }

        function GenerateFunctionForPhaseClick(PhaseDom, PhaseServices)
        {

            function CheckForClickedSubELements()
            
            {setTimeout(function(){
                var i = 0;
                var notes = getAllChildNodesWithClassName("PhaseBottomRightRightTop",PhaseDom);//This is a terrible hack that works based on the structure of the page
                for (; i < PhaseServices.length; i++)
                {
                    if (PhaseServices[i].getSelectStatus())
                    {
                        //notes.style.visibility = "visible";
                        $(notes[0]).show();
                        /*notes.style.width = "200px";
                        notes.style.height = "80px";
                        notes.style.visibility = "visible";*/
                        //alert(notes.innerHTML);
                        return;

                    }
                }
                $(notes[0]).hide();
                //$(notes).hide();
            }, 100)
            }


            return CheckForClickedSubELements;
        }


        function TriggerServiceBinding(PhaseStartingIndex, ArrayOfPhases,PhaseDomElementsArray,EncasingDomElement,FinishServiceBindingLoopBackFunction,CancelServiceBindingLoopBackFunction)
        {
            /*
                Name: Jerome Biotdara
                Description: This function is called when you want to trigger the UI o
            */
            var BindingProcessPromise = new WinJS.Promise(function (BindingFinish, BindingCancelled) {
                var haha=BindingCancelled.uniqueId();
                GoThoroughAllBindingPhases(ArrayOfPhases, PhaseDomElementsArray, PhaseStartingIndex, BindingFinish, BindingCancelled);
                
            })
            BindingProcessPromise.done
                (
                    function AfterGoingThroughAllPhasesUI(AllPhasesData)
                    {
                        /*
                            Name: Jerome Bitidara
                            Description: This is called agter the user goes through all the phases options or user selects "done"
                        */
                        var FinalizePhasesPromise = new WinJS.Promise
                            (
                                function (Success, Failuremprogress)
                                {
                                    
                                    FinalizePhases(AllPhasesData, EncasingDomElement, Success, Failuremprogress);
                                }
                            )

                        FinalizePhasesPromise.done
                            (
                                function (PhasesFinalized)
                                {
                                    //EncasingDomElement = document.getElementById('FirstDiv');
                                    while (EncasingDomElement.childNodes.length>0)
                                    {
                                        EncasingDomElement.childNodes[0].removeNode(true);
                                    }
                                    DisplayFinishUI(PhasesFinalized, EncasingDomElement);
                                    //FinishServiceBindingLoopBackFunction(AllPhasesData);
                                },
                                function ErrorInFinalizing()
                                {

                                }


                            );

                        
                    },  
                    function IncompleteBinding(PhaseArrayIndexBeforeCancel)
                    {
                        //alert("Are you sure you want to quit?");
                        var title = "Hmmm....!!!"
                        var content = "Do you really want to exit the service SignUp Page?"
                        var result, resultOptions = ["Yes", "No"];
                        var cmd;
                        var messageDialog = new Windows.UI.Popups.MessageDialog(content, title);
                        for (var i = 0; i < resultOptions.length; i++) {
                            cmd = new Windows.UI.Popups.UICommand();
                            cmd.label = resultOptions[i];
                            cmd.invoked = function (c) {
                                result = c.label;
                            }
                            messageDialog.commands.append(cmd);
                        }


                        messageDialog.showAsync().done
                        (
                            function SettingUpNewAccounts(command)
                            {
                                ShowUpperRightMessage(command.id, 10);
                                if (result == "Yes")
                                {
                                    CancelServiceBindingLoopBackFunction();
                                }
                                else
                                {
                                    TriggerServiceBinding(PhaseArrayIndexBeforeCancel, ArrayOfPhases, PhaseDomElementsArray,EncasingDomElement,FinishServiceBindingLoopBackFunction,CancelServiceBindingLoopBackFunction);
                                }

                            }
                        )

                    }
                )

            function DisplayFinishUI(PhaseData, EncasingDOMElement)
            {
                /*
                    Name: Jerome Biotidara
                    Description: THis function generates the FinishUI with the finish button and currently Registered Services;
                */
                var i = 0;
                var PhaseswithRegisteredServices = new Array();
                var j =0;
                for (; i < PhaseData.length; i++)
                {
                    j = 0;
                    for (; j < PhaseData[i].PhaseServices.length; j++)
                    {
                        var RegisteredFlag= PhaseData[i].PhaseServices[j].isRegisteredWithDashServers()
                        if (RegisteredFlag)
                        {
                            PhaseswithRegisteredServices.push(PhaseData[i]);
                            break;
                        }
                    }
                }
                
                i = 0;
                var PhaseArrayEncasingDom = document.createElement("div");
                PhaseArrayEncasingDom.setAttribute("class", "RegisteredPhaseElemt")
                for (; i < PhaseswithRegisteredServices.length;i++)
                {
                    var EachRegisteredServiceDivElement = document.createElement("div");
                    EachRegisteredServiceDivElement.setAttribute("class", "EachRegisteredServiceCaseElement")
                    EachRegisteredServiceDivElement.appendChild(generateGridForPhaseWithRegisteredService(PhaseswithRegisteredServices[i]));
                    PhaseArrayEncasingDom.appendChild(EachRegisteredServiceDivElement);
                }
                $(PhaseArrayEncasingDom).css("overflow", "Auto")
                SetDomObjectLocationInTableFormat(PhaseArrayEncasingDom, 2, 5, 20, 5, 10, 1, PhaseswithRegisteredServices.length);

                function generateGridForPhaseWithRegisteredService(MyPhase)
                {
                    var ArrayOfRegisteredServices = new Array();
                    var i=0;
                    for (; i < MyPhase.PhaseServices.length;i++)
                    {
                        if (MyPhase.PhaseServices[i].DashServersUpdated)
                        {
                            ArrayOfRegisteredServices.push(MyPhase.PhaseServices[i])
                        }
                    }

                    var FinishPhaseEncasingDom = document.createElement("div");
                    FinishPhaseEncasingDom.setAttribute("class", "FinishPhaseCase");
                    i=0;
                    for (; i < ArrayOfRegisteredServices.length;i++)
                    {
                        var MySelectedServicegDom = document.createElement("div");
                        MySelectedServicegDom.setAttribute("class", "SelectedPhaseServiceElement");
                        FinishPhaseEncasingDom.appendChild(MySelectedServicegDom);
                    }
                    SetDomObjectLocationInTableFormat(FinishPhaseEncasingDom, 2, 10, 10, 5, 5, 4, 3);
                    //MyEncasingDom.appendChild(FinishPhaseEncasingDom);
                    return FinishPhaseEncasingDom;
                }

            }

            function FinalizePhases(AllPhases, EncasingDom,FinalCompletionLoopBackSuccess,FinalCompletionLoopBackFailure)
            {
                /*
                    Name: Jerome Biotidara
                    Description:
                */
                var i=0;
                var j = 0;
                //Toss this whole for-loop into WinJS.promise and count each phase return before validating the bound services to avoid the call before services are added
                for (; i < AllPhases.length; i++)
                {
                    j=0;
                    for (; i < AllPhases[i].PhaseServices.length;i++)
                    {
                        var MyServiceRegistrationPromise = new WinJS.Promise(function (SuccessInRegistering,FailureInRegistering)
                        {
                            AllPhases[i].PhaseServices[j].RegisterServiceAccountWithDashServers(SuccessInRegistering,FailureInRegistering)//this can cause possible issues with multiple records being updated
                            
                        })
                        MyServiceRegistrationPromise.done
                        (
                            function ()
                            {
                                return;
                            },
                            function ()
                            {
                                ShowUpperRightMessage("Issues In Registering "+AllPhases[i].PhaseServices[j].Name)
                            }
                        )

                    }
                }
                FinalCompletionLoopBackSuccess(AllPhases);

            }
            
        }

        TriggerServiceBinding(0, AllPhases, ArrayOfPhaseDOMElements, MyBoundPhaseDiv, BindingSuccessFullLoopBackFunction, BindingCancelFullLoopBack);
        //Toss this whole section into a function to enable loop back call*
    }
    
    function checkAllBoundedServices(PhasesArray)
    {

    }

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
            BindingProcessFinishFunction(PhaseArray);
            return;
        }

        if (PhaseIndex < 0) {
            BindingProcessCancelFunction(0);
            return;
        }
        for (; i < ArrayOfPhaseDoms.length; i++)//hides all possible phaseDoms
        {
            $(ArrayOfPhaseDoms[i]).hide();
        }
        $(ArrayOfPhaseDoms[PhaseIndex]).show();//Displays/Unhides Only the pertinent phaseoOm
        var PhaseLaunchPromise = new WinJS.Promise(function (onSkipOrContinueClick, onCancelOrBackCLick, onProgress) {

            var haha0 = onCancelOrBackCLick.uniqueId();
            function ContinueFunction() {
                onSkipOrContinueClick(1);
            }

            function SkipFunction() {
                onSkipOrContinueClick(0);
            }

            function CancelFunction() {
                var haha2 = onCancelOrBackCLick.uniqueId();
                onCancelOrBackCLick(0);
            }
            var haha1 = CancelFunction.uniqueId();

            function BackFunction() {
                onCancelOrBackCLick(1);
            }

            PopulateBottomSection(ArrayOfPhaseDoms[PhaseIndex], PhaseArray[PhaseIndex], ContinueFunction, SkipFunction, CancelFunction, BackFunction);
        })
        PhaseLaunchPromise.done
        (
            function (SkipOrContinueFlag) {
                if (SkipOrContinueFlag)//True means "continue" was selected false means skip was selected
                {
                    LoadPhaseServicesSignUp();
                }
                else {
                    resetSelectedPhaseUIAndServices(PhaseArray[PhaseIndex], ArrayOfPhaseDoms[PhaseIndex]);
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
                                    SelectedPhaseServiceArray[CurrentIndex].UpdateVerify(true);
                                    var MyIndex = CurrentIndex + 1;
                                    GoThroughSelectedElementList(MyIndex, SelectedPhaseServiceArray, DoneWithSelectedList);
                                },
                                function (FailureMEssage) {
                                    ShowUpperRightMessage("Failed To Add " + SelectedPhaseServiceArray[CurrentIndex].Name);
                                    //Check out link to get Confirmation Box "http://stackoverflow.com/questions/15866550/how-to-implement-a-confirm-dialog-in-winjs-and-return-the-users-choice"
                                    SelectedPhaseServiceArray[CurrentIndex].UpdateVerify(false);
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
                if (CancelOrBackFlag)//True means "Back" was selected false means cancel Was selected
                {
                    PhaseIndex--;
                    GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction);
                }
                else {
                    var haha = BindingProcessCancelFunction.uniqueId()
                    BindingProcessCancelFunction(PhaseIndex);
                }
            }
        );

    }

    function resetSelectedPhaseUIAndServices(MyPhase, MyPhaseDom)
    {
        
        ClearPhase(MyPhase);
        ResetPhaseGridUI(MyPhaseDom);
        function ClearPhase(passedPhase)
        {
            //resets all services in phase
            passedPhase.ClearAllUISelectedServices();
        }
        
        function ResetPhaseGridUI(PhaseDom)
        {
            //Resets the grid element
            var RemoveClassName = "selectedGridElement";
            var MyListOfDomsWithClassName = getAllChildNodesWithClassName("selectedGridElement", PhaseDom);
            var i = 0;
            for (; i < MyListOfDomsWithClassName.length; i++)
            {
                $(MyListOfDomsWithClassName[i]).removeClass(RemoveClassName);
            }
        }

    }
    function getAllChildNodesWithClassName(ClassName,DomElement)
    {
        var i = 0;
        var ArrayOfDomElements = new Array();
        var MySplitClassNames =new Array();
        if(DomElement.className!=undefined)
        {
            MySplitClassNames=DomElement.className.split(" ");
        }
        if (MySplitClassNames.indexOf(ClassName) > -1)
        {
            ArrayOfDomElements.push(DomElement);
        }

        var ReturnArray = new Array();
        for (; i < DomElement.childNodes.length; i++)
        {
            ReturnArray=ReturnArray.concat(getAllChildNodesWithClassName(ClassName, DomElement.childNodes[i]));
        }

        ArrayOfDomElements=ArrayOfDomElements.concat(ReturnArray);

        return ArrayOfDomElements;


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
