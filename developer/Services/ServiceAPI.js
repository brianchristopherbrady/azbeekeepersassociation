import * as admin from 'firebase-admin'
import accountCredentials from '../../serviceAccount.json'

admin.initializeApp({
  credential: admin.credential.cert(accountCredentials),
  databaseUrl: 'azbeekeepersassociation.firebaseio.com'
})

const firestore = admin.firestore()
firestore.settings({timestampsInSnapshots: true})

export default {
  auth: admin.auth(),
  firestore
}
