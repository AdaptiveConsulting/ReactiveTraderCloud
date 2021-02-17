export interface RfqRequest {
  symbol: string
  notional: number
}

export enum QuoteStatus {
  Requested = "Request",
  Received = "Received",
  Accepted = "Accepted",
  Rejected = "Rejected",
}
