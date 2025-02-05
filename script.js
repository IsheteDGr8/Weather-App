$(document).ready(function () {
    $("#searchBtn").click(function () {
        var city = $("#cityInput").val().trim(); // Get user input and remove extra spaces

        if (city !== "") {
            getWeather(city);
        } else {
            alert("Please enter a city name.");
        }
    });

    function getWeather(city) {
        $.getJSON(
            "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=a9f91709cd3f00525128be30e4b7abf5",
            function (data) {
                console.log(data);

                $(".city-name").text(data.city.name + ", " + data.city.country); // Display city name

                var forecastHTML = "";
                var dailyData = processForecastData(data.list);

                dailyData.forEach(day => {
                    forecastHTML += `
                        <div class="forecast-day">
                            <p class="date">${day.dayName}, ${day.month} ${day.date}</p>
                            <img src="https://openweathermap.org/img/w/${day.icon}.png" class="icon">
                            <p class="weather">${day.weather}</p>
                            <p class="temp">${day.temp}°F</p>
                        </div>
                    `;
                });

                $(".forecast-container").html(forecastHTML); // Update the UI
            }
        ).fail(function () {
            alert("City not found. Please enter a valid city name.");
        });
    }

    function processForecastData(list) {
        let dailyForecast = [];
        let usedDates = new Set();

        list.forEach(item => {
            let dateObj = new Date(item.dt * 1000);
            let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
            let month = dateObj.toLocaleDateString('en-US', { month: 'short' }); // Jan, Feb, etc.
            let date = dateObj.getDate();

            let dateKey = `${month} ${date}`; // Unique key for each day

            if (!usedDates.has(dateKey) && dailyForecast.length < 5) {
                usedDates.add(dateKey);
                dailyForecast.push({
                    dayName: dayName,
                    month: month,
                    date: date,
                    weather: item.weather[0].main,
                    temp: Math.floor(item.main.temp),
                    icon: item.weather[0].icon
                });
            }
        });

        return dailyForecast;
    }
});
