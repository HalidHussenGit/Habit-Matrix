import './HabitTracker.css'

export default function HabitTracker({ habits, toggleHabit }) {
  const weeks = [
    { number: 48, abbr: 'W48' },
    { number: 49, abbr: 'W49' },
    { number: 50, abbr: 'W50' }
  ]

  return (
    <div className="habit-tracker">
      <div className="tracker-header">
        <div className="header-top">
          <h1>⚡</h1>
          <div className="period-selector">
            <button className="period-btn active">3 weeks</button>
            <span className="separator">|</span>
            <button className="period-btn">All weeks</button>
          </div>
        </div>
      </div>

      <div className="habits-table">
        <div className="table-header">
          <div className="habit-name-header">Habit</div>
          {weeks.map((week) => (
            <div key={week.number} className="week-header habit-checkbox-header">
              <span className="week-label">{week.abbr}</span>
            </div>
          ))}
          <div className="habit-actions-header"></div>
        </div>

        <div className="habits-list">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-row">
              <div className="habit-name">
                {habit.name.startsWith('✓') ? '✓' : ''}
                {habit.name}
              </div>
              
              {weeks.map((week, weekIndex) => (
                <div
                  key={`${habit.id}-${weekIndex}`}
                  className="habit-checkbox-cell"
                >
                  <input
                    type="checkbox"
                    className="habit-checkbox"
                    checked={habit.completed[weekIndex] || false}
                    onChange={() => toggleHabit(habit.id, weekIndex)}
                  />
                </div>
              ))}

              <div className="habit-actions">
                <button className="action-btn more-btn">⋯</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
