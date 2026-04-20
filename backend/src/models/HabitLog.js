import mongoose from 'mongoose'

const habitLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true
    },
    // Full date storage for lifetime tracking (and easy querying)
    logDate: {
      type: Date,
      required: true,
      index: true
    },
    year: {
      type: Number,
      required: true,
      index: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true
    },
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
      index: true
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// One log per habit per day.
habitLogSchema.index({ habitId: 1, logDate: 1 }, { unique: true })
habitLogSchema.index({ userId: 1, year: 1, month: 1, day: 1 })

export const HabitLog = mongoose.model('HabitLog', habitLogSchema)
