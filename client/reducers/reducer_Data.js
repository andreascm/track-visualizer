import { INPUT_COORD } from '../actions/index';

export default function(state = [], action) {
  switch (action.type) {
    case INPUT_COORD:
      return action.data
  }
  return state;
}
