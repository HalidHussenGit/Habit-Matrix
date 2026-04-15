const DATABASE_KEY = 'habit-matrix-db-v1'
const DAYS_IN_WEEK = 7

const pad2 = (value) => String(value).padStart(2, '0')

const cloneHabits = (habits) =>
  habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    completed: Array.from({ length: DAYS_IN_WEEK }, (_, index) => Boolean(habit.completed?.[index]))
  }))

const getIsoWeekContext = (date = new Date()) => {
  const localDate = new Date(date)
  localDate.setHours(0, 0, 0, 0)

  const dayIndex = (localDate.getDay() + 6) % 7
  const weekStart = new Date(localDate)
  weekStart.setDate(localDate.getDate() - dayIndex)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const isoReference = new Date(localDate)
  isoReference.setDate(localDate.getDate() + 3 - ((localDate.getDay() + 6) % 7))
  const isoYear = isoReference.getFullYear()

  const firstIsoThursday = new Date(isoYear, 0, 4)
  firstIsoThursday.setDate(firstIsoThursday.getDate() + 3 - ((firstIsoThursday.getDay() + 6) % 7))

  const weekNumber =
    1 + Math.round((isoReference.getTime() - firstIsoThursday.getTime()) / (7 * 24 * 60 * 60 * 1000))

  const month = weekStart.getMonth() + 1
  const weekKey = `${isoYear}-W${pad2(weekNumber)}`

  return {
    isoYear,
    weekNumber,
    weekKey,
    month,
    monthKey: `${isoYear}-${pad2(month)}`,
    weekStartISO: weekStart.toISOString().slice(0, 10),
    weekEndISO: weekEnd.toISOString().slice(0, 10)
  }
}

const createBaseDatabase = () => ({
  meta: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  current: null,
  history: {}
})

const createCurrentWeekRecord = (context, habits) => ({
  weekKey: context.weekKey,
  isoYear: context.isoYear,
  month: context.month,
  weekNumber: context.weekNumber,
  weekStartISO: context.weekStartISO,
  weekEndISO: context.weekEndISO,
  habits: cloneHabits(habits)
})

const ensureHistoryBucket = (database, context) => {
  if (!database.history[context.isoYear]) {
    database.history[context.isoYear] = {}
  }
  if (!database.history[context.isoYear][context.month]) {
    database.history[context.isoYear][context.month] = {}
  }
  if (!database.history[context.isoYear][context.month][context.weekKey]) {
    database.history[context.isoYear][context.month][context.weekKey] = {
      weekNumber: context.weekNumber,
      weekStartISO: context.weekStartISO,
      weekEndISO: context.weekEndISO,
      snapshots: []
    }
  }

  return database.history[context.isoYear][context.month][context.weekKey]
}

const archiveCurrentWeek = (database, reason) => {
  if (!database.current) {
    return
  }

  const currentContext = {
    isoYear: database.current.isoYear,
    month: database.current.month,
    weekNumber: database.current.weekNumber,
    weekKey: database.current.weekKey,
    weekStartISO: database.current.weekStartISO,
    weekEndISO: database.current.weekEndISO
  }

  const historyBucket = ensureHistoryBucket(database, currentContext)
  historyBucket.snapshots.push({
    reason,
    archivedAt: new Date().toISOString(),
    habits: cloneHabits(database.current.habits)
  })
}

const clearHabitChecks = (habits) =>
  habits.map((habit) => ({
    ...habit,
    completed: Array(DAYS_IN_WEEK).fill(false)
  }))

const readDatabase = () => {
  if (typeof window === 'undefined') {
    return createBaseDatabase()
  }

  try {
    const rawData = window.localStorage.getItem(DATABASE_KEY)
    if (!rawData) {
      return createBaseDatabase()
    }

    const parsed = JSON.parse(rawData)
    if (!parsed || typeof parsed !== 'object') {
      return createBaseDatabase()
    }

    return {
      ...createBaseDatabase(),
      ...parsed,
      history: parsed.history && typeof parsed.history === 'object' ? parsed.history : {}
    }
  } catch {
    return createBaseDatabase()
  }
}

const writeDatabase = (database) => {
  if (typeof window === 'undefined') {
    return
  }

  database.meta = {
    ...(database.meta || {}),
    updatedAt: new Date().toISOString()
  }

  window.localStorage.setItem(DATABASE_KEY, JSON.stringify(database))
}

const initializeDatabaseForToday = (defaultHabits) => {
  const database = readDatabase()
  const context = getIsoWeekContext(new Date())

  if (!database.current) {
    database.current = createCurrentWeekRecord(context, defaultHabits)
    writeDatabase(database)
    return { database, habits: cloneHabits(database.current.habits), context }
  }

  if (database.current.weekKey !== context.weekKey) {
    archiveCurrentWeek(database, 'auto_rollover')
    const nextHabits = clearHabitChecks(database.current.habits)
    database.current = createCurrentWeekRecord(context, nextHabits)
    writeDatabase(database)
    return { database, habits: cloneHabits(database.current.habits), context }
  }

  database.current = createCurrentWeekRecord(context, database.current.habits)
  writeDatabase(database)
  return { database, habits: cloneHabits(database.current.habits), context }
}

const syncCurrentWeekHabits = (database, habits, context = getIsoWeekContext(new Date())) => {
  database.current = createCurrentWeekRecord(context, habits)
  writeDatabase(database)
}

const finishCurrentWeek = (database, context = getIsoWeekContext(new Date())) => {
  syncCurrentWeekHabits(database, database.current?.habits || [], context)
  archiveCurrentWeek(database, 'manual_finish')

  const resetHabits = clearHabitChecks(database.current.habits)
  database.current = createCurrentWeekRecord(context, resetHabits)
  writeDatabase(database)

  return cloneHabits(resetHabits)
}

export {
  DAYS_IN_WEEK,
  cloneHabits,
  finishCurrentWeek,
  getIsoWeekContext,
  initializeDatabaseForToday,
  syncCurrentWeekHabits
}