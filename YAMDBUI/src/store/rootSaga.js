import { takeLatest } from 'redux-saga/effects';

import { GET_CARDS, GET_NEXT_PAGE, UPDATE_CARDS, fetchCardsIfNeeded } from './reducers/card/sagas';

/* APP FLOW */
function * CardQuerySaga () {
  yield takeLatest(GET_CARDS, fetchCardsIfNeeded);
}
function * CardNextPageSaga () {
  yield takeLatest(GET_NEXT_PAGE, fetchCardsIfNeeded);
}
function * CardUpdateSaga () {
  yield takeLatest(UPDATE_CARDS, fetchCardsIfNeeded);
}

export default [
  CardQuerySaga,
  CardNextPageSaga,
  CardUpdateSaga,
]