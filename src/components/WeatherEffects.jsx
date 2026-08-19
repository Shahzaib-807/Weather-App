export default function WeatherEffects({ weatherData }) {
  if (!weatherData) return null;
  const code = weatherData.weather[0].id;

  if (code >= 200 && code <= 232) {
    return (
      <div className="weather-effect rain-effect">
        {Array.from({ length: 35 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              animationDelay: `${(index % 10) * 0.18}s`,
              animationDuration: `${0.8 + (index % 5) * 0.12}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (code >= 300 && code <= 599) {
    return (
      <div className="weather-effect rain-effect">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 41) % 100}%`,
              animationDelay: `${(index % 12) * 0.16}s`,
              animationDuration: `${0.9 + (index % 4) * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (code >= 600 && code <= 622) {
    return (
      <div className="weather-effect snow-effect">
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 43) % 100}%`,
              animationDelay: `${(index % 12) * 0.25}s`,
              animationDuration: `${4 + (index % 4)}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (code === 800) {
    return <div className="weather-effect glow-effect" />;
  }

  if (code >= 801 && code <= 804) {
    return (
      <div className="weather-effect cloud-effect">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return null;
}