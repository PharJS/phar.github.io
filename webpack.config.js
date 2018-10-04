const { existsSync } = require('fs'),
  webpack = require('webpack'),
  OfflinePlugin = require('offline-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  path = require('path')

const mode = process.env.NODE_ENV || 'development',
  plugins = []

mode === 'production' &&
  plugins.push(
    new OfflinePlugin({
      safeToUseOptionalCaches: true,
      caches: {
        main: [
          'app.bundle.js',
          'vendor.bundle.js',
          ':rest:',
        ],
        additional: [
          ':externals:',
        ],
      },
      externals: [
        '/manifest.json',
        '/browserconfig.xml',
        '/assets/**/*.*',
        '/',
      ],
      ServiceWorker: {
        events: true,
        navigateFallbackURL: '/',
        publicPath: '/sw.js'
      },
    }),
  )

const seoFiles = (existsSync('./seo/'))
  ? [{from: './seo/', to: './'}]
  : []

module.exports = {
  mode,

  entry: {
    app: `${__dirname}/src/index.tsx`,
  },

  output: {
    path: `${__dirname}/build`,
    filename: '[name].bundle.js',
  },

  devtool: mode === 'production' ? false : 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'theme': path.resolve(__dirname, 'src/theme'),
      'components': path.resolve(__dirname, 'src/components'),
      'containers': path.resolve(__dirname, 'src/containers'),
      'i18n': path.resolve(__dirname, 'src/i18n'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'actions': path.resolve(__dirname, 'src/actions'),
      'reducers': path.resolve(__dirname, 'src/reducers'),
      'store': path.resolve(__dirname, 'src/store'),
    }
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: ['ts-loader'],
    },{
      test: /.pug$/,
      loader: 'pug-loader',
    },{
      test: /\.(ico|svg|png|jpg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    }]
  },

  optimization: {
    minimize: mode === 'production',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        },
      }
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
    }),
    new CopyWebpackPlugin([{
        from: './src/manifest.json',
        to: './',
      }, {
        from: './src/browserconfig.xml',
        to: './',
      }, {
        from: './src/assets/icons',
        to: './assets/icons',
      },
      ...seoFiles,
    ]),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    ...plugins,
  ],

  devServer: {
    host: '0.0.0.0',
  },
}
