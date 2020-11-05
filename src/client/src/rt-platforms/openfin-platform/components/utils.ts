interface BasicWindow {
  name: string;
  width: number;
  height: number;
}

export type Offset = [number, number]

/**
 * Shows an OpenFin Popup, offset from the bottom right corner of the parent window/full screen.
 */
async function showOpenFinPopup({ height, name, width }: BasicWindow, [rightOffset, bottomOffset]: Offset) {
  const popupWindow = await fin.Window.wrapSync({ uuid: fin.me.uuid, name });
  let left = 0, top = 0;

  /**
   * In both contexts, right & bottom are the screen coordinates of the right & bottom corners of either rectangle.
   * Upon maximizing an OpenFin window, the window bounds are not updated. We query the window state to see if it is
   * maximized, and if so, place the popup on the screen relative to the whole monitor.
   * 
   * We show a window by pointing its top-left corner to a pixel
   */

  async function setLeftTopForFullScreenMode() {
    const monitorInfo = await fin.System.getMonitorInfo()
    const { bottom, right } = monitorInfo.primaryMonitor.availableRect;

    left = right - width - rightOffset;
    top = bottom - height - bottomOffset;
  }

  try {
    const thisWindow = await fin.Window.getCurrent();
    const windowState = await thisWindow.getState();

    if (windowState === 'maximized') {
      await setLeftTopForFullScreenMode();
    } else {
      const { bottom, right } = await thisWindow.getBounds();
  
      if (bottom === undefined || right === undefined) {
        await setLeftTopForFullScreenMode();
      } else {
        left = right - width - rightOffset;
        top = bottom - height - bottomOffset;
      }
    }
  } finally {
    popupWindow.showAt(left, top);
    popupWindow.focus();
  }
}

/**
 * An OpenFin Popup hides itself when blurred
 */
async function createOpenFinPopup({ height, name, width }: BasicWindow, url: string, callback: () => void): Promise<void> {
  try {
    const popupWindow = await fin.Window.create({
      name,
      url,
      defaultHeight: height,
      defaultWidth: width,
      autoShow: false,
      frame: false,
      saveWindowState: false,
      cornerRounding: {
        height: 10,
        width: 10
      }
    });
    await popupWindow.addListener('blurred', () => popupWindow.hide().then(callback))
  } catch (e) {
    if (e.message && e.message.startsWith("Trying to create a Window with name-uuid combination already in use")) {
      console.log(`Attempted to recreate hidden window: ${name}`);
    } else {
      console.error(e);
    }
  }
}

export { showOpenFinPopup, createOpenFinPopup }