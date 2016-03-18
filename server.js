var express = require('express')
var path = require('path')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = express()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get('*', function(req, res, next) {
  var filename = path.join(compiler.outputPath, 'index.html')
  compiler.outputFileSystem.readFile(filename, function(err, result) {
    if (err) {
      return next(err)
    }

    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})
