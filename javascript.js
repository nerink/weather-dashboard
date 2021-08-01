// Open Weather Map API key
let apiKey = "65f2ea1556b7c542a0d96eef91cea11d";

// function to search current weather of searched city 
function searchCity(event){
   
    event.preventDefault();
    
    let cityInput = $("#searchcity").val();
    
    if(cityInput === "")
    {
        return;
    } 
   
    searchCurrentWeather(cityInput);
    
    populateSearchHistory(cityInput);
    
    $("#searchcity").val("");
}

// function to fetch current weather of city 
function searchCurrentWeather(city){
    
    let searchQueryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+ apiKey; 

    // Seach Current Weather
    $.ajax({
        
        url: searchQueryURL,
        method: "GET"

    }).then(function(response){
        
        // Convert the temp to fahrenheit
        let tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // Convert Kelvin to celsius : 0K − 273.15 = -273.1°C   
        let tempC = (response.main.temp - 273.15);

        let currentDate = new Date().toLocaleDateString();
     
        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        
        let uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+latitude+"&lon="+longitude+"&appid="+ apiKey;

        let cityId = response.id;
        
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&units=imperial&appid="+apiKey;
          
        $("#city-card").show();
        
        $("#temperature").text("Temperature : "+tempF.toFixed(2)+" °F/ "+tempC.toFixed(2)+"°C"); 
        $("#humidity").text("Humidity : "+response.main.humidity+" %");
        $("#windspeed").text("Wind Speed : "+response.wind.speed+" MPH");

        let image= $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon.toString() + ".png");

        $("#city-name").text(response.name + " ("+currentDate+") ").append(image);

        getUVIndex(uvQueryURL); 

        showForecast(forecastQueryURL);
        
    });   

}

//function to get UV index
function getUVIndex(uvQueryURL){

    console.log("UV query URL : "+uvQueryURL);
    
    $.ajax({
            
        url: uvQueryURL,
        method: "GET"

    }).then(function(uvResponse){
    
        let uvValue = uvResponse.value;
        
        let uvButton = $("<button>").attr("type","button").text(uvValue);
 
        if(uvValue >= 0 && uvValue <= 3){
            
            //low : green
            $("#uvindex").text("UV : Low, ").append(uvButton);
            uvButton.addClass("btn bg-success");
        }
        else if(uvValue >= 3 && uvValue <= 6){
            
            //moderate : yellow
            $("#uvindex").text("UV : Moderate, ").append(uvButton);
            uvButton.addClass("btn yellowBtn");
        } 
        else if(uvValue >= 6 && uvValue <= 8){
            
            //high : orange
            $("#uvindex").text("UV : High, ").append(uvButton);
            uvButton.addClass("btn orangeBtn");
        }
        else if(uvValue >= 8 && uvValue <= 10){
            
            //very high : red
            $("#uvindex").text("UV : Very high, ").append(uvButton);
            uvButton.addClass("btn bg-danger");
        }
        else if(uvValue >= 10){
            
            //extreme : violet
            $("#uvindex").text("UV : Extreme, ").append(uvButton);
            uvButton.addClass("btn violetBtn");
        }
    });
}

//function to show 5 days forecast 
function showForecast(forecastQueryURL){

    let temp, humidity,icon;

    console.log("Forecast query URL : "+forecastQueryURL);
    $("#5DayForecast").show();

    $.ajax({
            
        url: forecastQueryURL,
        method: "GET"

    }).then(function(forecastResponse){

        $("#forecast").empty();

        let list = forecastResponse.list;

        for(let i = 0 ; i < list.length ;i++){
            
            let date = list[i].dt_txt.split(" ")[0];
            let dateArr = date.split("-");
            
            let dateForecast = dateArr[1]+"/"+dateArr[2]+"/"+dateArr[0];
            let time = list[i].dt_txt.split(" ")[1];

            // console.log("date : "+dateForecast+" time : "+time);

            if(time === "12:00:00"){

                temp = list[i].main.temp;
                humidity = list[i].main.humidity;
                icon = list[i].weather[0].icon;

                let card = $("<div>").addClass("card bg-primary text-white");
                let cardBody = $("<div>").addClass("card-body");
                
                let fDate = $("<h5>").addClass("card-text").text(dateForecast);
                
    
                let imgIcon = $("<img>").attr("src","https://openweathermap.org/img/wn/" + icon + ".png"); 
                
                let tempP  = $("<p>").addClass("card-text").text("Temp: "+temp+"°F");
                
                let humidityP = $("<p>").addClass("card-text").text("Humidity : "+humidity+" % ");

                cardBody.append(fDate, imgIcon, tempP, humidityP);
                card.append(cardBody);

                $("#forecast").append(card);
            }
       
        }
    });
}

// function to store and populate search history
function populateSearchHistory(city){

    let history = JSON.parse(localStorage.getItem("history"));  
    let listitem;

    // If exists 
    if(history){

        for(let i = 0 ; i < history.length; i++){
            
            if(history[i] === city){
                return;
            }         
        } 
        history.unshift(city); 
        listitem = $("<li>").addClass("list-group-item previousCity").text(city);
        $("#historylist").prepend(listitem);    
    }
    else{
            history = [city]; 
            
            listitem = $("<li>").addClass("list-group-item previousCity").text(city);
            $("#historylist").append(listitem);

    }

    localStorage.setItem("history", JSON.stringify(history));   
}


// onclick function on search history city to load weather of that city 
$("#historylist").on("click", "li", function(event){

    let previousCityName = $(this).text();
    console.log("Previous city : "+ previousCityName);

    searchCurrentWeather(previousCityName);

});

// Execute script when html is fully loaded
$(document).ready(function(){

    $("#searchButton").on("click",searchCity);

    let history = JSON.parse(localStorage.getItem("history"));  
    
    // if search history exists in local storage
    if (history) {
        let lastSearchedCity = history[0];  //takes last searched city from localstorage
        searchCurrentWeather(lastSearchedCity); //loads last searched city's weather

        for(let i = 0 ; i < history.length; i++){
            
            let listitem = $("<li>").addClass("list-group-item previousCity").text(history[i]);  //populate search history in local storage to html page when page loads
            $("#historylist").append(listitem);    
            
        }
    } else {
        $("#city-card").hide();
        $("#5DayForecast").hide();
    }
});



