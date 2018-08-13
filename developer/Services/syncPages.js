import api from './ServiceAPI'
import fs from 'fs'
import path from 'path'

const enc = 'utf8'

// Component Templates
const PageTemplate = fs.readFileSync(path.resolve(__dirname, '../templates/Page.js'), enc)
const AsyncPageTemplate = fs.readFileSync(path.resolve(__dirname, '../templates/AsyncPage.js'), enc)
const pagesPath = path.resolve(__dirname, '../../src/Pages/index.js')
const getPagesIndex = () => fs.readFileSync(pagesPath, enc)

/*
 * Sync local components with pages in firebase
 * @desc This will create page components and add them to
 * Components/Pages/index.js
 */
const syncPages = (pages) => {
  pages
    .filter(filterExistingComponents)
    .forEach(createNewComponent)
}

// Helpers
function filterExistingComponents (page) {
  try {
    fs.readFileSync(path.resolve(__dirname, `../../src/Pages/${page.component}.js`))
    console.log(`[sync pages] component exists. bypassing ${page.component}`)
    return false
  } catch (err) {
    return true
  }
}

function createNewComponent (page) {
  console.log(`[sync pages] create component: <${page.component}>`)
  // make new component
  const componentPath = path.resolve(__dirname, `../../src/Pages/${page.component}.js`)
  const componentData = PageTemplate.replace(/Template/g, page.component)
  const containerData = AsyncPageTemplate
    .replace(/Template/g, page.component)
    .replace(/pageName/g, page.id)
  fs.writeFileSync(componentPath, componentData)

  // check then add it to Pages/index.js
  const pagesIndex = getPagesIndex()
  if (pagesIndex.includes(containerData)) return
  const end = pagesIndex.match(/(\n$)|(.$)/)
  if (end == null) return
  const [_, emptyLine, noEmptyLine] = end
  const idx = emptyLine ? pagesIndex.length - 1 : pagesIndex.length
  const beginning = pagesIndex.slice(0, idx)
  const newPagesData = `${beginning}\n${containerData}`
  fs.writeFileSync(pagesPath, newPagesData)
}

export default syncPages
