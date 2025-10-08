# ☀️ Modern Weather Forecast Application

This repository contains a dynamic, single-page weather application that provides current conditions, an hourly forecast for the day, and a seven-day weather outlook for any location worldwide. It prioritizes a smooth user experience by effectively managing data fetching and display.

## ✨ Features and Functionality

This application is built around the user's location and their need for real-time, detailed weather information.

* **🗺️ Geolocation-Based Current Weather:** Automatically fetches and displays the current weather conditions (temperature, cloud cover, etc.) for the user's precise location using the browser's `navigator.geolocation` API.
* **🕒 Hourly Forecast (Today):** Provides a detailed 24-hour forecast, showing temperature and dynamic weather icons for each hour of the current day in a collapsible table/card view.
* **📅 Seven-Day Weekly Outlook:** Displays forecast icons and dates for the upcoming week, giving users a quick overview of long-term trends.
* **🔍 Comprehensive Location Search:** Allows users to search for weather data anywhere in the world using an integrated full-screen search bar and an autocomplete service (Geoapify API).
* **🎨 Dynamic UI/UX:** The application features a dynamic background and weather icon that changes instantly based on the current weather conditions (e.g., sunny, rainy, stormy, day/night).
* **🔄 Seamless Data Handling:** Employs asynchronous JavaScript (`fetch` with Promises) to handle multiple external API calls efficiently.

---

🛠️ API & Data Sources
This application relies on the following external APIs:

Weather Data: Open-Meteo API (Used for all weather and forecast data).

Reverse Geocoding: LocationIQ API (Used to translate the user's latitude and longitude coordinates into a human-readable city and country name).

Search Autocomplete: Geoapify API (Used to provide real-time suggestions for the search bar and retrieve coordinates for any searched location).
