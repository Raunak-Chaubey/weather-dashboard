import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const apiKey = '93f4e96bdae4e52bdbc5de3009303ec1'; 

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      } else {
        setError('City not found!');
      }
    } catch (error) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getBackgroundClass = () => {
    if (!weather) return 'bg-default';
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes('cloud')) return 'bg-cloudy';
    if (condition.includes('rain')) return 'bg-rainy';
    if (condition.includes('clear')) return 'bg-sunny';
    return 'bg-default';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const toggleTemp = () => setIsCelsius(!isCelsius);

  const temp = weather
    ? isCelsius
      ? Math.round(weather.main.temp)
      : Math.round((weather.main.temp * 9) / 5 + 32)
    : null;

  return (
    <div className={`app ${getBackgroundClass()} ${isDarkMode ? 'dark' : ''}`}>
      <div className="container">
        <div className="header">
          <h1>Weather Dashboard</h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="mode-toggle">
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Check Weather
          </button>
        </form>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && !loading && !error && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p className="date">{currentDate}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="weather-icon"
            />
            <p className="temp">
              {temp}°{isCelsius ? 'C' : 'F'}
              <button onClick={toggleTemp} className="temp-toggle">
                Switch to {isCelsius ? '°F' : '°C'}
              </button>
            </p>
            <p className="description">{weather.weather[0].description}</p>
            <div className="details">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;