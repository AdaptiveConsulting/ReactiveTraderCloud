import { ACTION_TYPES, ThemeActions } from './actions'
import { Themes } from './constants'

type State = Readonly<{
  type: Themes
}>

const initialState: State = {
  type: Themes.DARK_THEME
}

const theme = (state = initialState, action: ThemeActions): State => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_THEME:
      return {
        ...state,
        type: state.type === Themes.DARK_THEME ? Themes.LIGHT_THEME : Themes.DARK_THEME
      }
    default:
      return state
  }
}

export default theme
