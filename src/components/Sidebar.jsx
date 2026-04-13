import './Sidebar.css'

export default function Sidebar({ pages, selectedPage, onSelectPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>📌</h2>
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
        <button className="add-page">+ New page</button>
      </div>
    </aside>
  )
}
