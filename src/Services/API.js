import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from '../firebase.config'

Firebase.initializeApp(config)

const firestore = Firebase.firestore()
firestore.settings({timestampsInSnapshots: true})

export default {
  auth: Firebase.auth(),
  firestore
}
