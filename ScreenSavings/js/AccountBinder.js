/// <reference group="Dedicated Worker" />
"use strict";
var LastTimeOfRequest = getTimeInString();
var Global_JusCounting = 0;

function getTimeInString()
{

    var LastUpdate = new Date();
    var DaysOfTheWeekArray = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
    var MonthsOfTheYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var WeekDay = DaysOfTheWeekArray[LastUpdate.getUTCDay()];
    var Year = LastUpdate.getUTCFullYear()
    var WeekDate = LastUpdate.getUTCDate()
    var Month = MonthsOfTheYear[LastUpdate.getUTCMonth()];
    var Hour = LastUpdate.getUTCHours()
    var Minute = LastUpdate.getUTCMinutes()
    var Second = LastUpdate.getUTCSeconds()

    var StringForTime = "" + WeekDay + ", " + WeekDate + " " + Month + " " + Year + " " + Hour + ":" + Minute + ":" + Second + " UTC"

    return StringForTime;
}

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
                WinJS.xhr({
                    url: fullUrlString, headers: {
                        "If-Modified-Since": LastTimeOfRequest
                    }
                }).done
                (
                    function SuccessfulConnection(DataRetrieved)
                    {   
                        var DataRetrievedJsonUpdated = JSON.parse(DataRetrieved.responseText);
                        LastTimeOfRequest = getTimeInString();
                        SuccessInRetrievingAmbiguousDataFromIntelServersFunction(DataRetrievedJsonUpdated)
                    },
                    function FailedConnection(ConnectionError)
                    {
                        LastTimeOfRequest = getTimeInString();
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


function HideWinBackButton()
{
    var WinBackButton = document.getElementById("win-backbutton");
    $(WinBackButton).hide();
}

function ShowWinBackButton(event)
{
    var WinBackButton = document.getElementById("win-backbutton");
    $(WinBackButton).show();
    if (event != undefined)
    {
        $(WinBackButton).off();
        $(WinBackButton).on("click", event);
    }

}

function EmptyDom(EncasingDomElement)
{
    while (EncasingDomElement.childNodes.length>0)
    {
        EncasingDomElement.childNodes[0].removeNode(true);
    }
}


function InitializationPhase(name, phaseSupportedService, description, nextService, precedingService, PhaseIcon) {
    name = name.toUpperCase();
    this.Name = name;
    this.PhaseCacheData = new CacheDataAccess().getPhase(name);
    this.PhaseServices = phaseSupportedService;
    phaseSupportedService.forEach(function (MyService)
    {
        MyService.InitializeServiceCacheData(name);
        MyService.setPhaseName(name);
    });
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

function Service(name, imageURL, authentication, RegisterWithIntel, CheckIfRegisteredWithDash,getDataFunction)
{
    /*
        Name: Jerome Biotidara
        Description: THis is  responsible for building an object for each service. And Some of its display properties. It takes the names, Image URL and AuthenticationFunction as parameters.
            name: refers to the name of the service been registered, it'll be shown in the population of the DOM in 
            imageUrl: a string type url used in the generating the image of the DOM for service bounding process
            authentication: a function object to be called to grant Dash access to client data. Usually the passed function returns an access token which will be stored on intel servers.
            RegisterWithIntel: a function object to be called to register the access token with intel servers. It takes whatever access token received from authentication process;
            CheckIfRegisteredWithDash: a function object to  be called when service needs rto verify if the current user is registered to the dell dash. The function will take one data parameter which is the JSOn object
    */

    this.Name = name;

    var CacheAccess = new CacheDataAccess();
    var ServicePhaseName = "";
    this.Image = imageURL;
    var AuthenticationData = new Object();
    this.AuthenticationData = AuthenticationData;
    var SelectedFlag = false;
    var RegisterServiceAccountWithIntelServer = RegisterWithIntel;
    var DashServersUpdated = false;
    this.isRegisteredWithDashServers = function ()
    {
        Verified = DashServersUpdated;
        SelectedFlag = Verified;
        return DashServersUpdated;
    }
    this.getSelectStatus = function ()
    {
        return SelectedFlag;
    }
    //this.getServiceCacheData = function () { return ServiceCacheData;};
    this.setPhaseName = setPhaseName;
    this.getPhaseName = getPhaseName;
    
    function getPhaseName()
    {
        return ServicePhaseName;
    }
    function setPhaseName(PhaseName)
    {
        ServicePhaseName = PhaseName;
    }

    var ServiceCacheData;

    this.UpdateRegisteredStatus = UpdateRegisteredStatus;
    function UpdateRegisteredStatus(status)
    {
        DashServersUpdated = status;
        //Verified = DashServersUpdated;
        //SelectedFlag = Verified;
    }
        
    this.ToggleSelection = ToggleSelection
    function ToggleSelection(MyDomElementID)
    {
        if (SelectedFlag)
        {
            $('#' + MyDomElementID).removeClass("selectedGridElement");
            Verified = false;
            SelectedFlag = false;
            ClearUILineOfunregisteredElements(Global_PhaseEnumerator[ServicePhaseName.toUpperCase()], name.toLowerCase());//removes all entry from UI
        }
        else
        {
            var SelectServicePromise = new WinJS.Promise
            (
                function (SuccessInSelection, FailureInSelection)
                {
                    try
                    {
                        Authentify(SuccessInSelection, FailureInSelection);
                    }
                    catch (e)
                    {
                        ShowUpperRightMessage("Sorry "+ name +" is currently in accessible. Please try again Later.")
                        FailureInSelection();
                    }
                }
            )
            SelectServicePromise.done
            (
                function AuthenticationSuccess()
                {
                    SelectedFlag = true;
                    Verified = SelectedFlag
                    $('#' + MyDomElementID).addClass("selectedGridElement");
                },
                function AuthenticationFail()
                {
                    SelectedFlag = false;
                    Verified = false;
                    DashServersUpdated = false;
                    $('#' + MyDomElementID).removeClass("selectedGridElement");
                }
            )
        }
    }

    this.SetSelectionFlag = function (UpdatedSelectedFlag)
    {
        SelectedFlag = UpdatedSelectedFlag;
    }

    function RegisterServiceAccountWithDashServers(RegistrationSuccess, RegistrationFailure)
    {
        /*
            Name: Jerome Biotidara
            Description: Function Registers retrieved account directly with Dash Servers
        */
        Global_JusCounting++;
        /*if (!Verified)
        {
            RegistrationFailure("Not Selected");
            return;
        }*/
        
        if (!RegisterServiceAccountWithIntelServer)//checks if there is a RegisterServiceAccountWithIntelServer function
        {
            if (ForceRegistationSuccessuWithIntelServers)
            {
                DashServersUpdated = true;
                Verified = true;
                SelectedFlag = true;
                RegistrationSuccess();
            }
            else
            {
                DashServersUpdated = false;
                Verified = false;
                SelectedFlag = false;
                RegistrationFailure("undefined Function To Register with Dash Servers");
            }
        }
        else
        {
            if (ForceRegistationSuccessuWithIntelServers)
            {
                DashServersUpdated = true;
                Verified = true;
                SelectedFlag = true;
                RegistrationSuccess();
            }
            else
            {
                var RegistrationWithIntelPromise = new WinJS.Promise
                (
                    function (RegistrationSuccess, RegistrationFailure)
                    {
                        if (!Verified)
                        {
                            CacheAccess.ClearService(ServicePhaseName, name.replace(" ", "").toUpperCase());//clears the entry in the cache memory
                            AuthenticationData.clearEntry = true;
                        }
                        RegisterServiceAccountWithIntelServer(AuthenticationData, RegistrationSuccess, RegistrationFailure);
                    }
                )
                RegistrationWithIntelPromise.done
                (
                    function DashServersUpdatedSuccessfully()
                    {
                        DashServersUpdated = !((!AuthenticationData) || (AuthenticationData.clearEntry));
                        Verified = DashServersUpdated;
                        SelectedFlag = DashServersUpdated;
                        RegistrationSuccess();
                    },
                    function DashServersFailedToUpdate(Err)
                    {
                        DashServersUpdated = false;
                        Verified = false;
                        SelectedFlag = false;
                        CacheAccess.ClearService(ServicePhaseName,name.replace(" ","").toUpperCase());//clears the entry in the cache memory
                        RegistrationFailure(Err);
                    }
                )
            }
        }

    }
    this.RegisterServiceAccountWithDashServers = RegisterServiceAccountWithDashServers;

    var Verified = false;
    this.getVerifiedStatus=function()
    {
        return Verified;
    }
    this.UpdateVerify = UpdateVerify
    function UpdateVerify(status) {
        Verified = status;
        if (Verified)//If an account is verified then it will be selected
        {
            SelectedFlag = Verified;
        }
    }

    var Authentication = new ServiceAuthentication(authentication);
    function Authentify(SuccessFunction, FailureFunction)
    {
        var AuthentifyAccountPromise = new WinJS.Promise(function (AuthenticationSuccess, AuthenticationFail, VerificationProgress)
        {
            try
            {
                Authentication.Authentify(AuthenticationSuccess, AuthenticationFail);
            }
            catch (e)
            {
                ShowUpperRightMessage("Sorry " + name + " is currently in accessible. Please try again Later.");
                AuthenticationFail();
            }
            //AuthenticationSuccess();
        });
        AuthentifyAccountPromise.done
        (
            function (SuccessMessage) {
            try
            {
                AuthenticationData = SuccessMessage;
                if (AuthenticationData.isValid())
                {
                    SuccessFunction(SuccessMessage);
                    UpdateVerify(true);
                }
                else
                {
                    AuthenticationData = false;
                    FailureFunction(SuccessMessage);
                    UpdateVerify(false);
                }
            }
            catch(e)
            {
                ShowUpperRightMessage("Sorry " + name + " is currently in accessible. Please try again Later.");
                AuthenticationData = false;
                FailureFunction(e);
                UpdateVerify(false);
            }
                
                
            },
            function (FailureMessage)
            {
                FailureFunction(FailureMessage)
                Verified = false;
                AuthenticationData = false;
            }
        );
    }
    this.Authentify = Authentify

    this.InitializeServiceCacheData = InitializeServiceCacheData;

    function InitializeServiceCacheData(PhaseName)
    {
        //ServiceCacheData = new CacheDataAccess().getService(PhaseName, name.replace(" ",""));
        ServiceCacheData=CacheAccess.getService(PhaseName, name.replace(" ", ""));
    }

    this.refreshServiceData = function (ServiceType)
    {
        if (refreshData.pause)
        {
            return;
        }
        if (typeof(getDataFunction)==="function")
        {
            var RefreshDataPromise = new WinJS.Promise
            (function (RefreshDataSuccess, RefreshFailure, RefreshProgress)
                {
                try
                {getDataFunction(userId, ServiceCacheData.LatterIdentifyingValue, RefreshDataSuccess, RefreshFailure);}
                catch (e)
                {
                    getDataFunction(userId, 0, RefreshDataSuccess, RefreshFailure);
                }
                }
            )
            RefreshDataPromise.done
            (
                function UpdatedDataSuccess(Data)
                {

                    var dataChanges = UpdateRefreshedService(Data,ServicePhaseName,name,ServiceCacheData);
                    if(dataChanges.Data.length>0)
                    {
                        new CacheDataAccess().UpdateCacheFile();
                    }
                    return;
                },
                function FailedToUpdateData(Data)
                {
                    ShowUpperRightMessage(name + " Failed to update");
                }
                ,
                function UpdatingService()
                {
                    ShowUpperRightMessage("Updating "+name+"...");
                }
            )            
        }
        else
        {
            return;
        }
    }

    this.checkIfRegistered = function (MyData)
    {
        if (typeof (CheckIfRegisteredWithDash) == "undefined")
        {
            ShowUpperRightMessage("Can't check " + name + " registration with Dash");
            return DashServersUpdated; 
        }
        else
        {
            AuthenticationData = CheckIfRegisteredWithDash(MyData);//The function generates the DataAccess object which has the tokens and/or veerifier and/or secrets. The function call could also return a false if there is no registered value
            if (AuthenticationData)
            {
                DashServersUpdated = true;
                return
            }
            DashServersUpdated = false;
            ;
        }
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
    else
    {
        this.Authentication = authentificationFunction;
    }
    this.Authentify = function (SuccessFunction, FailureFunction) {
        this.AuthentifyAccountPromise = new WinJS.Promise(function (VerificationSuccess, VerificationFail, VerificationProgress) {
            Authentication(VerificationSuccess, VerificationFail);
        })
        this.AuthentifyAccountPromise.done
        (
            function (SuccessMessage)
            {
                SuccessFunction(SuccessMessage)
            },
            function (FailureMessage)
            {
                FailureFunction(FailureMessage)
            }
        );
    }

}

function SetDomObjectLocationInTableFormat(ArrayOfTreeOfDoms, ViewableDomObjectPerLine, PercentageVerticalForSpace, PercentageHorizontalForSpace, SpaceForTopAndLowerBorder, SpaceForLeftAndRightBorder, RowsPerFullScreen, DomObjectPerLine, FunctionForEachDivElement) {

    ArrayOfTreeOfDoms.style.width = "100%";
    ArrayOfTreeOfDoms.style.height = "100%";
    if (ArrayOfTreeOfDoms.childNodes.length <= DomObjectPerLine)
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
//            $('#' + SubElementID).toggleClass("selectedGridElement");
        SubElementToggle(SubElementID);
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
        MySubDom.setAttribute("class", "GridElement gridhide");
        MySubDom.innerHTML = "<br>" + "<br>" +  MyPhase.PhaseServices[i].Name;
        var SubElementToggle = MyPhase.PhaseServices[i].ToggleSelection;
        var OnClickOfSubDiv = GenetateAFunction(SubElementID, SubElementToggle);
        if (MyPhase.PhaseServices[i].getVerifiedStatus() || MyPhase.PhaseServices[i].isRegisteredWithDashServers())
        {
            $(MySubDom).addClass("selectedGridElement");
            //SubElementToggle();
        }
        $(MySubDom).click(OnClickOfSubDiv);
        GridContentHolder.appendChild(MySubDom);
    }

    MiddleSectionDomObject.appendChild(GridContentHolder);
    SetDomObjectLocationInTableFormat(GridContentHolder, 2, 20, 20, 10, 10, 1, 2);

}

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
    BottomRightRightTop.innerHTML = "Next"// + ContinueCouter;
    //BottomRightRightTop.style.visibility = "hidden";
    $(BottomRightRightTop).on("click", ContinueFunction);
    BottomRightRight.appendChild(BottomRightRightTop);
    //$(BottomRightRightTop).hide();
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
    BottomRightRightCenter.innerHTML = "Done"
    $(BottomRightRightCenter).on("click",SkipFunction);
    BottomRightRight.appendChild(BottomRightRightCenter);


    BottomRightRightBottom = document.createElement("div");
        
    BottomRightRightBottom.setAttribute("id", BottomRightRightID);
    BottomRightRightBottom.setAttribute("class", "PhaseBottomRightRightBottom");
        
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
    EmptyDom(DomForUIGeneration);
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
    for (; i < AllPhases.length; i++)
    {
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

        PhaseTop.innerHTML = " <br>" + AllPhases[i].Name + " Section...";
            
        /*PhaseCenter DomElement Creation*/
        PhaseCenter = document.createElement("div");
        PhaseCenterID = idOfPhaseDiv + "Center";
        PhaseCenter.setAttribute("id", PhaseCenterID);
        PhaseCenter.setAttribute("class", "PhaseCenterDiv");
        EachPhase.appendChild(PhaseCenter);
        PopulateInitializationPhase(AllPhases[i], PhaseCenter);
        //$(EachPhase).click(GenerateFunctionForPhaseClick(EachPhase, AllPhases[i].PhaseServices));//function binds the click event to a function that gets the "continue" box for it to get display...this can be deprecated
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
                                var justChecking = AllPhasesData[0].PhaseServices[1].getVerifiedStatus();

                                FinalizePhases(AllPhasesData, EncasingDomElement, Success, Failuremprogress);
                            }
                        )

                    FinalizePhasesPromise.done
                        (
                            function (PhasesFinalized)
                            {
                                //EncasingDomElement = document.getElementById('FirstDiv');
                                
                                FinishServiceBindingLoopBackFunction(AllPhasesData);
                                
                                /*EmptyDom(EncasingDomElement);
                                var FinishTextDomElement = document.createElement("div");
                                FinishTextDomElement.setAttribute("class", "FinishPhaseTextDomElement");
                                FinishTextDomElement.innerHTML = "Finished the Dash setup these are your currently registered services";
                                var DisplayRegisteredPhaseDomElement = document.createElement("div");
                                DisplayRegisteredPhaseDomElement.setAttribute("class", "DisplayRegisteredCasDiv");
                                EncasingDomElement.appendChild(FinishTextDomElement);
                                EncasingDomElement.appendChild(DisplayRegisteredPhaseDomElement);
                                var FinishButtonDomElement = document.createElement("button");
                                FinishButtonDomElement.setAttribute("Name", "FinishButton");
                                FinishButtonDomElement.innerHTML = "Finish"
                                $(FinishButtonDomElement).on("click", onFinishButtonClick);
                                EncasingDomElement.appendChild(FinishButtonDomElement);
                                DisplayFinishUI(PhasesFinalized, DisplayRegisteredPhaseDomElement);

                                function onFinishButtonClick()
                                {
                                    FinishServiceBindingLoopBackFunction(AllPhasesData);
                                }*/
                                    
                            },
                            function ErrorInFinalizing(error)
                            {
                                error;
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
            //$(PhaseArrayEncasingDom).css("overflow", "Auto");
            SetDomObjectLocationInTableFormat(PhaseArrayEncasingDom, 2, 5, 20, 5, 10, 2, PhaseswithRegisteredServices.length);
            EncasingDOMElement.appendChild(PhaseArrayEncasingDom);
            function generateGridForPhaseWithRegisteredService(MyPhase)
            {
                var ArrayOfRegisteredServices = new Array();
                var i=0;
                for (; i < MyPhase.PhaseServices.length;i++)
                {
                    if (MyPhase.PhaseServices[i].isRegisteredWithDashServers())
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
                    MySelectedServicegDom.innerHTML = ArrayOfRegisteredServices[i].Name;
                    FinishPhaseEncasingDom.appendChild(MySelectedServicegDom);
                }
                SetDomObjectLocationInTableFormat(FinishPhaseEncasingDom, 2, 10, 10, 5, 5, 4, 2);

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
            var justChecking = AllPhases[0].PhaseServices[1].getVerifiedStatus();
            var FlagsForRegistrationUpdate = new Array(AllPhases.length)
            for (; i < AllPhases.length; i++)
            {
                FlagsForRegistrationUpdate[i] = new Array(AllPhases[i].PhaseServices.length);
            }

            i=0
            //Toss this whole for-loop into WinJS.promise and count each phase return before validating the bound services to avoid the call before services are added
            for (; i < AllPhases.length; i++)
            {
                FlagsForRegistrationUpdate[i] = new Array(AllPhases[i].PhaseServices.length);
                j=0;
                for (; j < AllPhases[i].PhaseServices.length;j++)
                {
                        
                        var MyServiceRegistrationPromise = new WinJS.Promise(function (SuccessInRegistering, FailureInRegistering)
                        {
                            AllPhases[i].PhaseServices[j].RegisterServiceAccountWithDashServers(SuccessInRegistering,FailureInRegistering)//this can cause possible issues with multiple records being updated
                            
                        }
                        )
                        MyServiceRegistrationPromise.done
                        (
                        Success(i, j),
                        Failure(i, j)
                        )
                        

                }
            }
                
            function Success(a,b)
            {
                return (function () { document.getElementById("TopRight").innerHTML += Global_JusCounting; RegistrationCounterUpdate(a, b);})
            }

            function Failure(a, b)
            {
                return (function () { document.getElementById("TopRight").innerHTML += Global_JusCounting; RegistrationCounterUpdate(a, b); })
            }

            function RegistrationCounterUpdate(PhaseIndex,ServiceIndex)
            {
                FlagsForRegistrationUpdate[PhaseIndex][ServiceIndex] = true;
                var i = 0;
                var j = 0;
                var NotFinishedRegisteringAllPhases = true;
                for (; i < FlagsForRegistrationUpdate.length; i++)
                {
                    j = 0;
                    for (; j < FlagsForRegistrationUpdate[i].length; j++)
                    {
                        if (!FlagsForRegistrationUpdate[i][j])
                        {
                            NotFinishedRegisteringAllPhases = true;
                            break;
                        }
                        NotFinishedRegisteringAllPhases = false;
                    }
                    if (NotFinishedRegisteringAllPhases)
                    {
                        break;
                    }
                }

                if (!NotFinishedRegisteringAllPhases)
                {
                    FinalCompletionLoopBackSuccess(AllPhases);
                }
            }

                

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

        PopulateBottomSection(ArrayOfPhaseDoms[PhaseIndex], PhaseArray[PhaseIndex], ContinueFunction, SkipFunction, CancelFunction, BackFunction);
    })
    PhaseLaunchPromise.done
    (
        function (SkipOrContinueFlag) {
            if (SkipOrContinueFlag)//True means "continue" was selected false means skip was selected
            {
                PhaseIndex++;
                GoThoroughAllBindingPhases(PhaseArray, ArrayOfPhaseDoms, PhaseIndex, BindingProcessFinishFunction, BindingProcessCancelFunction);
                //LoadPhaseServicesSignUp();
            }
            else
            {
                //resetSelectedPhaseUIAndServices(PhaseArray[PhaseIndex], ArrayOfPhaseDoms[PhaseIndex]);
                PhaseIndex = PhaseArray.length;
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
            else
            {
                    
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

//RegisteredWithXXX funcitons below are parameters to be used in Service object. They take retrieved bounded data from databse as parameters. If their respective associated BoundedData values null values the service isnt registered.  e.g the google news bounded data has Boundeddata.GoogleNews. a null value for this means the service is disabled.
function RegisteredWithFacebook(MyData)
{
    try{
    if (MyData.FacebookToken != null)
    {
        return new FacebookAccess(MyData.FacebookToken, MyData.FacebookId);
    }

    return false;
}
    catch (e)
{
    return false;
}


}

function RegisteredWithGroupon(MyData)
{
    try{
    if (MyData.GrouponId != null)
    {
        return new GrouponDataAccess(new Locationdata(MyData.GrouponId.Latitude, MyData.GrouponId.Longitude));
            //TwitterAccess(MyData.TwitterToken, MyData.TwitterVerifier);
    }

    return false;
}
    catch (e)
{
    return false;
}
}

function RegisteredWithTwitter(MyData)
{
    try{
    if ((MyData.TwitterToken != null) || (MyData.TwitterVerifier != null))
    {
        return new TwitterAccess(MyData.TwitterToken, MyData.TwitterVerifier);
    }

    return false;
}
    catch (e)
{
    return false;
}
}

function RegisteredWithFlickr(MyData)
{
    try{
    if ((MyData.FlickrToken != null) || (MyData.FlickrVerifier != null))
    {
        return new FlickrAccess(MyData.FlickrToken, MyData.FlickrVerifier);;
    }
    
    return false;
}
    catch (e)
{
    return false;
}
}

function RegisteredWithGmail(MyData)
{
    try
    {
        if ((MyData.GmailToken != null) || (MyData.GmailVerifier != null))
        {
            return new GoogleAccess(MyData.GmailToken, MyData.GmailVerifier);
        }

        return false
    }
    catch (e)
    {
        return false;
    }
}

function RegisteredWithGoogleNews(MyData)
{
    try{
        if ((MyData.GoogleNews != null) && (MyData != null) && (MyData.GoogleNews != "0"))
        {
            var myObj=new GoogleNewsDataAccess(MyData.GoogleNews == true);
            return myObj.isValid();
        }

            return false
        }
    catch (e)
    {
        return false;
    }
}


function UpdateRefreshedService(Data,PhaseName,ServiceName,ServiceCacheData)
{    
    ServiceName = ServiceName.replace(" ","").toUpperCase();
    var MyUpdatedService = ValidateUpdatedDataForCache(Data, PhaseName, ServiceName, ServiceCacheData);
    if (MyUpdatedService.Changes.length<=0)
    {
        //ShowUpperRightMessage("No new data from " + ServiceName);
    }

    Global_CacheData.Profile.Phases[PhaseName][ServiceName] = MyUpdatedService.Data;
    return {Data:MyUpdatedService.Changes};

}

function ValidateUpdatedDataForCache(Data,PhaseName,ServiceName, CurrentlyCachedData) {
    /*
        Name: Jerome Biotidara
        Description: Function takes a Data object received from refreshed data from dash serevers. It possibly calls a sub function which determines how it'll be further formated. Function returns a JSON object. 
    */
    /*var TypeOfService = null
    if (Data.length > 0) {
        TypeOfService = Data[0].TypeOfPhase.toUpperCase();
    }
    else {
        return { Data: CurrentlyCachedData, Changes: new Array() };
    }*/
    switch (PhaseName.toUpperCase()) {
        case "NEWS":
            {
                var UpdatedData = ValidateNewsForCache(Data, ServiceName, CurrentlyCachedData);
                CurrentlyCachedData = UpdatedData.Data;
                var i = 0;
                for (i = 0; i < UpdatedData.Changes.length; i++)//For pushes each updated card to the UI
                {
                    pushNewDataCard("NEWS", UpdatedData.Changes[i]);
                    
                }
                return { Data: CurrentlyCachedData, Changes: UpdatedData.Changes };
            }
            break;
        case "SOCIAL":
            {
                var UpdatedData = ValidateSocialForCache(Data, ServiceName, CurrentlyCachedData);
                CurrentlyCachedData = UpdatedData.Data;
                var i = 0;
                for (i = 0; i < UpdatedData.Changes.length; i++)//For pushes each updated card to the UI
                {
                    pushNewDataCard("SOCIAL", UpdatedData.Changes[i]);
                }
                return { Data: CurrentlyCachedData, Changes: UpdatedData.Changes };
            }
            break;
        case "MAIL":
            {
                var UpdatedData = ValidateMailForCache(Data, ServiceName, CurrentlyCachedData);
                CurrentlyCachedData = UpdatedData.Data;
                var i = 0;
                for (i = 0; i < UpdatedData.Changes.length; i++)//For pushes each updated card to the UI
                {
                    pushNewDataCard("MAIL", UpdatedData.Changes[i]);
                }
                return { Data: CurrentlyCachedData, Changes: UpdatedData.Changes };
            }
            break;
        case "PHOTOS":
            {
                var UpdatedData = ValidatePhotosForCache(Data, ServiceName, CurrentlyCachedData);
                CurrentlyCachedData = UpdatedData.Data;
                var i = 0;
                for (i = 0; i < UpdatedData.Changes.length; i++)//For pushes each updated card to the UI
                {
                    pushNewDataCard("PHOTOS", UpdatedData.Changes[i]);
                }
                return { Data: CurrentlyCachedData, Changes: UpdatedData.Changes };
            }
            break;
        case "DEALS":
            {
                var UpdatedData = ValidateDealsForCache(Data, ServiceName, CurrentlyCachedData);
                CurrentlyCachedData = UpdatedData.Data;
                var i = 0;
                for (i = 0; i < UpdatedData.Changes.length; i++)//For pushes each updated card to the UI
                {
                    pushNewDataCard("DEALS", UpdatedData.Changes[i]);
                }
                return { Data: CurrentlyCachedData, Changes: UpdatedData.Changes };
            }
            break;
        default:
            {
                ShowUpperRightMessage("Cannot Format Service for " + TypeOfService);
            }
    }
}

//News Cache
function News(Title,TitleImgURI,NewsPostTime,NewsData, NewsURL)
{
    //Title = { Load: Title };
    TitleImgURI = { Load: TitleImgURI };
    News.prototype.Title = Title;
    News.prototype.TitleImageURI = TitleImgURI;
    News.prototype.PostTime = new Date(NewsPostTime);
    News.prototype.Data = NewsData;
    News.prototype.DataURI = NewsURL;
    News.prototype.TypeOfPhase = "News";
    var ServiceID = { ID: null }
    News.prototype.ServiceID = ServiceID;
    News.prototype.setServiceID = function (passedServiceID)
    { ServiceID = passedServiceID };
    
    //News.prototype.CacheDatAccess = new CacheDataAccess();
    News.prototype.isNewsNew=function (OlderData)
    {
        if (PostTime > OlderData.LatestTime)
        {
            return true;
        }
        return false;
    }
}

function GoogleNews(Title, TitleImgURI, NewsPostTime, NewsData, NewsURL, NewsScrubbedSource)
{
    News.call(this, Title, TitleImgURI, NewsPostTime, NewsData, NewsURL);
    TitleImgURI = this.TitleImageURI;
    var NewsPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));//this gets the prototype of the parent object
    var NewsProperties = Object.getOwnPropertyNames(NewsPrototype);//this gets the properties of parent object
    var i = 0;
    for (; i < NewsProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, NewsProperties[i], { value: this[NewsProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }
    var ServiceID = this.ServiceID;
    this.getotherDownloadabledata = function ()
    {
        /*WinJS.xhr({ url: TitleImgURI.Load, headers: { "Content-Type": "image/jpeg" } }).done
        (
            function SuccessfulAccessToRemoteResource(result)
            {
                var NameOfFile = "DloadCache" + ServiceID.ID+".jpg";
                var MyDownloadedData = result.response;
                Windows.Storage.KnownFolders.documentsLibrary.createFileAsync(NameOfFile, Windows.Storage.CreationCollisionOption.replaceExisting).done
                (
                    function CreatedFileSuccessfully(FileIO)
                    {
                        Windows.Storage.FileIO.writeTextAsync(FileIO, MyDownloadedData).then
                        (
                            function WriteToFileSuccess()
                            {
                                //TitleImgURI.Load = NameOfFile;
                            },
                            function WriteToFileFailure()
                            {
                                ShowUpperRightMessage("failed To create quick Cache for " + NameOfFile);
                            }
                        )

                    },
                    function CreatedFileFailure(error)
                    {
                        ShowUpperRightMessage("failed To create quick Cache for " + NameOfFile);
                    }
                    
                )
            },
            function failedAccessToRemoteResource()
            {
                ShowUpperRightMessage("Remote cacheable data inaccessible ");
            }
        )*/
    }
    this.toDisplayArray = function ()
    {
        var newCard = new Array(12);
        newCard[4] = "google news";
        newCard[5] = this.PostTime;//time when news was poste
        newCard[6] = this.TitleImageURI.Load;
        newCard[7] = this.Title;
        newCard[8] = this.Data;
        newCard[9] = this.PostTime;//just time without date
        newCard[10] = this.DataURI;
        newCard[11] = this.ScrubbedSource;
        return newCard;
    }
    this.ScrubbedSource = NewsScrubbedSource;
    this.NameOfService = "GoogleNews";
    
}
GoogleNews.prototype = new News;

function SunNews(Title, TitleImgURI, NewsPostTime, NewsData, NewsURL)
{
    var NewsPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));//this gets the prototype of the parent object
    var NewsProperties = Object.getOwnPropertyNames(NewsPrototype);//this gets the properties of parent object
    var i = 0;
    for (; i < NewsProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, NewsProperties[i], { value: this[NewsProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }

    this.NameOfService = "SunNews";
}
SunNews.prototype = new News;

function ValidateNewsForCache(Data, Servicename, AllNews) {
    var UpdatedData = new Array();
    Servicename = Servicename.replace(" ", "");
    Servicename = Servicename.toUpperCase();

    var LatterElements = new Array();
    var FormerElements = new Array();
    var ArrayOfNewArticlesWithinCachedTimeRange = new Array()
    var ArrayOfNewArticlesOutsideCachedTimeRange = new Array();
    switch (Servicename) {
        case "GOOGLENEWS":
            {
                //var GoogleNewsData = new Array();
                //Data.sort(function (a, b) { return a[5] - b[5] });
                Data.sort(function (a, b) { return a.PostTime - b.PostTime });

                /*Data.forEach(function (MyData) {
                    GoogleNewsData.push(new GoogleNews(MyData[7],MyData[6],MyData[5],MyData[8],MyData[10],MyData[11]));
                });*/
                //Data = GoogleNewsData;

                var cachedGoogleNews = AllNews;
                var i = 0;
                var j = 0;
                for (i = 0; i < Data.length; i++) {
                    if (Data.length == 2) {
                        i;
                    }
                    for (j = 0; j < cachedGoogleNews.Data.length; j++) {
                        if (cachedGoogleNews.Data[j].DataURI == Data[i].DataURI) {
                            Data.splice(i, 1);
                            --i
                            break;
                        }
                    }
                }
                if (Data.length == 1) {
                    i;
                }


                var LatterDateTime = new Date(cachedGoogleNews.LatterIdentifyingValue);
                var FormerDateTime = new Date(cachedGoogleNews.FormerIdentifyingValue);
                i = 0;
                for (; i < Data.length; i++) {
                    if (isWithinDateTimeRange(FormerDateTime, LatterDateTime, Data[i].PostTime)) {
                        ArrayOfNewArticlesWithinCachedTimeRange.push(Data[i]);
                    }
                    else {
                        ArrayOfNewArticlesOutsideCachedTimeRange.push(Data[i]);
                    }
                }
                UpdatedData = ArrayOfNewArticlesOutsideCachedTimeRange.concat(ArrayOfNewArticlesWithinCachedTimeRange)
                cachedGoogleNews.Data = cachedGoogleNews.Data.concat(UpdatedData);
                cachedGoogleNews.Data.sort(function (a, b) { return a.PostTime - b.PostTime })
                cachedGoogleNews.FormerIdentifyingValue = cachedGoogleNews.Data[0].PostTime;
                cachedGoogleNews.LatterIdentifyingValue = cachedGoogleNews.Data.last().PostTime;
                var updatedDataFormattedasArray = new Array();

                UpdatedData.forEach(function (MyGoogleData) {
                    MyGoogleData.ServiceID.ID = new CacheDataAccess().getServiceObjectIndex();
                    updatedDataFormattedasArray.push(MyGoogleData.toDisplayArray());

                    if (isFunction(MyGoogleData.getotherDownloadabledata)) {
                        MyGoogleData.getotherDownloadabledata();
                    }
                    /*
                    News.prototype.Title = Title;
                    News.prototype.TitleImageURI = TitleImgURI;
                    News.prototype.PostTime = new Date(NewsPostTime);
                    News.prototype.Data = NewsData;
                    News.prototype.DataURI = NewsURL;
                    News.prototype.TypeOfPhase = "News";*/
                });
                return { Data: AllNews, Changes: updatedDataFormattedasArray };
                //AllNews.UpdateCache();
            }
            break;
        case "SUNNEWS":
            {

            }
            break;
    }
}
//Social Cache
function SocialPost(User,PostData,PostTime)
{
    SocialPost.prototype.User = User;
    SocialPost.prototype.Data = PostData;
    SocialPost.prototype.PostTime = PostTime;
    var ServiceID = { ID: null }
    SocialPost.prototype.ServiceID = ServiceID;
}

function FacebookPost(PosterName,Text,PostTime,Link,PosterID)
{
    SocialPost.call(this, PosterName, Text, PostTime);
    var SocialPostPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));//this gets the prototype of the parent object
    var SocialPostProperties = Object.getOwnPropertyNames(SocialPostPrototype);//this gets the properties of parent object
    var i = 0;
    for (; i < SocialPostProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, SocialPostProperties[i], { value: this[SocialPostProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }

    this.toDisplayArray = function ()
    {
        var newCard = new Array(11);
        newCard[4] = "facebook";
        newCard[5] = new Date(this.PostTime);//time when Posts was poste
        newCard[6] = this.User;
        newCard[7] = this.Data;
        newCard[8] = this.DataURI;
        newCard[9] = this.PosterID;//just time without date
        newCard[10] = new Date(this.PostTime);
        return newCard;
    }
    this.DataURI = Link;
    this.PosterID = PosterID;
    this.NameOfService = "FACEBOOK";
}

FacebookPost.prototype = new SocialPost;

function TwitterPost(User, PostData, PostTime,Photo)
{
    SocialPost.call(this, User, PostData, PostTime);
    var SocialPostPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));//this gets the prototype of the parent object
    var SocialPostProperties = Object.getOwnPropertyNames(SocialPostPrototype);//this gets the properties of parent object
    var i = 0;
    for (; i < SocialPostProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, SocialPostProperties[i], { value: this[SocialPostProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }
    this.toDisplayArray = function () {
        var newCard = new Array(10);
        newCard[4] = "twitter";
        newCard[5] = new Date(this.PostTime);//time when Posts was poste
        newCard[6] = this.User;
        newCard[7] = this.Data;
        newCard[8] = this.Photo;
        newCard[9] = new Date(this.PostTime);
        return newCard;
    }

    this.Photo = Photo;
    this.NameOfService = "TWITTER";
}
TwitterPost.prototype = new SocialPost;

function ValidateSocialForCache(Data, Servicename, AllPosts)
{
    var UpdatedData = new Array();
    Servicename = Servicename.replace(" ", "");
    Servicename = Servicename.toUpperCase();

    var LatterElements = new Array();
    var FormerElements = new Array();
    var ArrayOfNewSocialPostsWithinCachedTimeRange = new Array()
    var ArrayOfNewSocialPostsOutsideCachedTimeRange = new Array();
    switch (Servicename) {
        case "FACEBOOK":
            {
                Data.sort(function (a, b) { return a.PostTime - b.PostTime });
                var cachedFacebookPost = AllPosts;
                var LatterDateTime = new Date(cachedFacebookPost.LatterIdentifyingValue);
                var FormerDateTime = new Date(cachedFacebookPost.FormerIdentifyingValue);
                var i = 0;
                for (; i < Data.length; i++)
                {
                    if ((new Date(Data[i].PostTime)>LatterDateTime)||(new Date(Data[i].PostTime)<FormerDateTime))
                    {
                        ArrayOfNewSocialPostsOutsideCachedTimeRange.push(Data[i]);
                    }

                }
                UpdatedData = ArrayOfNewSocialPostsOutsideCachedTimeRange.concat(ArrayOfNewSocialPostsWithinCachedTimeRange)
                cachedFacebookPost.Data = cachedFacebookPost.Data.concat(UpdatedData);
                cachedFacebookPost.Data.sort(function (a, b) { return a.PostTime - b.PostTime })
                cachedFacebookPost.FormerIdentifyingValue = cachedFacebookPost.Data[0].PostTime;
                cachedFacebookPost.LatterIdentifyingValue = cachedFacebookPost.Data.last().PostTime;
                var updatedDataFormattedasArray = new Array();

                UpdatedData.forEach(function (MyFacebookData)
                {
                    MyFacebookData.ServiceID.ID = new CacheDataAccess().getServiceObjectIndex();
                    updatedDataFormattedasArray.push(MyFacebookData.toDisplayArray());
                });
                return { Data: AllPosts, Changes: updatedDataFormattedasArray };
                //AllPosts.UpdateCache();
            }
            break;
        case "TWITTER":
            {
                //var TwitterPostData = new Array();
                //Data.sort(function (a, b) { return a[5] - b[5] });
                /*Data.forEach(function (MyData) {
                    TwitterPostData.push(
                        new TwitterPost(MyData[6],MyData[7],MyData[5],MyData[8])
                        );
                });*/
                //Data = TwitterPostData;
                Data.sort(function (a, b) { return a.PostTime - b.PostTime });
                var cachedTwitterPost = AllPosts;
                var LatterDateTime = new Date(cachedTwitterPost.LatterIdentifyingValue);
                var FormerDateTime = new Date(cachedTwitterPost.FormerIdentifyingValue);
                var i = 0;
                for (; i < Data.length; i++) {
                    if ((new Date(Data[i].PostTime) > LatterDateTime) || (new Date(Data[i].PostTime) < FormerDateTime)) {
                        ArrayOfNewSocialPostsOutsideCachedTimeRange.push(Data[i]);
                    }

                }
                UpdatedData = ArrayOfNewSocialPostsOutsideCachedTimeRange.concat(ArrayOfNewSocialPostsWithinCachedTimeRange)
                cachedTwitterPost.Data = cachedTwitterPost.Data.concat(UpdatedData);
                cachedTwitterPost.Data.sort(function (a, b) { return a.PostTime - b.PostTime })
                cachedTwitterPost.FormerIdentifyingValue = cachedTwitterPost.Data[0].PostTime;
                cachedTwitterPost.LatterIdentifyingValue = cachedTwitterPost.Data.last().PostTime;
                var updatedDataFormattedasArray = new Array();

                UpdatedData.forEach(function (MyTwitterData)
                {
                    
                    MyTwitterData.ServiceID.ID = new CacheDataAccess().getServiceObjectIndex();
                    updatedDataFormattedasArray.push(MyTwitterData.toDisplayArray());
                });
                return { Data: AllPosts, Changes: updatedDataFormattedasArray };
                //AllPosts.UpdateCache();
            }
            break;
    }


}

//Mail Cache
function Mail(From, To, Subject, Time, EmailContext)
{
    Mail.prototype.From = From;
    Mail.prototype.To = To;
    Mail.prototype.Subject = Subject;
    Mail.prototype.PostTime = Time;
    Mail.prototype.EmailContext = EmailContext;
    var ServiceID = { ID: null }
    Mail.prototype.ServiceID = ServiceID;
    Mail.prototype.setServiceID = function (passedServiceID)
    { ServiceID = passedServiceID };
}

function GoogleMail(From, To, Subject, Time, EmailContext,TruncatedText)
{
    Mail.call(this, From, To, Subject, Time, EmailContext);
    var MailPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));//this gets the prototype of the parent object
    var MailProperties = Object.getOwnPropertyNames(MailPrototype);//this gets the properties of parent object
    var i = 0;
    for (; i < MailProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, MailProperties[i], { value: this[MailProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }
    
    this.TruncatedText = TruncatedText;
    this.toDisplayArray = function () {
        var newCard = new Array(11);
        newCard[4] = "gmail";
        newCard[5] = new Date(this.PostTime);
        newCard[6] = this.From;
        newCard[7] = this.Subject;
        newCard[8] = this.EmailContext;
        newCard[9] = this.To;
        newCard[10] = this.TruncatedText;
        return newCard;
    }
}
GoogleMail.prototype = new Mail;

function yahooMail(From, To, Subject, Time, EmailContext)
{
    Mail.prototype.Mail = From;
    Mail.prototype.To = To;
    Mail.prototype.Subject = Subject;
    Mail.prototype.PostTime = Time;
}
yahooMail.prototype = new Mail;

function ValidateMailForCache(Data, Servicename, AllMail) {
    var UpdatedData = new Array();
    Servicename = Servicename.replace(" ", "");
    Servicename = Servicename.toUpperCase();

    var LatterElements = new Array();
    var FormerElements = new Array();
    var ArrayOfNewArticlesWithinCachedTimeRange = new Array()
    var ArrayOfNewArticlesOutsideCachedTimeRange = new Array();
    switch (Servicename) {
        case "GOOGLEMAIL":
            {
                //var GoogleMailData = new Array();
                //Data.sort(function (a, b) { return a[5] - b[5] });
                Data.sort(function (a, b) { return a.PostTime - b.PostTime });

                /*Data.forEach(function (MyData) {
                    GoogleMailData.push(new GoogleMail(MyData[7],MyData[6],MyData[5],MyData[8],MyData[10],MyData[11]));
                });*/
                //Data = GoogleMailData;

                var cachedGoogleMail = AllMail;
                var i = 0;
                var j = 0;
                /*for (i = 0; i < Data.length; i++) {
                    if (Data.length == 2) {
                        i;
                    }
                    for (j = 0; j < cachedGoogleMail.Data.length; j++) {
                        if (cachedGoogleMail.Data[j].DataURI == Data[i].DataURI) {
                            Data.splice(i, 1);
                            --i
                            break;
                        }
                    }
                }
                if (Data.length == 1) {
                    i;
                }*/


                var LatterDateTime = new Date(cachedGoogleMail.LatterIdentifyingValue);
                var FormerDateTime = new Date(cachedGoogleMail.FormerIdentifyingValue);
                i = 0;
                for (; i < Data.length; i++) {
                    if (isWithinDateTimeRange(FormerDateTime, LatterDateTime, new Date(Data[i].PostTime))) {
                        //ArrayOfNewArticlesWithinCachedTimeRange.push(Data[i]);
                        i;
                    }
                    else {
                        ArrayOfNewArticlesOutsideCachedTimeRange.push(Data[i]);
                    }
                }
                UpdatedData = ArrayOfNewArticlesOutsideCachedTimeRange.concat(ArrayOfNewArticlesWithinCachedTimeRange)
                cachedGoogleMail.Data = cachedGoogleMail.Data.concat(UpdatedData);
                cachedGoogleMail.Data.sort(function (a, b) { return a.PostTime - b.PostTime })
                cachedGoogleMail.FormerIdentifyingValue = cachedGoogleMail.Data[0].PostTime;
                cachedGoogleMail.LatterIdentifyingValue = cachedGoogleMail.Data.last().PostTime;
                var updatedDataFormattedasArray = new Array();

                UpdatedData.forEach(function (MyGoogleData) {
                    MyGoogleData.ServiceID.ID = new CacheDataAccess().getServiceObjectIndex();
                    updatedDataFormattedasArray.push(MyGoogleData.toDisplayArray());

                    if (isFunction(MyGoogleData.getotherDownloadabledata)) {
                        MyGoogleData.getotherDownloadabledata();
                    }
                    /*
                    Mail.prototype.Title = Title;
                    Mail.prototype.TitleImageURI = TitleImgURI;
                    Mail.prototype.PostTime = new Date(MailPostTime);
                    Mail.prototype.Data = MailData;
                    Mail.prototype.DataURI = MailURL;
                    Mail.prototype.TypeOfPhase = "Mail";*/
                });
                return { Data: AllMail, Changes: updatedDataFormattedasArray };
                //AllMail.UpdateCache();
            }
            break;
        case "YAHOOMAIL":
            {

            }
            break;
    }
}

//Photos Cache
function Photos(Uri, PostTime, User)
{
    Photos.prototype.Uri = Uri;
    Photos.prototype.PostTime = PostTime;
    Photos.prototype.User = User;
    var ServiceID = { ID: null }
    Photos.prototype.ServiceID = ServiceID;
    Photos.prototype.setServiceID = function (passedServiceID)
    { ServiceID = passedServiceID };
}

function FlickrPhotos(Uri, PostTime, User)
{
    Photos.call(this, Uri, PostTime, User);
    var PhotosPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));//this gets the prototype of the parent object
    var PhotosProperties = Object.getOwnPropertyNames(PhotosPrototype);//this gets the properties of parent object
    var i = 0;
    for (; i < PhotosProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, PhotosProperties[i], { value: this[PhotosProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }

    this.toDisplayArray = function () {
        var newCard = new Array(8);
        newCard[4] = "flickr photo";
        newCard[5] = new Date(this.PostTime);
        newCard[6] = this.User;
        newCard[7] = this.Uri;
        return newCard;
    }

}
FlickrPhotos.prototype = new Photos;

function ValidatePhotosForCache(Data, Servicename, AllPhoto)
{
    var UpdatedData = new Array();
    Servicename = Servicename.replace(" ", "");
    Servicename = Servicename.toUpperCase();

    var LatterElements = new Array();
    var FormerElements = new Array();
    var ArrayOfNewArticlesWithinCachedTimeRange = new Array()
    var ArrayOfNewArticlesOutsideCachedTimeRange = new Array();
    switch (Servicename) {
        case "FLICKRPHOTO":
            {
                //var FlickrPhotoData = new Array();
                //Data.sort(function (a, b) { return a[5] - b[5] });
                Data.sort(function (a, b) { return a.PostTime - b.PostTime });

                /*Data.forEach(function (MyData) {
                    FlickrPhotoData.push(new FlickrPhoto(MyData[7],MyData[6],MyData[5],MyData[8],MyData[10],MyData[11]));
                });*/
                //Data = FlickrPhotoData;

                var cachedFlickrPhoto = AllPhoto;
                var i = 0;
                var j = 0;
                /*for (i = 0; i < Data.length; i++) {
                    if (Data.length == 2) {
                        i;
                    }
                    for (j = 0; j < cachedFlickrPhoto.Data.length; j++) {
                        if (cachedFlickrPhoto.Data[j].DataURI == Data[i].DataURI) {
                            Data.splice(i, 1);
                            --i
                            break;
                        }
                    }
                }
                if (Data.length == 1) {
                    i;
                }*/


                var LatterDateTime = new Date(cachedFlickrPhoto.LatterIdentifyingValue);
                var FormerDateTime = new Date(cachedFlickrPhoto.FormerIdentifyingValue);
                i = 0;
                for (; i < Data.length; i++) {
                    if (isWithinDateTimeRange(FormerDateTime, LatterDateTime, new Date(Data[i].PostTime))) {
                        //ArrayOfNewArticlesWithinCachedTimeRange.push(Data[i]);
                        i;
                    }
                    else {
                        ArrayOfNewArticlesOutsideCachedTimeRange.push(Data[i]);
                    }
                }
                UpdatedData = ArrayOfNewArticlesOutsideCachedTimeRange.concat(ArrayOfNewArticlesWithinCachedTimeRange)
                cachedFlickrPhoto.Data = cachedFlickrPhoto.Data.concat(UpdatedData);
                cachedFlickrPhoto.Data.sort(function (a, b) { return a.PostTime - b.PostTime })
                cachedFlickrPhoto.FormerIdentifyingValue = cachedFlickrPhoto.Data[0].PostTime;
                cachedFlickrPhoto.LatterIdentifyingValue = cachedFlickrPhoto.Data.last().PostTime;
                var updatedDataFormattedasArray = new Array();

                UpdatedData.forEach(function (MyFlickrData) {
                    MyFlickrData.ServiceID.ID = new CacheDataAccess().getServiceObjectIndex();
                    updatedDataFormattedasArray.push(MyFlickrData.toDisplayArray());

                    if (isFunction(MyFlickrData.getotherDownloadabledata)) {
                        MyFlickrData.getotherDownloadabledata();
                    }
                });
                return { Data: AllPhoto, Changes: updatedDataFormattedasArray };
                //AllPhoto.UpdateCache();
            }
            break;
        case "INSTAGRAMPHOTO":
            {

            }
            break;
    }
}


//Deals Cache
function Deals(Uri, expiryDate, Title,Location) {
    Deals.prototype.PostTime = expiryDate;
    Deals.prototype.DealURI = Uri;
    Deals.prototype.Title = Title;
    Deals.prototype.Location = Location;
    var ServiceID = { ID: null }
    Deals.prototype.ServiceID = ServiceID;
    Deals.prototype.setServiceID = function (passedServiceID)
    { ServiceID = passedServiceID };
}

function GrouponDeals(Uri, expiryDate, Title, Location, highlightsHTML, largeImageURL)
{
    Deals.call(this, Uri, expiryDate, Title, Location);
    var GrouponPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));
    var dealsProperties = Object.getOwnPropertyNames(GrouponPrototype);
    this.highlightsHTML = highlightsHTML;
    this.largeImageURL = largeImageURL;
    var i = 0;
    for (; i < dealsProperties.length; i++)//For loop loops through properties of parent
    {
        Object.defineProperty(this, dealsProperties[i], { value: this[dealsProperties[i]], writable: true, enumerable: true, configurable: true })//Generates a property for this object without looking up inheritance tree. Doing this because JSON.stringify doesnt go through inherited objects
    }
    this.toDisplayArray = function () {
        var newCard = new Array(11);
        newCard[4] = "groupon";
        newCard[5] = new Date(this.PostTime);
        newCard[6] = this.Title;
        newCard[7] = this.highlightsHTML;
        newCard[8] = this.largeImageURL;
        newCard[9] = this.DealURI;
        newCard[10] = this.Location;
        return newCard;
    }
}

GrouponDeals.prototype = new Deals;

function ValidateDealsForCache(Data, Servicename, AllDeal) {
    var UpdatedData = new Array();
    Servicename = Servicename.replace(" ", "");
    Servicename = Servicename.toUpperCase();

    var LatterElements = new Array();
    var FormerElements = new Array();
    var ArrayOfNewArticlesWithinCachedTimeRange = new Array()
    var ArrayOfNewArticlesOutsideCachedTimeRange = new Array();
    switch (Servicename) {
        case "GROUPON":
            {
                //var GrouponDealData = new Array();
                //Data.sort(function (a, b) { return a[5] - b[5] });
                Data.sort(function (a, b) { return a.PostTime - b.PostTime });

                /*Data.forEach(function (MyData) {
                    GrouponDealData.push(new GrouponDeal(MyData[7],MyData[6],MyData[5],MyData[8],MyData[10],MyData[11]));
                });*/
                //Data = GrouponDealData;

                var cachedGrouponDeal = AllDeal;
                var i = 0;
                var j = 0;
                /*for (i = 0; i < Data.length; i++) {
                    if (Data.length == 2) {
                        i;
                    }
                    for (j = 0; j < cachedGrouponDeal.Data.length; j++) {
                        if (cachedGrouponDeal.Data[j].DataURI == Data[i].DataURI) {
                            Data.splice(i, 1);
                            --i
                            break;
                        }
                    }
                }
                if (Data.length == 1) {
                    i;
                }*/


                var LatterDateTime = new Date(cachedGrouponDeal.LatterIdentifyingValue);
                var FormerDateTime = new Date(cachedGrouponDeal.FormerIdentifyingValue);
                i = 0;
                for (; i < Data.length; i++) {
                    if (isWithinDateTimeRange(FormerDateTime, LatterDateTime, new Date(Data[i].PostTime))) {
                        //ArrayOfNewArticlesWithinCachedTimeRange.push(Data[i]);
                        i;
                    }
                    else {
                        ArrayOfNewArticlesOutsideCachedTimeRange.push(Data[i]);
                    }
                }
                UpdatedData = ArrayOfNewArticlesOutsideCachedTimeRange.concat(ArrayOfNewArticlesWithinCachedTimeRange)
                cachedGrouponDeal.Data = cachedGrouponDeal.Data.concat(UpdatedData);
                cachedGrouponDeal.Data.sort(function (a, b) { return a.PostTime - b.PostTime })
                cachedGrouponDeal.FormerIdentifyingValue = cachedGrouponDeal.Data[0].PostTime;
                cachedGrouponDeal.LatterIdentifyingValue = cachedGrouponDeal.Data.last().PostTime;
                var updatedDataFormattedasArray = new Array();

                UpdatedData.forEach(function (MyGrouponData) {
                    MyGrouponData.ServiceID.ID = new CacheDataAccess().getServiceObjectIndex();
                    updatedDataFormattedasArray.push(MyGrouponData.toDisplayArray());

                    if (isFunction(MyGrouponData.getotherDownloadabledata)) {
                        MyGrouponData.getotherDownloadabledata();
                    }
                });
                return { Data: AllDeal, Changes: updatedDataFormattedasArray };
                //AllDeal.UpdateCache();
            }
            break;
        case "LIVINGSOCIAL":
            {

            }
            break;
    }
}


function isWithinDateTimeRange(From, To, Comaparison)
{
    var FromDiff = Comaparison - From;
    var ToDiff = To - Comaparison;

    if ((FromDiff >= 0) && (ToDiff >= 0))
    {
        return true;
    }
    else
    {
        return false;
    }
}

    function isBeforeOrAfterTimeRange(From, To, Comaparison)
    {
        var FromDiff = Comaparison - From;
        var ToDiff = To - Comaparison;

        if (FromDiff < 0)
        {
            return false
        }
        if (ToDiff<0)
        {
            return true;
        }


        ShowUpperRightMessage("invalid Input for isBeforeOrAfterTimeRange function")
        throw "invalid Input for isBeforeOrAfterTimeRange"

    }
