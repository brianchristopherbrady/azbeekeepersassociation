import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { createEpicMiddleware } from 'redux-most'
import logger from 'redux-logger'
import storage from 'localforage'
import pages, { Creators as pageActionCreators } from './pages'
import themes, { Creators as themeActionCreators } from './themes'
import actions, { Creators as actionsActionCreators } from './actions'
import createFormReducer from './forms'
import landing from './landing'
import auth from './auth'
import data from './data'
import createRootEpic from '../Epics'

export default function createPersistedStore (initialData) {
  const rootReducer = combineReducers({
    actions,
    auth,
    data,
    forms: createFormReducer(initialData),
    landing,
    pages,
    themes
  })

  const persistConfig = {
    storage,
    key: 'scamperly',
    blacklist: ['content', 'themes']
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  // const persistedReducer = persistReducer(persistConfig, rootReducer)
  const rootEpic = createRootEpic(initialData)
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const middleware = applyMiddleware(epicMiddleware, logger)
  const store = createStore(rootReducer, composeEnhancers(middleware))
  // const persistor = persistStore(store)
  const persistor = {}

  initialData.pages.forEach(page => {
    store.dispatch(pageActionCreators.pageSuccess(page.id, page))
  })
  store.dispatch(themeActionCreators.themesSuccess(initialData.themes))
  store.dispatch(actionsActionCreators.actionsSuccess(initialData.actions))

  return {store, persistor}
}
