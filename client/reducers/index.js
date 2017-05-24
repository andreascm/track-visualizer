import { combineReducers } from 'redux';
import Reducer_Address from './reducer_Address';
import Reducer_Data from './reducer_Data';

const rootReducer = combineReducers({
  address: Reducer_Address,
  data: Reducer_Data
});

export default rootReducer;
