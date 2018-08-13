import { combineReducers } from 'redux'
import { createActions, createReducer } from 'reduxsauce'
import { createSelector } from 'reselect'
import { mergeSubstoreState } from '../Services/utils'

/* ======================= */
/* ==== INITIAL STATE ==== */
/* ======================= */
const pageInitialState = {
  doc: null,
  zones: [],
  fetching: false,
  error: null,
  edits: {}
}
const initialState = {
  zones: [],
  isEditing: false,
  error: null,
  fetching: false
}

/* ========================== */
/* ==== TYPES & CREATORS ==== */
/* ========================== */
const { Types, Creators } = createActions({
  pageRequest: ['pageName'],
  pageFailure: ['pageName', 'payload'],
  pageSuccess: ['pageName', 'payload'],
  createPageRequest: ['payload'],
  createPageFailure: ['payload'],
  createPageSuccess: ['payload'],
  updatePageRequest: ['pageName', 'payload'],
  updatePageFailure: ['pageName', 'payload'],
  updatePageSuccess: ['pageName', 'payload'],
  pageZonesRequest: ['pageName'],
  pageZonesFailure: ['pageName', 'payload'],
  pageZonesSuccess: ['pageName', 'payload'],
  globalZonesRequest: [],
  globalZonesFailure: ['payload'],
  globalZonesSuccess: ['payload'],
  pageEnableEditing: [],
  pageDisableEditing: [],
  pageZonesEdit: ['pageName', 'zoneName', 'payload'],
  pageZonesUpdateRequest: ['pageName'],
  pageZonesUpdateSuccess: ['pageName']
})

/* ======================= */
/* ==== HELPERS, ETC. ==== */
/* ======================= */
const mergePageState = mergeSubstoreState(pageInitialState)
const KEY_BLACKLIST = [
  'isEditing',
  'zones',
  'fetching',
  'error'
]

const keyFilter = (key) => !KEY_BLACKLIST.includes(key)

/* ================= */
/* ==== REDUCER ==== */
/* ================= */
const Reducer = createReducer(initialState, {
  [Types.PAGE_REQUEST]: (state, {pageName}) => {
    return mergePageState(state, pageName, {fetching: true})
  },
  [Types.PAGE_FAILURE]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: false, error: payload})
  },
  [Types.PAGE_SUCCESS]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: false, error: null, doc: payload})
  },
  [Types.UPDATE_PAGE_REQUEST]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: true, doc: payload})
  },
  [Types.UPDATE_PAGE_FAILURE]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: false, error: payload})
  },
  [Types.UPDATE_PAGE_SUCCESS]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: false, error: null, doc: payload})
  },
  [Types.CREATE_PAGE_REQUEST]: (state) => {
    return {...state, fetching: true}
  },
  [Types.CREATE_PAGE_FAILURE]: (state, {payload}) => {
    return {...state, fetching: false, error: payload}
  },
  [Types.CREATE_PAGE_SUCCESS]: (state, {pageName, payload}) => {
    return {...state, fetching: false, error: null}
  },
  [Types.PAGE_ZONES_REQUEST]: (state, {pageName}) => {
    return mergePageState(state, pageName, {fetching: true})
  },
  [Types.PAGE_ZONES_FAILURE]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: false, error: payload})
  },
  [Types.PAGE_ZONES_SUCCESS]: (state, {pageName, payload}) => {
    return mergePageState(state, pageName, {fetching: false, error: null, zones: payload})
  },
  [Types.GLOBAL_ZONES_REQUEST]: (state) => {
    return {...state, fetching: true}
  },
  [Types.GLOBAL_ZONES_FAILURE]: (state, {payload}) => {
    return {...state, fetching: false, error: payload}
  },
  [Types.GLOBAL_ZONES_SUCCESS]: (state, {payload}) => {
    return {...state, fetching: false, error: null, zones: payload}
  },
  [Types.PAGE_ENABLE_EDITING]: (state) => {
    return {...state, isEditing: true}
  },
  [Types.PAGE_DISABLE_EDITING]: (state) => {
    let newState = {...state, isEditing: false}
    const pages = Object.keys(state)
      .filter(keyFilter)
      .forEach(pageName => {
        newState = mergePageState(newState, pageName, {edits: {}})
      })
    return newState
  },
  [Types.PAGE_ZONES_EDIT]: (state, {pageName, zoneName, payload}) => {
    const page = state[pageName]
    if (page == null) return state
    const zone = page.zones.find(z => z.id === zoneName) || {content: ''}
    const zoneIdx = page.zones.indexOf(zone)
    const edits = {...page.edits, [zoneName]: payload == null ? zone.content : payload}
    return mergePageState(state, pageName, {edits})
  },
  [Types.PAGE_ZONES_UPDATE_REQUEST]: (state, {pageName}) => {
    return mergePageState(state, pageName, {fetching: true})
  },
  [Types.PAGE_ZONES_UPDATE_SUCCESS]: (state, {pageName}) => {
    return mergePageState(state, pageName, {fetching: false})
  }
})

/* =================== */
/* ==== SELECTORS ==== */
/* =================== */
const pagesSelector = state => Object.keys(state.pages)
  .filter(keyFilter)
  .map(key => state.pages[key])
  .filter(page => page.doc != null)
const getPageSelector = state => page => (state.pages && state.pages[page]) || {}

const Selectors = {
  pages: pagesSelector,
  getPage: getPageSelector
}

export { Types, Creators, Reducer, Selectors }
export default Reducer
