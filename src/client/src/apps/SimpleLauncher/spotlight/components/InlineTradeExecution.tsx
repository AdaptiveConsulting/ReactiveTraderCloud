import React from 'react'
import { HelpText, Pill } from './styles'
import { InlineQuoteTable } from './InlineQuote'

interface Props {
  currencyPair?: string
  number?: number
  hasOverlay: boolean
}

const Usage: React.FC = () => (
  <HelpText>
    Usage: <Pill>buy/sell</Pill> <Pill>quantity</Pill> <Pill>instrument</Pill>
  </HelpText>
)

const Confirmation: React.FC = () => (
  <HelpText>
    Press <Pill>ENTER</Pill> to continue
  </HelpText>
)

export const InlineTradeExecution: React.FC<Props> = ({ currencyPair, number, hasOverlay }) => {
  if (hasOverlay) {
    if (currencyPair) {
      return <InlineQuoteTable currencyPair={currencyPair} />
    }

    return null
  }

  return !number || !currencyPair ? <Usage /> : <Confirmation />
}
