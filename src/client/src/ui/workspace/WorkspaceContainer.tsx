import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer'
import { TearOff } from '../tearoff'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'

const getSpotTileKeys = createDeepEqualSelector(
  (state: GlobalState) => Object.keys(state.currencyPairs),
  spotTilesKeys => spotTilesKeys
)

type WorkspaceContainerStateProps = ReturnType<typeof mapStateToProps>
type WorkspaceContainerProps = WorkspaceContainerStateProps

interface WorkspaceContainerState {
  [key: string]: boolean
}

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, WorkspaceContainerState> {
  makePortalProps = key => ({
    title: `${key} Spot`,
    config: {
      name: `${key} Spot`,
      width: 370,
      height: 155,
      url: 'about:`${key} Spot`',
      center: 'screen' as 'screen'
    }
  })

  render() {
    return (
      <div className="shell__workspace">
        <div className="workspace-region">{this.renderItems()}</div>
      </div>
    )
  }

  renderItems() {
    const { spotTileKeys } = this.props
    if (!spotTileKeys || spotTileKeys.length === 0) {
      return (
        <div className="workspace-region__icon--loading">
          <i className="fa fa-5x fa-cog fa-spin" />
        </div>
      )
    }

    return spotTileKeys
      .map(key => (
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
      .concat(_.times(6, i => <div key={i} className="workspace-region__spacer" />))
  }
}

const mapStateToProps = (state: GlobalState) => ({
  spotTileKeys: getSpotTileKeys(state)
})

export default connect(mapStateToProps)(WorkspaceContainer)
