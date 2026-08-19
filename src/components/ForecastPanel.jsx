import { formatTemperature } from "../utils/weatherHelpers";

export default function ForecastPanel({ forecastData, unit }) {
  // Har unique date ka pehla time slot collect karne ke liye logic
  const getDailyForecasts = (list) => {
    if (!list) return [];
    const dailyMap = new Map();

    list.forEach((item) => {
      // Date string extract kar rahe hain (YYYY-MM-DD)
      const date = item.dt_txt.split(" ")[0];
      
      // Agar ye date map me nahi hai, ya agar ye slot 12:00:00 ke ziada kareeb hai
      if (!dailyMap.has(date)) {
        dailyMap.set(date, item);
      } else if (item.dt_txt.includes("12:00:00")) {
        dailyMap.set(date, item);
      }
    });

    return Array.from(dailyMap.values());
  };

  const dailyList = getDailyForecasts(forecastData?.list);

  return (
    <div className="forecast-panel">
      <div className="panel-header">
        <h2>7 Days Forecast</h2>
        <span>Daily</span>
      </div>

      <div className="forecast-table">
        {dailyList.slice(0, 7).map((item) => (
          <div className="forecast-row" key={item.dt}>
            <div className="forecast-day">
              {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />

            <div className="forecast-condition">
              {item.weather[0].description}
            </div>

            <div className="forecast-temp-row">
              {formatTemperature(item.main.temp, unit)}°{unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}