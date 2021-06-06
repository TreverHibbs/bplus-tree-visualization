const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

let port = 3000;

if (process.env.TESTBUILD) {
  port = 3001;
}

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    disableHostCheck: true,
    port: port,
  },
});
