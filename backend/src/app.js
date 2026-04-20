import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { habitRouter } from './routes/habitRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/habits', habitRouter)

export { app }
