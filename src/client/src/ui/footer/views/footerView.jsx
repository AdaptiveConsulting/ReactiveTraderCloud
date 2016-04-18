import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { FooterModel } from '../model';
import {  ServiceStatusLookup } from '../../../services/model';
import { ServiceStatus } from '../../../system/service';
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

    return (
        <footer className='footer'>
          <ul className='footer__services'>
            {this._renderServices(model)}
          </ul>
        </footer>
    );
  }

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

    if (statusSummary.isConnected) {
      let connectedNodesText = statusSummary.connectedInstanceCount === 1
        ? 'node'
        : 'nodes';

      let title = `${serviceType} ${statusSummary.connectedInstanceCount} ${connectedNodesText} online`;
      return (
        <li key={serviceType} className='footer__service' title={title}>
          <span className='footer__service-label'><i className='footer__icon--online fa fa-circle ' />{statusSummary.connectedInstanceCount}</span>
        </li>
      );
    } else {
      let title = serviceType + ' offline';
      return (
        <li key={serviceType} className='footer__service animated infinite fadeIn'>
          <i className='footer__icon--offline fa fa-circle-o' title={title}/>
        </li>
      );
    }
  }

  _renderBrokerStatus(model:FooterModel) {
    let statusSpan;
    if (model.isConnectedToBroker) {
      statusSpan = (
        <span className='fa-stack animated fadeIn' title='Broker Online'>
          <i className='fa fa-signal fa-stack-1x'/>
        </span>);
    } else {
      statusSpan = (
        <span className='fa-stack' title='Broker offline'>
          <i className='fa fa-signal fa-stack-1x'/>
          <i className='fa fa-ban fa-stack-2x'/>
        </span>);
    }
    return <li className='footer__service' key='broker'>{statusSpan}</li>;
  }
}
