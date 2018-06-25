import * as _ from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import { Region, RegionActions } from '../common/regions'
import Blotter from './Blotter'
import { TearOff } from './Portal'

interface BlotterContainerState {
  gridDocument: Element
  tornOff: boolean
}

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type BlotterContainerProps = BlotterContainerStateProps & BlotterContainerDispatchProps

class BlotterContainer extends React.Component<BlotterContainerProps, BlotterContainerState> {
  state = {
    gridDocument: null,
    tornOff: false
  }

  popout = () => {
    this.setState({ tornOff: true } /* () => this.props.onPopout(blotterRegion) */)
  }

  popIn = () => {
    this.setState({ tornOff: false } /* () => this.props.onPopin(blotterRegion) */)
  }

  public render() {
    const { blotterService, isConnected } = this.props
    const { trades } = blotterService
    const { gridDocument, tornOff } = this.state
    const gridRows = _.values(trades).reverse()

    const portalProps = {
      name: 'blotter',
      title: 'Blotter',
      width: 850,
      height: 450,
      onUnload: this.popIn,
      url: 'about:Blotter'
    }

    if (isConnected) {
      return (
        <TearOff
          tornOff={tornOff}
          portalProps={portalProps}
          render={() => (
            <div
              className="shell_workspace_blotter"
              ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}
            >
              <Blotter
                rows={gridRows}
                gridDocument={gridDocument}
                onPopoutClick={this.popout}
                canPopout={Environment.isRunningInIE() || tornOff}
              />
            </div>
          )}
        />
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

export const blotterRegion: Region = {
  id: 'blotter'
}

const mapStateToProps = ({ blotterService, compositeStatusService }: GlobalState) => ({
  blotterService,
  isConnected: compositeStatusService && compositeStatusService.blotter && compositeStatusService.blotter.isConnected
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPopout: region => dispatch(RegionActions.popoutOpened(region)),
  onPopin: region => dispatch(RegionActions.popoutClosed(region))
})

const ConnectedBlotterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BlotterContainer)

export default ConnectedBlotterContainer
