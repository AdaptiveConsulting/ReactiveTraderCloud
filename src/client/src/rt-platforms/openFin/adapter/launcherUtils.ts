export async function isParentAppOpenfinLauncher() {
  const app = await fin.Window.getCurrent()
  const {
    identity: { uuid },
  } = await app.getParentApplication()

  return uuid.split('-').includes('launcher')
}
