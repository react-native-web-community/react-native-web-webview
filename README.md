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

## Usage
```js
import WebView from 'WebView'; // don't import from react-native
```

See [RN's doc](https://facebook.github.io/react-native/docs/webview.html).

## Examples
See the [storybook](https://react-native-web-community.github.io/react-native-web-webview/storybook).

## Contributing
PRs are welcome!
