import api from './ServiceAPI'
import fs from 'fs'
import path from 'path'

/*
 * Upload a local theme to firebase
 * @param {string} name
 * @param {object} theme
 * @param {object} options
 */
const uploadLocalTheme = (name, theme, options = {merge: true}) => {
  console.log('[theme] Uploading local theme', name)
  return api.firestore.collection('themes').doc(name).set(theme, options)
    .then(res => {
      console.log('[theme] Upload complete')
      return Promise.resolve(res)
    })
    .catch(err => {
      console.warn('[theme] Upload failed: ', err)
    })
}

export default uploadLocalTheme
