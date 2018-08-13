import path from 'path'
import Bundler from 'parcel-bundler'

const entryPath = path.resolve(__dirname, 'app/index.html')
const bundlerOptions = {
  outDir: path.resolve(__dirname, 'build'),
  outFile: 'index.html',
  publicUrl: './',
  watch: true,
  cache: true,
  cacheDir: path.resolve(__dirname, '.cache'),
  target: 'electron',
  sourceMaps: false,
  hmrPort: 0
}
const bundler = new Bundler(entryPath, bundlerOptions)
bundler.bundle()

bundler.on('bundled', (b) => {
  process.send({type: 'bundled'})
})

bundler.on('buildEnd', (b) => {
  process.send({type: 'buildEnd'})
})

process.on('message', (action) => {
  if (action.type === 'exit') {
    process.exit()
  }
})
