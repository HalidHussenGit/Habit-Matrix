const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

const startOfUtcDay = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

export const parseDateOnly = (dateInput) => {
  if (typeof dateInput !== 'string' || !DATE_ONLY_REGEX.test(dateInput)) {
    throw new Error('date must be in YYYY-MM-DD format')
  }

  const parsed = new Date(`${dateInput}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date value')
  }

  return startOfUtcDay(parsed)
}

export const getDatePartsUtc = (date) => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate()
})

export const getWeekRangeFromDate = (dateInput) => {
  const baseDate = parseDateOnly(dateInput)

  // Convert JS day to Monday-first index: Mon=0 ... Sun=6
  const mondayIndex = (baseDate.getUTCDay() + 6) % 7

  const weekStart = new Date(baseDate)
  weekStart.setUTCDate(baseDate.getUTCDate() - mondayIndex)

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)

  return {
    weekStart,
    weekEnd
  }
}

export const enumerateWeekDates = (weekStart) =>
  Array.from({ length: 7 }, (_, offset) => {
    const current = new Date(weekStart)
    current.setUTCDate(weekStart.getUTCDate() + offset)
    return current.toISOString().slice(0, 10)
  })
