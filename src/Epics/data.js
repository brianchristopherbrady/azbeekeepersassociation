import { mergeArray, fromPromise, map, from, chain, recoverWith, just } from 'most'
import { select, combineEpics } from 'redux-most'
import curry from 'ramda/es/curry'
import pipe from 'ramda/es/pipe'
import api from '../Services/API'
import { Creators, Types } from '../Store/data'
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

/* ========================= */
/* === EPIC CONSTRUCTION === */
/* ========================= */
export default () => {
  const dataCollection = api.firestore.collection(`data`)

  const dataStream = curriedChain((action) => {
    const dataName = action.dataName
    const sections = dataName.split('/')
    const query = action.query || []
    let request = sections.length % 2 === 0
      ? dataCollection.doc(sections.shift())
      : dataCollection.doc(sections.splice(0, sections.length).join('/'))
    if (sections.length) request = request.collection(sections.join('/'))

    if (request.where != null) {
      query.forEach(q => {
        request = request.where(...q)
      })
      request = action.limit ? request.limit(action.limit) : request
      request = action.orderBy ? request.orderBy(action.orderBy) : request
    }

    return fromPromise(request.get())
      .map(data => {
        const doc = (data.data && addIdToDocData(data)) || null
        const docs = (data.docs && data.docs.map(addIdToDocData)) || []
        return Creators.dataSuccess(dataName, {doc, docs})
      })
      .recoverWith(err => just(Creators.dataFailure(dataName, err)))
  })

  const handleDataRequest = pipe(
    select(Types.DATA_REQUEST),
    dataStream
  )

  return combineEpics([
    handleDataRequest
  ])
}
