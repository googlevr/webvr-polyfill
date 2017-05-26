const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const license = fs.readFileSync(path.join(__dirname, 'LICENSE.md'), 'utf8');
const banner = `@license\n${license}`;

module.exports = {
  entry: {
    'webvr-polyfill': './src/main.js',
    'webvr-polyfill.min': './src/main.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  resolve: {
    extensions: ['.js', '.js', '.json'],
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/build',
    contentBase: [
      path.resolve(__dirname, 'build'),
      path.resolve(__dirname, 'examples'),
    ],
    host: '0.0.0.0',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
    }),
    new webpack.BannerPlugin({ banner: banner }),
  ],
};
