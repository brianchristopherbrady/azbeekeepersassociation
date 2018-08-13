import React, { Component } from 'react'
import { render } from 'react-dom'
import api from './Services/API'
import createApp from './app'
import createStore from './Store'
import { addIdToDocData, sortPages } from './Services/utils'

window.api = api

function init () {
  const root = document.getElementById('app')
  getInitialData()
    .then(initialData => {
      const {store, persistor} = createStore(initialData)
      window.store = store
      return Promise.resolve({...initialData, store, persistor})
    })
    .then(createApp)
    .then(App => render(<App />, root))
}

function getInitialData () {
  return Promise.all([
    api.firestore.collection('pages').get(),
    api.firestore.collection('themes').get(),
    api.firestore.collection('actions').get()
  ])
    .then(([pages, themes, actions]) => {
      const p = pages.docs
        .map(addIdToDocData)
        .map(page => {
          return {
            ...page,
            actions: page.actions.map(action => action.id)
          }
        })
        .sort(sortPages)
      return Promise.resolve({
        pages: p,
        themes: themes.docs.map(addIdToDocData),
        actions: actions.docs.map(addIdToDocData)
      })
    })
}

document.addEventListener('DOMContentLoaded', init)
