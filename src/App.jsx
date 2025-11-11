import React, { useState, useEffect } from 'react';
import './App.css';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('London'); //   Default city

  // Replace with your OpenWeatherMap API key
  const API_KEY = '322ebaa7f11dae0a90ad2373ac5bc12f';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeatherData = async (cityName = city) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // Update document title with current temperature
      document.title = `${Math.round(data.main.temp)}°C - ${data.name} Weather`;
      
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and auto-refresh every 5 minutes
  useEffect(() => {
    fetchWeatherData();

    const interval = setInterval(() => {
      fetchWeatherData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [city]);

  const handleRefresh = () => {
    fetchWeatherData();
  };

  const handleCityChange = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData(e.target.value);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading && !weatherData) {
    return (
      <div className="weather-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-dashboard">
      <div className="dashboard-header">
        <h1>Weather Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter city name..."
            onKeyPress={handleCityChange}
            className="city-input"
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Try Again
          </button>
        </div>
      )}

      {weatherData && (
        <div className="weather-card">
          <div className="weather-header">
            <div className="location-info">
              <h2>{weatherData.name}, {weatherData.sys.country}</h2>
              <p className="date">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="current-weather">
            <div className="temperature-section">
              <div className="temp-main">
                <span className="temperature">
                  {Math.round(weatherData.main.temp)}°C
                </span>
                <div className="weather-description">
                  <img
                    src={getWeatherIcon(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].description}
                    className="weather-icon"
                  />
                  <p className="description">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">
                  {Math.round(weatherData.main.feels_like)}°C
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">
                  {weatherData.main.humidity}%
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">
                  {weatherData.wind.speed} m/s
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">
                  {weatherData.main.pressure} hPa
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Min Temp</span>
                <span className="detail-value">
                  {Math.round(weatherData.main.temp_min)}°C
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Temp</span>
                <span className="detail-value">
                  {Math.round(weatherData.main.temp_max)}°C
                </span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="refresh-overlay">
              <div className="spinner small"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;