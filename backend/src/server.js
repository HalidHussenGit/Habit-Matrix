import dotenv from 'dotenv'
import { app } from './app.js'
import { connectDatabase } from './config/database.js'

dotenv.config()

const port = Number(process.env.PORT || 4000)

const bootstrap = async () => {
  try {
    await connectDatabase()
    app.listen(port, () => {
      // Server startup message
      console.log(`Habit backend listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start backend', error)
    process.exit(1)
  }
}

bootstrap()
