export default class RegionSettings {
  constructor(title: string, width: number, height: number, dockable: false) {
    this._title = title;
    this._width = width;
    this._height = height;
    this._dockable = dockable;
  }

  _title: string;

  get title(): string {
    return this._title;
  }

  _width: number;

  get width(): number {
    return this._width;
  }

  _height: number;

  get height(): number {
    return this._height;
  }

  _dockable: boolean;

  get dockable(): boolean {
    return this._dockable;
  }
}
