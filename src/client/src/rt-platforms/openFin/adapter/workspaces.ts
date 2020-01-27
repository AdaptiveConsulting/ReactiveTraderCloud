import { openfinWindowStates, openDesktopWindow } from './window'
import { workspaces } from 'openfin-layouts'
import { Observable } from 'rxjs'
import { WindowConfig } from 'rt-platforms'
import { Workspace } from 'openfin-layouts/dist/client/workspaces'

interface WinProps {
  name: string
  display: boolean
}

export function setupWorkspaces() {
  return new Observable<WinProps>(observer => {
    workspaces
      .setRestoreHandler((workspace: workspaces.WorkspaceApp) => {
        console.log('settingRestoreHandler')
        return appRestoreHandler(workspace, (data: WinProps) => {
          console.log('appRestoreHandler')
          observer.next(data)
        })
      })
      .then(workspaces.ready)
  })
}

async function appRestoreHandler(
  workspaceApp: workspaces.WorkspaceApp,
  callback: (data: WinProps) => void,
) {
  const ofApp = await fin.Application.getCurrent()
  const openWindows = await ofApp.getChildWindows()

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
          callback({
            name: win.name,
            display: true,
          })
        },
        { defaultLeft: win.bounds.left, defaultTop: win.bounds.top },
      )

      // 'remove' the child window from the main window
      callback({
        name: win.name,
        display: false,
      })
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
      if (win.state === openfinWindowStates.Normal) {
        // Need to both restore and show because the restore function doesn't emit a `shown` or `show-requested` event
        await ofWin.restore()
        await ofWin.show()
      } else if (win.state === openfinWindowStates.Minimized) {
        await ofWin.minimize()
      } else if (win.state === openfinWindowStates.Maximized) {
        await ofWin.maximize()
      }
    } else {
      await ofWin.hide()
    }
  } catch (e) {
    console.error('position window error', e)
  }
}

export const saveWorkspace = async () => {
  const workspace = await workspaces.generate()
  window.localStorage.setItem('workspace', JSON.stringify(workspace))
}

export const getWorkspace = (): Workspace | null => {
  const workspace = window.localStorage.getItem('workspace')

  if (!workspace) {
    return null
  }

  return JSON.parse(workspace)
}

export const restoreWorkspace = () => {
  const workspace = getWorkspace()

  if (!workspace) {
    return
  }

  workspaces.restore(workspace)
}
