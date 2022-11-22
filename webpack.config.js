const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      'path': require.resolve('path-browserify'),
    } 
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'dist'),
        },
        {
          from: 'assets/css',
          to: path.join(__dirname, 'dist/css'),
        },
        {
          from: 'assets/images',
          to: path.join(__dirname, 'dist/images'),
        },
        {
          from: 'assets/webfonts',
          to: path.join(__dirname, 'dist/webfonts'),
        }
      ],
    })
  ]
};

module.exports = (env, argv) => {
  console.log('env', env);
  console.log('argv.mode', argv.mode);

  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map'; // remove in prod
  }

  return config;
};