export default class RegionSettings {
  _title:string;
  _width:number;
  _height:number;
  _dockable:boolean;

  constructor(title:string, width:number, height: number, dockable: false) {
    this._title = title;
    this._width = width;
    this._height = height;
    this._dockable = dockable;
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

  get dockable():boolean {
    return this._dockable;
  }
}
