import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

habitSchema.index({ userId: 1, name: 1 })

export const Habit = mongoose.model('Habit', habitSchema)
