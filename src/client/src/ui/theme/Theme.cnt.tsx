import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { selectType } from './selectors'
import Theme from './Theme.cmp'
import { Props } from './types'

const mapStateToProps = (state: GlobalState): Props => ({
  type: selectType(state)
})

export default connect(mapStateToProps)(Theme)
