import React from 'react';
// import WorkspaceView from './workspaceView';
import { WorkspaceView } from '../../workspace/views';
import { BlotterView } from '../../blotter/views';
import { HeaderView } from '../../header/views';
import { AnalyticsView } from '../../analytics/views';
import common from '../../common';
import system from 'system';
import Rx from 'rx';
import { Trade, ExecuteTradeRequest } from '../../../services/model';

var _log:system.logger.Logger = system.logger.create('ShellView');

const Modal = common.components.Modal;

class ShellView extends React.Component {

  constructor(props, context){
    super(props, context);

    this._disposables = new Rx.CompositeDisposable();
  }

  //componentDidMount(){
  //  // TODO all this service code will be lifted out of here to the bootstrapper once proper models
  //  // are introduced for blotter and analytics
  //  serviceContainer.referenceDataService.hasLoadedStream.subscribe(() => {
  //    this._addEvents();
  //  });
  //}
  //
  //_addEvents(){
  //
  //  this._disposables.add(
  //    serviceContainer.connectionStatusStream.subscribe((status:String) =>{
  //
  //      if (status === system.service.ConnectionStatus.sessionExpired){
  //        // TODO Lift
  //        Modal.setTitle('Session expired')
  //          .setBody(<div>
  //            <div>Your 15 minute session expired, you are now disconnected from the server.</div>
  //              <div>Click reconnect to start a new session.</div>
  //              <div className='modal-action'>
  //                <button className='btn btn-large' onClick={() => this.reconnect()}>Reconnect</button>
  //              </div>
  //            </div>)
  //          .setClass('error-modal')
  //          .open();
  //      }
  //    },
  //    err =>{
  //      _log.error('Error on connection status stream', err);
  //    })
  //  );
  //}

  componentWillUnmount(){
    this._disposables.dispose();
  }

  /**
   * Re-establishes a connection to broker once the session expires
   */
  reconnect(){
    Modal.close();
    serviceContainer.reConnect();
  }

  render(){
    return (
      <div className='flex-container'>
        <common.components.Modal />
        <HeaderView modelId='headerModelId' />
        <div className='horizontal-wrap'>
          <WorkspaceView modelId='workspaceModelId' />
          <AnalyticsView modelId='analyticsModelId' />
        </div>
        <BlotterView modelId='blotterModelId'  />
      </div>
    );
  }
}

export default ShellView;
