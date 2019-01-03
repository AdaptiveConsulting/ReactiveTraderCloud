import React from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles } from './selectors'
import { styled } from 'rt-theme'
import Workspace from './Workspace'
import { WorkspaceHeader, CurrencyOptions } from './workspaceHeader'

type WorkspaceContainerProps = ReturnType<typeof mapStateToProps>

interface WorkspaceContainerState {
  currencyView: CurrencyOptions
  tileView: string
}

const WorkSpaceWrapper = styled.div`
  height: 100%;
`
class WorkspaceContainer extends React.PureComponent<WorkspaceContainerProps, WorkspaceContainerState> {
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
      <WorkSpaceWrapper style={{ height: '100%' }}>
        <WorkspaceHeader
          currencyView={currencyView}
          onCurrencyChange={this.updateCurrencyOption}
          tradingTileView={tileView}
          onTileViewChange={this.updateTileView}
        />
        <Loadable status={status} render={() => <Workspace {...props} />} message="Pricing Disconnected" />
      </WorkSpaceWrapper>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
})

export default connect(mapStateToProps)(WorkspaceContainer)
