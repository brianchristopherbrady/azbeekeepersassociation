import { createSelector } from 'reselect'
import { createActions, createReducer } from 'reduxsauce'
import Flow from '../Services/Flow'

/* ======================= */
/* ==== INITIAL STATE ==== */
/* ======================= */
const initialState = {
  available: [],
  fetching: false,
  error: null,
  activeFlows: []
}

/* ========================== */
/* ==== TYPES & CREATORS ==== */
/* ========================== */
export const { Types, Creators } = createActions({
  flow: ['action', 'payload'],
  flowComplete: ['action'],
  actionsRequest: [],
  actionsFailure: ['payload'],
  actionsSuccess: ['payload'],
  createActionRequest: ['payload'],
  createActionFailure: ['payload'],
  createActionSuccess: ['payload']
})

/* =================== */
/* ==== SELECTORS ==== */
/* =================== */
const actionsSelector = state => state.actions
const availableSelector = createSelector(
  actionsSelector,
  (actions) => actions.available
)
const flowSelector = createSelector(
  availableSelector,
  (actions) => new Flow(actions)
)
export const Selectors = {
  actions: actionsSelector,
  available: availableSelector,
  flow: flowSelector
}

/* ================= */
/* ==== REDUCER ==== */
/* ================= */
const Reducer = createReducer(initialState, {
  [Types.FLOW]: (state, {action}) => {
    if (state.activeFlows.includes(action)) return state
    const activeFlows = [...state.activeFlows]
    activeFlows.push(action)
    return {...state, activeFlows}
  },
  [Types.FLOW_COMPLETE]: (state, {action}) => {
    if (!state.activeFlows.includes(action)) return state
    const activeFlows = [...state.activeFlows]
    activeFlows.splice(activeFlows.indexOf(action), 1)
    return {...state, activeFlows}
  },
  [Types.ACTIONS_REQUEST]: (state) => {
    return {...state, fetching: true}
  },
  [Types.ACTIONS_FAILURE]: (state, {payload}) => {
    return {...state, fetching: false, error: payload}
  },
  [Types.ACTIONS_SUCCESS]: (state, {payload}) => {
    const available = payload.map(action => {
      if (action.next != null) {
        action.next = action.next.id
      }
      return action
    })
    return {...state, fetching: false, error: null, available}
  },
  [Types.CREATE_ACTION_REQUEST]: (state) => {
    return {...state, fetching: true}
  },
  [Types.CREATE_ACTION_FAILURE]: (state, {payload}) => {
    return {...state, fetching: false, error: payload}
  },
  [Types.CREATE_ACTION_SUCCESS]: (state, arg) => {
    return {...state, fetching: false, error: null}
  }
})

export default Reducer
