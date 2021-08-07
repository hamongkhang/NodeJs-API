import { logger } from './logger'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' })
} else {
  dotenv.config({ path: '.env.example' })  // you can delete this after you create your own .env file!
}

export const USER = process.env.USER
export const MONGODB_URI = process.env.MONGODB_URI


if (!MONGODB_URI || !USER) {
  logger.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.')
  process.exit(1)
}
