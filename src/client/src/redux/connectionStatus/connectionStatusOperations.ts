import { createAction, handleActions } from 'redux-actions';
import ConnectionStatus from '../../system/service/connectionStatus';

export enum ACTION_TYPES {
  CONNECTION_STATUS = '@ReactiveTraderCloud/CONNECTION_STATUS'
}

export interface Connections {
  connection: ConnectionStatus,
  connectionType: string,
  url: string
}

const INITIAL_STATE: ConnectionStatus = {
  connection: ConnectionStatus.disconnected,
  connectionType: '',
  url: ''
}

export const fetchConnectionStatus = createAction(ACTION_TYPES.CONNECTION_STATUS)

export const connectionStatusEpic = compositeStatusService$ => action$ => {
  return compositeStatusService$.connectionStatusStream
    .map(connectionStatus => {
      return {
        connection: connectionStatus || '',
        connectionType: compositeStatusService$.connectionType || '',
        url: compositeStatusService$.connectionUrl || ''
      }
    })
    .map(fetchConnectionStatus)
}

export default handleActions({
  [ACTION_TYPES.CONNECTION_STATUS]: (state, action) => action.payload
}, INITIAL_STATE)


