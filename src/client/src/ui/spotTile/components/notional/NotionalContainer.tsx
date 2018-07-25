import React from 'react'
import { connect } from 'react-redux'
import { CurrencyPair } from 'rt-types'
import { GlobalState } from '../../../../combineReducers'
import { NotionalActions } from './actions'
import NotionalInput from './NotionalInput'
import { NotionalState } from './notionalReducer'

interface NotionalContainerProps {
  className: string
  currencyPair: CurrencyPair
  notionals: NotionalState
  onNotionalInputChange: typeof NotionalActions.onNotionalInputChange
}

const NotionalContainer: React.SFC<NotionalContainerProps> = ({
  className,
  currencyPair,
  notionals,
  onNotionalInputChange
}: NotionalContainerProps) => (
  <NotionalInput
    className={className}
    notional={getNotional(notionals, currencyPair)}
    currencyPair={currencyPair}
    onNotionalInputChange={(value: number) =>
      onNotionalInputChange({
        currencyPairSymbol: getCurrencyPairSymbol(currencyPair),
        value
      })
    }
  />
)

const mapStateToProps = ({ notionals }: GlobalState) => ({
  notionals
})

export default connect(
  mapStateToProps,
  { onNotionalInputChange: NotionalActions.onNotionalInputChange }
)(NotionalContainer)

const getCurrencyPairSymbol = (currencyPair: CurrencyPair) => currencyPair.symbol

const getNotional = (notionals: NotionalState, currencyPair: CurrencyPair) => notionals[currencyPair.symbol] || 1000000
