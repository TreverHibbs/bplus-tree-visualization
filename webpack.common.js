const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let entry = './src/ts/index.ts';
let outputPath = 'dist';

if (process.env.TESTBUILD) {
  entry = './tests/test.ts';
  outputPath = 'test-dist';
}

module.exports = {
  entry: entry,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader', { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
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
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
};
