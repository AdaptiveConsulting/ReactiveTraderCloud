import { initiateSymphony } from 'rt-symphony'
import IApplication from './IApplication'

export default class Symphony implements IApplication {
  private _urlParams: URLSearchParams
  private _param: string

  constructor(urlParams: URLSearchParams, param: string) {
    this._urlParams = urlParams
    this._param = param
  }

  public async run() {
    return (await initiateSymphony(this._urlParams.get(this._param))) as any
  }
}
