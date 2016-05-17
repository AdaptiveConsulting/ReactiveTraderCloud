export default class TradesUpdate{

  constructor(isStateOfTheWorld:boolean, isStale:boolean){
    this._isStateOfTheWorld = isStateOfTheWorld;
    this._isStale = isStale;
  }

  get isStateOfTheWorld():boolean{
    return this._isStateOfTheWorld;
  }
  get isStale():boolean{
    return this._isStale;
  }

  get trades():Array<Trade>{
    return this._trades;
  }

  set trades(trades:Array<Trade>){
    this._trades = trades;
  }
}
