import React, { FC, useEffect, useMemo, useState } from 'react'
import { InlineTradeExecutionContainer, InlineTradeResponseContainer } from './styles'

import { useTradeExecution } from './useTradeExecution'
import { Direction } from 'rt-types'
import { useMarketService } from './useMarketService'
import { IndeterminateLoadingBar } from './IndeterminateLoadingBar'

const COUNTDOWN = 5000

export type InlinePartialTradeRequest = {
  direction: Direction
  currencyPair: string
  notional: number
}

export type InlineTradeExecutionProps = {
  partialTradeRequest: InlinePartialTradeRequest
  handleReset: () => void
}

export const InlineTradeExecution: FC<InlineTradeExecutionProps> = ({
  partialTradeRequest,
  handleReset,
}) => {
  const { executeTrade, tradeResponse, loading, error } = useTradeExecution()
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timer>()
  const [countdownDisplay, setCountDisplay] = useState<number>(COUNTDOWN / 1000)
  const [tradeStatus, setTradeStatus] = useState<'accepted' | 'rejected'>()
  const [displayLoadingBar, setDisplayLoadingBar] = useState<boolean>(false)
  const [uiLoading, setUiLoading] = useState<boolean>(false)

  const currencyPairs = useMarketService()

  useEffect(() => {
    if (currencyPairs) {
      setCountdownTimer(undefined)
      startTradeCountdown()
    }
  }, [currencyPairs])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (countdownTimer) {
      interval = setInterval(() => {
        setCountDisplay(prev => {
          if (prev === 1) {
            clearInterval(interval)
            setCountDisplay(COUNTDOWN / 1000)
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      setCountDisplay(COUNTDOWN / 1000)
      clearInterval(interval)
    }
  }, [countdownTimer])

  useEffect(() => {
    if (tradeResponse && 'trade' in tradeResponse) {
      if (tradeResponse.trade.status === 'rejected') {
        setTradeStatus('rejected')
      }
      if (tradeResponse.trade.status === 'done') {
        setTradeStatus('accepted')
      }
      resetAfterTimeout()
      setDisplayLoadingBar(true)
      setUiLoading(false)
    } else {
      if (error) {
        resetAfterTimeout()
      }
      setDisplayLoadingBar(false)
    }
  }, [tradeResponse, error])

  useEffect(() => {
    if (error) {
      setDisplayLoadingBar(true)
      setTradeStatus('rejected')
      setUiLoading(false)
    }

    return () => {
      setTradeStatus(undefined)
      setDisplayLoadingBar(false)
      setUiLoading(false)
    }
  }, [error])

  const resetAfterTimeout = () => {
    setTimeout(() => {
      handleReset()
    }, COUNTDOWN)
  }

  const startTradeCountdown = () => {
    setUiLoading(true)
    setDisplayLoadingBar(true)

    const timer = setTimeout(() => {
      if (partialTradeRequest && currencyPairs) {
        executeTrade({ partialTradeRequest, currencyPairs })
      }
      clearTimeout(timer)
      setCountdownTimer(undefined)
    }, COUNTDOWN)

    setCountdownTimer(timer)
  }

  const successContent = useMemo(() => {
    if (tradeResponse && 'trade' in tradeResponse) {
      const {
        status,
        tradeId,
        symbol,
        direction,
        dealtCurrency,
        notional,
        tradeDate,
      } = tradeResponse.trade

      const directionString = direction.toLowerCase() === 'buy' ? 'bought' : 'sold'

      const rejectedString = 'Your trade has been rejected'
      const acceptedString = `You ${directionString} ${symbol} for ${dealtCurrency}${notional} settling ${tradeDate.toLocaleDateString()}`

      return (
        <>
          <p>
            <strong>Trade ID: {tradeId}</strong>
          </p>
          <p>
            <small>{status === 'rejected' ? rejectedString : acceptedString}</small>
          </p>
        </>
      )
    }
    return null
  }, [tradeResponse])

  const errorContent = useMemo(() => {
    if (error || (tradeResponse && 'error' in tradeResponse)) {
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
    }
    return null
  }, [tradeResponse, error])

  const countdownContent = useMemo(() => {
    if (countdownTimer) {
      return (
        <>
          <p>
            <strong>
              Trading {partialTradeRequest.currencyPair} in {countdownDisplay}...
            </strong>
          </p>
        </>
      )
    }

    return null
  }, [countdownTimer, countdownDisplay])

  const defaultContent = useMemo(() => {
    if (!countdownTimer && !tradeResponse && !error) {
      return (
        <>
          <p>
            <strong>Working...</strong>
          </p>
        </>
      )
    }
  }, [countdownTimer, tradeResponse, error])

  return (
    <InlineTradeExecutionContainer className="search-container--active">
      {displayLoadingBar && (
        <IndeterminateLoadingBar loading={loading || uiLoading} status={tradeStatus} />
      )}
      <InlineTradeResponseContainer>
        {successContent}
        {countdownContent}
        {errorContent}
        {defaultContent}
      </InlineTradeResponseContainer>
    </InlineTradeExecutionContainer>
  )
}
