import React from 'react';
// import WorkspaceView from './workspaceView';
import { WorkspaceView } from '../../workspace/views';
import { BlotterView } from '../../blotter/views';
import Header from '../../header/components/header-view';
import { AnalyticsView } from '../../analytics/views';
import common from '../../common';
import system from 'system';
import Rx from 'rx';
import { serviceContainer } from '../../../services';
import { Trade, ExecuteTradeRequest } from '../../../services/model';

var _log:system.logger.Logger = system.logger.create('ShellView');

const Modal = common.components.Modal;

class ShellView extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      trades: [],
      connected: false,
      services: {}
    };

    this._disposables = new Rx.CompositeDisposable();
  }

  componentDidMount(){
    // TODO all this service code will be lifted out of here to the bootstrapper once proper models
    // are introduced for blotter and analytics
    serviceContainer.referenceDataService.hasLoadedStream.subscribe(() => {
      this._addEvents();
    });
  }

  _addEvents(){

    this._disposables.add(
      serviceContainer.connectionStatusStream.subscribe((status:String) =>{
        const connected = status === system.service.ConnectionStatus.connected;

        this.setState({
          connected
        });

        if (status === system.service.ConnectionStatus.sessionExpired){
          // TODO Lift
          Modal.setTitle('Session expired')
            .setBody(<div>
              <div>Your 15 minute session expired, you are now disconnected from the server.</div>
                <div>Click reconnect to start a new session.</div>
                <div className='modal-action'>
                  <button className='btn btn-large' onClick={() => this.reconnect()}>Reconnect</button>
                </div>
              </div>)
            .setClass('error-modal')
            .open();
        }
      },
      err =>{
        _log.error('Error on connection status stream', err);
      })
    );
  }

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
        <Header status={this.state.connected}/>
        <div className='horizontal-wrap'>
          {/*onExecute={(payload) => this.addTrade(payload)}*/}
          {/* HACK: workspaceModelId needs to come from the shells model once this view gets updated, not hard coded */}
          <WorkspaceView modelId='workspaceModelId' />
          <AnalyticsView modelId='analyticsModelId' />
        </div>
        {/* HACK: blotterModelId needs to come from the shells model once this view gets updated, not hard coded */}
        <BlotterView modelId='blotterModelId'  />
      </div>
    );
  }
}

export default ShellView;
