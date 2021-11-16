export function closeWindow() {
  const win = fin.Window.getCurrentSync()
  win.close()
}
