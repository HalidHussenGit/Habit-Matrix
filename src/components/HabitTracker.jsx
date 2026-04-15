import { useEffect, useState } from 'react'
import './HabitTracker.css'

export default function HabitTracker({
  habits,
  toggleHabit,
  onRenameHabit,
  onDuplicateHabit,
  onSetHabitAllDays,
  onMoveHabitToTop,
  onDeleteHabit,
  onToggleHabitPriority
}) {
  const [openMenuHabitId, setOpenMenuHabitId] = useState(null)

  const days = [
    { id: 'mon', abbr: 'Mon' },
    { id: 'tue', abbr: 'Tue' },
    { id: 'wed', abbr: 'Wed' },
    { id: 'thu', abbr: 'Thu' },
    { id: 'fri', abbr: 'Fri' },
    { id: 'sat', abbr: 'Sat' },
    { id: 'sun', abbr: 'Sun' }
  ]

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.habit-actions')) {
        setOpenMenuHabitId(null)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  const handleMenuToggle = (event, habitId) => {
    event.stopPropagation()
    setOpenMenuHabitId((currentId) => (currentId === habitId ? null : habitId))
  }

  const handleRenameHabit = (habit) => {
    const newName = window.prompt('Edit habit name', habit.name)
    if (!newName) {
      return
    }

    const trimmedName = newName.trim()
    if (trimmedName.length === 0) {
      return
    }

    onRenameHabit(habit.id, trimmedName)
  }

  const menuOptions = [
    {
      key: 'settings',
      label: 'Settings: Toggle Priority',
      action: (habit) => onToggleHabitPriority(habit.id)
    },
    {
      key: 'edit',
      label: 'Edit Habit Name',
      action: handleRenameHabit
    },
    {
      key: 'duplicate',
      label: 'Duplicate Habit',
      action: (habit) => onDuplicateHabit(habit.id)
    },
    {
      key: 'complete',
      label: 'Mark All Days Complete',
      action: (habit) => onSetHabitAllDays(habit.id, true)
    },
    {
      key: 'reset',
      label: 'Clear All Day Checks',
      action: (habit) => onSetHabitAllDays(habit.id, false)
    },
    {
      key: 'move',
      label: 'Move Habit To Top',
      action: (habit) => onMoveHabitToTop(habit.id)
    },
    {
      key: 'delete',
      label: 'Delete Habit',
      className: 'danger',
      action: (habit) => {
        const isConfirmed = window.confirm(`Delete "${habit.name}"?`)
        if (isConfirmed) {
          onDeleteHabit(habit.id)
        }
      }
    }
  ]

  return (
    <div className="habit-tracker">
      <div className="tracker-header">
        <div className="header-top">
          <h1>⚡</h1>
          <div className="period-selector">
            <button className="period-btn active">7 days</button>
            <span className="separator">|</span>
            <button className="period-btn">All days</button>
          </div>
        </div>
      </div>

      <div className="habits-table">
        <div className="table-header">
          <div className="habit-name-header">Habit</div>
          {days.map((day) => (
            <div key={day.id} className="week-header habit-checkbox-header">
              <span className="week-label">{day.abbr}</span>
            </div>
          ))}
          <div className="habit-actions-header"></div>
        </div>

        <div className="habits-list">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`habit-row ${openMenuHabitId === habit.id ? 'menu-open' : ''}`}
            >
              <div className="habit-name">{habit.name}</div>
              
              {days.map((day, dayIndex) => (
                <div
                  key={`${habit.id}-${day.id}`}
                  className="habit-checkbox-cell"
                >
                  <input
                    type="checkbox"
                    className="habit-checkbox"
                    checked={habit.completed[dayIndex] || false}
                    onChange={() => toggleHabit(habit.id, dayIndex)}
                  />
                </div>
              ))}

              <div className="habit-actions">
                <button
                  className="action-btn more-btn"
                  type="button"
                  onClick={(event) => handleMenuToggle(event, habit.id)}
                  aria-label="Open habit actions"
                  aria-expanded={openMenuHabitId === habit.id}
                >
                  ⋯
                </button>

                {openMenuHabitId === habit.id && (
                  <div className="habit-menu">
                    {menuOptions.map((option) => (
                      <button
                        key={option.key}
                        className={`habit-menu-item ${option.className || ''}`}
                        type="button"
                        onClick={() => {
                          option.action(habit)
                          setOpenMenuHabitId(null)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
