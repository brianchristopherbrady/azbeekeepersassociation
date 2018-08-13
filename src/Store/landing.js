import { combineReducers } from 'redux'
import { createActions, createReducer } from 'reduxsauce'

const initialState = {
  items: [],
  fetching: false,
  error: null
}

export const { Types, Creators } = createActions({
  itemsRequest: [],
  itemsFailure: ['payload'],
  itemsSuccess: ['payload']
})

const Reducer = createReducer(initialState, {
  [Types.ITEMS_REQUEST]: (state) => {
    return {...state, fetching: true}
  },
  [Types.ITEMS_FAILURE]: (state, {payload}) => {
    return {...state, fetching: false, error: payload}
  },
  [Types.ITEMS_SUCCESS]: (state, {payload}) => {
    return {...state, fetching: false, error: null, items: payload}
  }
})

export default Reducer
