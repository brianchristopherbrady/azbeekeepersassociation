import { mergeArray, fromPromise, from, chain, recoverWith, constant, map, just } from 'most'
import { select, selectArray, combineEpics } from 'redux-most'
import { actions as FormActions } from 'react-redux-form'
import curry from 'ramda/es/curry'
import pipe from 'ramda/es/pipe'
import api from '../Services/API'
import SnapshotObservable from '../Services/SnapshotObservable'
import { Creators, Types, Selectors } from '../Store/auth'

class AuthObservable {
  constructor (auth) {
    this.auth = auth
    this.onChange = this.auth.onAuthStateChanged.bind(this.auth)
  }

  [Symbol.observable] () {
    return this
  }

  subscribe (observer) {
    this.unsubscribe = this.onChange(observer.next.bind(observer))
    return this.unsubscribe
  }
}

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
const userKeyWhitelist = [
  'uid', 'displayName', 'email',
  'emailVerified', 'photoURL',
  'isAnonymous', 'phoneNumber'
]

const dispatchSuccess = (res) => {
  const currentUser = Object.keys(res)
    .filter(key => userKeyWhitelist.indexOf(key) !== -1)
    .reduce((memo, key) => {
      memo[key] = res[key]
      return memo
    }, {})
  currentUser.creationTime = res.metadata && res.metadata.creationTime
  currentUser.lastSignInTime = res.metadata && res.metadata.lastSignInTime
  return Creators.signinSuccess(currentUser)
}

const dispatchRolesSuccess = doc => {
  if (doc == null) return Creators.rolesSuccess(roles)
  const data = doc.data()
  const roles = (data && data.roles) || []
  return Creators.rolesSuccess(roles)
}

const dispatchFailure = (err) => just(Creators.signinFailure(err))

/* ========================= */
/* === EPIC CONSTRUCTION === */
/* ========================= */
export default () => {
  const signin = ({email, password}) => {
    return fromPromise(api.auth.signInWithEmailAndPassword(email, password))
  }

  const signout = ({email, password}) => {
    return fromPromise(api.auth.signOut())
  }

  let rolesSubscription = null

  const getRoles = (payload) => {
    const uid = payload && payload.currentUser && payload.currentUser.uid
    const doc = api.firestore.collection('roles').doc(uid || 'none')
    if (!uid) {
      rolesSubscription && rolesSubscription.unsubscribe()
      rolesSubscription = null
      return fromPromise(doc.get())
    }
    rolesSubscription = new SnapshotObservable(doc)
    const request = doc.get()
    return mergeArray([fromPromise(request), from(rolesSubscription)])
  }

  // get auth signin request action type
  // and transform into a stream
  const handleSigninRequest = pipe(
    select(Types.SIGNIN_REQUEST),
    curriedChain(signin),
    curriedMap(dispatchSuccess),
    curriedRecover(dispatchFailure)
  )

  // get auth signout request action type
  // and transform into a stream
  const handleSignoutRequest = pipe(
    select(Types.SIGNOUT_REQUEST),
    curriedChain(signout),
    curriedMap(Creators.signoutSuccess),
    curriedRecover(dispatchFailure)
  )

  // live stream of auth changes
  const authObservable = new AuthObservable(api.auth)
  const authChangeLiveStream = from(authObservable)
    .map(user => {
      if (user) return dispatchSuccess(user)
      return Creators.signoutSuccess()
    })

  const handleAuthSuccessRoles = pipe(
    selectArray([Types.SIGNIN_SUCCESS, Types.SIGNOUT_SUCCESS]),
    curriedChain(getRoles),
    curriedMap(dispatchRolesSuccess),
    curriedRecover(() => just(dispatchRolesSuccess()))
  )

  const authRequestEpic = (action$, store$) => {
    return mergeArray([
      handleSigninRequest(action$),
      handleSignoutRequest(action$),
      handleAuthSuccessRoles(action$),
      authChangeLiveStream
    ])
  }

  return authRequestEpic
}
