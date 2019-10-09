declare var __VERSION__: string
declare var REACT_APP_ENV: string
declare module 'react-nvd3'
declare module 'react-sizeme'
declare module 'audio-recorder-polyfill'
interface Window {
  // types not currently available for FSBL - 1/24/2019
  FSBL: {
    addEventListener: any
    UserNotification: any
    Clients: {
      RouterClient: any
      LauncherClient: any
    }
  }

  SYMPHONY: SymphonyClient

  glue: GlueInterface

  glue4office: Glue42OfficeInterface
}
