import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1100
  );

  const API_KEY = "c19712e9f07fdfcfa189baa61f631878";

  // Detect screen size
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(
        window.innerWidth > 768 && window.innerWidth <= 1100
      );
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Grid Layout Logic
  const gridStyle = {
    display: "grid",
    gap: "20px",
    flex: 1,
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
      ? "1fr 1fr"
      : "1fr 1.5fr 1fr",
  };

  return (
    <div
      className={`app ${getTimeClass()}`}
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        color: "white",
      }}
    >
      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
          style={{
            padding: "12px 20px",
            borderRadius: "30px",
            border: "none",
            outline: "none",
            width: "clamp(220px, 40vw, 450px)",
          }}
        />
        <button
          onClick={fetchData}
          style={{
            padding: "12px 25px",
            borderRadius: "30px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Search
        </button>
      </div>

      {/* MAIN GRID */}
      <div style={gridStyle}>
        {/* LEFT CARD */}
        {data && (
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "25px",
              padding: "25px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "clamp(3rem,6vw,6rem)", fontWeight: 200 }}>
                {Math.round(data.main.temp)}°
              </h1>
              <h3>{data.weather[0].main}</h3>
              <p>Feels like {Math.round(data.main.feels_like)}°</p>
            </div>

            <div style={{ marginTop: "25px", display: "grid", gap: "10px" }}>
              <div>
                <small>Wind</small>
                <p>{data.wind.speed} m/s</p>
              </div>
              <div>
                <small>Humidity</small>
                <p>{data.main.humidity}%</p>
              </div>
              <div>
                <small>Pressure</small>
                <p>{data.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        )}

        {/* MAP CARD */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "25px",
            overflow: "hidden",
            minHeight: "300px",
          }}
        >
          {data ? (
            <iframe
              title="city-map"
              src={`https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=10&output=embed`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              Enter a city to see the map
            </div>
          )}
        </div>

        {/* RIGHT CARD */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "25px",
            padding: "25px",
          }}
        >
          <h2>7-Day Forecast</h2>

          <div style={{ marginTop: "15px", display: "grid", gap: "10px" }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                }}
              >
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