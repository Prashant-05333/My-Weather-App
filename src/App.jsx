import { useState } from "react"
import "./App.css"

function App() {

  const [city, setCity] = useState("")
  const [data, setData] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const API_KEY = "6ffbe5c120551c2d6b4d2fe70a5e0a25"

  async function fetchWeather() {
    if (!city) return

    try {
      setError("")
      setLoading(true)

      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )

      if (!res.ok) throw new Error()

      const result = await res.json()
      setData(result)

      // Forecast
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      )

      const result2 = await res2.json()
      const daily = result2.list.filter((_, i) => i % 8 === 0)
      setForecast(daily)

      setLoading(false)

    } catch {
      setError("❌ City not found")
      setLoading(false)
    }
  }

  // 📍 GPS Location
  function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )

      const result = await res.json()
      setData(result)
    })
  }

  // Icon
  function getIcon(weather) {
    weather = weather.toLowerCase()
    if (weather.includes("cloud")) return "☁️"
    if (weather.includes("rain")) return "🌧️"
    if (weather.includes("clear")) return "☀️"
    return "🌤️"
  }
  let bgImage = "https://images.unsplash.com/photo-1501973801540-537f08ccae7b"; // default sunny

if (data) {
  const weather = data.weather[0].main;

  if (weather === "Clear") {
    bgImage = "https://images.unsplash.com/photo-1501973801540-537f08ccae7b"; // ☀️ sunny
  } 
  else if (weather === "Clouds") {
    bgImage = "https://images.unsplash.com/photo-1499346030926-9a72daac6c63"; // ☁️ cloudy
  } 
  else if (weather === "Rain" || weather === "Drizzle") {
    bgImage = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29"; // 🌧️ rain
  } 
  else if (weather === "Snow") {
    bgImage = "https://images.unsplash.com/photo-1483664852095-d6cc6870702d"; // ❄️ snow
  } 
  else if (weather === "Mist" || weather === "Fog" || weather === "Haze") {
    bgImage = "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227"; // 🌫️ fog
  }
}

  return (
    <div className="app" style={{ backgroundImage: `url(${bgImage})` }}>

      <h1>🌦️ Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchWeather()
          }}
        />

        <button onClick={fetchWeather}>Search</button>
        <button onClick={getLocationWeather}>📍</button>
      </div>

      {loading && <p className="loading">⏳ Loading...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="weat">
          <h2>🏙️ {data.name}</h2>
          <h1 className="temp">{data.main.temp}°C</h1>

          <h3>
            {getIcon(data.weather[0].description)}{" "}
            {data.weather[0].description}
          </h3>

          <p>💧 Humidity: {data.main.humidity}%</p>
          <p>🌬️ Wind: {data.wind.speed} km/h</p>

          <p>
            🌅 Sunrise:{" "}
            {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
        </div>

      )}

      {/* 📅 Forecast */}
      {forecast.length > 0 && (
        <div className="forecast">
          <h2>📅 7-Day Forecast</h2><br></br>

          <div className="forecast-box">
            {forecast.map((item, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                <h3>{item.main.temp}°C</h3>
                <p>{getIcon(item.weather[0].description)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default App