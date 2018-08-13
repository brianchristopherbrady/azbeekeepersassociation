import { mergeArray, fromPromise, from, chain, recoverWith, just } from 'most'
import { select, combineEpics } from 'redux-most'
import curry from 'ramda/es/curry'
import pipe from 'ramda/es/pipe'
import api from '../Services/API'
import { Creators, Types } from '../Store/themes'
import SnapshotObservable from '../Services/SnapshotObservable'
import { addIdToDocData } from '../Services/utils'

/* =============== */
/* === CURRIES === */
/* =============== */
const curriedChain = curry(chain)
const curriedRecover = curry(recoverWith)

/* ======================== */
/* === DISPATCH ACTIONS === */
/* ======================== */
const dispatchSuccess = payload => {
  const themes = payload.docs
    .map(addIdToDocData)
  return Creators.themesSuccess(themes)
}

const dispatchFailure = (err) => just(Creators.themesFailure(err))

/* ========================= */
/* === EPIC CONSTRUCTION === */
/* ========================= */
export default () => {
  const themesCollection = api.firestore.collection(`themes`)

  const getThemeStream = () => fromPromise(themesCollection.get())

  // get page request action type
  // and transform into a stream
  const handleThemesRequest = pipe(
    select(Types.THEMES_REQUEST),
    curriedChain(getThemeStream),
    curriedRecover(dispatchFailure)
  )

  // create a stream of live pages document updates
  const observable = new SnapshotObservable(themesCollection)
  const themeLiveUpdateStream = from(observable)

  // merge page request actions and live updates
  // to dispatch success actions
  const themeRequestEpic = (action$) => {
    return mergeArray([handleThemesRequest(action$), themeLiveUpdateStream])
      .map(dispatchSuccess)
  }

  return themeRequestEpic
}
