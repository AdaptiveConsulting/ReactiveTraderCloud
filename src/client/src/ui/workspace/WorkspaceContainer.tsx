import * as React from 'react';
import SpotTileView from './tile/SpotTileView';

class WorkspaceContainer extends React.Component<any, {}> {
  public render() {
    return (
      <div className="shell__workspace">
        <div className="workspace-region">
          <SpotTileView />
        </div>
      </div>
    );
  }
}

export default WorkspaceContainer;
