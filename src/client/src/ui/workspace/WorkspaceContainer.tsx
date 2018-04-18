import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import RegionWrapper from '../common/regions/RegionWrapper'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'

const getSpotTileKeys = createDeepEqualSelector(
  (state:any) => Object.keys(state.currencyPairs),
  (spotTilesKeys) => spotTilesKeys
)

interface WorkspaceContainerOwnProps {}

interface WorkspaceContainerStateProps {
  spotTileKeys: string[]
}

interface WorkspaceContainerDispatchProps {}

type WorkspaceContainerProps =
  WorkspaceContainerOwnProps
  & WorkspaceContainerStateProps
  & WorkspaceContainerDispatchProps

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, {}> {

  render() {
    return <div className="shell__workspace">
      <div className="workspace-region">
        {this.renderItems()}
      </div>
    </div>
  }

  renderItems() {

    const { spotTileKeys } = this.props
    if (!spotTileKeys || spotTileKeys.length === 0) {
      return <div className="workspace-region__icon--loading"><i className="fa fa-5x fa-cog fa-spin"/></div>
    }

    return spotTileKeys
      .map(key => (
        <RegionWrapper key={key} region={key}>
          <div className="workspace-region__item">
            <ConnectedSpotTileContainer id={key}/>
          </div>
        </RegionWrapper>
      )).concat(_.times(6, i => <div key={i} className="workspace-region__spacer"/>))
  }
}

function mapStateToProps(state: any) {
  return {
    spotTileKeys: getSpotTileKeys(state)
  }
}

export default connect(mapStateToProps)(WorkspaceContainer)
