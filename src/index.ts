import express from 'express'
import cors from 'cors'
import { config } from './config/index'
import authRouter from './routes/auth'
import jobsRouter from './routes/jobs'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1', jobsRouter)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})