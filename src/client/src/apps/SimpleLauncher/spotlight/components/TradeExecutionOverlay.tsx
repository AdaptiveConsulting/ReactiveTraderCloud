import { DateTime } from 'luxon'
import numeral from 'numeral'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Subscription, fromEvent } from 'rxjs'
import { first } from 'rxjs/operators'
import {
  TradeExecutionActionContainer,
  TradeExecutionContainer,
  TradeResponseContainer,
} from './styles'

import { useTradeExecution } from './useTradeExecution'
import { useMarketService } from './useMarketService'
import { IndeterminateLoadingBar, IndeterminateLoadingBarStatus } from './IndeterminateLoadingBar'
import { DetectIntentResponse } from 'dialogflow'
import { getTradeRequest } from 'rt-interop'
import { TradeSuccessResponse } from 'apps/MainRoute/widgets/spotTile/model/executeTradeRequest'
import { Direction } from 'rt-types'

type TradeExecutionRequestStatus = 'incomplete' | 'complete'
export type TradeExecutionStatus = 'waiting' | 'executing' | 'success' | 'failure' | undefined

export type TradeExecutionProps = {
  handleReset: () => void
  handleClearSearchInput: () => void
  response: DetectIntentResponse
}

export const TradeExecutionOverlay: FC<TradeExecutionProps> = ({
  response,
  handleReset,
  handleClearSearchInput,
}) => {
  const [requestStatus, setRequestStatus] = useState<TradeExecutionRequestStatus>('incomplete')
  const [tradeStatus, setTradeStatus] = useState<TradeExecutionStatus>()
  const [loadingBarStatus, setLoadingBarStatus] = useState<IndeterminateLoadingBarStatus>()
  const { executeTrade, tradeResponse, loading, error } = useTradeExecution()

  const currencyPairs = useMarketService()
  const partialTradeRequest = getTradeRequest(response.queryResult)

  const executeTradeRequest = () => {
    if (partialTradeRequest && currencyPairs && requestStatus === 'complete') {
      setTradeStatus('executing')
      executeTrade({ partialTradeRequest, currencyPairs })
    }
  }

  const resetAll = () => {
    setLoadingBarStatus(undefined)
    setRequestStatus('incomplete')
    handleReset()
    handleClearSearchInput()
  }

  useEffect(() => {
    const subscription = new Subscription()

    if (tradeStatus === 'waiting') {
      subscription.add(
        fromEvent<KeyboardEvent>(document, 'keydown')
          .pipe(first(evt => evt.key === 'Enter' && !evt.repeat))
          .subscribe(executeTradeRequest)
      )
    }

    if (tradeStatus !== 'executing') {
      subscription.add(
        fromEvent<KeyboardEvent>(document, 'keydown')
          .pipe(first(evt => evt.key === 'Escape' && !evt.repeat))
          .subscribe(resetAll)
      )
    }

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeStatus])

  useEffect(() => {
    if (currencyPairs && partialTradeRequest) {
      setRequestStatus('complete')
    } else {
      setRequestStatus('incomplete')
    }
  }, [currencyPairs, partialTradeRequest])

  useEffect(() => {
    const reset = () => {
      setTradeStatus(undefined)
      setLoadingBarStatus(undefined)
    }

    if (requestStatus === 'complete') {
      setTradeStatus('waiting')
      setLoadingBarStatus('loading')
    }

    if (requestStatus === 'incomplete') {
      reset()
    }

    return () => {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestStatus])

  useEffect(() => {
    const isSuccessResponse = tradeResponse && 'trade' in tradeResponse
    if (isSuccessResponse) {
      setTradeStatus('success')
    } else {
      setLoadingBarStatus('failure')
      setTradeStatus('failure')
    }
  }, [tradeResponse])

  const tradeAcceptedContent = useMemo(() => {
    if (!tradeResponse) {
      return null
    }
    const {
      trade: { direction, symbol, dealtCurrency, notional, spotRate, tradeDate, tradeId },
    } = tradeResponse as TradeSuccessResponse

    const directionString = direction.toLowerCase() === 'buy' ? 'bought' : 'sold'
    const tradeAcceptedMessage = `You ${directionString} ${symbol} for ${dealtCurrency}${numeral(
      notional
    ).format()} @ ${spotRate} settling ${DateTime.fromJSDate(tradeDate).toFormat('dd-LLL-yyyy / HH:mm:ss')}`

    return (
      <>
        <p>
          <strong>Trade ID: {tradeId}</strong>
        </p>
        <p>
          <small>{tradeAcceptedMessage}</small>
        </p>
      </>
    )
  }, [tradeResponse])

  const tradeRejectedContent = useMemo(() => {
    if (!tradeResponse) {
      return null
    }
    const {
      trade: { tradeId },
    } = tradeResponse as TradeSuccessResponse

    return (
      <>
        <p>
          <strong>Trade ID: {tradeId}</strong>
        </p>
        <p>
          <small>Your trade has been rejected.</small>
        </p>
      </>
    )
  }, [tradeResponse])

  const tradeSuccessContent = useMemo(() => {
    if (error) {
      setLoadingBarStatus('failure')
      setTradeStatus('failure')
      return tradeRejectedContent
    }

    if (tradeResponse && 'trade' in tradeResponse) {
      if (tradeResponse.trade.status === 'done') {
        setLoadingBarStatus('success')
        return tradeAcceptedContent
      } else {
        setLoadingBarStatus('failure')
        return tradeRejectedContent
      }
    }
  }, [tradeAcceptedContent, tradeRejectedContent, tradeResponse, error])

  const tradeErrorContent = useMemo(() => {
    return (
      <>
        <p>
          <strong>Something went wrong while executing your trade.</strong>
        </p>
        <p>
          {tradeResponse && 'error' in tradeResponse && <small>{tradeResponse.error}</small>}
          {error && <small>{error}</small>}
        </p>
      </>
    )
  }, [error, tradeResponse])

  const confirmTradeContent = useMemo(() => {
    const directionString = partialTradeRequest?.Direction === Direction.Buy ? 'buying' : 'selling'

    return (
      <>
        <p>
          <strong>Are You Sure?</strong>
        </p>
        <p>
          <small>
            You are {directionString} {numeral(partialTradeRequest?.Notional).format()}{' '}
            {partialTradeRequest?.CurrencyPair}
          </small>
        </p>
      </>
    )
  }, [partialTradeRequest])

  if (requestStatus === 'incomplete') {
    return null
  }

  return (
    <TradeExecutionContainer className="search-container--active">
      {(requestStatus === 'complete' || loading) && tradeStatus !== 'waiting' && (
        <IndeterminateLoadingBar status={loadingBarStatus} />
      )}
      <TradeResponseContainer>
        {tradeStatus === 'waiting' && confirmTradeContent}
        {tradeStatus === 'executing' && <p>Executing Trade...</p>}
        {tradeResponse && tradeStatus === 'success' && tradeSuccessContent}
        {error || (tradeResponse && tradeStatus === 'failure' && tradeErrorContent)}
      </TradeResponseContainer>
      <TradeExecutionActionContainer>
        {tradeStatus === 'waiting' && <button onClick={executeTradeRequest}>Execute</button>}
        <button disabled={tradeStatus === 'executing'} onClick={resetAll}>
          {tradeStatus === 'waiting' ? 'Cancel' : 'Close'}
        </button>
      </TradeExecutionActionContainer>
    </TradeExecutionContainer>
  )
}
