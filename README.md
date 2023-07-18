# react-native-web-webview

> React Native for Web implementation of RN's WebView

## Getting started

Installing
```
npm install react-native-web-webview --save
```

The package provides the same functionality as react-native-webview, however, it works when exported as a web project.
To continue using the same imports that you do with non-web exports, you you configure an alias in your webpack config so that it resolves to the correct package.

```js
resolve: {
    alias: {
        'react-native': 'react-native-web',
        ...
        'react-native-webview': 'react-native-web-webview',
    }
}
```

Add the following rule to your webpack config:

```js
const rule = {
  test: /postMock.html$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};
```

## With Expo
When using Expo, you will need to add a webpack file that will be used for web builds in order to add the above code.
The following command will create the file in the way expected by Expo and will also install the **@expo/webpack-config** dependency which is necessary.
```$
npx expo customize webpack.config.js
```

If you haven't set up Expo to export web projects at all, you will need to install the following dependencies.
```
npx expo install react-native-web react-dom
```

Below is an example implementation of **webpack.config.js** in an expo project.
```js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');


///////
// NOTE: Webpack is only used for bundling web
///////


module.exports = async function (env, argv) {  
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias = {
    ...config.resolve.alias,

    // Set up aliases so the web versions are used (Rather than changing imports in each file)
    'react-native': 'react-native-web',
    'react-native-webview': 'react-native-web-webview',

  };

  // Prevents an error the react-native-web-webview recieves when building
  const rule = {
    test: /postMock.html$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    },
  };
  config.module.rules.push(rule);


  // Return the config for use by webpack
  return config;
};

```


## Usage

```js
import { WebView } from 'react-native-webview';
```

See [RN's doc](https://github.com/react-native-community/react-native-webview).

Supported props are:

- `source`
- `onMessage`
- `scrollEnabled`
- `injectedJavaScript`
- `style`

Additional, web-specific props are:

- `newWindow`: (_boolean_|_{ name: string, features: string}_)
  This will open the source in a new window, optionally giving it an [internal name and custom features](https://developer.mozilla.org/en-US/docs/Web/API/Window/open).
  By default, the name is `webview` and there are no features set.
  This is useful when your target has X-Frame-Options or a no-CORS policy.
  It currently only supports a `source` prop with a `method` set to `POST`.
  Please feel free to do a PR to support more request types!
- `title`: (_string_) This prop will set the `webview` title.

## Examples

See the [storybook](https://react-native-web-community.github.io/react-native-web-webview/storybook).

## Contributing

PRs are welcome!
