//Getting Coordinates
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,rain,showers,snowfall,is_day&hourly=temperature_2m,precipitation,cloud_cover,rain,showers,snowfall,is_day&daily=sunrise,sunset&timezone=auto`;
    //console.log(latitude, longitude);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        /* ************************* Variables ******************* */
        const temperature_hourly = data.hourly.temperature_2m;
        const temperature_current = data.current.temperature_2m;

        const times_hourly = data.hourly.time;
        const times_current = data.current.time;

        const clouds_hourly = data.hourly.cloud_cover;
        const clouds_current = data.current.cloud_cover;

        const rain_hourly = data.hourly.rain;
        const rain_current = data.current.rain;

        const showers_hourly = data.hourly.showers;
        const showers_current = data.current.showers;

        const snowfall_hourly = data.hourly.snowfall;
        const snowfall_current = data.current.snowfall;

        const daytime_current = data.current.is_day;
        const daytime_hourly = data.current.is_day;

        //Treat carefully////////////////////////////////////////////
        const sunrise = data.daily.sunrise;
        const sunset = data.daily.sunset;

        const weatherCode = data.current.weathercode;
        /* Copied Down 
        const sunriseHour = Number(sunrise.slice(11, 13));
        const sunsetHour = Number(sunset.slice(11, 13));
        ****/

        /////////////////////////////////////////////////////////////
        let fullTime;
        let hour;
        let date;
        let time_hour;
        let time_date;
        /////////////////////////////////////////////////////////////
        //Getting City & Country
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown";
            const country = data.address.country || "Unknown";
            const todayHour = times_current.slice(11, 16);
            const date_current = times_current.slice(0, 10);

            //console.log(`Your Location: ${city}, ${country}`);

            document.getElementById(
              "card-title"
            ).textContent = `${city} - ${country}`;

            document.getElementById(
              "temperature-text"
            ).textContent = `Temperature: ${temperature_current}°C`;

            document.getElementById(
              "date-text"
            ).textContent = `Date: ${date_current}`;

            document.getElementById(
              "time-text"
            ).textContent = `Time: ${todayHour}`;

            if (daytime_current) {
              document.getElementById(
                "dayShift"
              ).textContent = `It's Daytime in ${city}!`;
            } else {
              document.getElementById(
                "dayShift"
              ).textContent = `It's Nighttime in ${city}!`;
            }
          })
          .catch((error) => {
            console.error(error);
            document.getElementById("city").textContent = "An error occurred";
          });

        /******************** Current Day Forecast ***********************/
        if (daytime_current && rain_current && showers_current) {
          //console.log("Storm Day!");
        } else if (daytime_current && rain_current && !showers_current) {
          //console.log("Rain Day!");
        } else if (
          daytime_current &&
          !rain_current &&
          !showers_current &&
          clouds_current <= 20
        ) {
          //console.log("Partly Cloudy Day!");
        } else if (
          daytime_current &&
          !rain_current &&
          !showers_current &&
          clouds_current > 20
        ) {
          //console.log("Cloudy Day!");
        } else if (
          daytime_current &&
          !rain_current &&
          !showers_current &&
          !clouds_current &&
          !snowfall_current
        ) {
          //console.log("Sunny Clear Day!");
        } else if (
          daytime_current &&
          !rain_current &&
          !showers_current &&
          snowfall_current
        ) {
          //console.log("Snowy Day!");
        } else if (!daytime_current && rain_current && showers_current) {
          console.log("Storm Night!");
        } else if (!daytime_current && rain_current && !showers_current) {
          //console.log("Rain Night!");
        } else if (
          !daytime_current &&
          !rain_current &&
          !showers_current &&
          clouds_current <= 20
        ) {
          //console.log("Partly Cloudy Night!");
        } else if (
          !daytime_current &&
          !rain_current &&
          !showers_current &&
          clouds_current > 20
        ) {
          //console.log("Cloudy Night!");
        } else if (
          !daytime_current &&
          !rain_current &&
          !showers_current &&
          !clouds_current &&
          !snowfall_current
        ) {
          //console.log("Sunny Clear Night!");
        } else if (
          !daytime_current &&
          !rain_current &&
          !showers_current &&
          snowfall_current
        ) {
          //console.log("Snowy Night!");
        }

        /* Function to Separate (Hour From Date) & (Sunrise or Sunset From Date) Week-Based or Current */
        // Use: timeSpan(times_current, printCurrentTiming); //For Current Time & Date
        // Use: timeSpan(times_hourly, printWeeklyTiming); //For Weekly-Hourly Time & Date
        // Use: timeSpan(sunrise, printCurrentSunrise); //For Current Sunrise & Date
        // Use: timeSpan(sunrise, printWeeklySunrise); //For Current Sunrise & Date
        // Use: timeSpan(sunset, printCurrentSunset); //For Current Sunset & Date
        // Use: timeSpan(sunset, printWeeklySunset); //For Current Sunset & Date
        // Must call function with an argument

        const timeSpan = function (time, timing) {
          timing(time);
        };

        const printWeeklyTiming = function (time) {
          for (let i = 0; i < time.length; i++) {
            time_hour = time[i].slice(11, 16);
            time_date = time[i].slice(0, 10);
            console.log(`Time: ${time_hour}, Date ${time_date}`);
          }
        };

        const printCurrentTiming = function (time) {
          time_hour = time.slice(11, 16);
          time_date = time.slice(0, 10);
          console.log(`Time Now: ${time_hour}, Date ${time_date}`);
        };

        const printCurrentSunrise = function (time) {
          time_hour = time[0].slice(11, 16);
          time_date = time.slice(0, 10);
          console.log(`Sunrise: ${time_hour}, Date ${time_date}`);
        };

        const printCurrentSunset = function (time) {
          time_hour = time[0].slice(11, 16);
          time_date = time.slice(0, 10);
          console.log(`Sunset: ${time_hour}, Date ${time_date}`);
        };

        const printWeeklySunrise = function (time) {
          for (let i = 0; i < time.length; i++) {
            time_hour = time[i].slice(11, 16);
            time_date = time[i].slice(0, 10);
            console.log(`Sunrise: ${time_hour}, Date ${time_date}`);
          }
        };

        const printWeeklySunset = function (time) {
          for (let i = 0; i < time.length; i++) {
            time_hour = time[i].slice(11, 16);
            time_date = time[i].slice(0, 10);
            console.log(`Sunset: ${time_hour}, Date ${time_date}`);
          }
        };
      });
  });

/************************************ Hourly Cloud Cover - 7 Days - Modify to Work for 7 Days ****************************/
/*for (let i = 0; i < times_hourly.length; i++) {
          console.log(
            `Time: ${times_hourly[i]}, Cloud Cover: ${clouds_hourly[i]}%`
          );
          if (clouds_hourly[i] <= 20) {
            timeSpan(times_hourly[i]);
            console.log("Clear!");
          } else if (clouds_hourly[i] > 20 && clouds_hourly[i] <= 50) {
            timeSpan(times_hourly[i]);
            console.log("Partly Cloudy!");
          } else {
            timeSpan(times_hourly[i]);
            console.log("Cloudy!");
          }
        }
      })
  });
*/

/* Toggle Button Between Today & Week */

/************************************************* New *************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/* Search Bar */
const wHeight = window.innerHeight;
const sb = document.getElementById("search-button");
const closeSB = document.getElementById("fullscreen-close-button");
const SearchOverlay = document.getElementById("search-overlay");
const searchBar = document.getElementById("fullscreen-searchform");

searchBar.style.top = wHeight / 2 + "px";
//console.log(wHeight);

window.addEventListener(
  "resize",
  function () {
    //console.log(wHeight);
    //wHeight = window.innerHeight;
    searchBar.style.top = wHeight / 2 + "px";
  },
  true
);

document.addEventListener(
  "click",
  function () {
    sb.onclick = function () {
      console.log("Opened Search for Element: ");
      SearchOverlay.classList.add("fullscreen-search-overlay-show");
    };

    closeSB.onclick = function () {
      console.log("Closed Search for Element: " + closeSB);
      SearchOverlay.classList.remove("fullscreen-search-overlay-show");
    };
  },
  true
);

/* Search Suggestions */
const searchInput = document.getElementById("fullscreen-search-input");
const suggestionsBox = document.getElementById("suggestions-box");
const API_KEY = "1d6fc4b5cfe4490db8ea582b799b2ebd";

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value;

  if (query.length < 3) {
    suggestionsBox.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${API_KEY}`
  );
  const data = await response.json();

  suggestionsBox.innerHTML = ""; // Made that to clear previous suggestions

  if (data.features) {
    data.features.forEach((feature) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.innerText = feature.properties.formatted;

      suggestionItem.addEventListener("click", () => {
        searchInput.value = feature.properties.formatted;
        suggestionsBox.innerHTML = "";
        // Optional: Trigger your weather search function here
      });

      suggestionsBox.appendChild(suggestionItem);
    });
  }
});

// To hide suggestions when users click outside
document.addEventListener("click", (e) => {
  if (e.target.id !== "city-input") {
    suggestionsBox.innerHTML = "";
  }
});
