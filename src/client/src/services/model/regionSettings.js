export default class RegionSettings {
  _title:string;
  _width:number;
  _height:number;

  constructor(title:string, width:number, height: number) {
    this._title = title;
    this._width = width;
    this._height = height;
  }

  get title():string {
    return this._title;
  }

  get width():number {
    return this._width;
  }

  get height():number {
    return this._height;
  }
}
