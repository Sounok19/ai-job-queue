import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
}