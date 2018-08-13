import path from 'path'
import Bundler from 'parcel-bundler'
import chalk from 'chalk'
import { fork } from 'child_process'

const PORT = 1666
const entryPath = path.resolve(__dirname, 'src', 'index.html')
const bundler = new Bundler(entryPath, {
  outDir: path.resolve(__dirname, 'build'),
  outFile: 'index.html',
  watch: true,
  cache: true,
  cacheDir: path.resolve(__dirname, '.cache'),
  target: 'browser',
  sourceMaps: true,
  hmrPort: 0
})

bundler.serve(PORT)
const firebaseListeners = fork(path.resolve(__dirname, 'developer', 'developer.js'))

/* ================= */
/* === LISTENERS === */
/* ================= */
bundler.on('bundled', (b) => {
  // process.send({type: 'bundled'})
  // console.log(chalk.green(`Built`))
})

bundler.on('buildEnd', (b) => {
  // process.send({type: 'buildEnd'})
  // console.log(chalk.green(`Rebuilt`))
})

bundler.on('buildError', (err) => {
  // process.send({type: 'buildEnd'})
  console.log(chalk.red(`Build error`))
  console.log('')
  console.log(chalk.red(err.message))
})
