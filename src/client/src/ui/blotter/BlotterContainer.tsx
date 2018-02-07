import * as React from 'react'
import sizeMe from 'react-sizeme'
import * as PropTypes from 'prop-types'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { blotterRegionsSettings } from './reducer'
import { openWindow, addRegion } from '../../regions/regionsOperations'
import Blotter from './Blotter'
import { CurrencyPair } from '../../types'
import Environment from '../../system/environment';

interface BlotterContainerProps {
  blotterService: any
  isConnected: boolean
  currencyPairs: CurrencyPair[]
  onPopoutClick: (openFin) => () => void
  onComponentMount: () => void
  size: {width: number, height: number}
}

class BlotterContainer extends React.Component<BlotterContainerProps, {}> {

  static contextTypes = {
    openFin: PropTypes.object
  }

  public componentDidMount() {
    this.props.onComponentMount()
  }

  public render() {
    const trades = _.values(this.props.blotterService.trades).reverse()
    const openFin = this.context.openFin
    return (
      <div className="shell_workspace_blotter">
        <Blotter trades={trades}
                 currencyPairs={this.props.currencyPairs}
                 canPopout={Environment.isRunningInIE()}
                 size={this.props.size}
                 isConnected={this.props.isConnected}
                 onPopoutClick={this.props.onPopoutClick(openFin)}/>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => {
  const { blotterService, compositeStatusService, currencyPairs } = state
  const isConnected =  compositeStatusService && compositeStatusService.blotter && compositeStatusService.blotter.isConnected || false
  return { blotterService, isConnected, currencyPairs }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPopoutClick: (openFin) => {
      return () => {
        dispatch(openWindow(blotterRegion, openFin))
      }
    },
    onComponentMount: () => {
      dispatch(addRegion(blotterRegion))
    },
  }
}

const ConnectedBlotterContainer = connect(mapStateToProps, mapDispatchToProps)(sizeMe({ monitorHeight: true })(BlotterContainer))

const blotterRegion = {
  id: 'blotter',
  isTearedOff: false,
  container: ConnectedBlotterContainer,
  settings: blotterRegionsSettings,
}

export default ConnectedBlotterContainer
