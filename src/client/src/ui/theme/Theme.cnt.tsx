import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { selectType } from './selectors'
import Theme, { Props } from './Theme.cmp'

const mapStateToProps = (state: GlobalState): Props => ({
  type: selectType(state)
})

export default connect(mapStateToProps)(Theme)
