import { Store } from 'redux'
import { BasePlatformAdapter } from '../platformAdapter'
import { AppConfig, WindowConfig, InteropTopics, ExcelInterop } from '../types'
import { openDesktopWindow } from './window'
import { fromEventPattern } from 'rxjs'
import { excelAdapter } from './excel'
import { CurrencyPairPositionWithPrice } from 'rt-types'
import { LayoutActions } from '../../../../shell/layouts/layoutActions'
import { workspaces } from 'openfin-layouts'
import { Notification, NotificationButtonClickedEvent } from 'openfin-notifications'
import { NotificationMessage } from '../browser/utils/sendNotification'

export async function setupWorkspaces(store: Store) {
  if (typeof fin !== 'undefined') {
    await workspaces.setRestoreHandler((workspace: workspaces.WorkspaceApp) =>
      appRestoreHandler(workspace, store),
    )
    await workspaces.ready()
  }
}

type OpenFinWindowState = Parameters<Parameters<fin.OpenFinWindow['getState']>[0]>[0]

enum WindowState {
  Normal = 'normal',
  Minimized = 'minimized',
  Maximized = 'maximized',
}

export default class OpenFin extends BasePlatformAdapter {
  readonly name = 'openfin'
  readonly type = 'desktop'

  openFinNotifications = require('openfin-notifications')

  constructor() {
    super()
    this.openFinNotifications.addEventListener(
      'notification-button-clicked',
      (event: NotificationButtonClickedEvent) => {
        fin.desktop.InterApplicationBus.publish(
          InteropTopics.HighlightBlotter,
          event.notification.customData,
        )
      },
    )
  }

  notificationHighlight = {
    init: () => this.interop.subscribe$(InteropTopics.HighlightBlotter),
  }

  chartIQ = {
    open: (id: string, config: AppConfig) => this.app.open(id, config),
  }

  window = {
    close: () => fin.desktop.Window.getCurrent().close(),

    open: (config: WindowConfig, onClose?: () => void) => openDesktopWindow(config, onClose),

    maximize: () => {
      const win = fin.desktop.Window.getCurrent()
      win.getState((state: OpenFinWindowState) => {
        switch (state) {
          case WindowState.Maximized:
          case WindowState.Minimized:
            win.restore(() => win.bringToFront())
            break
          case WindowState.Normal:
          default:
            win.maximize()
            break
        }
      })
    },

    minimize: () => fin.desktop.Window.getCurrent().minimize(),
  }

  app = {
    exit: () => fin.desktop.Application.getCurrent().close(),
    open: (id: string, config: AppConfig) =>
      new Promise<string>((resolve, reject) => {
        fin.desktop.System.getAllApplications(apps => {
          const isRunning = apps.find(app => app.isRunning && app.uuid === id)
          if (isRunning) {
            // tslint:disable-next-line:no-unused-expression
            config.payload && this.interop.publish(config.topic, config.payload)
          } else {
            const appConfig = {
              name: config.uuid,
              uuid: config.uuid,
              url: config.url,
              mainWindowOptions: {
                icon: config.icon,
                autoShow: true,
                frame: true,
              },
            }
            const app: fin.OpenFinApplication = new fin.desktop.Application(
              appConfig,
              () => app.run(() => setTimeout(() => resolve(id), 1000), err => reject(err)),
              err => reject(err),
            )
          }
        })
      }),
  }

  interop = {
    subscribe$: (topic: string) =>
      fromEventPattern(
        (handler: Function) =>
          fin.desktop.InterApplicationBus.subscribe('*', topic, handler as () => void),
        (handler: Function) =>
          fin.desktop.InterApplicationBus.unsubscribe('*', topic, handler as () => void),
      ),

    publish: (topic: string, message: string | object) =>
      fin.desktop.InterApplicationBus.publish(topic, message),
  }

  excel: ExcelInterop = {
    adapterName: excelAdapter.name,
    open: () => excelAdapter.openExcel(),
    isOpen: () => excelAdapter.isSpreadsheetOpen(),
    publishPositions: (positions: CurrencyPairPositionWithPrice[]) =>
      excelAdapter.publishPositions(positions),
    publishBlotter: <T extends any>(blotterData: T) => excelAdapter.publishBlotter(blotterData),
  }

  notification = {
    notify: (message: object) => {
      this.openFinNotifications
        .create({
          body: this.getNotificationBody(message),
          title: this.getNotificationTitle(message),
          icon: `${location.protocol}//${location.host}/static/media/icon.ico`,
          customData: message,
          buttons: [
            {
              title: 'Highlight trade in blotter',
              iconUrl: `${location.protocol}//${location.host}/static/media/icon.ico`,
            },
          ],
        })
        .then((successVal: Notification) => {
          console.info('Notification success', successVal)
        })
        .catch((err: any) => {
          console.error('Notification error', err)
        })
    },
  }

  getNotificationTitle({ tradeNotification }: NotificationMessage) {
    const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
    return `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${
      tradeNotification.notional
    }`
  }

  getNotificationBody({ tradeNotification }: NotificationMessage) {
    return `vs. ${tradeNotification.termsCurrency} - Rate ${
      tradeNotification.spotRate
    } - Trade ID ${tradeNotification.tradeId}`
  }
}

async function appRestoreHandler(workspaceApp: workspaces.WorkspaceApp, store: Store) {
  const ofApp = await fin.Application.getCurrent()
  const openWindows = await ofApp.getChildWindows()
  console.log(openWindows)
  const opened = workspaceApp.childWindows.map(async (win: workspaces.WorkspaceWindow) => {
    if (!openWindows.some(w => w.identity.name === win.name)) {
      const config: WindowConfig = {
        name: win.name,
        url: win.url,
        width: win.bounds.width,
        height: win.bounds.height,
      }
      await openDesktopWindow(
        config,
        () => {
          store.dispatch(
            LayoutActions.updateContainerVisibilityAction({
              name: win.name,
              display: true,
            }),
          )
        },
        { defaultLeft: win.bounds.left, defaultTop: win.bounds.top },
      )

      // we need to 'remove' the child window from the main window
      store.dispatch(
        LayoutActions.updateContainerVisibilityAction({
          name: win.name,
          display: false,
        }),
      )
    } else {
      await positionWindow(win)
    }
  })

  await Promise.all(opened)
  return workspaceApp
}

async function positionWindow(win: workspaces.WorkspaceWindow): Promise<void> {
  try {
    const { isShowing, isTabbed } = win

    const ofWin = await fin.Window.wrap(win)
    await ofWin.setBounds(win.bounds)

    if (isTabbed) {
      await ofWin.show()
      return
    }

    await ofWin.leaveGroup()

    if (isShowing) {
      if (win.state === WindowState.Normal) {
        // Need to both restore and show because the restore function doesn't emit a `shown` or `show-requested` event
        await ofWin.restore()
        await ofWin.show()
      } else if (win.state === WindowState.Minimized) {
        await ofWin.minimize()
      } else if (win.state === WindowState.Maximized) {
        await ofWin.maximize()
      }
    } else {
      await ofWin.hide()
    }
  } catch (e) {
    console.error('position window error', e)
  }
}
