const path = require('path');

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
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

module.exports = (env, argv) => {
  console.log('env', env);
  console.log('argv.mode', argv.mode);
  
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map'; // remove in prod
  }

  return config;
};