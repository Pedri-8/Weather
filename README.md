# 🌦️ Weather Dashboard

A simple and responsive weather app built with **React.js**. Users can search any city and get real-time weather updates including temperature, humidity, wind speed, and weather conditions — powered by the **OpenWeatherMap API**.

---

## 🔗 Live Demo

👉 [Check it out here](https://weather-flax-two.vercel.app/)

---

## 🛠️ Tech Stack

- **React.js** – UI library
- **Tailwind CSS** – Styling
- **OpenWeatherMap API** – Weather data
- **React Hooks** – State & side-effect management

---

## ✨ Features

- 🔍 Search for any city to get real-time weather
- 🌡️ Displays temperature, weather condition, humidity, and wind speed
- 🌤️ Weather icon provided by OpenWeatherMap
- 🌗 Dark/Light mode toggle
- ⏳ Loading state while fetching
- ❌ Friendly error messages for invalid city names or API failures
- 🕘 Shows last 5 searched cities for quick access
- 🔄 Refresh current city’s weather manually
- 📱 Fully responsive for mobile and desktop

---

## 📦 Getting Started

To run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/Pedri-8/Weather.git
cd Weather
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root and add your OpenWeatherMap API key:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev   # if using Vite
# or
npm start     # if using CRA
```

---

## 🌐 API Integration

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current):

```
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
```

* Free tier supports up to 60 calls per minute
* API key is stored securely using environment variables

---
