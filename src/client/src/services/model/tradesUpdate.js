import { Trade } from './';

export default class TradesUpdate{

  constructor(isStateOfTheWorld:boolean, isStale:boolean, trades:Array<Trade>){
    this._isStateOfTheWorld = isStateOfTheWorld;
    this._isStale = isStale;
    this._trades = trades;
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
}
