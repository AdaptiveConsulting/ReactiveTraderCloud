export async function isParentAppOpenfinLauncher() {
  if (fin?.Window) {
    const app = await fin.Window.getCurrent()
    const {
      identity: { uuid },
    } = await app.getParentApplication()

    return uuid.split('-').includes('launcher')
  }
  return false
}
