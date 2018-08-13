
export default class SnapshotObservable {
  constructor (docOrCollection) {
    this.docOrCollection = docOrCollection
    this.snapshot = this.docOrCollection.onSnapshot.bind(this.docOrCollection)
  }

  [Symbol.observable] () {
    return this
  }

  subscribe (observer) {
    this.unsubscribe = this.snapshot(observer.next.bind(observer))
    return this.unsubscribe
  }
}
