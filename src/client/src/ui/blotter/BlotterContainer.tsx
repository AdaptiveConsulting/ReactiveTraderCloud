import * as React from 'react'
import sizeMe from 'react-sizeme'
import * as PropTypes from 'prop-types'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { blotterRegionsSettings } from './reducer'
import { openWindow, addRegion } from '../../regions/regionsOperations'
// import Blotter from './Blotter'
import AgGridBlotter from './AgGridBlotter'
import { CurrencyPair } from '../../types'

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
    const trades = this.props.blotterService.trades
    const openFin = this.context.openFin
    const gridRows = _.values(trades).reverse()
    const popoutClick = this.props.onPopoutClick(openFin)
    return (
      <div className="shell_workspace_blotter">
        <AgGridBlotter rows={ gridRows }
                       onPopoutClick={popoutClick}
                       canPopout={true}/>
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
        console.log(' ::: onPopout click , openFin : ', openFin)
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
