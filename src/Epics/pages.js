import { mergeArray, fromPromise, map, from, chain, recoverWith, just } from 'most'
import { select, combineEpics } from 'redux-most'
import curry from 'ramda/es/curry'
import pipe from 'ramda/es/pipe'
import api from '../Services/API'
import { Creators, Types } from '../Store/pages'
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
const dispatchAction = payload => {
  if (!payload.exists) {
    return Creators.pageFailure(payload.pageName, `[scamper]: page does not exist: ${payload.pageName}`)
  }
  const page = addIdToDocData(payload)
  page.actions = page.actions == null ? [] : page.actions.map(action => action.id)
  return Creators.pageSuccess(page.id, page)
}

const dispatchZonesAction = payload => {
  if (payload.empty) {
    return Creators.pageZonesFailure(payload.pageName, `[scamper]: zone or page does not exist: ${payload.pageName}`)
  }
  const zones = payload.docs.map(addIdToDocData)
  return Creators.pageZonesSuccess(payload.pageName, zones)
}

const dispatchGlobalZonesAction = payload => {
  if (payload.empty) {
    return Creators.globalZonesFailure(`[scamper]: zone or page does not exist: global`)
  }
  const zones = payload.docs.map(addIdToDocData)
  return Creators.globalZonesSuccess(zones)
}

/* ========================= */
/* === EPIC CONSTRUCTION === */
/* ========================= */
export default (pages) => {
  const pagesCollection = api.firestore.collection(`pages`)

  const sendUpdatePageRequest = ({payload}) => {
    const page = {...payload}
    page.actions = page.actions.map(id => pagesCollection.doc(id))
    page.component = page.id.slice(0, 1).toUpperCase() + page.id.slice(1)
    const req = pagesCollection.doc(page.id).set(page, {merge: true})
      .then(res => pagesCollection.doc(page.id).get())
      .then(page => {
        const payload = addIdToDocData(page)
        payload.action = payload.actions == null ? [] : payload.actions.map(action => action.id)
        return Promise.resolve({
          payload,
          pageName: page.id
        })
      })
      .catch(err => Promise.reject({
        ...err,
        pageName: page.id
      }))
    return fromPromise(req)
  }

  const getPageStream = ({pageName}) => {
    const prom = pagesCollection.doc(pageName).get()
      .catch(err => Promise.reject({
        message: `[scamper] could not retrieve page: ${pageName}`,
        pageName
      }))
      .then(payload => Promise.resolve({...payload, pageName}))
    return fromPromise(prom)
  }

  const getZoneStreams = ({pageName} = {}) => {
    const collectionName = pageName == null || pageName === 'global'
      ? `content/global/zones`
      : `pages/${pageName}/zones`
    const zonesCollection = api.firestore.collection(collectionName)
    const prom = zonesCollection.get()
      .catch(err => Promise.reject({
        message: `[scamper]: failed to retrieve zones for container: ${pageName || 'global'}`,
        pageName: pageName
      }))
      .then(res => {
        res.pageName = pageName
        return Promise.resolve(res)
      })
    return fromPromise(prom)
  }

  // get page request action type
  // and transform into a stream
  const handlePageRequest = pipe(
    select(Types.PAGE_REQUEST),
    curriedChain(getPageStream),
    curriedRecover((err) => just(Creators.pageFailure(err.pageName, err)))
  )

  // create a stream of live pages document updates
  const pageLiveUpdateStreams = pages.map(page => {
    const pageDoc = pagesCollection.doc(page.id)
    const observable = new SnapshotObservable(pageDoc)
    return from(observable)
  })

  // create page requests
  const handleCreatePageRequest = pipe(
    select(Types.CREATE_PAGE_REQUEST),
    curriedChain(sendUpdatePageRequest),
    curriedMap(Creators.createPageSuccess),
    curriedRecover((err) => just(Creators.createPageFailure(err.pageName, err)))
  )
  // update page requests
  const handleUpdatePageRequest = pipe(
    select(Types.UPDATE_PAGE_REQUEST),
    curriedChain(sendUpdatePageRequest),
    curriedMap(({payload, pageName}) => Creators.updatePageSuccess(pageName, payload)),
    curriedRecover((err) => just(Creators.updatePageFailure(err.pageName, err)))
  )

  // create a stream of live pages updates
  // const pagesLiveUpdateStream = from(new SnapshotObservable(pagesCollection))
  //   .chain((pages) => mergeArray(pages.docs.map(just)))

  // get zones request action type
  // and transform into a stream
  const handleZonesRequest = pipe(
    select(Types.PAGE_ZONES_REQUEST),
    curriedChain(getZoneStreams),
    curriedRecover((err) => just(Creators.pageZonesFailure(err.pageName, err)))
  )

  const handleZonesUpdateRequest = pipe(
    select(Types.PAGE_ZONES_UPDATE_REQUEST)
  )
  const handleGlobalZonesUpdateRequest = pipe(
    select(Types.GLOBAL_ZONES_REQUEST),
    curriedChain(getZoneStreams),
    curriedMap(dispatchGlobalZonesAction),
    curriedRecover((err) => just(Creators.globalZonesFailure(err)))
  )

  // create a stream of live zones document updates
  const zonesLiveUpdateStreams = pages.map(page => {
    const pageZonesCollection = api.firestore.collection(`pages/${page.id}/zones`)
    const observable = new SnapshotObservable(pageZonesCollection)
    return from(observable)
      .map(res => {
        res.pageName = page.id
        return res
      })
  })
  const globalZonesLiveUpdateStreams = from(new SnapshotObservable(api.firestore.collection('content/global/zones')))

  // merge page request actions and live updates
  // to dispatch success actions
  const pageRequestStream = (action$) => {
    return mergeArray([handlePageRequest(action$) /* ...pageLiveUpdateStreams, pagesLiveUpdateStream */])
      .map(dispatchAction)
  }

  // merge zones request actions and live updates
  // to dispatch success actions
  const zonesRequestStream = (action$) => {
    return mergeArray([handleZonesRequest(action$), ...zonesLiveUpdateStreams])
      .map(dispatchZonesAction)
  }

  // merge page request actions and live updates
  // to dispatch successes
  const zonesUpdateRequestStream = (action$, store$) => {
    return action$
      .thru(select(Types.PAGE_ZONES_UPDATE_REQUEST))
      .chain((action) => {
        const {pageName} = action
        const page = store$.getState().pages[pageName]
        const pageZonesCollection = api.firestore.collection(`pages/${pageName}/zones`)
        const requests = Object.keys(page.edits)
          .map(zoneName => {
            const doc = pageZonesCollection.doc(zoneName)
            const content = page.edits[zoneName]
            const prom = doc.set({content}, {merge: true})
              .then(res => pageName)
              .catch(res => Promise.reject({
                ...res,
                message: res.message,
                pageName
              }))
            return fromPromise(prom)
          })
        return mergeArray(requests)
      })
      .map(Creators.pageZonesUpdateSuccess)
      .recoverWith((err) => just(Creators.pageZonesFailure(err.pageName, err)))
  }

  return combineEpics([
    pageRequestStream,
    zonesRequestStream,
    zonesUpdateRequestStream,
    handleCreatePageRequest,
    handleUpdatePageRequest,
    handleGlobalZonesUpdateRequest
  ])
}
