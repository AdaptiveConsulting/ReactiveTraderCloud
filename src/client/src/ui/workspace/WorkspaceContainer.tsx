import React from 'react'
import { connect } from 'react-redux'
import { TearOff } from 'rt-components'
import { GlobalState } from '../../combineReducers'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer'

type WorkspaceContainerStateProps = ReturnType<typeof mapStateToProps>
type WorkspaceContainerProps = WorkspaceContainerStateProps

interface WorkspaceContainerState {
  [key: string]: boolean
}

export class WorkspaceContainer extends React.PureComponent<WorkspaceContainerProps, WorkspaceContainerState> {
  makePortalProps = key => ({
    title: `${key} Spot`,
    config: {
      name: `${key} Spot`,
      width: 370,
      height: 155,
      url: 'about:`${key} Spot`'
    },
    browserConfig: { center: 'screen' as 'screen' }
  })

  render() {
    return (
      <div className="shell__workspace">
        <div className="workspace-region">{this.renderItems()}</div>
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="workspace-region__icon--loading">
        <i className="fa fa-5x fa-cog fa-spin" />
      </div>
    )
  }

  renderItems() {
    const { spotTileKeys } = this.props

    const pairs = Object.keys(spotTileKeys)

    if (!spotTileKeys || pairs.length === 0) {
      return this.renderLoading()
    }

    return pairs.map(key => (
      <TearOff
        id={key}
        portalProps={this.makePortalProps(key)}
        render={(popOut, tornOff) => (
          <div className="workspace-region__item">
            <ConnectedSpotTileContainer id={key} onPopoutClick={popOut} tornOff={tornOff} />
          </div>
        )}
        key={key}
      />
    ))
  }
}

const mapStateToProps = (state: GlobalState) => ({
  spotTileKeys: state.currencyPairs
})

export default connect(mapStateToProps)(WorkspaceContainer)
