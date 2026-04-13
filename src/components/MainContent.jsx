import HabitTracker from './HabitTracker'
import ConsistencyChart from './ConsistencyChart'
import './MainContent.css'

export default function MainContent({ habits, toggleHabit }) {
  return (
    <main className="main-content">
      <div className="content-wrapper">
        <div className="tracker-section">
          <HabitTracker habits={habits} toggleHabit={toggleHabit} />
        </div>
        
        <aside className="chart-section">
          <ConsistencyChart />
        </aside>
      </div>
    </main>
  )
}
