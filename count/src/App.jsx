import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);

  const API_KEY = "c19712e9f07fdfcfa189baa61f631878";

  function getTimeClass() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 20) return "evening";
    return "night";
  }

  async function fetchData() {
    if (!input) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${API_KEY}&units=metric`
      );
      const jsonData = await response.json();
      if (jsonData.cod === 200) setData(jsonData);
      else alert("City not found");
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const getDay = (offset) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return days[d.getDay()];
  };

  return (
    <div className={`app ${getTimeClass()}`}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
        />
        <button onClick={fetchData}>Search</button>
      </div>

      <div className="main-container">
        {/* LEFT CARD: CURRENT WEATHER */}
        {data && (
          <div className="left-card">
            <div className="top-info">
              <h1>{Math.round(data.main.temp)}°</h1>
              <div className="weather-condition">
                <h3>{data.weather[0].main}</h3>
                <p>Feels like {Math.round(data.main.feels_like)}°</p>
              </div>
            </div>
            <div className="bottom-details">
              <div className="info-box"><span>Wind</span><p>{data.wind.speed}m/s</p></div>
              <div className="info-box"><span>Humidity</span><p>{data.main.humidity}%</p></div>
              <div className="info-box"><span>Pressure</span><p>{data.main.pressure}hPa</p></div>
            </div>
          </div>
        )}

        {/* MIDDLE CARD: DYNAMIC MAP */}
        <div className="map-card">
          {data ? (
            <iframe
              title="city-map"
              src={`https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=10&output=embed`}
            ></iframe>
          ) : (
            <div className="map-placeholder">Enter a city to see the map</div>
          )}
        </div>

        {/* RIGHT CARD: WEEKLY FORECAST */}
        <div className="right-card">
          <h2>7-Day Forecast</h2>
          <div className="forecast-container">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="day-row">
                <span>{i === 0 ? "Today" : getDay(i)}</span>
                <span>☀️</span>
                <p>{data ? Math.round(data.main.temp - i) : "--"}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

