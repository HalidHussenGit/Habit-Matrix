import { useEffect, useRef, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import {
  DAYS_IN_WEEK,
  cloneHabits,
  finishCurrentWeek,
  getIsoWeekContext,
  initializeDatabaseForToday,
  syncCurrentWeekHabits
} from './utils/habitDatabase'

const getPreferredTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedTheme = window.localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const defaultHabits = [
    'Habit',
    '7:20',
    'Up immediately',
    'Stretch',
    'Workout',
    'Walk',
    'Laws',
    'Work before phone',
    'Read w breakfast',
    'Complete task',
    'No fizzle',
    'Follow schedule',
    '3 Pomodoro',
    'Head massage',
    '<3h phone',
    '3 Meals',
    'Plan tomorrow today',
    'Sleep by 12'
  ]

  const createDefaultHabits = () =>
    defaultHabits.map((name, index) => ({
      id: index + 1,
      name,
      completed: Array(DAYS_IN_WEEK).fill(false)
    }))

  const databaseRef = useRef(null)
  const [selectedPage, setSelectedPage] = useState('neural')
  const [theme, setTheme] = useState(getPreferredTheme)
  const [habits, setHabits] = useState(createDefaultHabits)
  const [weekContext, setWeekContext] = useState(() => getIsoWeekContext(new Date()))

  const normalizeCompleted = (completed) => {
    return Array.from({ length: DAYS_IN_WEEK }, (_, index) => Boolean(completed[index]))
  }

  const applyHabitUpdate = (updater) => {
    setHabits((currentHabits) => {
      const nextHabits = typeof updater === 'function' ? updater(currentHabits) : updater

      if (databaseRef.current) {
        const currentContext = getIsoWeekContext(new Date())
        setWeekContext(currentContext)
        syncCurrentWeekHabits(databaseRef.current, nextHabits, currentContext)
      }

      return nextHabits
    })
  }

  useEffect(() => {
    const { database, habits: currentHabits, context } = initializeDatabaseForToday(createDefaultHabits())
    databaseRef.current = database
    setHabits(currentHabits)
    setWeekContext(context)
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!databaseRef.current) {
        return
      }

      const currentContext = getIsoWeekContext(new Date())
      if (databaseRef.current.current?.weekKey !== currentContext.weekKey) {
        const { database, habits: reloadedHabits, context } = initializeDatabaseForToday(
          databaseRef.current.current?.habits || createDefaultHabits()
        )
        databaseRef.current = database
        setHabits(cloneHabits(reloadedHabits))
        setWeekContext(context)
      }
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [])

  const toggleHabit = (habitId, dayIndex) => {
    applyHabitUpdate((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        const updatedCompleted = normalizeCompleted(habit.completed)
        updatedCompleted[dayIndex] = !updatedCompleted[dayIndex]

        return { ...habit, completed: updatedCompleted }
      })
    )
  }

  const renameHabit = (habitId, newName) => {
    applyHabitUpdate((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === habitId ? { ...habit, name: newName } : habit
      )
    )
  }

  const duplicateHabit = (habitId) => {
    applyHabitUpdate((currentHabits) => {
      const sourceHabit = currentHabits.find((habit) => habit.id === habitId)
      if (!sourceHabit) {
        return currentHabits
      }

      const nextId = currentHabits.reduce((maxId, habit) => Math.max(maxId, habit.id), 0) + 1
      const duplicate = {
        ...sourceHabit,
        id: nextId,
        name: `${sourceHabit.name} (copy)`,
        completed: normalizeCompleted(sourceHabit.completed)
      }

      return [...currentHabits, duplicate]
    })
  }

  const setHabitAllDays = (habitId, value) => {
    applyHabitUpdate((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === habitId
          ? { ...habit, completed: Array(DAYS_IN_WEEK).fill(value) }
          : habit
      )
    )
  }

  const moveHabitToTop = (habitId) => {
    applyHabitUpdate((currentHabits) => {
      const habitToMove = currentHabits.find((habit) => habit.id === habitId)
      if (!habitToMove) {
        return currentHabits
      }

      return [habitToMove, ...currentHabits.filter((habit) => habit.id !== habitId)]
    })
  }

  const deleteHabit = (habitId) => {
    applyHabitUpdate((currentHabits) => currentHabits.filter((habit) => habit.id !== habitId))
  }

  const toggleHabitPriority = (habitId) => {
    applyHabitUpdate((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        const isPriority = habit.name.startsWith('★ ')
        return {
          ...habit,
          name: isPriority ? habit.name.slice(2) : `★ ${habit.name}`
        }
      })
    )
  }

  const addHabit = () => {
    const habitName = window.prompt('Add new habit', '')
    if (!habitName) {
      return
    }

    const trimmedName = habitName.trim()
    if (!trimmedName) {
      return
    }

    applyHabitUpdate((currentHabits) => {
      const nextId = currentHabits.reduce((maxId, habit) => Math.max(maxId, habit.id), 0) + 1
      return [
        ...currentHabits,
        {
          id: nextId,
          name: trimmedName,
          completed: Array(DAYS_IN_WEEK).fill(false)
        }
      ]
    })
  }

  const finishWeek = () => {
    if (!databaseRef.current) {
      return
    }

    const shouldClearWeek = window.confirm(
      `Finish ${weekContext.weekKey}? This will archive this week's checkboxes and clear only the checks.`
    )
    if (!shouldClearWeek) {
      return
    }

    const currentContext = getIsoWeekContext(new Date())
    const resetHabits = finishCurrentWeek(databaseRef.current, currentContext)
    setWeekContext(currentContext)
    setHabits(resetHabits)
  }

  const pages = [
    { id: 'neural', name: 'neural net', icon: '🧠' },
    { id: 'peach', name: 'PeachMedia', icon: '🎬' },
    { id: 'todo', name: 'things to do', icon: '✓' },
    { id: 'personal', name: 'Personal Notes', icon: '📝' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'workout', name: 'Workout', icon: '💪' },
    { id: 'ruglabs', name: 'RugLabs', icon: '🔬' },
    { id: 'uptopium', name: 'Uptopium', icon: '⚗️' },
    { id: 'likebutter', name: 'LikeButter', icon: '🧈' },
    { id: 'social', name: 'Social media', icon: '📱' },
    { id: 'cherry', name: "Cherry's", icon: '🍒' },
    { id: 'archive', name: 'Archive', icon: '📦' }
  ]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app">
      <Sidebar
        pages={pages}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddHabit={addHabit}
        onFinishWeek={finishWeek}
      />
      <MainContent
        habits={habits}
        toggleHabit={toggleHabit}
        onRenameHabit={renameHabit}
        onDuplicateHabit={duplicateHabit}
        onSetHabitAllDays={setHabitAllDays}
        onMoveHabitToTop={moveHabitToTop}
        onDeleteHabit={deleteHabit}
        onToggleHabitPriority={toggleHabitPriority}
      />
    </div>
  )
}

export default App
