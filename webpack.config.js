var extractText = require('extract-text-webpack-plugin')
var htmlWebpackPlugin = require('html-webpack-plugin')
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
    publicPath: dev ? '/dist/' : ''
  },
  plugins: [
    new extractText('bundle.css', {
      allChunks: true
    }),
    new htmlWebpackPlugin({
      template: 'index.html',
      hash: true
    })
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
        query: { plugins: dev ? ['react-hot-loader/babel'] : [] },
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: dev ? 'style-loader!css-loader?modules!postcss-loader' :
          extractText.extract('style-loader', 'css-loader?modules&minimize!postcss-loader'),
        exclude: /node_modules|lib/
      },
      {
        test: /\.css$/,
        loader: dev ? 'style-loader!css-loader' :
          extractText.extract('style-loader', 'css-loader?minimize'),
        include: /node_modules|lib/
      },
      {
        test: /\.(png|svg)$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.ttf$/,
        loader: 'file'
      }
    ]
  }
}

if (dev) {
  config.devtool = 'cheap-module-eval-source-map'
  config.entry.unshift(
    'webpack-hot-middleware/client',
    'react-hot-loader/patch'
  )

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
