import './ConsistencyChart.css'

export default function ConsistencyChart() {
  const weeks = ['W48', 'W49', 'W50']
  const consistencyData = [37, 37, 37]

  // Simple SVG line chart
  const generatePath = () => {
    const width = 280
    const height = 180
    const padding = 20
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2
    const maxValue = 100

    const points = [
      { x: 0, y: 80 },
      { x: 20, y: 70 },
      { x: 40, y: 65 },
      { x: 60, y: 45 },
      { x: 80, y: 50 },
      { x: 100, y: 35 },
      { x: 120, y: 42 },
    ]

    const pathParts = points.map((p, i) => {
      const x = padding + (p.x / 120) * graphWidth
      const y = padding + graphHeight - (p.y / 100) * graphHeight
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })

    return pathParts.join(' ')
  }

  return (
    <div className="consistency-chart">
      <div className="chart-header">
        <h3>Consistency</h3>
        <span className="average">Average: 55.667%</span>
      </div>

      <div className="week-stats">
        {weeks.map((week, index) => (
          <div key={week} className="week-stat">
            <div className="stat-label">{week}</div>
            <div className="stat-value">{consistencyData[index]}%</div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill" 
                style={{ width: `${consistencyData[index]}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <p className="chart-note">Consistency</p>
        <svg viewBox="0 0 320 200" className="chart-svg">
          {/* Grid lines */}
          <line x1="20" y1="160" x2="300" y2="160" stroke="var(--chart-grid)" strokeWidth="1" />
          <line x1="20" y1="120" x2="300" y2="120" stroke="var(--chart-grid)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="20" y1="80" x2="300" y2="80" stroke="var(--chart-grid)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="20" y1="40" x2="300" y2="40" stroke="var(--chart-grid)" strokeWidth="1" strokeDasharray="2,2" />

          {/* Y-axis labels */}
          <text x="10" y="165" fontSize="10" fill="var(--text-muted)" textAnchor="end">0%</text>
          <text x="10" y="125" fontSize="10" fill="var(--text-muted)" textAnchor="end">50%</text>
          <text x="10" y="45" fontSize="10" fill="var(--text-muted)" textAnchor="end">100%</text>

          {/* Line chart */}
          <path
            d={generatePath()}
            stroke="var(--chart-line)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--chart-line)' }}></div>
          <span>Consistency</span>
        </div>
      </div>
    </div>
  )
}
