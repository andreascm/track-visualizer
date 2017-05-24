import { INPUT_ADDRESS } from '../actions/index';

export default function(state = {}, action) {
  switch(action.type) {
    case INPUT_ADDRESS:
      return action.address
    }
    return state;
}
