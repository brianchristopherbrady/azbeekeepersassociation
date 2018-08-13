import { unfold } from 'most'

export default class Flow {
  constructor (flow, starting) {
    if (!Array.isArray(flow)) {
      throw new Error('[flow] Flow object must be instantiated with an array of objects')
    }
    this.flow = flow
    this.current = null
    this.starting = starting || null
    this.done = false
  }

  [Symbol.iterator] () {
    return this
  }

  start (action) {
    const flowAction = this.flow.find(a => a.id === action)
    if (flowAction == null) {
      console.warn(`[flow]: action not found in flow for ${action}`)
      return null
    }
    return new Flow(this.flow, action)
  }

  next () {
    this.checkStarting()
    this.current = this.current == null
      ? this.flow.find(a => a.id === this.starting)
      : this.flow.find(a => a.id === this.current.next)
    this.done = this.current == null
    return {done: this.done, value: this.done ? null : this.current}
  }

  catch (err) {
    const next = this.current && this.current.error
    if (next == null) throw err
    this.current = this.flow.find(a => a.id === next)
    this.done = this.current == null || this.current.next == null
    return {done: this.done, value: err, seed: err}
  }

  stream (actions = {}, arg) {
    this.checkStarting()
    return unfold((result) => {
      this.next()
      const next = this.done ? result : actions[this.current.id](result)
      return Promise.resolve(next)
        .then(res => ({done: this.done, value: res, seed: res}))
        .catch(err => this.catch(err))
    }, arg)
  }

  checkStarting () {
    if (!this.starting) {
      throw new Error('[flow] Please set a starting point for flow by calling item.start(action)')
    }
  }
}
