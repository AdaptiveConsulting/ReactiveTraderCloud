import { OpenFinDesktopAgent } from '@adaptive/openfin-fdc3-desktop-agent'
import { SandboxDesktopAgent } from '@adaptive/sandbox-fdc3-desktop-agent'
import { default as FDC3 } from '../fdc3/provider'

const isFinsemble = 'FSBL' in window
// TODO: We should not need to negate `isFinsemble` to check for OpenFin.
// Somewhere, `fin` is being added to the `window` object even in electron/finsemble versions.
const isOpenFin = 'fin' in window && !isFinsemble

export const getProvider = () => {
  if (isOpenFin) {
    return new FDC3(new OpenFinDesktopAgent())
  }

  return new FDC3(new SandboxDesktopAgent())
}
