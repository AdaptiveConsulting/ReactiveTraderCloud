import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { Environment } from 'rt-system'
import { GlobalState } from 'StoreTypes'
import { BlotterActions } from './actions'
import Blotter from './components'
import { selectBlotterRows, selectBlotterStatus } from './selectors'

interface BlotterContainerOwnProps {
  onPopoutClick: () => void
  tornOff: boolean
  tearable?: boolean
}

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type BlotterContainerProps = BlotterContainerStateProps & BlotterContainerDispatchProps & BlotterContainerOwnProps

const BlotterContainer: React.SFC<BlotterContainerProps> = ({
  status,
  onMount,
  tearable = false,
  tornOff,
  ...props
}) => (
  <Loadable
    onMount={onMount}
    status={status}
    render={() => <Blotter {...props} canPopout={tearable && !Environment.isRunningInIE() && !tornOff} />}
    message="Blotter Disconnected"
  />
)

const mapStateToProps = (state: GlobalState) => ({
  rows: selectBlotterRows(state),
  status: selectBlotterStatus(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMount: () => dispatch(BlotterActions.subscribeToBlotterAction()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlotterContainer)
