import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import card from './reducers/card/reducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  card
});
