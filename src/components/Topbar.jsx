export default function Topbar({
  city,
  setCity,
  showSuggestions,
  setShowSuggestions,
  handleSearch,
  suggestionsQuery,
  suggestions,
  handleSuggestionSelect,
}) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">WEATHER DASHBOARD</p>
        <h1>Weather Overview</h1>
      </div>

      <form className="dashboard-search" onSubmit={handleSearch}>
        <input
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (city.trim().length > 0) setShowSuggestions(true);
          }}
          placeholder="Search city..."
        />
        <button type="submit">⌕</button>

        {showSuggestions && city.trim() !== "" && (
          <div className="location-suggestions">
            {suggestionsQuery.isLoading && (
              <div className="suggestion-loading">Searching locations...</div>
            )}

            {!suggestionsQuery.isLoading &&
              suggestions.length === 0 &&
              !suggestionsQuery.isFetching && (
                <div className="suggestion-empty">No locations found</div>
              )}

            {suggestions.map((item, index) => (
              <button
                key={`${item.lat}-${item.lon}-${index}`}
                type="button"
                className="location-suggestion"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionSelect(item)}
              >
                <span className="suggestion-icon">📍</span>
                <span className="suggestion-content">
                  <strong>{item.name}</strong>
                  <small>
                    {item.state ? `${item.state}, ` : ""}
                    {item.country}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}
      </form>
    </header>
  );
}