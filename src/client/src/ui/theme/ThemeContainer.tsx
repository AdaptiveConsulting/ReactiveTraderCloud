import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { selectType } from 'shell/theme/selectors'
import Theme, { Props } from './Theme'

const mapStateToProps = (state: GlobalState): Props => ({
  type: selectType(state)
})

export default connect(mapStateToProps)(Theme)
