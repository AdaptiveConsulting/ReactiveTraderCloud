import { map } from "rxjs/operators"
import { BlotterService } from "@/generated/TradingGateway"
import { withConnection } from "./withConnection"

export const tradesStream$ = BlotterService.getTradeStream().pipe(
  withConnection(),
  map(({ updates }) =>
    updates.map((update) => ({
      ...update,
      tradeId: update.tradeId.toString(),
    })),
  ),
)
