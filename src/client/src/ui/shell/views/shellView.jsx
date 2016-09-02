import React from 'react';
import { SmartComponent } from 'esp-js-react';
import {Modal, Chrome} from '../../common/components';
import {FooterView} from '../../footer/views';
import {router} from '../../../system';
import {WorkspaceRegionView} from '../../regions/views/workspace';
import {SingleItemRegionView} from '../../regions/views/singleItem';
import {AnalyticsRegionView} from '../../regions/views/analytics';
import classnames from 'classnames';
import './shell.scss';
import '../../common/styles/_base.scss';
import '../../common/styles/_fonts.scss';

export default class ShellView extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
  }

  render() {
    let model = this.props.model;
    let shellClasses = classnames('shell__container', {
      'shell__container--no-blotter': model.isBlotterOut,
      'shell__container--no-analytics': model.isAnalyticsOut
    });

    let wellKnownModelIds = model.wellKnownModelIds;
    return (
      <SmartComponent modelId={wellKnownModelIds.chromeModelId} view={Chrome}>
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
            <SmartComponent className='shell__workspace' modelId={wellKnownModelIds.workspaceRegionModelId} view={WorkspaceRegionView} />
            <SmartComponent className='shell__analytics' modelId={wellKnownModelIds.analyticsRegionModelId} view={AnalyticsRegionView} />
            <SmartComponent className='shell__blotter' modelId={wellKnownModelIds.blotterRegionModelId} view={SingleItemRegionView} />
          </div>
          <div className='shell__footer'>
            <SmartComponent modelId={wellKnownModelIds.footerModelId} view={FooterView} />
          </div>
        </div>
      </SmartComponent>
    );
  }
}
