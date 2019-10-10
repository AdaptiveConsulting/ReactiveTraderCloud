import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.simple(),
      ),
    }),
  ],
})

export default logger
