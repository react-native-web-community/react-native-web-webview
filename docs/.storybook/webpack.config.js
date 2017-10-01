const path = require('path');
const webpack = require('webpack');

module.exports = (storybookBaseConfig, configType) => {
  const DEV = configType === 'DEVELOPMENT';

  storybookBaseConfig.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: { cacheDirectory: true },
    },
  });

  storybookBaseConfig.module.rules.push({
    test: /\.html$/,
    use: {
      loader: 'file-loader',
      options: { name: '[name].[ext]' },
    },
  });

  storybookBaseConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.__REACT_NATIVE_DEBUG_ENABLED__': DEV,
    })
  );

  storybookBaseConfig.resolve.alias = {
    'react-native': 'react-native-web',
    WebView: path.join(__dirname, '../../src/'),
  };

  return storybookBaseConfig;
};
