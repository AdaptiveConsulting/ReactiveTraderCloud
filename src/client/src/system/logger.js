import Guard from './guard';

const levels = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

let _currentLevel = levels.debug;

let _sink = logEvent =>{
  return;
  const toLog = ['[' + logEvent.level + '][' + logEvent.logger + ']'];
  toLog.push.apply(toLog, logEvent.message);
  console.log.apply(console, toLog);
};

class Logger {
  constructor(name){
    this._name = name;
  }

  get isVerboseEnabled(){
    return _currentLevel <= levels.verbose;
  }

  verbose(){
    if (this.isVerboseEnabled){
      this._log('VERBOSE', arguments);
    }
  }

  debug(){
    if (_currentLevel <= levels.debug){
      this._log('DEBUG', arguments);
    }
  }

  info(){
    if (_currentLevel <= levels.info){
      this._log('INFO', arguments);
    }
  }

  warn(){
    if (_currentLevel <= levels.warn){
      this._log('WARN', arguments);
    }
  }

  error(){
    if (_currentLevel <= levels.error){
      this._log('ERROR', arguments);
    }
  }

  _log(level, message){
    Guard.isString(level, 'level isn\'t a string');
    //Guard.isString(message, 'message isn\'t a string');
    _sink({
      logger: this._name,
      level: level,
      message
    });
  }
}

function create(name):Logger{
  Guard.isDefined(name, 'The name argument should be defined');
  Guard.isString(name, 'The name argument should be a string');
  return new Logger(name);
}

function setLevel(level){
  _currentLevel = level;
}

function setSink(sink){
  Guard.isFunction(sink, 'Logging sink argument must be a function');
  _sink = sink;
}

export default {create, setLevel, setSink, levels, Logger};
