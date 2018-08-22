type Severity = 'info' | 'warn' | 'error' | 'debug'

enum levels {
  verbose = 'debug',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error'
}

const order = Object.keys(levels)

let currentLevel = order.indexOf(process.env.NODE_ENV === 'production' ? levels.warn : levels.error)

let sink = (logEvent: LogParams) => {
  console[logEvent.level].call(null, `${logEvent.logger}:`, ...Array.from(logEvent.args))
}

export class Logger {
  name: string

  constructor(name: string) {
    this.name = name
  }

  /**
   * verbose(message [, ...args]): expects a string log message and optional additional arguments
   */
  verbose(message: string, message2?: string, message3?: string) {
    if (currentLevel <= order.indexOf('verbose')) {
      this.log('debug', arguments)
    }
  }

  /**
   * debug(message [, ...args]): expects a string log message and optional additional arguments
   */
  debug(message?: string, message2?: string, message3?: string) {
    this.log('debug', arguments)
  }

  /**
   * info(message [, ...args]): expects a string log message and optional additional arguments
   */
  info(message?: string, message2?: any, message3?: any) {
    this.log('info', arguments)
  }

  /**
   * warn(message [, ...args]): expects a string log message and optional additional arguments
   */
  warn(message?: string, message2?: string, message3?: string) {
    this.log('warn', arguments)
  }

  /**
   * error(message [, ...args]): expects a string log message and optional additional arguments
   */
  error(message?: string, message2?: any, message3?: string) {
    this.log('error', arguments)
  }

  log(level: Severity, args: IArguments) {
    if (currentLevel <= order.indexOf(level)) {
      sink({
        args,
        level,
        logger: this.name
      })
    }
  }
}

function create(name: string) {
  return new Logger(name)
}

function setLevel(level: levels) {
  currentLevel = order.indexOf(level)
}

interface LogParams {
  args: IArguments
  level: Severity
  logger: string
}

function setSink(sinkNew: (params: LogParams) => void) {
  sink = sinkNew
}

export default { create, setLevel, setSink, levels, Logger }
