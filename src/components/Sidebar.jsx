import './Sidebar.css'

export default function Sidebar({
  pages,
  selectedPage,
  onSelectPage,
  theme,
  onToggleTheme,
  onAddHabit,
  onFinishWeek
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>📌</h2>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {pages.map((page) => (
          <button
            key={page.id}
            className={`nav-item ${selectedPage === page.id ? 'active' : ''}`}
            onClick={() => onSelectPage(page.id)}
          >
            <span className="nav-icon">{page.icon}</span>
            <span className="nav-name">{page.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-actions">
        <button className="sidebar-action-btn" type="button" onClick={onAddHabit}>
          + Add Habit
        </button>
        <button className="sidebar-action-btn finish-week-btn" type="button" onClick={onFinishWeek}>
          Finish the Week
        </button>
      </div>
    </aside>
  )
}
