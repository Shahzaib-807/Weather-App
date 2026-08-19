export const formatTemperature = (celsius, unit) => {
  if (unit === "F") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

export const getCityLocalDate = (timezoneOffsetInSeconds, timestampMs = Date.now()) => {
  const localBrowserOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
  const utcMs = timestampMs + localBrowserOffsetMs;
  return new Date(utcMs + timezoneOffsetInSeconds * 1000);
};

export const formatCityDate = (timezone) => {
  if (timezone === undefined) return "";
  const cityDate = getCityLocalDate(timezone);
  return cityDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatCityTime = (timezone) => {
  if (timezone === undefined) return "";
  const cityDate = getCityLocalDate(timezone);
  return cityDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatCitySunTime = (timestamp, timezone) => {
  if (!timestamp || timezone === undefined) return "N/A";
  const cityDate = getCityLocalDate(timezone, timestamp * 1000);
  return cityDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatUpdatedTime = (timestamp, timezone) => {
  if (!timestamp || timezone === undefined) return "";
  const cityDate = getCityLocalDate(timezone, timestamp * 1000);
  return cityDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getWindDirection = (degrees) => {
  if (degrees === undefined || degrees === null) return "N/A";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const getHumidityStatus = (humidity) => {
  if (humidity < 30) return "Dry";
  if (humidity < 60) return "Comfortable";
  if (humidity < 75) return "Humid";
  return "Very Humid";
};

export const getSunProgress = (sunrise, sunset, timezone) => {
  if (!sunrise || !sunset || timezone === undefined) return 0;
  const cityCurrentTimeSeconds = Math.floor(
    getCityLocalDate(timezone).getTime() / 1000
  );
  if (cityCurrentTimeSeconds < sunrise || cityCurrentTimeSeconds > sunset) {
    return 0;
  }
  return (cityCurrentTimeSeconds - sunrise) / (sunset - sunrise);
};

export const getWeatherTheme = (weatherData) => {
  if (!weatherData) return "dashboard-default";
  const code = weatherData.weather[0].id;
  if (code >= 200 && code <= 232) return "dashboard-storm";
  if (code >= 300 && code <= 599) return "dashboard-rain";
  if (code >= 600 && code <= 622) return "dashboard-snow";
  if (code === 800) return "dashboard-clear";
  return "dashboard-clouds";
};