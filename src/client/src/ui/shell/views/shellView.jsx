import React from 'react';
import {Modal, Chrome} from '../../common/components';
import {FooterView} from '../../footer/views';
import {ViewBase} from '../../common';
import {router} from '../../../system';
import {WorkspaceRegionView} from '../../regions/views/workspace';
import {SingleItemRegionView} from '../../regions/views/singleItem';
import classnames from 'classnames';
import './shell.scss';

export default class ShellView extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
  }

  render() {
    let model = this.props.model;
    if (model === null) {
      return null;
    }

    let shellClasses = classnames('shell__container', {
      'shell__container--no-blotter': model.isBlotterOut,
      'shell__container--no-analytics': model.isAnalyticsOut,
      'shell__container--no-side-bar': model.isSidebarOut
    });

    let wellKnownModelIds = model.wellKnownModelIds;
    return (
      <Chrome>
        <div>
          <div className='shell__splash'>
            <span className='shell__splash-message'>{model.appVersion}<br />Loading...</span>
          </div>
          <div className={shellClasses}>
            <Modal shouldShow={model.sessionExpired} title='Session expired'>
              <div>
                <div>Your 15 minute session expired, you are now disconnected from the server.</div>
                <div>Click reconnect to start a new session.</div>
                <button className='btn shell__button--reconnect'
                        onClick={() => router.publishEvent(model.modelId, 'reconnectClicked', {})}>Reconnect
                </button>
              </div>
            </Modal>
            <WorkspaceRegionView className='shell__workspace' modelId={wellKnownModelIds.workspaceRegionModelId}/>
            <SingleItemRegionView className='shell__analytics' modelId={wellKnownModelIds.analyticsRegionModelId}/>
            <SingleItemRegionView className='shell__side-bar' modelId={wellKnownModelIds.sidebarRegionModelId}/>
            <SingleItemRegionView className='shell__blotter' modelId={wellKnownModelIds.blotterRegionModelId}/>
          </div>
          <div className='shell__footer'>
            <FooterView modelId={wellKnownModelIds.footerModelId}/>
          </div>
        </div>
      </Chrome>
    );
  }
}
