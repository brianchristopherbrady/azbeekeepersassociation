import { combineReducers } from 'redux'
import { createActions, createReducer } from 'reduxsauce'
import { createSelector } from 'reselect'
import { mergeSubstoreState } from '../Services/utils'

/* ======================= */
/* ==== INITIAL STATE ==== */
/* ======================= */
const initialState = {}
const initialDataState = {
  fetching: false,
  error: null,
  doc: null,
  docs: []
}

/* ========================== */
/* ==== TYPES & CREATORS ==== */
/* ========================== */
const { Types, Creators } = createActions({
  dataRequest: ['dataName', 'query', 'limit', 'order'],
  dataFailure: ['dataName', 'payload'],
  dataSuccess: ['dataName', 'payload']
})

/* ======================= */
/* ==== HELPERS, ETC. ==== */
/* ======================= */
const mergePageState = mergeSubstoreState(initialState)
const KEY_BLACKLIST = []

const keyFilter = (key) => !KEY_BLACKLIST.includes(key)

/* ================= */
/* ==== REDUCER ==== */
/* ================= */
const Reducer = createReducer(initialState, {
  [Types.DATA_REQUEST]: (state, {dataName}) => {
    return mergePageState(state, dataName, {fetching: true})
  },
  [Types.DATA_FAILURE]: (state, {dataName, payload}) => {
    return mergePageState(state, dataName, {fetching: false, error: payload})
  },
  [Types.DATA_SUCCESS]: (state, {dataName, payload}) => {
    const doc = payload.doc || null
    const docs = payload.docs || []
    return mergePageState(state, dataName, {fetching: false, error: null, doc, docs})
  }
})

/* =================== */
/* ==== SELECTORS ==== */
/* =================== */
const dataSelector = state => Object.keys(state.data)
  .filter(keyFilter)
  .map(key => state.data[key])
  .filter(data => data.doc != null || data.docs.length > 0)
const getDataSelector = state => data => (state.data && state.data[data]) || {}

const Selectors = {
  data: dataSelector,
  getData: getDataSelector
}

export { Types, Creators, Reducer, Selectors }
export default Reducer
