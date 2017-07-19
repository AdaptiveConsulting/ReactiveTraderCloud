import { combineReducers } from 'redux';

function autobahnService(state = {}, action: any) {
  switch (action.type) {
    case 'START_BOOTSTRAP':
      const autobahnConn = action.payload;
      autobahnConn.open();
      return state;
    default:
      return state;
  }
}

const reducers = combineReducers({
  autobahn: autobahnService
});

export default reducers;
