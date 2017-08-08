import { combineEpics } from 'redux-observable';
import { referenceServiceEpic } from './reference/referenceOperations';
import { blotterEpic } from './blotter/blotterOperations';
import { pricingEpic } from './pricing/pricingOperations'

export default combineEpics(
  referenceServiceEpic,
  blotterEpic,
  pricingEpic
);
