import { createActions, createReducer } from 'reduxsauce'
import { Theme } from '../Components/Styled'
import { createSelector } from 'reselect'

/* ======================= */
/* ==== INITIAL STATE ==== */
/* ======================= */
const initialState = {
  fetching: false,
  error: null,
  theme: 'default',
  available: {
    default: Theme
  }
}

/* ========================== */
/* ==== TYPES & CREATORS ==== */
/* ========================== */
export const { Types, Creators } = createActions({
  themesRequest: null,
  themesFailure: ['payload'],
  themesSuccess: ['payload'],
  themeSwitch: ['payload']
})

/* =================== */
/* ==== SELECTORS ==== */
/* =================== */
const themesSelector = (state) => state.themes
const availableSelector = createSelector(
  themesSelector,
  (themes) => themes.available
)
const currentSelector = createSelector(
  themesSelector,
  (themes) => themes.theme
)
const themeSelector = createSelector(
  availableSelector,
  currentSelector,
  (available, theme) => available[theme]
)
export const Selectors = {
  themes: themesSelector,
  current: currentSelector,
  available: availableSelector,
  theme: themeSelector
}

/* ================= */
/* ==== REDUCER ==== */
/* ================= */
export default createReducer(initialState, {
  [Types[`THEMES_REQUEST`]]: (state) => {
    return {...state, fetching: true}
  },
  [Types[`THEMES_FAILURE`]]: (state, action) => {
    return {...state, fetching: false, error: action.payload}
  },
  [Types[`THEMES_SUCCESS`]]: (state, {payload}) => {
    const available = payload.reduce((memo, theme) => {
      memo[theme.id] = theme
      return memo
    }, {})
    return {...state, fetching: false, error: null, available}
  },
  [Types[`THEME_SWITCH`]]: (state, {payload}) => {
    if (state.available[payload] == null) return state
    return {...state, theme: payload}
  }
})
