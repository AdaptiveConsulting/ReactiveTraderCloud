import React from 'react'
import { connect } from 'react-redux'
import { Flex, TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import { GlobalState } from '../../combineReducers'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer'
import { selectSpotTiles } from './selectors'

const Workspace = styled.div`
  padding: 0 0.5rem 0 1rem;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  order: 1;
`

const WorkspaceHeader = styled(Flex)`
  padding: 1.25rem 0.875rem 1.25rem 1.25rem;
  color: ${p => p.theme.shell.textColor};
  font-size: 1rem;
`

const WorkspaceItems = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-column-gap: 0.25rem;
  grid-row-gap: 0.25rem;
`

const WorkspaceItem = styled('div')`
  flex-grow: 1;
  flex-basis: 20rem;
`

type WorkspaceContainerStateProps = ReturnType<typeof mapStateToProps>
type WorkspaceContainerProps = WorkspaceContainerStateProps

const WorkspaceContainer = ({ spotTiles = [] }: WorkspaceContainerProps) => (
  <Workspace>
    <WorkspaceHeader justifyContent="space-between">
      <div>Live Rates</div>
    </WorkspaceHeader>

    <WorkspaceItems>
      {spotTiles.map(({ key, portalProps }) => (
        <TearOff
          id={key}
          portalProps={portalProps}
          render={(popOut, tornOff) => (
            <WorkspaceItem>
              <ConnectedSpotTileContainer id={key} onPopoutClick={popOut} tornOff={tornOff} />
            </WorkspaceItem>
          )}
          key={key}
        />
      ))}
    </WorkspaceItems>
  </Workspace>
)

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state)
})

export default connect(mapStateToProps)(WorkspaceContainer)
