import { getWindDirection, getHumidityStatus } from "../utils/weatherHelpers";

export default function Highlights({ weatherData, handleRefresh, isRefreshing }) {
  return (
    <div className="highlights">
      <div className="section-title-row">
        <h2>Today's Highlights</h2>
        <button
          className="refresh-small"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          ↻
        </button>
      </div>

      <div className="highlight-grid">
        <div className="highlight-card">
          <p className="highlight-label">Wind Status</p>
          <div className="highlight-icon">🌬️</div>
          <div className="highlight-value">
            {weatherData.wind.speed}
            <span> m/s</span>
          </div>
          <div className="highlight-bottom">
            {getWindDirection(weatherData.wind.deg)} direction
          </div>
        </div>

        <div className="highlight-card">
          <p className="highlight-label">Humidity</p>
          <div className="highlight-icon">💧</div>
          <div className="highlight-value">
            {weatherData.main.humidity}
            <span>%</span>
          </div>
          <div className="highlight-bottom">
            {getHumidityStatus(weatherData.main.humidity)}
          </div>
        </div>

        <div className="highlight-card">
          <p className="highlight-label">Wind Gust</p>
          <div className="highlight-icon">💨</div>
          <div className="highlight-value">
            {weatherData.wind.gust
              ? weatherData.wind.gust.toFixed(1)
              : weatherData.wind.speed.toFixed(1)}
            <span> m/s</span>
          </div>
          <div className="highlight-bottom">Maximum wind gust</div>
        </div>

        <div className="highlight-card">
          <p className="highlight-label">Visibility</p>
          <div className="highlight-icon">◉</div>
          <div className="highlight-value">
            {(weatherData.visibility / 1000).toFixed(1)}
            <span> km</span>
          </div>
          <div className="highlight-bottom">Visibility range</div>
        </div>
      </div>
    </div>
  );
}