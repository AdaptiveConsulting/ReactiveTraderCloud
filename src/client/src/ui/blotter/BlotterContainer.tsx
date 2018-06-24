import * as _ from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import sizeMe from 'react-sizeme'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import Blotter from './Blotter'
import { TearOff } from './Portal'

interface BlotterContainerSizeProps {
  size: { width: number; height: number }
}

interface BlotterContainerState {
  gridDocument: Element
  tornOff: boolean
}

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerProps = BlotterContainerSizeProps & BlotterContainerStateProps

class BlotterContainer extends React.Component<BlotterContainerProps, BlotterContainerState> {
  state = {
    gridDocument: null,
    tornOff: false
  }

  popout = () => this.setState({ tornOff: true })

  popIn = () => this.setState({ tornOff: false })

  public render() {
    const { blotterService, isConnected, environment } = this.props
    const { trades } = blotterService
    const { gridDocument, tornOff } = this.state
    const gridRows = _.values(trades).reverse()

    const portalProps = {
      name: 'blotter',
      title: 'Blotter',
      features: { width: 850, height: 450 },
      onUnload: this.popIn
    }

    return isConnected ? (
      <TearOff
        tornOff={tornOff}
        portalProps={portalProps}
        onDesktop={environment.isRunningOnDesktop}
        render={() => (
          <div
            className="shell_workspace_blotter"
            ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}
          >
            <Blotter
              rows={gridRows}
              gridDocument={gridDocument}
              onPopoutClick={this.popout}
              canPopout={Environment.isRunningInIE()}
            />
          </div>
        )}
      />
    ) : (
      <div className="shell_workspace_blotter blotter--disconnected">Blotter disconnected</div>
    )
  }

  private updateGridDocument = (doc: Element) => {
    if (doc && !this.state.gridDocument) {
      this.setState({ gridDocument: doc })
    }
  }
}

const mapStateToProps = ({ blotterService, compositeStatusService, environment }: GlobalState) => ({
  environment,
  blotterService,
  isConnected: compositeStatusService && compositeStatusService.blotter && compositeStatusService.blotter.isConnected
})

const ConnectedBlotterContainer = connect(mapStateToProps)(sizeMe({ monitorHeight: true })(BlotterContainer))

export default ConnectedBlotterContainer
