import HabitTracker from './HabitTracker'
import ConsistencyChart from './ConsistencyChart'
import './MainContent.css'

export default function MainContent({
  habits,
  toggleHabit,
  onRenameHabit,
  onDuplicateHabit,
  onSetHabitAllDays,
  onMoveHabitToTop,
  onDeleteHabit,
  onToggleHabitPriority
}) {
  return (
    <main className="main-content">
      <div className="content-wrapper">
        <div className="tracker-section">
          <HabitTracker
            habits={habits}
            toggleHabit={toggleHabit}
            onRenameHabit={onRenameHabit}
            onDuplicateHabit={onDuplicateHabit}
            onSetHabitAllDays={onSetHabitAllDays}
            onMoveHabitToTop={onMoveHabitToTop}
            onDeleteHabit={onDeleteHabit}
            onToggleHabitPriority={onToggleHabitPriority}
          />
        </div>
        
        <aside className="chart-section">
          <ConsistencyChart />
        </aside>
      </div>
    </main>
  )
}
