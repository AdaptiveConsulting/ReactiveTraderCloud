import { Context } from 'openfin-fdc3'

export type FDC3Platform = {
  readonly broadcast: (context: Context) => void
}
