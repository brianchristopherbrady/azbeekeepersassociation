import api from '../src/Services/API'
import { addIdToDocData } from '../src/Services/utils'
import { syncActions, syncPages, uploadLocalTheme } from './Services'

api.firestore.collection('pages').onSnapshot(pages => {
  syncPages(pages.docs.map(addIdToDocData))
})

api.firestore.collection('actions').onSnapshot(actions => {
  syncActions(actions.docs.map(addIdToDocData))
})

process.on('message', (action) => {
  if (action.type === 'exit') {
    process.exit()
  }
})
