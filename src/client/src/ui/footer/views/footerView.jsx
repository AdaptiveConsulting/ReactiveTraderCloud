import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { FooterModel } from '../model';
import {  ServiceStatusLookup, ApplicationStatusConst } from '../../../services/model';
import { ServiceStatus } from '../../../system/service';
import classnames from 'classnames';
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
    let applicationStatusCssLookup = {
      [ApplicationStatusConst.Healthy]: 'footer__general-status-icon--healthy',
      [ApplicationStatusConst.Warning]: 'footer__general-status-icon--warning',
      [ApplicationStatusConst.Down]:    'footer__general-status-icon--down',
      [ApplicationStatusConst.Unknown]: ''
    };
    let panelClasses = classnames(
      'footer__service-status-panel',
      {
        'hide': !model.shouldShowServiceStatus
      });

    return (
        <footer className='footer'>
          <span className='footer__connection-url'>{model.isConnectedToBroker ? `Connected to ${model.connectionUrl} (${model.connectionType})` : 'Disconnected'} </span>
         <i onMouseEnter={(e) => this._toggleServiceStatus()}
            onMouseLeave={(e) => this._toggleServiceStatus()}
            className={'footer__general-status-icon fa fa-circle ' + applicationStatusCssLookup[model.applicationStatus]} >
         </i>
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
