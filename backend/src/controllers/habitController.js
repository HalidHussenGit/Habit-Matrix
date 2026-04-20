import mongoose from 'mongoose'
import { Habit } from '../models/Habit.js'
import { HabitLog } from '../models/HabitLog.js'
import { User } from '../models/User.js'
import {
  enumerateWeekDates,
  getDatePartsUtc,
  getWeekRangeFromDate,
  parseDateOnly
} from '../utils/date.js'

const ensureObjectId = (idValue, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(idValue)) {
    throw new Error(`${fieldName} is invalid`)
  }
}

const sendError = (response, error, statusCode = 400) => {
  response.status(statusCode).json({
    message: error.message || 'Request failed'
  })
}

export const addHabit = async (request, response) => {
  try {
    const { userId, name, description, color } = request.body

    ensureObjectId(userId, 'userId')
    if (!name || !name.trim()) {
      return response.status(400).json({ message: 'name is required' })
    }

    const userExists = await User.exists({ _id: userId })
    if (!userExists) {
      return response.status(404).json({ message: 'User not found' })
    }

    const habit = await Habit.create({
      userId,
      name: name.trim(),
      description: description || '',
      color: color || '#3b82f6'
    })

    response.status(201).json({ habit })
  } catch (error) {
    sendError(response, error)
  }
}

export const editHabit = async (request, response) => {
  try {
    const { habitId } = request.params
    const { name, description, color, isArchived } = request.body

    ensureObjectId(habitId, 'habitId')

    const updatePayload = {}
    if (typeof name === 'string' && name.trim()) {
      updatePayload.name = name.trim()
    }
    if (typeof description === 'string') {
      updatePayload.description = description
    }
    if (typeof color === 'string' && color.trim()) {
      updatePayload.color = color.trim()
    }
    if (typeof isArchived === 'boolean') {
      updatePayload.isArchived = isArchived
    }

    const habit = await Habit.findByIdAndUpdate(habitId, updatePayload, {
      new: true,
      runValidators: true
    })

    if (!habit) {
      return response.status(404).json({ message: 'Habit not found' })
    }

    response.json({ habit })
  } catch (error) {
    sendError(response, error)
  }
}

export const deleteHabit = async (request, response) => {
  try {
    const { habitId } = request.params

    ensureObjectId(habitId, 'habitId')

    const deletedHabit = await Habit.findByIdAndDelete(habitId)
    if (!deletedHabit) {
      return response.status(404).json({ message: 'Habit not found' })
    }

    // Keep lifetime data consistent by removing logs tied to the deleted habit.
    await HabitLog.deleteMany({ habitId })

    response.status(204).send()
  } catch (error) {
    sendError(response, error)
  }
}

export const markHabitForDate = async (request, response) => {
  try {
    const { habitId } = request.params
    const { date, completed } = request.body

    ensureObjectId(habitId, 'habitId')

    if (typeof completed !== 'boolean') {
      return response.status(400).json({ message: 'completed must be true or false' })
    }

    const habit = await Habit.findById(habitId)
    if (!habit) {
      return response.status(404).json({ message: 'Habit not found' })
    }

    const logDate = parseDateOnly(date)
    const { year, month, day } = getDatePartsUtc(logDate)

    const habitLog = await HabitLog.findOneAndUpdate(
      { habitId: habit._id, logDate },
      {
        $set: {
          userId: habit.userId,
          habitId: habit._id,
          logDate,
          year,
          month,
          day,
          completed
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    )

    response.json({ habitLog })
  } catch (error) {
    sendError(response, error)
  }
}

export const getHabitsForWeek = async (request, response) => {
  try {
    const { userId, date } = request.query

    ensureObjectId(userId, 'userId')
    if (!date) {
      return response.status(400).json({ message: 'date query param is required (YYYY-MM-DD)' })
    }

    const { weekStart, weekEnd } = getWeekRangeFromDate(date)
    const weekDates = enumerateWeekDates(weekStart)

    const habits = await Habit.find({ userId, isArchived: false }).sort({ createdAt: 1 }).lean()

    const logs = await HabitLog.find({
      userId,
      habitId: { $in: habits.map((habit) => habit._id) },
      logDate: { $gte: weekStart, $lte: weekEnd }
    }).lean()

    const logsByHabitAndDate = new Map()
    for (const log of logs) {
      logsByHabitAndDate.set(`${String(log.habitId)}:${log.logDate.toISOString().slice(0, 10)}`, log.completed)
    }

    const weeklyHabits = habits.map((habit) => {
      const days = weekDates.map((isoDate) => ({
        date: isoDate,
        completed: Boolean(logsByHabitAndDate.get(`${String(habit._id)}:${isoDate}`))
      }))

      return {
        habitId: habit._id,
        name: habit.name,
        description: habit.description,
        color: habit.color,
        days
      }
    })

    response.json({
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      habits: weeklyHabits
    })
  } catch (error) {
    sendError(response, error)
  }
}
