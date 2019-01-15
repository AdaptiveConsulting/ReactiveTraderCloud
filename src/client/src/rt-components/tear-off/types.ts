export enum WindowCenterStatus {
  Parent = 'parent',
  Screen = 'screen',
}

export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  center?: WindowCenterStatus
}
