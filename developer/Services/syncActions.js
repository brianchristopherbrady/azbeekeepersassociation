import api from './ServiceAPI'
import fs from 'fs'
import path from 'path'

const enc = 'utf8'

// Component Templates
const ActionTemplate = fs.readFileSync(path.resolve(__dirname, '../templates/action.js'), enc)
const actionsPath = path.resolve(__dirname, '../../src/Actions/index.js')
const getActionsIndex = () => fs.readFileSync(actionsPath, enc)

/*
 * Sync local actions with actions in firebase
 * @desc This will create empty action functions in
 * Actions/index.js
 */
const syncActions = (actions) => {
  console.log('[sync actions] syncing')
  actions
    .filter(filterExistingActions)
    .forEach(createNewAction)
}

// Helpers
function filterExistingActions (action) {
  const actions = getActionsIndex()
  const reg = new RegExp(`${action.id}'?:\\s?\\(`)
  const isActionPresent = reg.test(actions)
  if (isActionPresent) {
    console.log('[sync actions] skipping: ', action.id)
  }
  return !isActionPresent
}

function createNewAction (action) {
  console.log(action)
  console.log(`[sync actions] create action: ${action.id}`)
  // make new component
  const actionsIndex = getActionsIndex()
  const actionData = ActionTemplate
    .trim()
    .replace(/template/g, action.id)
    .replace(/\n/g, '\n  ')
  const lastLine = actionsIndex.match(/(actions = \{\n)/)
  const [_, lastActionLine] = lastLine
  const idx = actionsIndex.indexOf(lastActionLine)
  const beginning = actionsIndex.slice(0, idx)
  const end = actionsIndex.slice(idx + lastActionLine.length)
  const newActions = `${beginning}actions = {\n  ${actionData},\n${end}`
  fs.writeFileSync(actionsPath, newActions)
}

export default syncActions
