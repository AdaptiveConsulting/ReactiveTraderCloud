import values from 'lodash.values'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import { BlotterActions } from './actions'
import Blotter from './components'

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
    const gridRows = values(trades).reverse()

    if (isConnected) {
      return (
        <Blotter rows={gridRows} onPopoutClick={onPopoutClick} canPopout={!Environment.isRunningInIE() && !tornOff} />
      )
    }

    return <div className="shell_workspace_blotter blotter--disconnected">Blotter disconnected</div>
  }
}

const mapStateToProps = ({ blotterService, compositeStatusService }: GlobalState) => ({
  blotterService,
  isConnected: compositeStatusService && compositeStatusService.blotter && compositeStatusService.blotter.isConnected
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  subscribeToBlotter: () => dispatch(BlotterActions.subscribeToBlotterAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlotterContainer)
