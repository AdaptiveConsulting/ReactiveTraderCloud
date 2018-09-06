import { createSelector } from 'reselect'

import { ConnectionStatus } from 'rt-system'
import { GlobalState } from 'StoreTypes'

export const selectState = (state: GlobalState) => state.connectionStatus

export const selectIsConnected = createSelector([selectState], state => state.status === ConnectionStatus.connected)

export const selectUrl = createSelector([selectState], state => state.url)

export const selectTransportType = createSelector([selectState], state => state.transportType)
