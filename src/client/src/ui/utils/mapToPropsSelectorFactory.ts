import { createSelectorCreator, defaultMemoize } from 'reselect'
import * as _ from 'lodash'

export const createDeepEqualSelector = createSelectorCreator<any>(
  defaultMemoize,
  _.isEqual
)
