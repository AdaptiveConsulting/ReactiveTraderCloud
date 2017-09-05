import Rate from './rate'
import Spread from './spread'
import { PriceMovementType } from './index'

export default class SpotPrice {
  constructor(symbol: any,
              ratePrecision: number,
              bid: Rate,
              ask: Rate,
              mid: Rate,
              valueDate: Date,
              creationTimestamp: Date,
              priceMovementType: PriceMovementType,
              spread: Spread,
              isTradable: boolean) {
    this._symbol = symbol
    this._ratePrecision = ratePrecision
    this._bid = bid
    this._ask = ask
    this._mid = mid
    this._valueDate = valueDate
    this._creationTimestamp = creationTimestamp
    this._priceMovementType = priceMovementType
    this._spread = spread
    this._isTradable = isTradable
  }

  _symbol: string

  get symbol(): string {
    return this._symbol
  }

  _ratePrecision: number

  get ratePrecision(): number {
    return this._ratePrecision
  }

  _bid: Rate

  get bid(): Rate {
    return this._bid
  }

  _ask: Rate

  get ask(): Rate {
    return this._ask
  }

  _mid: Rate

  get mid(): Rate {
    return this._mid
  }

  // in the real world there'd be a price id on here somewhere!!

  _valueDate: Date

  get valueDate(): Date {
    return this._valueDate
  }

  _creationTimestamp: Date

  get creationTimestamp(): Date {
    return this._creationTimestamp
  }

  _priceMovementType: PriceMovementType

  get priceMovementType(): PriceMovementType {
    return this._priceMovementType
  }

  _spread: Spread

  get spread(): Spread {
    return this._spread
  }

  _isTradable: boolean

  get isTradable(): boolean {
    return this._isTradable
  }
}
