import * as _ from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import Blotter from './Blotter'

interface BlotterContainerState {
  gridDocument: Element
}

interface BlotterContainerOwnProps {
  onPopoutClick: () => void
  tornOff: boolean
}

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerProps = BlotterContainerStateProps & BlotterContainerOwnProps

class BlotterContainer extends React.Component<BlotterContainerProps, BlotterContainerState> {
  state = {
    gridDocument: null
  }

  public render() {
    const { blotterService, isConnected, tornOff, onPopoutClick } = this.props
    const { trades } = blotterService
    const { gridDocument } = this.state
    const gridRows = _.values(trades).reverse()

    if (isConnected) {
      return (
        <div
          className="shell_workspace_blotter"
          ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}
        >
          <Blotter
            rows={gridRows}
            gridDocument={gridDocument}
            onPopoutClick={onPopoutClick}
            canPopout={Environment.isRunningInIE() || tornOff}
          />
        </div>
      )
    }

    return <div className="shell_workspace_blotter blotter--disconnected">Blotter disconnected</div>
  }

  private updateGridDocument = (doc: Element) => {
    if (doc && !this.state.gridDocument) {
      this.setState({ gridDocument: doc })
    }
  }
}

const mapStateToProps = ({ blotterService, compositeStatusService }: GlobalState) => ({
  blotterService,
  isConnected: compositeStatusService && compositeStatusService.blotter && compositeStatusService.blotter.isConnected
})

const ConnectedBlotterContainer = connect(mapStateToProps)(BlotterContainer)

export default ConnectedBlotterContainer
