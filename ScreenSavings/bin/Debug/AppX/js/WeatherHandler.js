function PopulateWeatherDiv()
{
    var WeatherButtonContainer= document.createElement("div");
    var SelectedWeatherContainer= document.createElement("div");
    AllData.foreach(MyLocation)
    {
        var MyLocationButton=document.createElement('div');
        $(MyLocationButton).addClass("WeatherButton");
        BindButtonActivity(BindButtonActivity);
        WeatherButtonContainer.appendChild(MyLocationButton);
        var MyWeatherDataContainer=document.createElement("div");
        MyLocation.Data.forEach(function(MyData)
        {
            var generatedDom=PopulateWeatherDataForMyLocation(MyData);
            $(MyWeatherDataContainer).addClass("DayData");			
        })
		
		
		
    }
}


function Weather()
{
    var Body=document.getElementByTag('body');
    var WeatherIcon = document.getElementById("weather");
    WeatherIcon.addEventListener("click", function(){})
    var WeatherContainer=document.createElement('div');
    Body.appendChild(WeatherContainer);
		
}

function PopulateWeatherDataForMyLocation(MyData)
{
    var getWeatherPromise = new WinJS.Promise(function (success,Failure,progress)
    {
        getLatestWeather(MyData, success, Failure);
    })
    var Locationdom = document.getElementById("location");
    var weatherIcondom = document.getElementById("weatherIcon");
    var temperaturedom = document.getElementById("temperature");
    getWeatherPromise.done
    (
        function (Data)
        {
            try
            {
                var LatestData = Data[0];
                Locationdom.innerHTML = "" + LatestData.location[0] + "," + LatestData.location[1];
                var src="http://openweathermap.org/img/w/" + LatestData.otherdata[1];
                weatherIcondom.src = src
                temperaturedom.innerHTML = LatestData.Temperature_F;
            }
            catch (e)
            {
                Locationdom.innerHTML = ""
                weatherIcondom.setAttribute("src", "");
                temperaturedom.innerHTML = "";
            }
        },
        function (error)
        {
            Locationdom.innerHTML = ""
            weatherIcondom.setAttribute("src", "");
            temperaturedom.innerHTML = "";
        }
    )

    
}



function WeatherData(Temperature_F, Status,DateData,Location,otherData)
{
    this.Temperature_F = Temperature_F;
    this.Status = Status;
    this.date = new Date(DateData);
    this.location = Location;
    this.otherdata= otherData;
}


function getLatestWeather(myLocationData,successCallback,FailureCallBack)
{
    var myWeatherURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + myLocationData.Latitude + "&lon=" + myLocationData.Longitude + "&cnt=10&mode=json";
    WinJS.xhr({ url: myWeatherURL }).done
    (
        function (data)
        {
            try
            {
                var jsonWeatherData = JSON.parse(data.responseText);
                var location=[jsonWeatherData.city.name,jsonWeatherData.city.country];
                var arrayOfweatherData=new Array();
                jsonWeatherData.list.forEach(
                function(myData)
                {
                    var Temp_f = kevinsToFarenheight(myData.temp.day);
                    var temp_info = myData.weather[0].main;
                    var temp_tm = myData.dt
                    var temp_otherData = [myData.weather[0].description, myData.weather[0].icon];
                    var myWeatherdata = new WeatherData(Temp_f, temp_info, temp_tm, location, temp_otherData);
                    arrayOfweatherData.push(myWeatherdata);
                }
                )
                successCallback(arrayOfweatherData);
                
            }
            catch (e)
            {
                FailureCallBack("invalid weather data");
            }
        },
        function (error)
        {
            FailureCallBack("Issues connecting to weather")
        }
    );
}

function kevinsToFarenheight(value)
{
    value = (Number)(value);

    value = ((value - 273) * 1.8) + 32;
    return Math.round(value);
}