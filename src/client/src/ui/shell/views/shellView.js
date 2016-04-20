import React from 'react';
import { Modal } from '../../common/components';
import { HeaderView } from '../../header/views';
import { FooterView } from '../../footer/views';
import { ViewBase } from '../../common';
import { ShellModel } from '../model';
import { router } from '../../../system';
import { PopoutRegionView } from '../../regions/views/popout';
import { WorkspaceRegionView } from '../../regions/views/workspace';
import { SingleItemRegionView } from '../../regions/views/singleItem';
import './shell.scss';


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
        <div className='shell__container'>
          <div className='shell__splash'>
            <span className='shell__splash-message'>Loading...</span>
          </div>
          <Modal shouldShow={model.sessionExpired} title='Session expired'>
            <div>
              <div>Your 15 minute session expired, you are now disconnected from the server.</div>
              <div>Click reconnect to start a new session.</div>
                <button className='btn shell__button--reconnect'
                        onClick={() => router.publishEvent(model.modelId, 'reconnectClicked', {})}>Reconnect
                </button>
            </div>
          </Modal>
          <div className='shell__workspace'>
            <WorkspaceRegionView modelId={wellKnownModelIds.workspaceRegionModelId}/>
          </div>
          <SingleItemRegionView modelId={wellKnownModelIds.quickAccessRegionModelId}/>
          <div className='shell__blotter'>
            <SingleItemRegionView modelId={wellKnownModelIds.blotterRegionModelId}/>
          </div>
          <PopoutRegionView modelId={wellKnownModelIds.popoutRegionModelId}/>
          <FooterView modelId={wellKnownModelIds.footerModelId}/>
        </div>
    );
  }
}

