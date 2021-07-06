const HtmlWebpackPlugin = require('html-webpack-plugin');
let glob = require("glob");
const path = require('path');

let entry = './src/ts/index.ts';
let htmlTemplate = 'src/index.html';
let outputPath = 'dist';
let htmlInject = true;

if (process.env.TESTBUILD) {
  entry = glob.sync('./tests/**/*.test.ts');
  outputPath = 'test-dist';
  htmlTemplate = 'tests/test.ejs';
  htmlInject = false;
}

module.exports = {
  entry: entry,
  devtool: 'inline-source-map',
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
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: htmlTemplate,
      inject: htmlInject,
      title: 'awesome'
    })
  ],
};
