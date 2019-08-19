import { waitForObject } from 'rt-util'
import IApplication from './IApplication'
import renderApplication from './render'

export default class Standalone implements IApplication {
  private _urlParams: URLSearchParams
  private _param: string

  constructor(urlParams: URLSearchParams, param: string) {
    this._urlParams = urlParams
    this._param = param
  }

  public async run() {
    if (this._urlParams.has(this._param)) {
      await waitForObject(this._urlParams.get(this._param))
    }
    return renderApplication() as any
  }
}
