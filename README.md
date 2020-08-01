# react-native-web-webview

> React Native for Web implementation of RN's WebView

## Getting started

`$ npm install react-native-web-webview --save`

Alias the package in your webpack config:

```
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
