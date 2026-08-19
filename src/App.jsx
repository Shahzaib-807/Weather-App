import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getWeather,
  getWeatherByLocation,
  getForecast,
  getForecastByLocation,
  getLocationSuggestions,
} from "./services/weatherApi";
import { getWeatherTheme } from "./utils/weatherHelpers";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import WeatherEffects from "./components/WeatherEffects";
import MainWeatherCard from "./components/MainWeatherCard";
import Highlights from "./components/Highlights";
import ForecastPanel from "./components/ForecastPanel";
import DetailsPanel from "./components/DetailsPanel";

function App() {
  const [city, setCity] = useState("Haripur");
  const [searchCity, setSearchCity] = useState("Haripur");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [unit, setUnit] = useState("C");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedCity, setDebouncedCity] = useState("");

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("appTheme") || "dark";
    } catch {
      return "dark";
    }
  });

  const [recentCities, setRecentCities] = useState(() => {
    try {
      const saved = localStorage.getItem("recentCities");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteCities, setFavoriteCities] = useState(() => {
    try {
      const saved = localStorage.getItem("favoriteCities");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
    document.body.className = theme === "light" ? "light-mode" : "dark-mode";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCity(city.trim()), 350);
    return () => clearInterval(timer);
  }, [city]);

  const cityWeatherQuery = useQuery({
    queryKey: ["weather", searchCity],
    queryFn: () => getWeather(searchCity),
    enabled: !location && !!searchCity,
    refetchInterval: 1000 * 60 * 10,
  });

  const locationWeatherQuery = useQuery({
    queryKey: ["locationWeather", location],
    queryFn: () => getWeatherByLocation(location.lat, location.lon),
    enabled: !!location,
    refetchInterval: 1000 * 60 * 10,
  });

  const cityForecastQuery = useQuery({
    queryKey: ["forecast", searchCity],
    queryFn: () => getForecast(searchCity),
    enabled: !location && !!searchCity,
    refetchInterval: 1000 * 60 * 10,
  });

  const locationForecastQuery = useQuery({
    queryKey: ["locationForecast", location],
    queryFn: () => getForecastByLocation(location.lat, location.lon),
    enabled: !!location,
    refetchInterval: 1000 * 60 * 10,
  });

  const suggestionsQuery = useQuery({
    queryKey: ["locationSuggestions", debouncedCity],
    queryFn: () => getLocationSuggestions(debouncedCity),
    enabled: showSuggestions && debouncedCity.length > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });

  useEffect(() => {
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }, [recentCities]);

  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  const weatherData = location
    ? locationWeatherQuery.data
    : cityWeatherQuery.data;

  const forecastData = location
    ? locationForecastQuery.data
    : cityForecastQuery.data;

  const isLoading = location
    ? locationWeatherQuery.isLoading || locationForecastQuery.isLoading
    : cityWeatherQuery.isLoading || cityForecastQuery.isLoading;

  const isRefreshing = location
    ? locationWeatherQuery.isFetching || locationForecastQuery.isFetching
    : cityWeatherQuery.isFetching || cityForecastQuery.isFetching;

  const isError = location
    ? locationWeatherQuery.isError || locationForecastQuery.isError
    : cityWeatherQuery.isError || cityForecastQuery.isError;

  const error = location
    ? locationWeatherQuery.error || locationForecastQuery.error
    : cityWeatherQuery.error || cityForecastQuery.error;

  const suggestions = suggestionsQuery.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setLocation(null);
    setLocationError("");
    setSearchCity(trimmedCity);
    setShowSuggestions(false);

    setRecentCities((previousCities) => {
      const filtered = previousCities.filter(
        (item) => item.toLowerCase() !== trimmedCity.toLowerCase()
      );
      return [trimmedCity, ...filtered].slice(0, 6);
    });
  };

  const handleSuggestionSelect = (item) => {
    const selectedCity = item.name;
    setCity(selectedCity);
    setShowSuggestions(false);
    setLocationError("");
    setLocation({ lat: item.lat, lon: item.lon });

    setRecentCities((previousCities) => {
      const filtered = previousCities.filter(
        (cityName) => cityName.toLowerCase() !== selectedCity.toLowerCase()
      );
      return [selectedCity, ...filtered].slice(0, 6);
    });
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setShowSuggestions(false);
      },
      () => {
        setLocationError("Location permission denied. Please allow location access.");
      }
    );
  };

  const handleRecentCity = (cityName) => {
    setCity(cityName);
    setLocation(null);
    setLocationError("");
    setSearchCity(cityName);
    setShowSuggestions(false);
  };

  const handleFavorite = () => {
    if (!weatherData || location) return;
    const currentCity = weatherData.name;

    setFavoriteCities((previousFavorites) => {
      const exists = previousFavorites.some(
        (item) => item.toLowerCase() === currentCity.toLowerCase()
      );
      if (exists) {
        return previousFavorites.filter(
          (item) => item.toLowerCase() !== currentCity.toLowerCase()
        );
      }
      return [...previousFavorites, currentCity];
    });
  };

  const handleRemoveFavorite = (cityName) => {
    setFavoriteCities((previousFavorites) =>
      previousFavorites.filter(
        (item) => item.toLowerCase() !== cityName.toLowerCase()
      )
    );
  };

  const handleRefresh = () => {
    if (location) {
      locationWeatherQuery.refetch();
      locationForecastQuery.refetch();
    } else {
      cityWeatherQuery.refetch();
      cityForecastQuery.refetch();
    }
  };

  const isFavorite =
    weatherData &&
    favoriteCities.some(
      (item) => item.toLowerCase() === weatherData.name.toLowerCase()
    );

  return (
    <div className={`dashboard ${getWeatherTheme(weatherData)} ${theme}-mode`}>
      <WeatherEffects weatherData={weatherData} />

      <Sidebar
        handleLocation={handleLocation}
        handleRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="dashboard-main">
        <Topbar
          city={city}
          setCity={setCity}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          handleSearch={handleSearch}
          suggestionsQuery={suggestionsQuery}
          suggestions={suggestions}
          handleSuggestionSelect={handleSuggestionSelect}
        />

        {locationError && <div className="error-box">{locationError}</div>}

        {isLoading && (
          <div className="dashboard-loading">
            <div className="big-spinner" />
            <p>Loading weather...</p>
          </div>
        )}

        {isError && (
          <div className="error-box">
            {error?.response?.data?.message || "Unable to fetch weather"}
          </div>
        )}

        {weatherData && !isLoading && !isError && (
          <>
            <section className="dashboard-grid">
              <MainWeatherCard
                weatherData={weatherData}
                unit={unit}
                setUnit={setUnit}
                handleFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
              <Highlights
                weatherData={weatherData}
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </section>

            <section className="bottom-grid">
              <ForecastPanel forecastData={forecastData} unit={unit} />
              <DetailsPanel
                weatherData={weatherData}
                recentCities={recentCities}
                favoriteCities={favoriteCities}
                handleRecentCity={handleRecentCity}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
  
export default App;