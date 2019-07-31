
export interface Price {
    ask: number
    bid: number
    mid: number
    creationTimestamp: number
    symbol: string
    valueDate: string
  }
  
  export function convertToPrice(dto: RawPrice): Price {
    return {
      ask: dto.Ask,
      bid: dto.Bid,
      mid: dto.Mid,
      creationTimestamp: dto.CreationTimestamp,
      symbol: dto.Symbol,
      valueDate: dto.ValueDate,
    }
  }
  
  export interface RawPrice {
    Ask: number
    Bid: number
    Mid: number
    CreationTimestamp: number
    Symbol: string
    ValueDate: string
  }