import Flow from '../src/Services/Flow'

const flow1 = [
  {id: '1', next: '2', error: 'err'},
  {id: '2', next: '3', error: 'err'},
  {id: '3', next: '4', error: 'err'},
  {id: '4', next: '5', error: 'err'},
  {id: 'err', next: null, error: null}
]

const delay = (message, throwError) => () => new Promise((resolve, reject) => {
  setTimeout(throwError ? reject : resolve, 1500, throwError || message)
})

const actions = {
  '1': delay('1'),
  '2': delay('2'),
  '3': delay('3'),
  '4': delay('4'),
  err: () => 'error'
}

export default ['flow class tests', (t) => {
  let flow = new Flow(flow1)
  let i = 0
  let next, flowItem

  t.throws(flow.next, 'Should throw when not started')

  const flowTest = flow.start('1')

  t.ok(typeof flowTest[Symbol.iterator] === 'function', 'Iterator function is defined')

  for (flowItem of flowTest) {
    t.equal(flowItem.id, flow1[i].id, `Iterating over flow returns next item`)
    i++
  }

  const asyncFlowTest = flow.start('1')
  let shouldBeValue = 1
  const flowStream = asyncFlowTest.stream(actions, 1)
  flowStream
    .observe((val) => {
      t.equals(val, shouldBeValue.toString(), `should equal incremented value: ${shouldBeValue}`)
      shouldBeValue++
    })
    .then(res => {
      t.equals(res, '4', `should equal last value: 4`)
      console.log('finished', res)
      t.end()
    })
}]
