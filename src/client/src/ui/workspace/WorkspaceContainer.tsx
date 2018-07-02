import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { GlobalState } from '../../combineReducers'
import { RegionActions } from '../common/regions'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer'
import { TearOff } from '../tearoff'
import { PortalProps } from '../tearoff/Portal'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'

const getSpotTileKeys = createDeepEqualSelector(
  (state: GlobalState) => Object.keys(state.currencyPairs),
  spotTilesKeys => spotTilesKeys
)

type WorkspaceContainerStateProps = ReturnType<typeof mapStateToProps>
type WorkspaceContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type WorkspaceContainerProps = WorkspaceContainerStateProps & WorkspaceContainerDispatchProps

interface WorkspaceContainerState {
  [key: string]: boolean
}

interface SpotTilePortalProps {
  [key: string]: PortalProps
}

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, WorkspaceContainerState> {
  state = {}

  portalProps: SpotTilePortalProps = {}

  componentDidMount() {
    const { spotTileKeys } = this.props
    spotTileKeys.map(key => this.setState({ [key]: false }))
  }

  makePortalProps = key => ({
    title: `${key} Spot`,
    onUnload: () => this.popIn(key),
    config: {
      name: `${key} Spot`,
      width: 370,
      height: 155,
      url: 'about:`${key} Spot`',
      center: 'screen' as 'screen'
    }
  })

  popout = (key: string) => {
    this.setState({ [key]: true }, () => this.props.onPopout({ id: key }))
  }

  popIn = (key: string) => {
    this.setState({ [key]: false }, () => this.props.onPopin({ id: key }))
  }

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
        <div className="workspace-region__item">
          <TearOff
            tornOff={this.state[key]}
            portalProps={this.makePortalProps(key)}
            key={key}
            render={() => (
              <ConnectedSpotTileContainer id={key} onPopoutClick={() => this.popout(key)} tornOff={this.state[key]} />
            )}
          />
        </div>
      ))
      .concat(_.times(6, i => <div key={i} className="workspace-region__spacer" />))
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPopout: region => dispatch(RegionActions.popoutOpened(region)),
  onPopin: region => dispatch(RegionActions.popoutClosed(region))
})

const mapStateToProps = (state: GlobalState) => ({
  spotTileKeys: getSpotTileKeys(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceContainer)
