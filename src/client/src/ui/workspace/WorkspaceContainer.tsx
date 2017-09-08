import * as _ from 'lodash'
import * as React from 'react'

import './WorkspaceContainerStyles.scss'
import { connect } from 'react-redux'
import RegionWrapper from '../../regions/RegionWrapper'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer';

interface WorkspaceContainerOwnProps {

}

interface WorkspaceContainerStateProps {
  spotTiles: any
}

interface WorkspaceContainerDispatchProps {

}

type WorkspaceContainerProps =
  WorkspaceContainerOwnProps
  & WorkspaceContainerStateProps
  & WorkspaceContainerDispatchProps

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, {}> {

  render() {
    const items = this.props.spotTiles && _.values(this.props.spotTiles)

    return <div className="shell__workspace">
      <div className="workspace-region">
        {this.renderItems(items)}
      </div>
    </div>
  }

  renderItems(items) {

    if (!items.length) {
      return <div className="workspace-region__icon--loading"><i className="fa fa-5x fa-cog fa-spin"/></div>
    }

    return Object.keys(this.props.spotTiles)
      .map(key => (
        <RegionWrapper key={key} region={key}>
          <div className="workspace-region__item">
            <ConnectedSpotTileContainer id={key}/>
          </div>
        </RegionWrapper>
      )).concat(_.times(6, i => <div key={i} className="workspace-region__spacer"/>))
  }
}

function mapStateToProps({ spotTiles }) {
  return { spotTiles }
}

export default connect(mapStateToProps)(WorkspaceContainer)
