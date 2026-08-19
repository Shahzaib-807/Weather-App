import {
  formatCitySunTime,
  getCityLocalDate,
  getSunProgress,
} from "../utils/weatherHelpers";

export default function DetailsPanel({
  weatherData,
  recentCities,
  favoriteCities,
  handleRecentCity,
  handleRemoveFavorite,
}) {
  let sunProgress = 0;
  let sunX = 10;
  let sunY = 55;
  let isDayTime = true;

  if (weatherData) {
    const cityNow = Math.floor(
      getCityLocalDate(weatherData.timezone).getTime() / 1000
    );
    isDayTime =
      cityNow >= weatherData.sys.sunrise && cityNow <= weatherData.sys.sunset;

    sunProgress = getSunProgress(
      weatherData.sys.sunrise,
      weatherData.sys.sunset,
      weatherData.timezone
    );

    const sunAngle = Math.PI - sunProgress * Math.PI;
    sunX = 50 + 40 * Math.cos(sunAngle);
    sunY = 55 - 40 * Math.sin(sunAngle);
  }

  return (
    <div className="details-panel">
      <div className="panel-header">
        <h2>Sun & Air</h2>
      </div>

      <div className="sun-arc-card">
        <div className="sun-arc-header">
          <div>
            <small>Sunrise</small>
            <strong>
              {formatCitySunTime(weatherData.sys.sunrise, weatherData.timezone)}
            </strong>
          </div>

          {/* Circle background remove kar diya hai, sirf percentage text bilkul center me show hoga */}
          <div
            className="sun-current"
            style={{
              background: "none",
              border: "none",
              boxShadow: "none",
              width: "auto",
              height: "auto",
              borderRadius: "0",
              fontWeight: "600",
            }}
          >
            {isDayTime ? `${Math.round(sunProgress * 100)}%` : "🌙 Night"}
          </div>

          <div className="sunset-time">
            <small>Sunset</small>
            <strong>
              {formatCitySunTime(weatherData.sys.sunset, weatherData.timezone)}
            </strong>
          </div>
        </div>

        <div className="sun-arc">
          <svg viewBox="0 0 100 65" className="sun-arc-svg">
            <path d="M 10 55 A 40 40 0 0 1 90 55" className="sun-arc-bg" />

            {isDayTime && (
              <>
                <path
                  d="M 10 55 A 40 40 0 0 1 90 55"
                  className="sun-arc-progress"
                  pathLength="1"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 1 - sunProgress,
                  }}
                />
                <circle cx={sunX} cy={sunY} r="4" className="sun-orb" />
                <circle cx={sunX} cy={sunY} r="8" className="sun-orb-glow" />
              </>
            )}
          </svg>

          <div className="sun-arc-labels">
            <span>🌅</span>
            <span>☀️</span>
            <span>🌇</span>
          </div>
        </div>

        <div className="sun-status">
          {isDayTime
            ? "Sun is currently above the horizon"
            : "Sunset has passed (Night time)"}
        </div>
      </div>

      <div className="air-progress">
        <div className="progress-title">
          Cloudiness
          <strong>{weatherData.clouds.all}%</strong>
        </div>

        <div className="progress-bar">
          <span style={{ width: `${weatherData.clouds.all}%` }} />
        </div>
      </div>

      {recentCities.length > 0 && (
        <div className="recent-mini">
          <h3>Recent Cities</h3>
          {recentCities.slice(0, 4).map((cityName) => (
            <button key={cityName} onClick={() => handleRecentCity(cityName)}>
              {cityName}
            </button>
          ))}
        </div>
      )}

      {favoriteCities.length > 0 && (
        <div className="favorites-mini">
          <h3>Favorites</h3>
          {favoriteCities.slice(0, 3).map((cityName) => (
            <div className="favorite-mini-row" key={cityName}>
              <button onClick={() => handleRecentCity(cityName)}>
                ★ {cityName}
              </button>
              <button onClick={() => handleRemoveFavorite(cityName)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}