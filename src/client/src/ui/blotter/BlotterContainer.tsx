import * as _ from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import sizeMe from 'react-sizeme'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import { RegionSettings } from '../../types'
import { addRegion, openWindow } from '../common/regions/regionsOperations'
import Blotter from './Blotter'
import { BlotterState } from './reducer'

interface BlotterContainerProps {
  blotterService: BlotterState
  isConnected: boolean
  size: { width: number; height: number }
  onPopoutClick: () => void
  onComponentMount: () => void
}

interface BlotterContainerState {
  gridDocument: Element
}

class BlotterContainer extends React.Component<BlotterContainerProps, BlotterContainerState> {
  state = {
    gridDocument: null
  }

  public componentDidMount() {
    this.props.onComponentMount()
  }

  public render() {
    const { blotterService, onPopoutClick, isConnected } = this.props
    const { trades } = blotterService
    const { gridDocument } = this.state
    const gridRows = _.values(trades).reverse()
    return isConnected ? (
      <div className="shell_workspace_blotter" ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}>
        <Blotter
          rows={gridRows}
          gridDocument={gridDocument}
          onPopoutClick={onPopoutClick}
          canPopout={Environment.isRunningInIE()}
        />
      </div>
    ) : null
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

const ConnectedBlotterContainer = connect(
  mapStateToProps,
  {
    onPopoutClick: () => openWindow(blotterRegion),
    onComponentMount: () => addRegion(blotterRegion)
  }
)(sizeMe({ monitorHeight: true })(BlotterContainer))

interface Region {
  id: string
  isTearedOff: boolean
  container: React.ComponentClass
  settings: RegionSettings
}

const blotterRegionsSettings: RegionSettings = {
  title: 'Blotter',
  width: 850,
  height: 450,
  minHeight: 200,
  dockable: false,
  resizable: true
}

const blotterRegion: Region = {
  id: 'blotter',
  isTearedOff: false,
  container: ConnectedBlotterContainer,
  settings: blotterRegionsSettings
}

export default ConnectedBlotterContainer
