import React from 'react';
import { Link } from 'react-router';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { HeaderModel } from '../model';
import {  ServiceStatusLookup } from '../../../services/model';
import { ServiceStatus } from '../../../system/service';

// TODO : fix below import:
// Styles in the below import extend some font awesome styles, however if we use webpack here then the fontawesome styles are not currently available due to some load ordering issue.
// The below method is the correct approach, however we're going to have to park it for now. The styles in general are rathermessyy and need to be cleaned up.
// import './header.scss';

export default class HeaderView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    }
  }

  render() {
    let model:HeaderModel = this.state.model;
    if (!model) {
      return null;
    }

    return (
      <nav className='navbar navbar-default'>
        <a className='navbar-brand navbar-adaptive' href='http://weareadaptive.com/' target='_blank'
           title='Adaptive Home Page'
           onClick={(e) => router.publishEvent(this.props.modelId, 'externalLinkClicked', e)}
        >
          <img src='images/adaptive-logo-statusbar.png' alt='Adaptive Logo'/>
        </a>
        <a className='navbar-brand navbar-adaptive navbar-openfin' href='http://openfin.co/' target='_blank'
           title='Open Fin'
           onClick={(e) => router.publishEvent(this.props.modelId, 'externalLinkClicked', e)}
        >
          <img src='images/openfin-logo.png' alt='OpenFin Logo'/>
        </a>
        <Link className='navbar-brand' to='/' title='Home'>
          Reactive Trader Cloud
        </Link>
        <ul className='nav navbar-nav hidden-xs hidden-sm navbar-left'>
          <li>
            <Link to='/user' className='nav-link' activeClassName='active'>
              <i className='fa fa-user'/> {model.currentUser.code} ({model.currentUser.name} {model.currentUser.surname})
            </Link>
          </li>
        </ul>
        <nav className='nav navbar-nav chrome-controls pull-right'>
          <a title='Minimise'
             onClick={(e) => router.publishEvent(this.props.modelId, 'minimiseClicked', e)}
             href='#'>
            <i className='fa fa-minus-square'/>
          </a>
          <a title='Maximise'
             onClick={(e) => router.publishEvent(this.props.modelId, 'maximiseClicked', e)}
             href='#'>
            <i className='fa fa-plus-square'/>
          </a>
          <a title='Close'
             onClick={(e) => router.publishEvent(this.props.modelId, 'closeClicked', e)}
             href='#'>
            <i className='fa fa-times'/>
          </a>
        </nav>
        <ul className='nav navbar-nav pull-right nav-status hidden-xs'>
          {this._renderServices(model)}
        </ul>
      </nav>
    );
  }

  _renderServices(model:HeaderModel) {
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

  _renderService(model:HeaderModel, serviceType) {
    let statusSummary:ServiceStatus = model.serviceLookup.services[serviceType];

    if (statusSummary.isConnected) {
      let connectedNodesText = statusSummary.connectedInstanceCount === 1
        ? 'node'
        : 'nodes';

      let title = `${serviceType} ${statusSummary.connectedInstanceCount} ${connectedNodesText} online`;
      return (
        <li key={serviceType} className='service-status' title={title}>
          <i className='fa fa-circle ' />
          <i className='node-badge'>{statusSummary.connectedInstanceCount}</i>
        </li>
      );
    } else {
      let title = serviceType + ' offline';
      return (
        <li key={serviceType} className='service-status text-danger animated infinite fadeIn'>
          <i className='fa fa-circle-o' title={title}/>
        </li>
      );
    }
  }

  _renderBrokerStatus(model:HeaderModel) {
    let statusSpan;
    if (model.isConnectedToBroker) {
      statusSpan = (
        <span className='fa-stack text-success animated fadeIn' title='Broker Online'>
          <i className='fa fa-signal fa-stack-1x'/>
        </span>);
    } else {
      statusSpan = (
        <span className='fa-stack' title='Broker offline'>
          <i className='fa fa-signal fa-stack-1x'/>
          <i className='fa fa-ban fa-stack-2x text-danger'/>
        </span>);
    }
    return <li key='broker'>{statusSpan}</li>;
  }
}
