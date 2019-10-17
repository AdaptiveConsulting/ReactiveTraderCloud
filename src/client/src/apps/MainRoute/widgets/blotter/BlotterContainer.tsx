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

export type FilterValuesByFieldId = { [fieldId: string]: ReadonlyArray<any> }

interface BlotterContainerOwnProps {
  filters?: FilterValuesByFieldId
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}

const tradeMatchesFilter = (trade: Trade, filterField: string, matchingValues: ReadonlyArray<any>) => {
  if (!trade) {
    return false
  }
  if (!(trade as any).hasOwnProperty(filterField)) {
    console.warn(`Trying to filter of field ${filterField} which does not exist in 'Trade' object`);
    return true
  }

  const tradeFieldValue = trade[filterField]

  return matchingValues.includes(tradeFieldValue)
}

function selectBlotterRowsAndFilter(state: GlobalState, filters?: FilterValuesByFieldId) {
  const trades: ReadonlyArray<Trade> = selectBlotterRows(state)
  return trades.filter(
    trade => {
      if (!filters) {
        return true
      }
      const fieldsToFilterBy = Object.keys(filters);
      return fieldsToFilterBy.every(fieldToFilterBy => tradeMatchesFilter(trade, fieldToFilterBy, filters[fieldToFilterBy]))
    }
  )
}

const mapStateToProps = (state: GlobalState, ownProps: BlotterContainerOwnProps) => ({
  rows: selectBlotterRowsAndFilter(state, ownProps.filters),
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
