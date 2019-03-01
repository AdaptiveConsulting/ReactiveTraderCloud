export interface RawPrice {
  Ask: number
  Bid: number
  Mid: number
  CreationTimestamp: number
  Symbol: string
  ValueDate: string
}

export interface RawServiceStatus {
  Type: string
  Instance: string
  TimeStamp: number
  Load: number
}
