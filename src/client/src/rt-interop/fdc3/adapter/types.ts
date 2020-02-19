import { Context, AppIntent } from 'openfin-fdc3'

export type FDC3Platform = {
  readonly broadcast: (context: Context) => void

  readonly findIntent: (intent: string, context?: Context) => Promise<AppIntent>

  readonly open: (intent: string, context?: Context) => Promise<void>
}
