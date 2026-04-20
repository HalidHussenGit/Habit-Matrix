import { Router } from 'express'
import {
  addHabit,
  deleteHabit,
  editHabit,
  getHabitsForWeek,
  markHabitForDate
} from '../controllers/habitController.js'

const habitRouter = Router()

habitRouter.post('/', addHabit)
habitRouter.patch('/:habitId', editHabit)
habitRouter.delete('/:habitId', deleteHabit)
habitRouter.put('/:habitId/logs', markHabitForDate)
habitRouter.get('/week', getHabitsForWeek)

export { habitRouter }
