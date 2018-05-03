import * as _ from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import OpenFinChrome from '../../shell/OpenFinChrome'
import PopoutServiceBase from './popoutServiceBase'
const { DockingManager } = require('./dockingManager.js')

const DOCKED_CLASS_NAME = 'docked'
const BOUNDS_CHANGING_EVENT = 'bounds-changing'
const CLOSE_REQUESTED_EVENT = 'close-requested'
import logger from '../../../system/logger'

const log = logger.create('OpenfinPopoutService')

export default class OpenfinPopoutService extends PopoutServiceBase {
  openFin
  popouts
  dockingManager

  constructor(openFin) {
    super()
    this.openFin = openFin
    this.popouts = {}
    this.initializeDockingManager()
  }

  openPopout(
    {
      url,
      title,
      onClosing,
      windowOptions = { height: 400, width: 400, dockable: false }
    },
    view
  ) {
    const openFin = this.openFin
    this.createWindow(
      { url, title, windowOptions },
      tearoutWindow => {
        const popoutContainer = tearoutWindow.contentWindow.document.createElement(
          'div'
        )
        const onBoundsChanging = _.throttle(
          () => tearoutWindow.setAsForeground(),
          300
        )
        const onCloseRequested = () => {
          this.unregisterWindow(tearoutWindow)
          if (popoutContainer) {
            ReactDOM.unmountComponentAtNode(popoutContainer)
          }
          if (_.isFunction(onClosing)) {
            onClosing()
          }
          tearoutWindow.removeEventListener(
            BOUNDS_CHANGING_EVENT,
            onBoundsChanging
          )
          tearoutWindow.removeEventListener(
            CLOSE_REQUESTED_EVENT,
            onCloseRequested
          )
          openFin.close(tearoutWindow)
        }
        popoutContainer.id = this.popoutContainerId
        tearoutWindow.contentWindow.document.body.appendChild(popoutContainer)
        ReactDOM.render(
          <OpenFinChrome showHeaderBar={false} close={onCloseRequested}>
            {view}
          </OpenFinChrome>,
          popoutContainer
        )
        tearoutWindow.resizeTo(windowOptions.width, windowOptions.height)
        tearoutWindow.updateOptions({ opacity: 0, alwaysOnTop: true })
        tearoutWindow.show()
        tearoutWindow.animate(
          {
            opacity: {
              opacity: 1,
              duration: 300
            }
          },
          null,
          () => tearoutWindow.bringToFront()
        )
        this.registerWindow(tearoutWindow, windowOptions.dockable)
        tearoutWindow.addEventListener(BOUNDS_CHANGING_EVENT, onBoundsChanging)
        tearoutWindow.addEventListener(CLOSE_REQUESTED_EVENT, onCloseRequested)
      },
      err => log.error(`An error occured while tearing out window: ${err}`)
    )
  }

  undockPopout(windowName) {
    fin.desktop.InterApplicationBus.publish('undock-window', { windowName })
  }

  createWindow(
    { url, title, windowOptions },
    onSuccessCallback,
    errorCallback
  ) {
    const tearoutWindow = new fin.desktop.Window(
      {
        url,
        name: title,
        autoShow: false,
        frame: false,
        resizable: windowOptions.resizable,
        minWidth: windowOptions.minWidth,
        minHeight: windowOptions.minHeight,
        maximizable: false,
        minimizable: false,
        showTaskbarIcon: false,
        alwaysOnTop: true
      },
      () => onSuccessCallback(tearoutWindow),
      err => errorCallback(err)
    )
  }

  initializeDockingManager() {
    fin.desktop.main(() => {
      this.dockingManager = DockingManager.getInstance()
      fin.desktop.InterApplicationBus.subscribe(
        '*',
        'window-docked',
        ({ windowName }) => {
          const tearoutWindow = this.popouts[windowName]
          if (tearoutWindow) {
            const container = tearoutWindow.contentWindow.document.getElementsByClassName(
              'openfin-chrome__content'
            )[0]
            container.className += ` ${DOCKED_CLASS_NAME}`
            log.info(`Docking ${tearoutWindow.name}`)
          }
        }
      )
      fin.desktop.InterApplicationBus.subscribe(
        '*',
        'window-undocked',
        ({ windowName }) => {
          const tearoutWindow = this.popouts[windowName]
          if (tearoutWindow) {
            const container = tearoutWindow.contentWindow.document.getElementsByClassName(
              'openfin-chrome__content'
            )[0]
            container.className = container.className.replace(
              new RegExp(DOCKED_CLASS_NAME, 'g'),
              ''
            )
            log.info(`Undocking ${tearoutWindow.name}`)
          }
        }
      )
    })
  }

  registerWindow(tearoutWindow, dockable) {
    if (this.dockingManager) {
      this.dockingManager.register(tearoutWindow, dockable)
      this.popouts[tearoutWindow.name] = tearoutWindow
      setTimeout(() => {
        fin.desktop.InterApplicationBus.publish('window-load', {
          windowName: tearoutWindow.name
        })
      })
    }
  }

  unregisterWindow({ name }) {
    // ensure other popouts are notified in case the window is docked
    this.undockPopout(name)
    delete this.popouts[name]
  }
}
