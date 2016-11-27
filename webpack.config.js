const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');

const config = {
  entry: {
    'app': './app/index.jsx',
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
  },
  resolve: {
    'extensions': [
      '', '.js', '.jsx',
    ],
  },
  module : {
   loaders : [
     {
       test : /\.jsx?/,
       include : APP_DIR,
       loader : 'babel'
     },
     {
      test: /\.css$/,
      loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
    }
   ]
 },

 plugins: [new HtmlWebpackPlugin({
   title: 'Iron Chat',
   template: 'my-index.ejs'
 })],
 devServer: {
      host: '0.0.0.0',
      port: 8080,
      historyApiFallback: true,
      devtool: 'eval-source-map',
      progress: true,
      colors: true,
      quiet: false,
      noInfo: false,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
      },
      proxy: {
        '/api/*': {
          target: {
            host: process.env.DOCKER_DEV ? 'server' : 'localhost',
            port: 8082,
            protocol: 'http:',
          },
          ignorePath: false,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io/*': {
          target: {
            host: process.env.DOCKER_DEV ? 'server' : 'localhost',
            port: 8082,
            protocol: 'http:',
          },
          ignorePath: false,
          changeOrigin: true,
          secure: false,
        },
      }
    }
};

module.exports = config;
