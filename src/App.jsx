import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

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
  const [selectedPage, setSelectedPage] = useState('neural')
  const [theme, setTheme] = useState(getPreferredTheme)
  const [habits, setHabits] = useState([
    { id: 1, name: 'Habit', completed: [true, true, true] },
    { id: 2, name: '7:20', completed: [true, false, true] },
    { id: 3, name: 'Up immediately', completed: [true, true, true] },
    { id: 4, name: 'Stretch', completed: [false, false, false] },
    { id: 5, name: 'Workout', completed: [true, true, true] },
    { id: 6, name: 'Walk', completed: [true, false, false] },
    { id: 7, name: 'Laws', completed: [false, true, true] },
    { id: 8, name: 'Work before phone', completed: [true, true, true] },
    { id: 9, name: 'Read w breakfast', completed: [false, false, false] },
    { id: 10, name: 'Complete task', completed: [true, true, true] },
    { id: 11, name: 'No fizzle', completed: [true, true, true] },
    { id: 12, name: 'Follow schedule', completed: [true, true, true] },
    { id: 13, name: '3 Pomodoro', completed: [true, true, true] },
    { id: 14, name: 'Head massage', completed: [false, false, false] },
    { id: 15, name: '<3h phone', completed: [true, true, true] },
    { id: 16, name: '3 Meals', completed: [true, false, true] },
    { id: 17, name: 'Plan tomorrow today', completed: [true, true, true] },
    { id: 18, name: 'Sleep by 12', completed: [false, true, false] }
  ])

  const toggleHabit = (habitId, weekIndex) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: habit.completed.map((c, i) => i === weekIndex ? !c : c) }
        : habit
    ))
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
      />
      <MainContent habits={habits} toggleHabit={toggleHabit} />
    </div>
  )
}

export default App
