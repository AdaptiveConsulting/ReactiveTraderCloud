import React from 'react';
import {Modal, OpenFinChrome} from '../../common/components';
import {FooterView} from '../../footer/views';
import {ViewBase} from '../../common';
import {ShellModel} from '../model';
import {router} from '../../../system';
import {WorkspaceRegionView} from '../../regions/views/workspace';
import {SingleItemRegionView} from '../../regions/views/singleItem';
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

    let openFinChrome = null;
    if (model.isRunningInOpenFin) {
      openFinChrome = (<OpenFinChrome className='shell__header'
        minimize={() => router.publishEvent(model.modelId, 'minimizeClicked', {})}
        maximize={() => router.publishEvent(model.modelId, 'maximizeClicked', {})}
        close={() => router.publishEvent(model.modelId, 'closeClicked', {})}/>);
    }

    let chromeContainerClassName = model.isRunningInOpenFin ? 'chrome__container-openFin' : 'chrome__container';
    let wellKnownModelIds = model.wellKnownModelIds;
    return (
      <div className={chromeContainerClassName}>
        {openFinChrome}
        <div className='shell__container'>
          <div className='shell__splash'>
            <span className='shell__splash-message'>{model.appVersion}<br />Loading...</span>
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
          <div className='shell__analytics'>
            <SingleItemRegionView modelId={wellKnownModelIds.quickAccessRegionModelId}/>
          </div>
          <div className='shell__blotter'>
            <SingleItemRegionView modelId={wellKnownModelIds.blotterRegionModelId}/>
          </div>
          <div className='shell__footer'>
            <FooterView modelId={wellKnownModelIds.footerModelId}/>
          </div>
        </div>
      </div>
    );
  }
}

