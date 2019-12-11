import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';

export const GET_CARDS = 'GET_CARDS';
export const UPDATE_CARDS = 'UPDATE_CARDS';
export const GET_NEXT_PAGE = 'GET_NEXT_PAGE';
export const FETCHING_CARDS = 'FETCHING_CARDS';
export const FETCHING_CARDS_SUCCEEDED = 'FETCHING_CARDS_SUCCEEDED';
export const FETCHING_CARDS_FAILED = 'FETCHING_CARDS_FAILED';
export const ACKNOWLEDGE_ERROR = 'ACKNOWLEDGE_ERROR';
export const SET_NEXT_CARD_QUERY = 'SET_NEXT_CARD_QUERY';
export const SET_CURRENT_CARD_QUERY_TO_NEXT = 'SET_CURRENT_CARD_QUERY_TO_NEXT';
export const SET_CARDS_FROM_DATA = 'SET_CARDS_FROM_DATA';
export const ADD_CARDS_FROM_DATA = 'ADD_CARDS_FROM_DATA';
export const SET_GRAND_TOTAL = 'SET_GRAND_TOTAL';

const getCurrentQuery = (store) => store.card ? store.card.currentQuery : {};
const getNextQuery = (store) => store.card ? store.card.nextQuery : {};
const getDefaultQuery = (store) => store.card ? store.card.defaultQuery : {};

export const getCards = (query) => ({
  type: GET_CARDS,
  query
});
export const updateCards = () => ({
  type: UPDATE_CARDS
});
export const getNextPage = () => ({
  type: GET_NEXT_PAGE
})
export const fetchingCards = () => ({
  type: FETCHING_CARDS
});
export const fetchingCardsSucceeded = () => ({
  type: FETCHING_CARDS_SUCCEEDED
});
export const fetchingCardsFailed = (error) => ({
  type: FETCHING_CARDS_FAILED,
  error
});
export const acknowledgeCardError = () => ({
  type: ACKNOWLEDGE_ERROR
});
export const setNextCardQuery = (query) => ({
  type: SET_NEXT_CARD_QUERY,
  query
});
export const setCurrentCardQueryToNextQuery = () => ({
  type: SET_CURRENT_CARD_QUERY_TO_NEXT
});
export const setCardsFromData = (cardData) => ({
  type: SET_CARDS_FROM_DATA,
  cardData
});
export const addCardsFromData = (cardData) => ({
  type: ADD_CARDS_FROM_DATA,
  cardData
});

const buildDataQuery = (query) => {
  const apiRoot = `${process.env.REACT_APP_YAMDB_SERVICE_URI || ''}/api/cards`;
  return `${apiRoot}/orderby/${query.orderby}/${query.dir}/${query.start}/${query.end}${query.filter ? `${query.filter}` : ''}`;
}

export const fetchCards = (query) => axios.get(buildDataQuery(query))
  .then(response => response.data)
  .catch(err => {
    throw err;
  });


export function* fetchCardsIfNeeded(action) {
  try {
    let currentQuery = yield select(getCurrentQuery);
    let nextQuery = yield select(getNextQuery);
    let defaultQuery = yield select(getDefaultQuery);
    if (currentQuery === null && nextQuery === null) {
      yield put(setNextCardQuery(defaultQuery));
      nextQuery = yield select(getNextQuery);
    }
    // if this check fails there's nothing to do
    if (action.type === UPDATE_CARDS || JSON.stringify(currentQuery) !== JSON.stringify(nextQuery)) {
      yield put(fetchingCards());
      const cardData = yield call(fetchCards, nextQuery);

      // action discriminator
      if (action.type === GET_NEXT_PAGE) {
        yield put(addCardsFromData(cardData));
      }
      if ([GET_CARDS, UPDATE_CARDS].indexOf(action.type) >= 0) {
        yield put(setCardsFromData(cardData));
      }
      yield put(setCurrentCardQueryToNextQuery());
      yield put(fetchingCardsSucceeded());
    }
  } catch (ex) {
    yield put(fetchingCardsFailed(ex));
  }
}
