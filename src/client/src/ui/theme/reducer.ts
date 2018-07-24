import { ACTION_TYPES, ThemeActions } from './actions'
import { DARK_THEME, LIGHT_THEME } from './constants'

type State = Readonly<{
  type: typeof LIGHT_THEME | typeof DARK_THEME
}>

const initialState: State = {
  type: LIGHT_THEME
}

const theme = (state = initialState, action: ThemeActions): State => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_THEME:
      return {
        ...state,
        type: state.type === DARK_THEME ? LIGHT_THEME : DARK_THEME
      }
    default:
      return state
  }
}

export default theme
