import React from 'react';
import { WorkspaceView } from '../../workspace/views';
import { BlotterView } from '../../blotter/views';
import { HeaderView } from '../../header/views';
import { AnalyticsView } from '../../analytics/views';
import common from '../../common';

export default class ShellView extends React.Component {

  render(){
    return (
      <div className='flex-container'>
        <common.components.Modal />
        <HeaderView modelId='headerModelId' />
        <div className='horizontal-wrap'>
          <WorkspaceView modelId='workspaceModelId' />
          <AnalyticsView modelId='analyticsModelId' />
        </div>
        <BlotterView modelId='blotterModelId'  />
      </div>
    );
  }
}
