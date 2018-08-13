import { mergeArray, fromPromise, from, chain, recoverWith, constant, map } from 'most'
import { select, combineEpics } from 'redux-most'
import { actions as FormActions } from 'react-redux-form'
import curry from 'ramda/es/curry'
import pipe from 'ramda/es/pipe'
import api from '../Services/API'
import { Creators, Types, Selectors } from '../Store/actions'
import Actions from '../Actions'
import SnapshotObservable from '../Services/SnapshotObservable'
import { addIdToDocData } from '../Services/utils'

/* =============== */
/* === CURRIES === */
/* =============== */
const curriedMap = curry(map)
const curriedChain = curry(chain)
const curriedMerge = curry(mergeArray)
const curriedRecover = curry(recoverWith)

/* ======================== */
/* === DISPATCH ACTIONS === */
/* ======================== */
const dispatchSuccess = payload => {
  const actions = payload.docs
    .map(addIdToDocData)
  return Creators.actionsSuccess(actions)
}

const curryActions = (actions, store) =>
  Object.keys(actions)
    .reduce((memo, key) => {
      memo[key] = curry(actions[key])(store)
      return memo
    }, {})

/* ========================= */
/* === EPIC CONSTRUCTION === */
/* ========================= */
export default () => {
  const actionsCollection = api.firestore.collection(`actions`)
  const createActionsStream = () => fromPromise(actionsCollection.get())
  const sendCreateActionRequest = ({payload}) => {
    const action = {...payload}
    if (action.next) action.next = actionsCollection.doc(action.next)
    if (action.error) action.error = actionsCollection.doc(action.error)
    const req = actionsCollection.doc(action.id).set(action, {merge: true})
    return fromPromise(req)
  }

  // get actions request action type
  // and transform into a stream
  const handleActionsRequest = pipe(
    select(Types.ACTIONS_REQUEST),
    curriedChain(createActionsStream),
    curriedRecover(Creators.actionsFailure)
  )

  // get submit actions to create
  // and transform into a stream
  const handleCreateActionRequest = pipe(
    select(Types.CREATE_ACTION_REQUEST),
    curriedChain(sendCreateActionRequest),
    curriedMap(Creators.createActionSuccess),
    curriedRecover(Creators.createActionFailure)
  )

  // get submit actions to create
  // and transform into a stream
  const handleCreateActionSuccess = pipe(
    select(Types.CREATE_ACTION_SUCCESS),
    curriedMap(() => FormActions.reset('forms.actions.__newAction__'))
  )

  // create a stream of live actions document updates
  const observable = new SnapshotObservable(actionsCollection)
  const actionsLiveUpdateStream = from(observable)

  // create curried actions (with access to {dispatch, getState}
  // middleware object), then create/start a flow substream,
  // then wait for the substream results, and map them to
  // a flow store dispatch
  const createFlowEpic = (action$, store$) => {
    const flowStream = action$
      .thru(select(Types.FLOW))
      .map(action => {
        const curriedActions = curryActions(Actions, store$)
        return Selectors.flow(store$.getState())
          .start(action.action)
          .stream(curriedActions, action.payload)
          .reduce((m, res) => action.action)
      })
      .chain(fromPromise)
      .map(res => Creators.flowComplete(res))

    return flowStream
  }

  // merge page request actions and live updates
  // to dispatch success actions
  const actionsRequestEpic = (action$, store$) => {
    return mergeArray([
      handleActionsRequest(action$),
      actionsLiveUpdateStream
    ])
      .map(dispatchSuccess)
  }

  return combineEpics([
    actionsRequestEpic,
    handleCreateActionRequest,
    handleCreateActionSuccess,
    createFlowEpic
  ])
}
