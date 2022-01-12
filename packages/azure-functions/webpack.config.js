const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry:  {
      monzoWebhook: "./src/functions/monzoWebhook.ts",
      getWeek: "./src/functions/getWeek.ts"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
            loader: "ts-loader",
            options: {
              projectReferences: true
            }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs'
  },
};