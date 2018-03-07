const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  }, 
  watch: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: path.resolve(__dirname, './node_modules/babel-loader'),
        query: {
          presets: [ 'es2015', 'react']
        }
      }
    ]
  }
}