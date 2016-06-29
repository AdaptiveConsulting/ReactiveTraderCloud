import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { FooterModel, ExternalURL } from '../model';
import {  ServiceStatusLookup } from '../../../services/model';
import { ServiceStatus } from '../../../system/service';
import classnames from 'classnames';
import StatusIndicator from './statusIndicator.jsx';

import './footer.scss';

export default class FooterView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model:FooterModel = this.state.model;
    if (!model) {
      return null;
    }
    let panelClasses = classnames(
      'footer__service-status-panel',
      {
        'hide': !model.shouldShowServiceStatus
      });

    let openfinLogoClassName = classnames(
      'footer__logo',
      {
        'footer__logo-openfin': model.isRunningInOpenFin,
        'footer__logo-openfin--hidden': !model.isRunningInOpenFin
      }
    );
    let footerClasses = classnames('footer', {
      'footer--disconnected': !model.isConnectedToBroker
    });
    return (
        <footer className={footerClasses}>
          <span className='footer__connection-url'>{model.isConnectedToBroker ? `Connected to ${model.connectionUrl} (${model.connectionType})` : 'Disconnected'} </span>
          <span className='footer__logo-container '>
            <span className='footer__logo footer__logo-adaptive' onClick={() => model.openLink(ExternalURL.adaptiveURL)}></span>
            <span className={openfinLogoClassName} onClick={() => model.openLink(ExternalURL.openfinURL)}></span>
          </span>
          <div className='footer__status-indicator-wrapper'
            onMouseEnter={(e) => this._toggleServiceStatus()}
            onMouseLeave={(e) => this._toggleServiceStatus()}>
            <StatusIndicator className='footer__status-indicator' status={model.applicationStatus} />
         </div>
          <div className={panelClasses}>
            <ul className='footer__services'>
              {this._renderServices(model)}
            </ul>
          </div>
        </footer>
    );
  }

  _toggleServiceStatus() {
    router.publishEvent(this.props.modelId, 'toggleServiceStatus', {});
  };

  _renderServices(model:FooterModel) {
    let items = [];
    items.push(this._renderBrokerStatus(model));

    let serviceLookup:ServiceStatusLookup = model.serviceLookup;
    if (!serviceLookup) {
      return items;
    }
    for (let serviceType in serviceLookup.services) {
      items.push(this._renderService(model, serviceType));
    }
    return items;
  }

  _renderService(model:FooterModel, serviceType) {
    let statusSummary:ServiceStatus = model.serviceLookup.services[serviceType];
    let statusSpan;
    if (statusSummary.isConnected) {
      let connectedNodesText = statusSummary.connectedInstanceCount === 1
        ? 'node'
        : 'nodes';
      let title = `${serviceType} (${statusSummary.connectedInstanceCount} ${connectedNodesText})`;
      statusSpan = (
          <span className='footer__service-label'><i className='footer__icon--online fa fa-circle ' />{title}</span>
      );
    } else {
      statusSpan = (<span className='footer__service-label'><i className='footer__icon--offline fa fa-circle-o'/>{serviceType}</span>);
    }
    return (
      <li className='footer__service' key={serviceType}>{statusSpan}</li>
    );
  }

  _renderBrokerStatus(model:FooterModel) {
    let statusSpan;
    if (model.isConnectedToBroker) {
      statusSpan = (
        <span className='footer__service-label'><i className='footer__icon--online fa fa-circle ' />broker</span>
      );
    } else {
      statusSpan = (
        <span className='footer__service-label'><i className='footer__icon--offline fa fa-circle-o' />broker</span>
      );
    }
    return <li className='footer__service' key='broker'>{statusSpan}</li>;
  }
}
