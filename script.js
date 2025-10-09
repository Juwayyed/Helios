const loadingOverlay = document.getElementById("loading-overlay");
const mainContent = document.getElementById("main-content");

if (mainContent) {
  mainContent.classList.add("hidden");
}

const hideLoadingScreen = () => {
  if (loadingOverlay) {
    loadingOverlay.classList.add("hidden");
    if (mainContent) {
      mainContent.classList.remove("hidden");
    }
  }
};

const dateTextElement = document.getElementById("date_text");
const cardTitleElement = document.getElementById("card-title");
const timeIcon = "⏰";
const calendarIcon = "📅";
const tempIcon = "🌡️";
const sunriseIcon = "☀️";
const sunsetIcon = "🌒";

let lastCity = "Unknown";
let lastCountry = "Unknown";
let current_timezone = "auto";
let api_last_time = "";

//Days of The Week
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// دالة تحديث الوقت كل ثانية (تعتمد على التايم زون الخاص بالمدينة)
function updateClock() {
  if (!dateTextElement || lastCity === "Unknown" || !api_last_time) {
    return;
  }

  // استخدام الوقت الثابت من الـ API كمرجع
  const now = new Date(api_last_time);

  // حساب الفارق الزمني بين وقت الـ API والوقت الحالي للجهاز
  const timeDifference = Date.now() - now.getTime();

  // تطبيق الفارق على الوقت الثابت للحصول على الوقت الحالي
  const targetDate = new Date(now.getTime() + timeDifference);

  // تحديد خيارات التنسيق للوقت والتاريخ بناءً على التايم زون
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: current_timezone,
  };

  // تنسيق الوقت
  const currentTime = targetDate.toLocaleTimeString("en-US", optionsTime);

  // تنسيق اسم اليوم والتاريخ
  const todayName = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: current_timezone,
  });
  const formattedCurrentDate = targetDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: current_timezone,
  });

  // تحديث محتوى البطاقة
  dateTextElement.textContent = `${timeIcon} Time: ${currentTime} | ${calendarIcon} Date: ${todayName}, ${formattedCurrentDate}`;

  // تحديث عنوان البطاقة
  if (cardTitleElement && lastCity !== "Unknown") {
    cardTitleElement.textContent = `${lastCity} - ${lastCountry}`;
  }
}

// تشغيل تحديث الوقت كل ثانية
setInterval(updateClock, 1000);

const updateWeather = (latitude, longitude) => {
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,rain,showers,snowfall,is_day&hourly=temperature_2m,precipitation,cloud_cover,rain,showers,snowfall,is_day&daily=sunrise,sunset&timezone=auto`;

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      /* ************************* Variables ******************* */
      const temperature_hourly = data.hourly.temperature_2m;
      const temperature_current = data.current.temperature_2m;

      const dates_weekly = data.daily.time;

      const is_day = data.hourly.is_day;

      const times_hourly = data.hourly.time;
      const times_current = data.current.time;

      // تحديث التايم زون وآخر وقت من الـ API
      current_timezone = data.timezone || "auto";
      api_last_time = times_current;

      const clouds_hourly = data.hourly.cloud_cover;
      const clouds_current = data.current.cloud_cover;

      const rain_hourly = data.hourly.rain;
      const rain_current = data.current.rain;

      const showers_hourly = data.hourly.showers;
      const showers_current = data.current.showers;

      const snowfall_hourly = data.hourly.snowfall;
      const snowfall_current = data.current.snowfall;

      const daytime_current = data.current.is_day;
      const daytime_hourly = data.hourly.is_day;

      const sunrise = data.daily.sunrise;
      const sunset = data.daily.sunset;

      const weatherCode = data.current.weathercode;

      const targetHour = "10:00";

      const iconCurrent = document.getElementById("weather-icon");

      const body = document.body.style;

      const icon = document.getElementById("toggleIcon");
      const iconClose = document.getElementById("toggleIconClose");

      const card_front = document.getElementById("card_front");
      const card_back = document.getElementById("card_back");

      let tableImg;

      /* Card open & Close */
      let frontCardVisible = true;

      const tableIcons = function (
        daytime_hourly,
        rain_hourly,
        showers_hourly,
        clouds_hourly,
        snowfall_hourly
      ) {
        if (daytime_hourly && rain_hourly && showers_hourly) {
          tableImg = `<img class="table-icon" src="/img/Icons/Day/Storm-Day.png">`;
        } else if (daytime_hourly && rain_hourly && !showers_hourly) {
          tableImg = `<img class="table-icon" src="/img/Icons/Day/Rainy-Day.png">`;
        } else if (
          daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          clouds_hourly <= 20
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Day/Partly-Cloudy-Day.png">`;
        } else if (
          daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          clouds_hourly > 20
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Day/Cloudy-Day.png">`;
        } else if (
          daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          !clouds_hourly &&
          !snowfall_hourly
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Day/Clear-Sunny-Day.png">`;
        } else if (
          daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          snowfall_hourly
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Day/Snowy-Day.png">`;
        } else if (!daytime_hourly && rain_hourly && showers_hourly) {
          tableImg = `<img class="table-icon" src="/img/Icons/Night/Storm-Night.png">`;
        } else if (!daytime_hourly && rain_hourly && !showers_hourly) {
          tableImg = `<img class="table-icon" src="/img/Icons/Night/Raining-Cloudy-Night.png">`;
        } else if (
          !daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          clouds_hourly <= 20
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Night/Partly-Cloudy-Night.png">`;
        } else if (
          !daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          clouds_hourly > 20
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Night/Cloudy-Night.png">`;
        } else if (
          !daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          !clouds_hourly &&
          !snowfall_hourly
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Night/Clear-Sky-Night.png">`;
        } else if (
          !daytime_hourly &&
          !rain_hourly &&
          !showers_hourly &&
          snowfall_hourly
        ) {
          tableImg = `<img class="table-icon" src="/img/Icons/Night/Snowy-Night.png">`;
        }
        return tableImg;
      };

      /* Loop For Populating The Today Table - Back Card */
      for (let i = 0; i < 24; i++) {
        let HourlyTodayData = (document.getElementById(
          `cell_${i + 1}`
        ).innerHTML = ` ${tableIcons(
          daytime_hourly[i],
          rain_hourly[i],
          showers_hourly[i],
          clouds_hourly[i],
          snowfall_hourly[i]
        )}
          <span class="cell-text"> | ${timeIcon} ${times_hourly[i].slice(
          11,
          16
        )} | ${tempIcon} Temperature: ${temperature_hourly[i]} </span>`);
      }

      // 7 Days Data
      const index10Hour = times_hourly
        .map((time, index) => (time.includes("10:00") ? index : -1))
        .filter((index) => index !== -1);

      const clouds10Hour = index10Hour.map((index) => clouds_hourly[index]);
      const rain10Hour = index10Hour.map((index) => rain_hourly[index]);
      const showers10Hour = index10Hour.map((index) => showers_hourly[index]);
      const snow10Hour = index10Hour.map((index) => snowfall_hourly[index]);
      const time10Hour = index10Hour.map((index) => times_hourly[index]);

      /////////////////////////////////////////////////////////////
      let fullTime;
      let hour;
      let date;
      let time_hour;
      let time_date;
      let city;
      /////////////////////////////////////////////////////////////
      //Getting City & Country
      fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.dea5c495e7b1880b6b690facdb96ef55&lat=${latitude}&lon=${longitude}&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown";
          const country = data.address.country || "Unknown";

          // تحديث المتغيرات العامة للمدينة والبلد
          lastCity = city;
          lastCountry = country;

          // توفير قيمة تاريخية لاستخدامات الكود القديمة التي لم يتم تحديثها
          const date_current = api_last_time.slice(0, 10);

          const timeSpan = function (time, timing) {
            timing(time);
          };

          const printWeeklyTiming = function (time) {
            for (let i = 0; i < time.length; i++) {
              time_hour = time[i].slice(11, 16);
              time_date = time[i].slice(0, 10);
            }
          };

          const printCurrentTiming = function (time) {
            time_hour = time.slice(11, 16);
            time_date = time.slice(0, 10);
            return [time_hour, time_date];
          };

          const printCurrentSunrise = function (time) {
            time_hour = time[0].slice(11, 16);
            time_date = time.slice(0, 10);
          };

          const printCurrentSunset = function (time) {
            time_hour = time[0].slice(11, 16);
            time_date = time.slice(0, 10);
          };

          const printWeeklySunrise = function (time) {
            for (let i = 0; i < time.length; i++) {
              time_hour = time[i].slice(11, 16);
              time_date = time[i].slice(0, 10);
            }
          };

          const printWeeklySunset = function (time) {
            for (let i = 0; i < time.length; i++) {
              time_hour = time[i].slice(11, 16);
              time_date = time[i].slice(0, 10);
            }
          };

          //Days Names "Today" - نستخدم api_last_time لحساب اسم اليوم بالتوقيت الصحيح
          const currentDateObj = new Date(api_last_time);
          const todayName = currentDateObj.toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: current_timezone,
          });

          //Days Names "Week"
          let weekDays = dates_weekly.map((date_current) => {
            const date = new Date(date_current);
            return days[date.getDay()];
          });

          // لا يتم تحديث date_text هنا، دالة updateClock تقوم بذلك

          document.getElementById(
            "card-title"
          ).textContent = `${city} - ${country}`;

          document.getElementById(
            "temperature-text"
          ).textContent = `${tempIcon} Temperature: ${temperature_current}°C`;

          // تم إزالة تحديث عنصر "date_text" هنا

          document.getElementById(
            "sunrise_text"
          ).textContent = `${sunriseIcon} Sunrise on: ${
            printCurrentTiming(sunrise[0])[0]
          } | ${sunsetIcon} Sunset on: ${printCurrentTiming(sunset[0])[0]}`;

          if (daytime_current) {
            document.getElementById(
              "dayShift"
            ).textContent = `It's Daytime in ${city}!`;
          } else {
            document.getElementById(
              "dayShift"
            ).textContent = `It's Nighttime in ${city}!`;
          }

          //Loop For Displaying Dates at the bottom of the week cards
          for (let i = 0; i < dates_weekly.length; i++) {
            const dateOptions = { month: "long", day: "numeric" };
            const weekDatesObj = new Date(
              `${dates_weekly[i]}`
            ).toLocaleDateString("en-US", dateOptions);

            document.getElementById(
              `date-text-week--${i + 1}`
            ).innerHTML = `${weekDays[i]}<br>${weekDatesObj}`;
          }

          /******************** Current Day Forecast ***********************/
          if (daytime_current && rain_current && showers_current) {
            document.getElementById(
              "weather_description"
            ).textContent = `Storm ongoing!`;
            iconCurrent.src = "/img/Icons/Day/Storm-Day.png";
            body.backgroundImage =
              "url('/img/BGs/Day/Stormy-Day-BG 1920x1080.jpg')";
          } else if (daytime_current && rain_current && !showers_current) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Raining Now!`;
            iconCurrent.src = "/img/Icons/Day/Rainy-Day.png";
            body.backgroundImage =
              "url('/img/BGs/Day/Rainy-Day-BG 1920x1080.jpg')";
          } else if (
            daytime_current &&
            !rain_current &&
            !showers_current &&
            clouds_current <= 20
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Partly Cloudy!`;
            iconCurrent.src = "/img/Icons/Day/Partly-Cloudy-Day.png";
            body.backgroundImage =
              "url('/img/BGs/Day/Partly-Cloudy-Day-BG 1920x1080.jpg')";
          } else if (
            daytime_current &&
            !rain_current &&
            !showers_current &&
            clouds_current > 20
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Cloudy Sky!`;
            iconCurrent.src = "/img/Icons/Day/Cloudy-Day.png";
            body.backgroundImage =
              "url('/img/BGs/Day/Cloudy-Day-BG 1920x1080.jpg')";
          } else if (
            daytime_current &&
            !rain_current &&
            !showers_current &&
            !clouds_current &&
            !snowfall_current
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `It's Clear and Sunny!`;
            iconCurrent.src = "/img/Icons/Day/Clear-Sunny-Day.png";
            body.backgroundImage =
              "url('/img/BGs/Day/Clear-Sunny-Day-BG 1920x1080.jpg')";
          } else if (
            daytime_current &&
            !rain_current &&
            !showers_current &&
            snowfall_current
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Snowing Now!`;
            iconCurrent.src = "/img/Icons/Day/Snowy-Day.png";
            body.backgroundImage =
              "url('/img/BGs/Day/Snowy-Day-BG 1920x1080.jpg')";
          } else if (!daytime_current && rain_current && showers_current) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Storm ongoing!`;
            iconCurrent.src = "/img/Icons/Night/Storm-Night.png";
            body.backgroundImage =
              "url('/img/BGs/Night/Storm-Night-BG 1920x1080.jpg')";
          } else if (!daytime_current && rain_current && !showers_current) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Raining Now!`;
            iconCurrent.src = "/img/Icons/Night/Raining-Cloudy-Night.png";
            body.backgroundImage =
              "url('/img/BGs/Night/Raining-Cloudy-Night-BG 1920x1080.jpg')";
          } else if (
            !daytime_current &&
            !rain_current &&
            !showers_current &&
            clouds_current <= 20
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Partly Cloudy!`;
            iconCurrent.src = "/img/Icons/Night/Partly-Cloudy-Night.png";
            body.backgroundImage =
              "url('/img/BGs/Night/Partly-Cloudy-Night-BG 1920x1080.jpg')";
          } else if (
            !daytime_current &&
            !rain_current &&
            !showers_current &&
            clouds_current > 20
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `A Cloudy Night!`;
            iconCurrent.src = "/img/Icons/Night/Cloudy-Night.png";
            body.backgroundImage =
              "url('/img/BGs/Night/Cloudy-Night-BG 1920x1080.jpg')";
          } else if (
            !daytime_current &&
            !rain_current &&
            !showers_current &&
            !clouds_current &&
            !snowfall_current
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Clear Sky!`;
            iconCurrent.src = "/img/Icons/Night/Clear-Sky-Night.png";
            body.backgroundImage =
              "url('/img/BGs/Night/Clear-Sky-Night-BG 1920x1080.jpg')";
          } else if (
            !daytime_current &&
            !rain_current &&
            !showers_current &&
            snowfall_current
          ) {
            document.getElementById(
              "weather_description"
            ).textContent = `The Weather ${temperature_current}°C`;
            document.getElementById(
              "weather_description"
            ).textContent = `Snowing Outside!`;
            iconCurrent.src = "/img/Icons/Night/Snowy-Night.png";
            body.backgroundImage =
              "url('/img/BGs/Night/Snowy-Night-BG 1920x1080.jpg')";
          }

          /************************ Weekly Forecast icon change ************************/

          const daily10Data = index10Hour.map((index) => ({
            time: times_hourly[index],
            clouds: clouds_hourly[index],
            rain: rain_hourly[index],
            showers: showers_hourly[index],
            snowfall: snowfall_hourly[index],
          }));

          daily10Data.forEach((day, i) => {
            const iconWeekly = document.getElementById(
              `weather-icon-week--${i + 1}`
            );
            if (day.rain && day.showers) {
              iconWeekly.src = "/img/Icons/Day/Storm-Day.png";
            } else if (day.rain && !day.showers) {
              iconWeekly.src = "/img/Icons/Day/Rainy-Day.png";
            } else if (!day.rain && !day.showers && day.clouds <= 20) {
              iconWeekly.src = "/img/Icons/Day/Partly-Cloudy-Day.png";
            } else if (!day.rain && !day.showers && day.clouds > 20) {
              iconWeekly.src = "/img/Icons/Day/Cloudy-Day.png";
            } else if (
              !day.rain &&
              !day.showers &&
              !day.clouds &&
              !day.snowfall
            ) {
              iconWeekly.src = "/img/Icons/Day/Clear-Sunny-Day.png";
            } else if (!day.rain && !day.showers && day.snowfall) {
              iconWeekly.src = "/img/Icons/Day/Snowy-Day.png";
            }
          });

          /* Weekdays Cards Click Events - Change Date Data Accordingly */
          // Function to Get the Data of a Specific Date
          const getDayData = (dateStr) => {
            return times_hourly
              .map((time, index) => ({
                time,
                temp: temperature_hourly[index],
                rain: rain_hourly[index],
                showers: showers_hourly[index],
                clouds: clouds_hourly[index],
                snowfall: snowfall_hourly[index],
                daytime: is_day[index] === 1,
              }))
              .filter((entry) => entry.time.startsWith(dateStr));
          };

          for (let i = 1; i < 8; i++) {
            const weekdayElement = document.getElementById(`weekday-${i}`);

            // Using onclick for not repeating the usage of Event Listeners
            weekdayElement.onclick = () => {
              const dateStr = dates_weekly[i - 1];
              const dayData = getDayData(dateStr);

              // Clearing Previous Cells
              document
                .querySelectorAll(".cell")
                .forEach((cell) => (cell.innerHTML = ""));

              dayData.forEach((hour, j) => {
                document.getElementById(`cell_${j + 1}`).innerHTML = `
                ${tableIcons(
                  hour.daytime,
                  hour.rain,
                  hour.showers,
                  hour.clouds,
                  hour.snowfall
                )} <span class="cell-text">|
                ${timeIcon} ${hour.time.slice(11, 16)} |
                ${tempIcon} Temperature: ${hour.temp}</span>
                `;
              });

              card_front.classList.remove("open");
              card_front.classList.add("hidden");
              card_back.classList.remove("hidden");
              card_back.classList.add("open");
              frontCardVisible = false;
              document.getElementById(
                "card-title-back"
              ).innerHTML = `${city} - Weather Per Hour on ${dateStr}`;
            };
          }
          /* End of Weekdays Cards Click Events */

          /************************ Hourly (Today) Forecast icon change ***************************/
          /**
           * Determine the weather icon based on given conditions.
           *
           * @param {object} conditions
           * @param {number} conditions.rain
           * @param {number} conditions.showers
           * @param {number} conditions.clouds
           * @param {number} conditions.snowfall
           * @param {boolean} conditions.isDay
           * @returns {string} Path to the appropriate weather icon
           */
          function getIconPath(conditions) {
            const { rain, showers, clouds, snowfall, isDay } = conditions;

            if (isDay) {
              // Day
              if (rain > 0 && showers > 0) {
                return "/img/Icons/Day/Storm-Day.png";
              } else if (rain > 0 && showers === 0) {
                return "/img/Icons/Day/Rainy-Day.png";
              } else if (clouds <= 20) {
                return "/img/Icons/Day/Partly-Cloudy-Day.png";
              } else if (clouds > 20) {
                return "/img/Icons/Day/Cloudy-Day.png";
              } else if (snowfall > 0) {
                return "/img/Icons/Day/Snowy-Day.png";
              } else {
                return "/img/Icons/Day/Clear-Sunny-Day.png";
              }
            } else {
              // Night
              if (rain > 0 && showers > 0) {
                return "/img/Icons/Night/Storm-Night.png";
              } else if (rain > 0 && showers === 0) {
                return "/img/Icons/Night/Raining-Cloudy-Night.png";
              } else if (clouds <= 20) {
                return "/img/Icons/Night/Partly-Cloudy-Night.png";
              } else if (clouds > 20) {
                return "/img/Icons/Night/Cloudy-Night.png";
              } else if (snowfall > 0) {
                return "/img/Icons/Night/Snowy-Night.png";
              } else {
                return "/img/Icons/Night/Clear-Sky-Night.png";
              }
            }
          }
        });
      hideLoadingScreen();
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      hideLoadingScreen();
    });
};

//Getting Coordinates
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    // Calling updateWeather() with current location
    updateWeather(latitude, longitude);
  });
/* Function to Separate (Hour From Date) & (Sunrise or Sunset From Date) Week-Based or Current */
// Use: timeSpan(times_current, printCurrentTiming); //For Current Time & Date
// Use: timeSpan(times_hourly, printWeeklyTiming); //For Weekly-Hourly Time & Date
// Use: timeSpan(sunrise, printCurrentSunrise); //For Current Sunrise & Date
// Use: timeSpan(sunrise, printWeeklySunrise); //For Weekly Sunrise & Date
// Use: timeSpan(sunset, printCurrentSunset); //For Current Sunset & Date
// Use: timeSpan(sunset, printWeeklySunset); //For Weekly Sunset & Date
// Must call function with an argument

const card_front = document.getElementById("card_front");
const card_back = document.getElementById("card_back");
const icon = document.getElementById("toggleIcon");
const iconClose = document.getElementById("toggleIconClose");
let frontCardVisible = true;

icon.addEventListener("click", () => {
  card_front.classList.remove("open");
  card_front.classList.add("hidden");
  card_back.classList.remove("hidden");
  card_back.classList.add("open");
  frontCardVisible = !frontCardVisible;
  document.getElementById("card-title-back").innerHTML =
    "Weather Per Hour for Today!";
});

iconClose.addEventListener("click", () => {
  card_back.classList.remove("open");
  card_back.classList.add("hidden");
  card_front.classList.remove("hidden");
  card_front.classList.add("open");
  frontCardVisible = !frontCardVisible;
});

/********************************************* Search Bar *********************************************/
let wHeight = window.innerHeight;
const sb = document.getElementById("search-button");
const closeSB = document.getElementById("fullscreen-close-button");
const SearchOverlay = document.getElementById("search-overlay");
const searchBar = document.getElementById("fullscreen-searchform");
const searchInput = document.getElementById("fullscreen-search-input");
const suggestionsBox = document.getElementById("suggestions-box");

searchBar.style.top = wHeight / 2 + "px";

window.addEventListener("resize", () => {
  wHeight = window.innerHeight;
  searchBar.style.top = wHeight / 2 + "px";
});

// افتح الـ overlay لما تضغط على زرار البحث
sb.addEventListener("click", (e) => {
  e.stopPropagation();
  SearchOverlay.classList.add("fullscreen-search-overlay-show");
});

// اقفل الـ overlay لما تضغط على زرار الإغلاق
closeSB.addEventListener("click", (e) => {
  e.stopPropagation();
  SearchOverlay.classList.remove("fullscreen-search-overlay-show");
});

// اقفل الـ overlay لما تضغط في أي حتة برّه البحث أو الاقتراحات
document.addEventListener("click", (e) => {
  if (
    SearchOverlay.classList.contains("fullscreen-search-overlay-show") &&
    !searchBar.contains(e.target) &&
    !suggestionsBox.contains(e.target) &&
    e.target !== sb &&
    e.target !== closeSB
  ) {
    suggestionsBox.innerHTML = "";
    SearchOverlay.classList.remove("fullscreen-search-overlay-show");
  }
});

/* Search Suggestions */
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

  suggestionsBox.innerHTML = "";

  if (data.features) {
    data.features.forEach((feature) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.innerText = feature.properties.formatted;

      suggestionItem.addEventListener("click", () => {
        searchInput.value = feature.properties.formatted;
        suggestionsBox.innerHTML = "";

        const lat = feature.properties.lat;
        const lon = feature.properties.lon;

        updateWeather(lat, lon);
        SearchOverlay.classList.remove("fullscreen-search-overlay-show");
      });

      suggestionsBox.appendChild(suggestionItem);
    });
  }
});
