import React from 'react';
import { BlotterView } from '../../blotter/views';
import { HeaderView } from '../../header/views';
import { AnalyticsView } from '../../analytics/views';
import { Modal, PageContainer } from '../../common/components';
import { ViewBase } from '../../common';
import { ShellModel } from '../model';
import { router } from '../../../system';
import { PopoutRegionView } from '../../regions/views/popout';
import { WorkspaceRegionView } from '../../regions/views/workspace';

export default class ShellView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null,
      modelId: 'shellModelId'
    };
  }

  render() {
    let model:ShellModel = this.state.model;
    if (model === null) {
      return null;
    }
    var wellKnownModelIds = model.wellKnownModelIds;
    return (
      <PageContainer>
        <div className='flex-container'>
          <Modal shouldShow={model.sessionExpired} title='Session expired'>
            <div>
              <div>Your 15 minute session expired, you are now disconnected from the server.</div>
              <div>Click reconnect to start a new session.</div>
              <div className='modal-action'>
                <button className='btn btn-large'
                        onClick={() => router.publishEvent(model.modelId, 'reconnectClicked', {})}>Reconnect
                </button>
              </div>
            </div>
          </Modal>
          <HeaderView modelId={wellKnownModelIds.headerModelId}/>
          <div className='horizontal-wrap'>
            <WorkspaceRegionView modelId={wellKnownModelIds.workspaceRegionModelId}/>
            <AnalyticsView modelId={wellKnownModelIds.analyticsModelId}/>
          </div>
          <BlotterView modelId={wellKnownModelIds.blotterModelId}/>
          <PopoutRegionView modelId={wellKnownModelIds.popoutRegionModelId}/>
        </div>
      </PageContainer>
    );
  }
}
