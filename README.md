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
- `onLoad`
- `onLoadStart`
- `onLoadEnd`
- `onError`
- `onHttpError` (limited support - see notes below)
- `scrollEnabled`
- `injectedJavaScript`
- `userAgent`
- `style`

Supported methods (via ref):

- `goBack()` - Navigate to the previous page
- `goForward()` - Navigate to the next page
- `reload()` - Reload the current page
- `stopLoading()` - Stop loading the current page
- `injectJavaScript(script)` - Execute JavaScript in the WebView context
- `postMessage(message, origin)` - Send a message to the WebView

Additional, web-specific props are:

- `newWindow`: (_boolean_|_{ name: string, features: string}_)
  This will open the source in a new window, optionally giving it an [internal name and custom features](https://developer.mozilla.org/en-US/docs/Web/API/Window/open).
  By default, the name is `webview` and there are no features set.
  This is useful when your target has X-Frame-Options or a no-CORS policy.
  It currently only supports a `source` prop with a `method` set to `POST`.
  Please feel free to do a PR to support more request types!
- `title`: (_string_) This prop will set the `webview` title.

## Important Notes

### onHttpError Limitations

Due to browser security restrictions (same-origin policy), `onHttpError` has limited support:
- **Full support**: When using `source.method` (which uses fetch internally), HTTP errors like 404, 500, etc. are properly detected
- **Limited support**: For direct iframe `src` loads, HTTP errors can only be detected for same-origin content
- **No support**: Cross-origin iframe loads cannot detect HTTP errors due to browser security policies

### userAgent

The `userAgent` prop overrides the navigator.userAgent value within the WebView by injecting JavaScript. Note that this doesn't change the actual HTTP User-Agent header sent by the browser.

## Examples

See the [storybook](https://react-native-web-community.github.io/react-native-web-webview/storybook).

## Contributing

PRs are welcome!
