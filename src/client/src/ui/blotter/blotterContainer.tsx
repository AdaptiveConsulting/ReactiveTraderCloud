import * as React from 'react'
import * as _ from 'lodash'
import sizeMe from 'react-sizeme'
import {connect} from 'react-redux'
import {onPopoutClick, onComponentMount, blotterRegionsSettings} from './../../redux/blotter/blotterOperations'
import Blotter from './blotter'

class BlotterContainer extends React.Component<any, {}> {
  componentDidMount() {
    this.props.onComponentMount()
  }

  public render() {

    const trades = this.props.blotterService.trades
    const blotterProps = {
      trades: _.values(trades),
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

const mapStateToProps = ({blotterService, statusService}) => {
  const isConnected = true
  return {blotterService, isConnected}
}

const blotterRegion = {
  id: 'blotter',
  isTearedOff: false,
  settings: blotterRegionsSettings
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

export default connect(mapStateToProps, mapDispatchToProps)(sizeMe({monitorHeight: true})(BlotterContainer))
