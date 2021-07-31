//Search Button variable//
let searchBtn= document.querySelector(".submit-btn");
//Create local storage for cities
let searchHistory=[];
let cities=JSON.parse(localStorage.getItem('City'));
if (cities !== null){
searchHistory=cities
}


searchBtn.addEventListener("click", function(event){
    //get the city value inputted by the user 
    let city= $("#cityLocation").val();
   //store and populate search history 
   searchHistory.push(city)
    localStorage.setItem("City",JSON.stringify(searchHistory));

    //Fetch City API
    let weatherApp="https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=65f2ea1556b7c542a0d96eef91cea11d";
    
    //hit query URL with AJAX
    $.ajax({
        url: weatherApp,
        method: "GET"

    }).then (function (response){
        console.log(response);
        let lat=response.coord.lat;
        let lon=response.coord.lon;
        let forecastApp="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly&appid=65f2ea1556b7c542a0d96eef91cea11d";
        // Log the queryURL
        console.log("Search Query URL : "+weatherApp);
        // create current date variable
        var currentDate = new Date().toLocaleDateString();
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        $("#city-box").show();
        $("#cityid").text(response.name+ " ("+currentDate+")");
        $("#temperature").text("Temperature : "+tempF.toFixed(2)+" °F"); 
        $("#humidity").text("Humidity : "+response.main.humidity+" %");
        $("#windspeed").text("Wind Speed : "+response.wind.speed+" MPH");

       // getUVIndex(); 

        showForecast(forecastApp);

    })
//UV Index

//function to show 5 day forecast 
function showForecast(fivedayforecast){
    $.ajax({
        url: fivedayforecast,
        method: "GET"
    }).then(function(forecastResponse){
        console.log (forecastResponse.daily)
        let list= forecastResponse.daily
       for(let i=0; i< 5; i++){
           console.log (list[i].humidity);
           $(".five-day-row").append("<div>"+list[i].humidity+"</div>");
       }


    })
}



// function to search current weather of searched city 

 
})

