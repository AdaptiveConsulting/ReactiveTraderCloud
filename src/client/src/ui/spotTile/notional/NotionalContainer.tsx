import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../../combineReducers'
import { CurrencyPair } from '../../../types'
import { NotionalActions } from './actions'
import NotionalInput from './NotionalInput'
import { NotionalState } from './reducer'

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
