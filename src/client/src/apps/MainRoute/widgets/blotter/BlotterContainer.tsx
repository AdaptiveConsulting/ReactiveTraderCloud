import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { BlotterActions } from './actions'
import Blotter from './components'
import { selectBlotterRows, selectBlotterStatus } from './selectors'
import { usePlatform } from 'rt-platforms'

interface BlotterContainerOwnProps {
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}

const mapStateToProps = (state: GlobalState) => ({
  rows: selectBlotterRows(state),
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
      render={() => <Blotter {...props} canPopout={tearable && allowTearOff && !tornOff} />}
      message="Blotter Disconnected"
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlotterContainer)
