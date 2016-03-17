import React from 'react';
import { WorkspaceView } from '../../workspace/views';
import { BlotterView } from '../../blotter/views';
import { HeaderView } from '../../header/views';
import { AnalyticsView } from '../../analytics/views';
import { Modal } from '../../common/components';
import { ViewBase } from '../../common';
import { ShellModel } from '../model';
import { router } from '../../../system';
import { PopoutRegionView } from '../../regions/popout/views';

export default class ShellView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null,
      modelId:'shellModelId'
    };
  }

  render(){
    let model:ShellModel = this.state.model;
    if(model === null) {
      return null;
    }
    return (
      <div className='flex-container'>
        <Modal shouldShow={model.sessionExpired}l title='Session expired'>
          <div>
            <div>Your 15 minute session expired, you are now disconnected from the server.</div>
            <div>Click reconnect to start a new session.</div>
            <div className='modal-action'>
              <button className='btn btn-large' onClick={() => router.publishEvent(model.modelId, 'reconnectClicked', {})}>Reconnect</button>
            </div>
          </div>
        </Modal>
        <HeaderView modelId='headerModelId' />
        <div className='horizontal-wrap'>
          <WorkspaceView modelId='workspaceModelId' />
          <AnalyticsView modelId='analyticsModelId' />
        </div>
        <BlotterView modelId='blotterModelId'  />
        <PopoutRegionView modelId='popoutRegionModelId' />
      </div>
    );
  }
}
