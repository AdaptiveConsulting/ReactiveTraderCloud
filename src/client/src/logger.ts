import logdown from 'logdown'

enum DebugLevel {
  error = 'error',
  warn = 'warn',
  debug = 'debug',
  info = 'info',
}

export enum DebugType {
  Error = 'Error',
  Warning = 'Warning',
  Debug = 'Debug',
  Subscribing = 'Subscribing',
  Subscribed = 'Subscribed',
  Received = 'Received',
  Executing = 'Executing',
  Execute = 'Execute',
  Info = 'Info',
}

const levelColour = {
  error: 'Crimson',
  warn: 'Tomato',
  debug: 'Orange',
  info: 'RoyalBlue',
}

export const createLogger = (debugLevel: DebugLevel) => {
  const colour = Object.keys(levelColour)
    .filter(key => key === debugLevel)
    .map(level => levelColour[level])
    .join()

  return (name: string, debugType?: DebugType) =>
    debugType !== undefined
      ? (...args: any[]) => logdown(`app:${name}${debugType}`, { prefixColor: colour })[debugLevel](...args)
      : (...args: any[]) => logdown(`app:${name}`, { prefixColor: colour })[debugLevel](...args)
}

const logger = {
  info: createLogger(DebugLevel.info),
  debug: createLogger(DebugLevel.debug),
  warn: createLogger(DebugLevel.warn),
  error: createLogger(DebugLevel.error),
}

export default logger
