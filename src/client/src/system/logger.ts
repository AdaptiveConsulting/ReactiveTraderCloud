enum levels {
  verbose = 'debug',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error'
}

type SEVERITY = 'info' | 'warn' | 'error' | 'debug'

let currentLevel = levels.verbose

let sink = (logEvent: LogParams) => {
  console[logEvent.level].call(
    null,
    `${logEvent.logger}:`,
    ...Array.from(logEvent.args)
  )
}

export class Logger {
  name: string

  constructor(name: string) {
    this.name = name
  }

  get isVerboseEnabled() {
    return currentLevel === levels.verbose
  }

  /**
   * verbose(message [, ...args]): expects a string log message and optional additional arguments
   */
  verbose(message: string, message2?: string, message3?: string) {
    if (this.isVerboseEnabled) {
      this.log('debug', arguments)
    }
  }

  /**
   * debug(message [, ...args]): expects a string log message and optional additional arguments
   */
  debug(message?: string, message2?: string, message3?: string) {
    if (currentLevel <= levels.debug) {
      this.log('debug', arguments)
    }
  }

  /**
   * info(message [, ...args]): expects a string log message and optional additional arguments
   */
  info(message?: string, message2?: any, message3?: any) {
    if (currentLevel <= levels.info) {
      this.log('info', arguments)
    }
  }

  /**
   * warn(message [, ...args]): expects a string log message and optional additional arguments
   */
  warn(message?: string, message2?: string, message3?: string) {
    if (currentLevel <= levels.warn) {
      this.log('warn', arguments)
    }
  }

  /**
   * error(message [, ...args]): expects a string log message and optional additional arguments
   */
  error(message?: string, message2?: any, message3?: string) {
    if (currentLevel <= levels.error) {
      this.log('error', arguments)
    }
  }

  log(level: SEVERITY, args: IArguments) {
    sink({
      args,
      level,
      logger: this.name
    })
  }
}

function create(name: string) {
  return new Logger(name)
}

function setLevel(level: levels) {
  currentLevel = level
}

interface LogParams {
  args: IArguments
  level: SEVERITY
  logger: string
}

function setSink(sinkNew: (params: LogParams) => void) {
  sink = sinkNew
}

export default { create, setLevel, setSink, levels, Logger }
