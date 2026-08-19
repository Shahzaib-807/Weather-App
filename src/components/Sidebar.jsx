export default function Sidebar({
  handleLocation,
  handleRefresh,
  isRefreshing,
  theme,
  toggleTheme,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✣</div>
        <span>Weather</span>
      </div>

      <nav className="side-nav">
        <button className="nav-item active" title="Dashboard">
          <span className="nav-icon">▦</span>
          <span className="nav-text">Dashboard</span>
        </button>

        <button
          className="nav-item"
          onClick={handleLocation}
          title="Use My Current Location"
        >
          <span className="nav-icon">📍</span>
          <span className="nav-text">Current Location</span>
        </button>

        <button
          className="nav-item"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh Weather"
        >
          <span className="nav-icon">↻</span>
          <span className="nav-text">Refresh</span>
        </button>

        <button
          className="nav-item theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          <span className="nav-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span className="nav-text">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </nav>
    </aside>
  );
}