import { combineEpics } from 'redux-observable';
import { referenceServiceEpic } from './reference/referenceOperations';
import { blotterServiceEpic } from './blotter/blotterOperations';
import { pricingServiceEpic } from './pricing/pricingOperations'
import { analyticsServiceEpic } from './analytics/analyticsOperations';
import { compositeStatusServiceEpic } from './compositeStatusService/compositeStatusServiceOperations';

export default combineEpics(
  referenceServiceEpic,
  blotterServiceEpic,
  pricingServiceEpic,
  analyticsServiceEpic,
  compositeStatusServiceEpic
);
