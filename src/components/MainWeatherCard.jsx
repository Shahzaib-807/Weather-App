import {
  formatCityDate,
  formatCityTime,
  formatTemperature,
  formatUpdatedTime,
} from "../utils/weatherHelpers";

export default function MainWeatherCard({
  weatherData,
  unit,
  setUnit,
  handleFavorite,
  isFavorite,
}) {
  return (
    <div className="main-weather-card">
      <div className="weather-card-top">
        <div>
          <p className="small-label">CURRENT WEATHER</p>
          <p className="weather-date">
            {formatCityDate(weatherData.timezone)}
          </p>
          <p className="city-local-time">
            Local time: {formatCityTime(weatherData.timezone)}
          </p>
        </div>

        <div className="weather-actions">
          <button
            onClick={() => setUnit("C")}
            className={unit === "C" ? "unit-active" : ""}
          >
            °C
          </button>
          <button
            onClick={() => setUnit("F")}
            className={unit === "F" ? "unit-active" : ""}
          >
            °F
          </button>
          <button onClick={handleFavorite} className="star-button">
            {isFavorite ? "★" : "☆"}
          </button>
        </div>
      </div>

      <div className="main-weather-content">
        <div className="weather-visual">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>

        <div className="main-temp">
          <div className="temperature-big">
            {formatTemperature(weatherData.main.temp, unit)}
            <span>°{unit}</span>
          </div>

          <p className="condition">{weatherData.weather[0].description}</p>

          <div className="location-info">
            <span>📍</span>
            <div>
              <strong>{weatherData.name}</strong>
              <small>{weatherData.sys.country}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="main-weather-footer">
        <div>
          <span>🌡</span>
          Feels like
          <strong>
            {formatTemperature(weatherData.main.feels_like, unit)}°{unit}
          </strong>
        </div>

        <div>
          <span>↑</span>
          High
          <strong>
            {formatTemperature(weatherData.main.temp_max, unit)}°{unit}
          </strong>
        </div>

        <div>
          <span>↓</span>
          Low
          <strong>
            {formatTemperature(weatherData.main.temp_min, unit)}°{unit}
          </strong>
        </div>
      </div>

      <div className="updated-info">
        Last updated: {formatUpdatedTime(weatherData.dt, weatherData.timezone)}
      </div>
    </div>
  );
}