export function isParentAppOpenfinLauncher() {
  if (window?.fin?.me) {
    const uuid = window.fin.me.uuid
    return uuid.split('-').includes('launcher')
  }
  return false
}
