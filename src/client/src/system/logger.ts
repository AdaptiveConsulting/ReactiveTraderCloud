import Guard from './guard'

const levels = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
}

let currentLevel = levels.debug

let sink = (logEvent)  => {
  const toLog = [`%c [${logEvent.level}][${logEvent.logger}]`, `color:${logEvent.color}`]
  toLog.push.apply(toLog, logEvent.args)
  console.log.apply(console, toLog)
}

class Logger {
  name: string

  constructor(name) {
    this.name = name
  }

  get isVerboseEnabled() {
    return currentLevel <= levels.verbose
  }

  /**
   * verbose(message [, ...args]): expects a string log message and optional additional arguments
   */
  verbose(message?: string, message2?: string, message3?: string) {
    if (this.isVerboseEnabled) {
      this.log('VERBOSE', arguments)
    }
  }

  /**
   * debug(message [, ...args]): expects a string log message and optional additional arguments
   */
  debug(message?: string, message2?: string, message3?: string) {
    if (currentLevel <= levels.debug) {
      this.log('DEBUG', arguments)
    }
  }

  /**
   * info(message [, ...args]): expects a string log message and optional additional arguments
   */
  info(message?: string, message2?: string, message3?: string) {
    if (currentLevel <= levels.info) {
      this.log('INFO', arguments, 'blue')
    }
  }

  /**
   * warn(message [, ...args]): expects a string log message and optional additional arguments
   */
  warn(message?: string, message2?: string, message3?: string) {
    if (currentLevel <= levels.warn) {
      this.log('WARN', arguments)
    }
  }

  /**
   * error(message [, ...args]): expects a string log message and optional additional arguments
   */
  error(message?: string, message2?: any, message3?: string) {
    if (currentLevel <= levels.error) {
      this.log('ERROR', arguments, 'red')
    }
  }

  logError(level, message, err) {
    const errorMessage = _.isError(err)
      ? err.message
      : err
    this.log(level, `${message}. Error:${errorMessage}`)
  }

  log(level, args, color = 'black') {
    Guard.isString(level, 'level isn\'t a string')
    sink({
      args,
      color,
      level,
      logger: this.name,
    })
  }
}

function create(name) {
  Guard.isDefined(name, 'The name argument should be defined')
  Guard.isString(name, 'The name argument should be a string')
  return new Logger(name)
}

function setLevel(level) {
  currentLevel = level
}

function setSink(sinkNew) {
  Guard.isFunction(sinkNew, 'Logging sink argument must be a function')
  sink = sinkNew
}

export default { create, setLevel, setSink, levels, Logger }
