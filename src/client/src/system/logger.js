import Guard from './guard';

var levels = {
    verbose:0,
    debug:1,
    info:2,
    warn:3,
    error:4
};

var _currentLevel = levels.verbose;

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
    verbose(format) {
        if (this.isVerboseEnabled) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._log('VERBOSE', format, args);
        }
    }
    debug(format) {
        if (_currentLevel <= levels.debug) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._log('DEBUG', format, args);
        }
    }
    info(format) {
        if (_currentLevel <= levels.info) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._log('INFO', format, args);
        }
    }
    warn(format) {
        if (_currentLevel <= levels.warn) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._log('WARN', format, args);
        }
    }
    error(format) {
        if (_currentLevel <= levels.error) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._log('ERROR', format, args);
        }
    }
    _log(level, format, args) {
        Guard.isString(format, 'First argument to a log function should be a string, but got [' + format + ']');
        var message = format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
        _sink({
            logger: this._name,
            level: level,
            message: message
        });
    }
}

function create(name) : Logger {
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

export default { create, setLevel, setSink, levels, Logger };
