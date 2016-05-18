import React from 'react';
import OpenFinChrome from '../../openFinChrome/openFinChrome.jsx';
import BrowserChrome from '../../browserChrome/browserChrome.jsx';
import { ChromeModel } from '../model';
import { router } from '../../../../../system';
import { WellKnownModelIds } from '../../../../../';
import { ViewBase } from '../../../../common/';

export default class Chrome extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null,
      modelId: WellKnownModelIds.chromeModelId
    };
  }
  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  render() {
    let model:ChromeModel = this.state.model;

    if (model === null) {
      return (
        <div>{this.props.children}</div>
      );
    }

    if (model.isRunningInOpenFin) {
      return (<OpenFinChrome minimize={() => router.publishEvent(model.modelId, 'minimizeClicked', {})}
                             maximize={() => router.publishEvent(model.modelId, 'maximizeClicked', {})}
                             close={() => router.publishEvent(model.modelId, 'closeClicked', {})}>
        {this.props.children}
      </OpenFinChrome>);
    } else {
      return (
        <BrowserChrome>{this.props.children}</BrowserChrome>
      );
    }
  }
}
