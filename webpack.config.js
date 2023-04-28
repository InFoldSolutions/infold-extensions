const path = require('path');
const package = require('./package.json');

// Webpack plugins
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  console.log('env', env);
  console.log('argv.mode', argv.mode);

  const browserCssPath = (env.browser === "chrome") ? "chrome-extension://" : "moz-extension://";
  const config = {
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
    entry: {
      content: './src/content/index.ts',
      background: './src/background/index.ts',
    },
    output: {
      filename: '[name].js',
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
            from: `manifest/${env.browser}.json`,
            to: path.join(__dirname, 'dist/manifest.json'),
            transform(content) {
              return content
                .toString()
                .replace('$VERSION', package.version)
            },
          },
          {
            from: 'assets/css/all.min.css',
            to: path.join(__dirname, 'dist/css/all.min.css'),
            transform(content) {
              return content
                .toString()
                .replaceAll('$BROWSERCSSPATH', browserCssPath)
            },
          },
          {
            from: 'assets/css/main.css',
            to: path.join(__dirname, 'dist/css/main.css')
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
      }),
      new ZipPlugin({
        path: path.join(__dirname, 'output'),
        filename: `${package.name}-${package.version}.zip`
      })
    ]
  }

  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map'; // remove in prod
  }

  return config;
};