import { combineForms } from 'react-redux-form'

const createFormReducer = ({pages, actions}) => {
  const initialState = pages
    .reduce((memo, page) => {
      memo[page.id] = {
        'actions': (page.actions && page.actions.map(action => action.id)) || [],
        path: page.path,
        id: page.id,
        sort: page.sort
      }
      return memo
    }, {})

  initialState.actions = actions.reduce((memo, action) => {
    memo[action.id] = {
      id: action.id,
      next: action.next && action.next.id,
      error: action.error && action.error.id
    }
    return memo
  }, {})

  initialState.actions.__newAction__ = {
    id: null,
    next: null,
    error: null
  }

  initialState.__newPage__ = {
    id: null,
    path: null,
    actions: [],
    sort: 50
  }

  return combineForms(initialState, 'forms')
}

export default createFormReducer
