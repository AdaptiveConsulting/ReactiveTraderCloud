import * as ReactDOM from 'react-dom'
import PopoutServiceBase from './popoutServiceBase'
import * as _ from 'lodash'
import logger from '../../../system/logger'

const log = logger.create('BlotterModel')

export default class BrowserPopoutService extends PopoutServiceBase {
  openPopout(options, view) {
    let popoutContainer
    const windowOptionsString = this.getWindowOptionsString(options.windowOptions)
    log.debug(`Opening child window url:${options.url},title:${options.title}`)
    const childWindow = window.open(options.url, options.title, windowOptionsString)
    const onloadHandler = () => {
      log.debug(`Popout window loading`)
      childWindow.document.title = options.title
      popoutContainer = childWindow.document.createElement('div')
      popoutContainer.id = this.popoutContainerId
      childWindow.document.body.appendChild(popoutContainer)
      ReactDOM.render(view, popoutContainer)
    }
    childWindow.onbeforeunload = () => {
      if (popoutContainer) {
        ReactDOM.unmountComponentAtNode(popoutContainer)
      }

      if (_.isFunction(options.onClosing)) {
        options.onClosing()
      }
    }
    childWindow.onload = onloadHandler
  }

  getWindowOptionsString(options = { height: 400, width: 400 }) {
    const top = ((window.innerHeight - options.height) / 2) + window.screenY
    const left = ((window.innerWidth - options.width) / 2) + window.screenX
    const windowOptions = Object.assign({ top, left }, options)

    return Object.keys(windowOptions)
                .map(key => `${key}=${this.mapWindowOptionValue(windowOptions[key])}`)
                .join(',')
  }

  mapWindowOptionValue(value) {
    if (_.isBoolean(value)) {
      return value ? 'yes' : 'no'
    }
    return value
  }
}
