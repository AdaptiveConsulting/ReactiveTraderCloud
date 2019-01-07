import React from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles } from './selectors'
import { styled } from 'rt-theme'
import Workspace from './Workspace'
import { WorkspaceHeader, CurrencyOptions } from './workspaceHeader'

type Props = ReturnType<typeof mapStateToProps>

interface State {
  currencyView: CurrencyOptions
  tileView: string
}

const WorkSpaceWrapper = styled.div`
  height: 100%;
`
class WorkspaceContainer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
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
    const { tileView, currencyView } = this.state
    return (
      <WorkSpaceWrapper style={{ height: '100%' }}>
        <WorkspaceHeader onCurrencyChange={this.updateCurrencyOption} onTileViewChange={this.updateTileView} />
        <Loadable
          status={status}
          render={() => <Workspace {...props} tileView={tileView} currencyView={currencyView} />}
          message="Pricing Disconnected"
        />
      </WorkSpaceWrapper>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
})

export default connect(mapStateToProps)(WorkspaceContainer)
