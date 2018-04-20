import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import sizeMe from 'react-sizeme'
import Environment from '../../system/environment'
import { CurrencyPair } from '../../types'
import { addRegion, openWindow } from '../common/regions/regionsOperations'
import Blotter from './Blotter'
import { blotterRegionsSettings } from './reducer'

interface BlotterContainerProps {
  blotterService: any
  isConnected: boolean
  currencyPairs: CurrencyPair[]
  onPopoutClick: (openFin) => () => void
  onComponentMount: () => void
  size: { width: number; height: number }
}

interface BlotterContainerState {
  gridDocument: Element
}

class BlotterContainer extends React.Component<
  BlotterContainerProps,
  BlotterContainerState
> {
  state = {
    gridDocument: null
  }

  static contextTypes = {
    openFin: PropTypes.object
  }

  public componentDidMount() {
    this.props.onComponentMount()
  }

  public render() {
    const trades = this.props.blotterService.trades
    const openFin = this.context.openFin
    const gridRows = _.values(trades).reverse()
    const popoutClick = this.props.onPopoutClick(openFin)
    return (
      <div
        className="shell_workspace_blotter"
        ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}
      >
        <Blotter
          rows={gridRows}
          gridDocument={this.state.gridDocument}
          onPopoutClick={popoutClick}
          canPopout={Environment.isRunningInIE()}
        />
      </div>
    )
  }

  private updateGridDocument = (doc: Element) => {
    if (doc && !this.state.gridDocument) {
      this.setState({ gridDocument: doc })
    }
  }
}

const mapStateToProps = (state: any) => {
  const { blotterService, compositeStatusService, currencyPairs } = state
  const isConnected =
    (compositeStatusService &&
      compositeStatusService.blotter &&
      compositeStatusService.blotter.isConnected) ||
    false
  return { blotterService, isConnected, currencyPairs }
}

const mapDispatchToProps = dispatch => {
  return {
    onPopoutClick: openFin => {
      return () => {
        dispatch(openWindow(blotterRegion, openFin))
      }
    },
    onComponentMount: () => {
      dispatch(addRegion(blotterRegion))
    }
  }
}

const ConnectedBlotterContainer = connect(mapStateToProps, mapDispatchToProps)(
  sizeMe({ monitorHeight: true })(BlotterContainer)
)

const blotterRegion = {
  id: 'blotter',
  isTearedOff: false,
  container: ConnectedBlotterContainer,
  settings: blotterRegionsSettings
}

export default ConnectedBlotterContainer
