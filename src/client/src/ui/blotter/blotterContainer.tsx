import * as React from 'react'
import * as _ from 'lodash'
import sizeMe from 'react-sizeme'
import { connect } from  'react-redux'
import Blotter from './blotter'

class BlotterContainer extends React.Component<any, {}> {

  public render() {

    const trades = this.props.blotterService.trades
    const blotterProps = {
      trades: _.values(trades),
      isConnected: this.props.isConnected,
      canPopout: false,
      size: this.props.size
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
  return { blotterService, isConnected }

}

export default connect(mapStateToProps)(sizeMe({monitorHeight: true})(BlotterContainer))
