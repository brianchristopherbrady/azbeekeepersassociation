import { select, combineEpics } from 'redux-most'
import createAuthEpic from './auth'
import createPagesEpic from './pages'
import createThemesEpic from './themes'
import createActionsEpic from './actions'
import createDataEpic from './data'

export default function createRootEpic ({pages, themes}) {
  return combineEpics([
  	createAuthEpic(),
    createPagesEpic(pages),
    createThemesEpic(themes),
    createActionsEpic(),
    createDataEpic()
  ])
}
