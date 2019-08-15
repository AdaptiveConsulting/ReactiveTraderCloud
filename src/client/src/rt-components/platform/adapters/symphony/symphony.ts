import { BasePlatformAdapter } from '../platformAdapter'
import { WindowConfig } from '../types'

export default class Symphony extends BasePlatformAdapter {
    readonly name = 'browser'
    readonly type = 'browser'

    readonly allowTearOff = false
    window = {
        close: () => window.close(),

        open: (config: WindowConfig, onClose?: () => void) => {
            return Promise.resolve(null)
        },
    }

    fdc3 = {
        broadcast: () => { },
    }

    notification = {
        notify: (message: object) => {

        },
    }

}
