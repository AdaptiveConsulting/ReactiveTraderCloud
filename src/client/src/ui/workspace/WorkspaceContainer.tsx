import * as React from 'react'
import SpotTile from './SpotTile'

class WorkspaceContainer extends React.Component<any, {}> {
  public render() {
    return (
      <div className="shell__workspace">
        <div className="workspace-region">
          <SpotTile />
        </div>
      </div>
    )
  }
}

export default WorkspaceContainer
