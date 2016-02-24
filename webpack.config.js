var extractText = require('extract-text-webpack-plugin')
var path = require('path')
var cssnext = require('postcss-cssnext')
var cssImport = require('postcss-import')
var precss = require('precss')
var webpack = require('webpack')

var dev = process.env.NODE_ENV !== 'production'

var config = {
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new extractText('bundle.css')
  ],
  postcss: function(webpack) {
    return [
      cssImport({ addDependencyTo: webpack }),
      precss(),
      cssnext()
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: dev ? ['react-hmre'] : []
        },
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css$/,
        loader: dev ? 'style-loader!css-loader!postcss-loader' :
          extractText.extract('style-loader', 'css-loader?minimize!postcss-loader'),
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
}

if (dev) {
  config.devtool = 'cheap-module-eval-source-map'
  config.entry.push('webpack-hot-middleware/client')

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
} else {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        unused: true,
        dead_code: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  )
}

module.exports = config
