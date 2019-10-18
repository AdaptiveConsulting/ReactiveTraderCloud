import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { BlotterActions } from './actions'
import Blotter from './components'
import { selectBlotterRows, selectBlotterStatus } from './selectors'
import { usePlatform } from 'rt-platforms'
import { Trade } from 'rt-types'

export type FieldValues = ReadonlyArray<any> | undefined;
export type BlotterFilter = { [fieldId: string]: FieldValues }

interface BlotterContainerOwnProps {
  filter?: BlotterFilter
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}

const tradeMatchesFilter = (trade: Trade, filterField: string, filteringFieldValues: FieldValues) => {
  if (!trade) {
    return false
  }
  if (!filteringFieldValues) {
    return true
  }
  if (!(trade as any).hasOwnProperty(filterField)) {
    console.warn(`Trying to filter of field ${filterField} which does not exist in 'Trade' object`);
    return true
  }

  const tradeFieldValue = trade[filterField]

  return filteringFieldValues.includes(tradeFieldValue)
}

function selectBlotterRowsAndFilter(state: GlobalState, filters?: BlotterFilter): ReadonlyArray<Trade>  {
  const trades: ReadonlyArray<Trade> = selectBlotterRows(state)
  const fieldsToFilterBy = Object.keys(filters || {})
  if (!filters || fieldsToFilterBy.length === 0) {
    return trades;
  }

  return trades.filter(
    trade => {
      return fieldsToFilterBy.every(fieldToFilterBy => tradeMatchesFilter(trade, fieldToFilterBy, filters[fieldToFilterBy]))
    }
  )
}

const mapStateToProps = (state: GlobalState, ownProps: BlotterContainerOwnProps) => ({
  rows: selectBlotterRowsAndFilter(state, ownProps.filter) as Trade[],
  status: selectBlotterStatus(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMount: () => dispatch(BlotterActions.subscribeToBlotterAction()),
})

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type BlotterContainerProps = BlotterContainerStateProps &
  BlotterContainerDispatchProps &
  BlotterContainerOwnProps

const BlotterContainer: React.FC<BlotterContainerProps> = ({
  status,
  onMount,
  tearable = false,
  tornOff,
  ...props
}) => {
  const { allowTearOff } = usePlatform()

  return (
    <Loadable
      onMount={onMount}
      status={status}
      render={() => <Blotter {...props} canPopout={tearable && allowTearOff && !tornOff}/>}
      message="Blotter Disconnected"
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlotterContainer)
