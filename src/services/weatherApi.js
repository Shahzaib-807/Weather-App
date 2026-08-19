import api from "./api";

export const getWeather = async (city) => {
  const response = await api.get("/weather", {
    params: {
      q: city,
    },
  });

  return response.data;
};

export const getWeatherByLocation = async (lat, lon) => {
  const response = await api.get("/weather", {
    params: {
      lat,
      lon,
    },
  });

  return response.data;
};

export const getForecast = async (city) => {
  const response = await api.get("/forecast", {
    params: {
      q: city,
    },
  });

  return response.data;
};

export const getForecastByLocation = async (lat, lon) => {
  const response = await api.get("/forecast", {
    params: {
      lat,
      lon,
    },
  });

  return response.data;
};

export const getLocationSuggestions = async (query) => {
  const response = await api.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: query,
        limit: 5,
      },
    }
  );

  return response.data;
};