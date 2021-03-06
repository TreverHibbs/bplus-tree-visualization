const path = require('path');

let entry = './src/index.ts';
let outputPath = 'dist';

if (process.env.TESTBUILD) {
  entry = './tests/test.ts';
  outputPath = 'test-dist';
}

module.exports = {
  mode: 'development',
  entry: entry,
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, outputPath),
  },
};
