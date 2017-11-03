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
        'WebView': 'react-native-web-webview',
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
import WebView from 'WebView'; // don't import from react-native
```

See [RN's doc](https://facebook.github.io/react-native/docs/webview.html).

Supported props are:
- source
- onMessage

Additional props are:
- `newWindow`: (*boolean*|*{ name: string, features: string}*)
This will open the source in a new window, optionally giving it an [internal name and custom features](https://developer.mozilla.org/en-US/docs/Web/API/Window/open).
By default, the name is `webview` and there are no features set.
This is useful when your target has X-Frame-Options or a no-CORS policy.
It currently only supports a `source` prop with a `method` set to `POST`.
- `title`: (*string*) This prop will set the `webview` title.
- `scrollEnable`: (*boolean*) If `true` the scrolling will be enable in the `webview`, if `false` or `undefined` the scrolling will be disable.
Please feel free to do a PR to support more request types!

## Examples
See the [storybook](https://react-native-web-community.github.io/react-native-web-webview/storybook).

## Contributing
PRs are welcome!
