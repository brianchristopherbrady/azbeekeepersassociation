import { combineReducers } from 'redux'
import { createActions, createReducer } from 'reduxsauce'
import { createSelector } from 'reselect'

const initialState = {
  currentUser: null,
  roles: [],
  fetching: false,
  error: null
}

export const { Types, Creators } = createActions({
  signinRequest: ['email', 'password'],
  signinSuccess: ['currentUser'],
  signinFailure: ['error'],
  signoutRequest: [],
  signoutSuccess: [],
  rolesSuccess: ['roles']
})

const Reducer = createReducer(initialState, {
  [Types.SIGNIN_REQUEST]: (state, {email, password}) => {
    return {...state, fetching: true}
  },
  [Types.SIGNIN_FAILURE]: (state, {error}) => {
    return {...state, error, fetching: false}
  },
  [Types.SIGNIN_SUCCESS]: (state, {currentUser}) => {
    return {...state, currentUser, fetching: false, error: null}
  },
  [Types.SIGNOUT_REQUEST]: (state) => {
    return {...state, fetching: true}
  },
  [Types.SIGNOUT_SUCCESS]: (state) => {
    return {...state, fetching: false, currentUser: null}
  },
  [Types.ROLES_SUCCESS]: (state, {roles}) => {
    return {...state, roles}
  }
})

export default Reducer

const authSelector = (state) => state.auth
const currentUserSelector = createSelector(
  authSelector,
  auth => auth.currentUser
)
const isAuthenticatedSelector = createSelector(
  currentUserSelector,
  currentUser => currentUser != null
)
const rolesSelector = createSelector(
  authSelector,
  auth => auth.roles
)
const hasRoleSelector = createSelector(
  rolesSelector,
  roles => (...args) => args.some(role => roles.includes(role))
)

export const Selectors = {
  auth: authSelector,
  currentUser: currentUserSelector,
  isAuthenticated: isAuthenticatedSelector,
  roles: rolesSelector,
  hasRole: hasRoleSelector
}
