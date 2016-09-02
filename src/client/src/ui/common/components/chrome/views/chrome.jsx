import React from 'react';
import OpenFinChrome from '../../openFinChrome/openFinChrome.jsx';
import BrowserChrome from '../../browserChrome/browserChrome.jsx';
import { ChromeModel } from '../model';
import { router } from '../../../../../system';
import { ViewBase } from '../../../../common/';

export default class Chrome extends React.Component {
  constructor() {
    super();
  }

  static propTypes = {
    model: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  };

  render() {
    let model:ChromeModel = this.props.model;
    let router = this.props.router;

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
