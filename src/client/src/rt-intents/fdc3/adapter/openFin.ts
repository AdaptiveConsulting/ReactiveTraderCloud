import { Context } from 'openfin-fdc3'
import { FDC3Platform } from './types'

export default class OpenFinFDC3 implements FDC3Platform {
  fdc3Context = require('openfin-fdc3')

  public broadcast = (context: Context) => this.fdc3Context.broadcast(context)
}
