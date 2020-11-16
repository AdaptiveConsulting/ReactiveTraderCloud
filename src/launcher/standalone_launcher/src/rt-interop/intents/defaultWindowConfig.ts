import { WindowConfig } from 'rt-platforms'

export const defaultConfig: WindowConfig = {
  name: '',
  url: '',
  width: 600,
  height: 400,
  center: 'parent',
}

// Safer than location.origin due to browser support
export const windowOrigin = `${location.protocol}//${location.host}`
