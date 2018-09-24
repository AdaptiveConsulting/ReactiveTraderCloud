export class DefaultWindowProvider {
  type = 'browser'
  platform = 'browser'

  maximize() {
    throw new Error('environment.provider.maximize not implemented')
  }

  minimize() {
    throw new Error('environment.provider.minimize not implemented')
  }

  close() {
    return window.close()
  }

  open(...args: string[]) {
    return window.open(...args)
  }
}

export default DefaultWindowProvider
