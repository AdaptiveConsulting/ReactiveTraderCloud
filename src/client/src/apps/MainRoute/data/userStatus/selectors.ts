import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

const selectState = (state: GlobalState) => state.userStatus

const selectUser = createSelector([selectState], state => state.user)

const selectSelectingUser = createSelector([selectState], state => state.selectingUser)

export { selectUser, selectSelectingUser }
