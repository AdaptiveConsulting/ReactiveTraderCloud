import Guard from './guard';

const levels = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

let _currentLevel = levels.verbose;

let _sink = (logEvent)  =>{
  const toLog = [`%c [${logEvent.level}][${logEvent.logger}]`, `color:${logEvent.color}`];
  toLog.push.apply(toLog, logEvent.args);
  console.log.apply(console, toLog);
};

class Logger {
  constructor(name) {
    this._name = name;
  }

  get isVerboseEnabled() {
    return _currentLevel <= levels.verbose;
  }

  /**
   * verbose(message [, ...args]): expects a string log message and optional additional arguments
   */
  verbose(){
    if (this.isVerboseEnabled){
      this._log('VERBOSE', arguments);
    }
  }

  /**
   * debug(message [, ...args]): expects a string log message and optional additional arguments
   */
  debug(){
    if (_currentLevel <= levels.debug){
      this._log('DEBUG', arguments);
    }
  }

  /**
   * info(message [, ...args]): expects a string log message and optional additional arguments
   */
  info(){
    if (_currentLevel <= levels.info){
      this._log('INFO', arguments, 'blue');
    }
  }

  /**
   * warn(message [, ...args]): expects a string log message and optional additional arguments
   */
  warn(){
    if (_currentLevel <= levels.warn){
      this._log('WARN', arguments);
    }
  }

  /**
   * error(message [, ...args]): expects a string log message and optional additional arguments
   */
  error(){
    if (_currentLevel <= levels.error){
      this._log('ERROR', arguments, 'red');
    }
  }

  _logError(level, message, err) {
    let errorMessage = _.isError(err)
      ? err.message
      : err;
    this._log(level, `${message}. Error:${errorMessage}`);
  }

  _log(level, args, color) {
    Guard.isString(level, 'level isn\'t a string');
    _sink({
      logger: this._name,
      level: level,
      args: args,
      color:color || 'black',
    });
  }
}

function create(name):Logger {
  Guard.isDefined(name, 'The name argument should be defined');
  Guard.isString(name, 'The name argument should be a string');
  return new Logger(name);
}

function setLevel(level) {
  _currentLevel = level;
}

function setSink(sink) {
  Guard.isFunction(sink, 'Logging sink argument must be a function');
  _sink = sink;
}

export default {create, setLevel, setSink, levels, Logger};
