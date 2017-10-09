const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const licensePath = path.join(__dirname, 'build', 'license.js');
const license = fs.readFileSync(licensePath, 'utf8');

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
    extensions: ['.js', '.json'],
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/build',
    contentBase: [
      path.resolve(__dirname, 'build'),
      path.resolve(__dirname, 'examples'),
    ],
    host: '0.0.0.0',
    disableHostCheck: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
    }),
    new webpack.BannerPlugin({ banner: license, raw: true }),
  ],
};
