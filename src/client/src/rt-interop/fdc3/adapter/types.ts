import { Context } from 'openfin/_v2/fdc3/main'

export type FDC3Platform = {
  readonly broadcast: (context: Context) => void
}
