import React, { FC, useEffect, useMemo, useState } from 'react'
import { InlineTradeExecutionContainer, InlineTradeResponseContainer } from './styles'

import { useTradeExecution } from './useTradeExecution'
import { useMarketService } from './useMarketService'
import { IndeterminateLoadingBar, IndeterminateLoadingBarStatus } from './IndeterminateLoadingBar'
import { DetectIntentResponse } from 'dialogflow'
import { getTradeRequest } from 'rt-interop'
import { TradeSuccessResponse } from 'apps/MainRoute/widgets/spotTile/model/executeTradeRequest'

const COUNTDOWN = 5000
const COUNTDOWN_DISPLAY = COUNTDOWN / 1000

type InlineTradeExecutionRequestStatus = 'incomplete' | 'complete'
export type InlineTradeExecutionStatus = 'waiting' | 'executing' | 'success' | 'failure' | undefined

export type InlineTradeExecutionProps = {
  handleReset: () => void
  response: DetectIntentResponse
}

export const InlineTradeExecution: FC<InlineTradeExecutionProps> = ({ response, handleReset }) => {
  const [requestStatus, setRequestStatus] = useState<InlineTradeExecutionRequestStatus>(
    'incomplete'
  )
  const [tradeStatus, setTradeStatus] = useState<InlineTradeExecutionStatus>()
  const [countdownDisplay, setCountdownDisplay] = useState<number>(COUNTDOWN_DISPLAY)
  const [loadingBarStatus, setLoadingBarStatus] = useState<IndeterminateLoadingBarStatus>()
  const { executeTrade, tradeResponse, loading, error } = useTradeExecution()

  const currencyPairs = useMarketService()
  const partialTradeRequest = getTradeRequest(response.queryResult)

  const startTimers = (): { interval: number; timeout: number } => {
    setTradeStatus('waiting')
    setLoadingBarStatus('loading')

    const intervalId = setInterval(() => {
      setCountdownDisplay(prev => {
        if (prev === 1) {
          clearInterval(intervalId)
          return COUNTDOWN_DISPLAY
        }
        return prev - 1
      })
    }, 1000)

    const timeoutId = setTimeout(() => {
      executeTradeRequest()
      clearTimeout(timeoutId)
    }, COUNTDOWN)

    // @ts-ignore
    return { interval: intervalId, timeout: timeoutId }
  }

  const executeTradeRequest = () => {
    if (partialTradeRequest && currencyPairs && requestStatus === 'complete') {
      setTradeStatus('executing')
      executeTrade({ partialTradeRequest, currencyPairs })
    }
  }

  const cancelTradeRequest = () => {
    setLoadingBarStatus(undefined)
    setRequestStatus('incomplete')
    handleReset()
  }

  useEffect(() => {
    if (currencyPairs && partialTradeRequest) {
      setRequestStatus('complete')
    } else {
      setRequestStatus('incomplete')
    }
  }, [currencyPairs, partialTradeRequest])

  useEffect(() => {
    let intervalId: number | undefined
    let timeoutId: number | undefined

    const clearTimers = () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    if (requestStatus === 'complete') {
      const { interval, timeout } = startTimers()
      intervalId = interval
      timeoutId = timeout
    }

    if (requestStatus === 'incomplete') {
      clearTimers()
    }

    return () => {
      clearTimers()
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
    if (tradeResponse && 'trade' in tradeResponse) {
      if (tradeResponse.trade.status === 'done') {
        setLoadingBarStatus('success')
        return tradeAcceptedContent
      } else {
        setLoadingBarStatus('failure')
        return tradeRejectedContent
      }
    }
  }, [tradeAcceptedContent, tradeRejectedContent, tradeResponse])

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

  if (requestStatus === 'incomplete') {
    return null
  }

  return (
    <InlineTradeExecutionContainer className="search-container--active">
      {(requestStatus === 'complete' || loading) && (
        <IndeterminateLoadingBar status={loadingBarStatus} />
      )}
      <InlineTradeResponseContainer>
        {tradeStatus === 'waiting' && <p>Trading in {countdownDisplay} seconds</p>}
        {tradeStatus === 'executing' && <p>Executing Trade...</p>}
        {tradeResponse && tradeStatus === 'success' && tradeSuccessContent}
        {error || (tradeResponse && tradeStatus === 'failure' && tradeErrorContent)}
      </InlineTradeResponseContainer>
      <button
        disabled={tradeStatus === 'executing'}
        onClick={tradeStatus === 'waiting' ? cancelTradeRequest : handleReset}
      >
        {tradeStatus === 'waiting' ? 'Cancel Request' : 'Close'}
      </button>
    </InlineTradeExecutionContainer>
  )
}
