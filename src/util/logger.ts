import winston from 'winston'

const { combine, prettyPrint, colorize } = winston.format
const options: winston.LoggerOptions = {
  format: combine(
      prettyPrint(),
      colorize(),
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' })
  ]
}

export const logger = winston.createLogger(options)
