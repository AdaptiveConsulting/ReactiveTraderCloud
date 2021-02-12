import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  InlineTradeExecutionActionContainer,
  InlineTradeExecutionContainer,
  InlineTradeResponseContainer,
} from './styles'

import { useTradeExecution } from './useTradeExecution'
import { useMarketService } from './useMarketService'
import { IndeterminateLoadingBar, IndeterminateLoadingBarStatus } from './IndeterminateLoadingBar'
import { DetectIntentResponse } from 'dialogflow'
import { getTradeRequest } from 'rt-interop'
import { TradeSuccessResponse } from 'apps/MainRoute/widgets/spotTile/model/executeTradeRequest'
import { Direction } from 'rt-types'

type InlineTradeExecutionRequestStatus = 'incomplete' | 'complete'
export type InlineTradeExecutionStatus = 'waiting' | 'executing' | 'success' | 'failure' | undefined

export type InlineTradeExecutionProps = {
  handleReset: () => void
  handleClearSearchInput: () => void
  response: DetectIntentResponse
}

export const InlineTradeExecution: FC<InlineTradeExecutionProps> = ({
  response,
  handleReset,
  handleClearSearchInput,
}) => {
  const [requestStatus, setRequestStatus] = useState<InlineTradeExecutionRequestStatus>(
    'incomplete'
  )
  const [tradeStatus, setTradeStatus] = useState<InlineTradeExecutionStatus>()
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
      trade: { direction, symbol, dealtCurrency, notional, tradeDate, tradeId },
    } = tradeResponse as TradeSuccessResponse

    const directionString = direction === 'buy' ? 'bought' : 'sold'
    const tradeAcceptedMessage = `You ${directionString} ${symbol} for ${dealtCurrency}${notional} settling ${tradeDate.toLocaleDateString()}`

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
            You are {directionString} {partialTradeRequest?.Notional}{' '}
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
    <InlineTradeExecutionContainer className="search-container--active">
      {(requestStatus === 'complete' || loading) && tradeStatus !== 'waiting' && (
        <IndeterminateLoadingBar status={loadingBarStatus} />
      )}
      <InlineTradeResponseContainer>
        {tradeStatus === 'waiting' && confirmTradeContent}
        {tradeStatus === 'executing' && <p>Executing Trade...</p>}
        {tradeResponse && tradeStatus === 'success' && tradeSuccessContent}
        {error || (tradeResponse && tradeStatus === 'failure' && tradeErrorContent)}
      </InlineTradeResponseContainer>
      <InlineTradeExecutionActionContainer>
        {tradeStatus === 'waiting' && <button onClick={executeTradeRequest}>Execute</button>}
        <button disabled={tradeStatus === 'executing'} onClick={resetAll}>
          {tradeStatus === 'waiting' ? 'Cancel' : 'Close'}
        </button>
      </InlineTradeExecutionActionContainer>
    </InlineTradeExecutionContainer>
  )
}
