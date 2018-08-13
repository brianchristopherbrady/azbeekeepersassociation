
export const addIdToDocData = doc => ({...doc.data(), id: doc.id})
export const sortPages = (a, b) => b.sort - a.sort
export const mergeSubstoreState = (initialState) => (state, substoreName, newState = {}) => ({
  ...state,
  [substoreName]: {
    ...(state[substoreName] || initialState),
    ...newState
  }
})
