import { createSelector } from 'reselect'
import { ConnectionStatus } from 'rt-system'
import { GlobalState } from 'StoreTypes'

const selectState = (state: GlobalState) => state.connectionStatus

const selectIsConnected = createSelector(
  [selectState],
  state => state.status === ConnectionStatus.connected
)

const selectUrl = createSelector([selectState], state => state.url)

export { selectIsConnected, selectUrl }
