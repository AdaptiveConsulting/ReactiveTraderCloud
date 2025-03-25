import { CurrencyPair } from "@/services/currencyPairs"
import { ExecutionStatus } from "@/services/executions"

import { useTileCurrencyPair } from "../Tile.context"
import {
  getTileState$,
  onDismissMessage,
  TileState,
  TileStates,
  useTileState,
} from "../Tile.state"
import { FailureOverlay, SuccessOverlay, WarningOverlay } from "./overlays"
import { Pending } from "./Pending"
import { ExecutionStatusAlertContainer } from "./Response.styles"

const ExecutionOverlay = ({
  tileState,
  currencyPair,
  onClose,
}: {
  tileState: TileState
  currencyPair: CurrencyPair
  onClose: () => void
}) => {
  const isTooLong = tileState.status === TileStates.TooLong

  const isFailure =
    (tileState.status === TileStates.Finished &&
      tileState.trade.status === ExecutionStatus.Rejected) ||
    tileState.status === TileStates.CreditExceeded ||
    tileState.status === TileStates.Timeout

  const isSuccessful =
    tileState.status === TileStates.Finished &&
    tileState.trade.status === ExecutionStatus.Done

  return (
    <ExecutionStatusAlertContainer state={tileState} role="dialog">
      {(() => {
        switch (true) {
          case isSuccessful:
            return (
              <SuccessOverlay
                trade={tileState.trade}
                onClose={onClose}
                {...currencyPair}
              />
            )
          case isFailure:
            return (
              <FailureOverlay
                tileState={tileState}
                onClose={onClose}
                {...currencyPair}
              />
            )
          case isTooLong:
            return <WarningOverlay {...currencyPair} />
        }
      })()}
    </ExecutionStatusAlertContainer>
  )
}

export const executionResponse$ = getTileState$
export const ExecutionResponse = () => {
  const currencyPair = useTileCurrencyPair()
  const tileState = useTileState(currencyPair.symbol)

  const props = {
    currencyPair,
    tileState,
    onClose: () => {
      onDismissMessage(currencyPair.symbol)
    },
  }

  return <StatelessExecutionResponse {...props} />
}

export const StatelessExecutionResponse = ({
  currencyPair,
  tileState,
  onClose,
}: {
  currencyPair: CurrencyPair
  tileState: TileState
  onClose: () => void
}) => {
  if (tileState.status === TileStates.Ready) return null

  return tileState.status === TileStates.Started ? (
    <Pending />
  ) : (
    <ExecutionOverlay
      currencyPair={currencyPair}
      tileState={tileState}
      onClose={onClose}
    />
  )
}
