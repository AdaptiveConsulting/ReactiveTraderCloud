import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { ConnectionOverlay } from 'rt-components'
import { Environment } from 'rt-system'
import { GlobalState } from 'StoreTypes'
import { BlotterActions } from './actions'
import Blotter from './components'
import { selectBlotterService, selectBlotterStatus } from './selectors'

interface BlotterContainerOwnProps {
  onPopoutClick: () => void
  tornOff: boolean
}

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type BlotterContainerProps = BlotterContainerStateProps & BlotterContainerDispatchProps & BlotterContainerOwnProps

class BlotterContainer extends React.Component<BlotterContainerProps> {
  componentDidMount() {
    this.props.subscribeToBlotter()
  }

  render() {
    const { blotterService, isConnected, tornOff, onPopoutClick } = this.props
    const { trades } = blotterService
    const gridRows = Object.values(trades).reverse()

    if (isConnected) {
      return (
        <Blotter rows={gridRows} onPopoutClick={onPopoutClick} canPopout={!Environment.isRunningInIE() && !tornOff} />
      )
    }

    return <ConnectionOverlay>Blotter disconnected</ConnectionOverlay>
  }
}

const mapStateToProps = (state: GlobalState) => ({
  blotterService: selectBlotterService(state),
  isConnected: selectBlotterStatus(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  subscribeToBlotter: () => dispatch(BlotterActions.subscribeToBlotterAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlotterContainer)
