export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  displayName?: string
  minHeight?: number
  minWidth?: number
  maxHeight?: number
  maxWidth?: number
  x?: number
  y?: number
  saveWindowState?: boolean
  includeInSnapshots?: boolean
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function openWindow(
  config: WindowConfig,
  onClose?: () => void,
): Promise<Window | undefined> {
  return Promise.reject("Function should be implemented at platform level")
}
