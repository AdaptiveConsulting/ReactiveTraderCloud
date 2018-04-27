import * as _ from 'lodash'
import { createSelectorCreator, defaultMemoize } from 'reselect'

export const createDeepEqualSelector = createSelectorCreator<any>(
  defaultMemoize,
  _.isEqual
)
