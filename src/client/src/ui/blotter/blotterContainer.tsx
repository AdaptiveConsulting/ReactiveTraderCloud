import * as React from 'react'
import sizeMe from 'react-sizeme'
import {connect} from 'react-redux'
import {onPopoutClick, onComponentMount, blotterRegionsSettings} from '../../redux/blotter/blotterOperations'
import Blotter from './blotter'

class BlotterContainer extends React.Component<any, {}> {
  public componentDidMount() {
    this.props.onComponentMount()
  }

  public render() {
    const trades = this.props.blotterService.trades
    const blotterProps = {
      trades: _.values(trades).reverse(),
      isConnected: this.props.isConnected,
      onPopoutClick: this.props.onPopoutClick,
      canPopout: true,
      size: this.props.size,
    }
    return (
      <div className="shell_workspace_blotter">
        <Blotter {...blotterProps} />
      </div>
    )
  }
}

const mapStateToProps = ({ blotterService, compositeStatusService }) => {
  const isConnected =  compositeStatusService && compositeStatusService.blotter && compositeStatusService.blotter.isConnected || false
  return { blotterService, isConnected }
}

const mapDispatchToProps = dispatch => {
  return {
    onPopoutClick: () => {
      dispatch(onPopoutClick(blotterRegion))
    },
    onComponentMount: () => {
      dispatch(onComponentMount(blotterRegion))
    }
  }
}

const ConnectedBlotterContainer = connect(mapStateToProps, mapDispatchToProps)(sizeMe({monitorHeight: true})(BlotterContainer))

const blotterRegion = {
  id: 'blotter',
  isTearedOff: false,
  container: ConnectedBlotterContainer,
  settings: blotterRegionsSettings
}

export default ConnectedBlotterContainer
