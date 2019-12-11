import * as actions from './sagas';

const initialState = {
  fetching: false,
  cards: {
    docs: [],
    total: 0,
    limit: 0,
    offset: 0
  },
  currentQuery: null,
  nextQuery: null,
  defaultQuery: {
    start: 1,
    end: 20,
    orderby: 'released_at',
    dir: 'asc',
    filter: `?type_line=Creature`
  },
  pageSize: 20,
  currentGrandTotal: null,
  error: {
    message: null,
    raw: null,
    ack: true
  }
};

const CardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPDATE_CARDS:
    case actions.GET_CARDS:
      return {
        ...state,
        nextQuery: { 
          ...(action.query || state.nextQuery),
          filter: action.query.filter || state.defaultQuery.filter,
          start: 1 // reset page
        }
      }
    case actions.GET_NEXT_PAGE:
      return {
        ...state,
        nextQuery: state.nextQuery ? {
          ...state.nextQuery,
          start: state.nextQuery.end + 1,
          end: state.nextQuery.end + state.pageSize
        } : state.nextQuery
      }
    case actions.FETCHING_CARDS:
      return {
        ...state,
        fetching: true
      };
    case actions.FETCHING_CARDS_SUCCEEDED:
      return {
        ...state,
        fetching: false,
        error: {
          message: null,
          raw: null,
          ack: true
        }
      };
    case actions.FETCHING_CARDS_FAILED:
        return {
          ...state,
          fetching: false,
          error: {
            message: action.error.message,
            raw: action.error,
            ack: false
          }
        };
    case actions.ACKNOWLEDGE_ERROR:
        return {
          ...state,
          error: {
            ...state.error,
            ack: true
          }
        };
    case actions.SET_NEXT_CARD_QUERY:
      return {
        ...state,
        nextQuery: action.query
      };
    case actions.SET_CURRENT_CARD_QUERY_TO_NEXT:
      return {
        ...state,
        currentQuery: state.nextQuery
      }
    case actions.SET_CARDS_FROM_DATA:
      return {
        ...state,
        cards: action.cardData
      }
    case actions.ADD_CARDS_FROM_DATA:
      return {
        ...state,
        cards: {
          ...state.cards,
          docs: [...state.cards.docs, ...action.cardData.docs],
          limit: state.cards.docs.length + action.cardData.docs.length,
          total: action.cardData.total
        }
      }
    default:
      return state;
  }
};

export default CardReducer;
