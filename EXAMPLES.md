# Usage Examples

## Basic Usage with New Features

### Navigation Controls

```jsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';

function WebViewWithNavigation() {
  const webviewRef = useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Back" onPress={() => webviewRef.current.goBack()} />
        <Button title="Forward" onPress={() => webviewRef.current.goForward()} />
        <Button title="Reload" onPress={() => webviewRef.current.reload()} />
        <Button title="Stop" onPress={() => webviewRef.current.stopLoading()} />
      </View>

      <WebView
        ref={webviewRef}
        source={{ uri: 'https://example.com' }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

### Lifecycle Events

```jsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

function WebViewWithEvents() {
  const [status, setStatus] = useState('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <Text>Status: {status}</Text>
      <Text>URL: {currentUrl}</Text>

      <WebView
        source={{ uri: 'https://example.com' }}
        onLoadStart={(event) => {
          setStatus('Loading...');
          setCurrentUrl(event.nativeEvent.url);
          console.log('Started loading:', event.nativeEvent.url);
        }}
        onLoadEnd={(event) => {
          setStatus('Loaded');
          console.log('Finished loading:', event.nativeEvent.url);
        }}
        onError={(event) => {
          setStatus('Error');
          console.error('Load error:', event.nativeEvent.description);
        }}
        onHttpError={(event) => {
          setStatus(`HTTP Error: ${event.nativeEvent.statusCode}`);
          console.error('HTTP error:', event.nativeEvent.statusCode, event.nativeEvent.description);
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

### Dynamic JavaScript Injection

```jsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';

function WebViewWithDynamicJS() {
  const webviewRef = useRef(null);

  const changeBackgroundColor = () => {
    webviewRef.current.injectJavaScript(`
      document.body.style.backgroundColor = '#${Math.floor(Math.random()*16777215).toString(16)}';
    `);
  };

  const showAlert = () => {
    webviewRef.current.injectJavaScript(`
      alert('Hello from React Native!');
    `);
  };

  const getPageTitle = () => {
    webviewRef.current.injectJavaScript(`
      window.ReactNativeWebView.postMessage(document.title);
    `);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Change BG Color" onPress={changeBackgroundColor} />
        <Button title="Show Alert" onPress={showAlert} />
        <Button title="Get Title" onPress={getPageTitle} />
      </View>

      <WebView
        ref={webviewRef}
        source={{ uri: 'https://example.com' }}
        onMessage={(event) => {
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

### Custom User Agent

```jsx
import React from 'react';
import { WebView } from 'react-native-webview';

function WebViewWithCustomUA() {
  return (
    <WebView
      source={{ uri: 'https://example.com' }}
      userAgent="MyCustomApp/1.0 (CustomUserAgent)"
      onLoad={() => {
        console.log('Page loaded with custom user agent');
      }}
      style={{ flex: 1 }}
    />
  );
}
```

### Initial JavaScript Injection

```jsx
import React from 'react';
import { WebView } from 'react-native-webview';

function WebViewWithInitialJS() {
  const injectedJS = `
    // This runs after the page loads
    console.log('Page loaded!');

    // Modify the page
    document.body.style.fontFamily = 'Arial, sans-serif';

    // Add custom functionality
    window.myCustomFunction = function() {
      console.log('Custom function called!');
    };
  `;

  return (
    <WebView
      source={{ uri: 'https://example.com' }}
      injectedJavaScript={injectedJS}
      style={{ flex: 1 }}
    />
  );
}
```

### Complete Example

```jsx
import React, { useRef, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

function CompleteWebViewExample() {
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text>URL: {url}</Text>
        <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
        {error && <Text style={styles.error}>Error: {error}</Text>}
      </View>

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Button title="◀" onPress={() => webviewRef.current.goBack()} />
        <Button title="▶" onPress={() => webviewRef.current.goForward()} />
        <Button title="⟳" onPress={() => webviewRef.current.reload()} />
        <Button title="✕" onPress={() => webviewRef.current.stopLoading()} />
        <Button
          title="Inject JS"
          onPress={() => {
            webviewRef.current.injectJavaScript(`
              alert('Current URL: ' + window.location.href);
            `);
          }}
        />
      </View>

      {/* WebView */}
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://example.com' }}
        userAgent="MyApp/1.0"
        onLoadStart={(e) => {
          setLoading(true);
          setUrl(e.nativeEvent.url);
          setError(null);
        }}
        onLoadEnd={(e) => {
          setLoading(false);
          console.log('Page loaded:', e.nativeEvent.title);
        }}
        onError={(e) => {
          setLoading(false);
          setError(e.nativeEvent.description);
        }}
        onHttpError={(e) => {
          setError(`HTTP ${e.nativeEvent.statusCode}: ${e.nativeEvent.description}`);
        }}
        onMessage={(e) => {
          console.log('Message from page:', e.nativeEvent.data);
        }}
        injectedJavaScript={`
          // Setup message bridge
          window.onerror = function(msg, url, line) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: msg,
              url: url,
              line: line
            }));
            return false;
          };
        `}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  navbar: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  webview: {
    flex: 1,
  },
  error: {
    color: 'red',
  },
});

export default CompleteWebViewExample;
```

## Important Notes

### Cross-Origin Limitations

Some features have limitations due to browser security policies:

1. **onHttpError**: Only works reliably for same-origin content or when using `source.method` (which uses fetch internally)
2. **injectJavaScript**: Cannot inject into cross-origin iframes due to same-origin policy
3. **Navigation state**: Cannot access cross-origin iframe's URL or document

### Best Practices

1. Always check if the ref exists before calling methods:
   ```jsx
   if (webviewRef.current) {
     webviewRef.current.goBack();
   }
   ```

2. Handle errors gracefully:
   ```jsx
   <WebView
     onError={(e) => {
       console.error('WebView error:', e.nativeEvent);
       // Show user-friendly error message
     }}
   />
   ```

3. Use `onLoadStart` and `onLoadEnd` to show loading indicators:
   ```jsx
   const [loading, setLoading] = useState(false);

   <WebView
     onLoadStart={() => setLoading(true)}
     onLoadEnd={() => setLoading(false)}
   />
   ```

4. Clean up message listeners in unmount:
   ```jsx
   useEffect(() => {
     return () => {
       // Cleanup if needed
     };
   }, []);
   ```
