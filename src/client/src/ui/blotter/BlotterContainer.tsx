import { GlobalState } from 'combineReducers'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { styled } from 'rt-util'
import { Environment } from 'system'
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

const BlotterDisconnected = styled('div')`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme: { palette } }) => palette.accentBad.normal};
  color: ${({ theme: { text } }) => text.primary};
`

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

    return <BlotterDisconnected>Blotter disconnected</BlotterDisconnected>
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
