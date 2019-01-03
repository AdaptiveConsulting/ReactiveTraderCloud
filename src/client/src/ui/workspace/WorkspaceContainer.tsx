import React from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles } from './selectors'
import Workspace from './Workspace'
import { WorkspaceHeader, CurrencyOptions } from './workspaceHeader'

type WorkspaceContainerProps = ReturnType<typeof mapStateToProps>

interface WorkspaceContainerState {
  currencyView: CurrencyOptions
  tileView: string
}
export class WorkspaceContainer extends React.PureComponent<WorkspaceContainerProps, WorkspaceContainerState> {
  constructor(props: WorkspaceContainerProps) {
    super(props)
    this.state = { currencyView: CurrencyOptions.All, tileView: 'Normal' }
  }

  updateCurrencyOption = (currency: CurrencyOptions) => {
    this.setState({ currencyView: currency })
  }

  updateTileView = (tileView: string) => {
    this.setState({ tileView })
  }

  render() {
    const { status, ...props } = this.props
    const { currencyView, tileView } = this.state
    return (
      <div>
        <WorkspaceHeader
          currencyOptionView={currencyView}
          onCurrencyChange={this.updateCurrencyOption}
          tradingTileView={tileView}
          onTileViewChange={this.updateTileView}
        />
        <Loadable status={status} render={() => <Workspace {...props} />} message="Pricing Disconnected" />
      </div>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
})

export default connect(mapStateToProps)(WorkspaceContainer)
