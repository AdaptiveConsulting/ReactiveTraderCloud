import React from 'react';
import { SmartComponent } from 'esp-js-react';
import {Modal, Chrome} from '../../common/components';
import {FooterView} from '../../footer/views';
import {WorkspaceRegionView} from '../../regions/views/workspace';
import {SingleItemRegionView} from '../../regions/views/singleItem';
import {SidebarRegionView} from '../../regions/views/sidebar';
import { BlotterContainer } from '../../blotter';
import './shell.scss';
import '../../common/styles/_base.scss';
import '../../common/styles/_fonts.scss';
import { AnalyticsContainer } from '../../analytics';

export default class ShellView extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
  }

  render() {
    let model = this.props.model;
    let wellKnownModelIds = model.wellKnownModelIds;
    return (
      <SmartComponent modelId={wellKnownModelIds.chromeModelId} view={Chrome}>
        <div>
          <div className='shell__splash'>
            <span className='shell__splash-message'>{model.appVersion}<br />Loading...</span>
          </div>
          <div className='shell__container'>
            <Modal shouldShow={model.sessionExpired} title='Session expired'>
              <div>
                <div>Your 15 minute session expired, you are now disconnected from the server.</div>
                <div>Click reconnect to start a new session.</div>
                <button className='btn shell__button--reconnect'
                        onClick={() => this.props.router.publishEvent(model.modelId, 'reconnectClicked', {})}>Reconnect
                </button>
              </div>
            </Modal>
            <div className='shell_workspace_blotter'>
              <SmartComponent className='shell__workspace' modelId={wellKnownModelIds.workspaceRegionModelId} view={WorkspaceRegionView} />
              <div className='shell__blotter'>
                <BlotterContainer />
              </div>
            </div>
            {/*<SmartComponent className='shell__sidebar' modelId={wellKnownModelIds.sidebarRegionModelId} view={SidebarRegionView} />*/}
            <div className='shell__sidebar'>
              <AnalyticsContainer />
            </div>
          </div>
          <div className='shell__footer'>
            <SmartComponent modelId={wellKnownModelIds.footerModelId} view={FooterView} />
          </div>
        </div>
      </SmartComponent>
    );
  }
}
