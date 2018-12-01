const React = require('react')
const ReactDomServer = require('react-dom/server')
const express = require('express')
const fallback = require('express-history-api-fallback')
const config = require('./nollup.config.js')
const nollupDevServer = require('nollup/lib/dev-middleware')
const DemoComponent = require('./src/ssr/DemoComponent')

const port = process.env.PORT
if(!port){
  throw new Error('please specify PORT in env variables.')
}

const app = express()

app.get('/ssrComponent', (req, res) => {
  const stream = ReactDomServer.renderToNodeStream(
    React.createElement(DemoComponent, {text: 'hydrated hi'})
  )
  stream.pipe(res, {end: false})
  stream.on('end', () => res.end())
})

app.use(nollupDevServer(app, config, {
  watch: 'demo/src',
  hot: true
}))

app.use(express.static('demo/public'))

app.use(fallback('index.html', {root: 'demo/public'}))

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`)
})


