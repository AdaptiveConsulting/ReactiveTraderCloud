import { FDC3Platform } from './types'
import { Context } from 'openfin/_v2/fdc3/main'

export default class OpenFinFDC3 implements FDC3Platform {
  public broadcast = (context: Context) => fdc3.broadcast(context)
}
