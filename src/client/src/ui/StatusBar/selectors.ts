import { createSelector } from 'reselect'

import { selectServiceStatus } from 'ui/compositeStatus'
import { selectIsConnected } from 'ui/connectionStatus'

export const selectCombinedServiceStatus = createSelector(
  [selectServiceStatus, selectIsConnected],
  (serviceStatus, isConnected) => ({
    broker: {
      serviceType: 'broker',
      connectedInstanceCount: 0,
      isConnected,
    },
    ...serviceStatus,
  }),
)
