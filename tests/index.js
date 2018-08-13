import test from 'tape'
import './setup'
import flow from './flow'

class TestRunner {
  constructor () {
    this.tests = []
  }

  add (t) {
    this.tests.push(t)
  }

  run () {
    this.tests.forEach(t => test(...t))
  }
}

const runner = new TestRunner()
runner.add(flow)
runner.run()
