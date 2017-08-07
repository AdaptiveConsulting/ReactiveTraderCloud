import { combineEpics } from 'redux-observable';
import { referenceServiceEpic } from './reference/referenceOperations';
import { blotterEpic } from './blotter/blotterOperations';

export default combineEpics(
  referenceServiceEpic,
  blotterEpic
);
