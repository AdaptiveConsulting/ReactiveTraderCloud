import Guard from './guard';

var levels = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

var _currentLevel = levels.debug;

var _sink = logEvent => {
  console.log('[' + logEvent.logger + '] [' + logEvent.level + ']: ' + logEvent.message);
};

class Logger {
  constructor(name) {
    this._name = name;
  }

  get isVerboseEnabled() {
    return _currentLevel <= levels.verbose;
  }

  verbose(message) {
    if (this.isVerboseEnabled) {
      this._log('VERBOSE', message);
    }
  }

  debug(message) {
    if (_currentLevel <= levels.debug) {
      this._log('DEBUG', message);
    }
  }

  info(message) {
    if (_currentLevel <= levels.info) {
      this._log('INFO', message);
    }
  }

  warn(message) {
    if (_currentLevel <= levels.warn) {
      this._log('WARN', message);
    }
  }

  error(message) {
    if (_currentLevel <= levels.error) {
      this._log('ERROR', message);
    }
  }

  _log(level, message) {
    Guard.isString(level, 'level isn\'t a string');
    Guard.isString(message, 'message isn\'t a string');
    _sink({
      logger: this._name,
      level: level,
      message: message
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
