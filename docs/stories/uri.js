import React from 'react';
import { WebView } from 'react-native-webview';
import { action } from '@storybook/addon-actions';

export const basic = () => {
  return (
    <div style={{ height: '100vh' }}>
      <WebView source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }} />
    </div>
  );
};

export const onMessage = () => {
  return (
    <WebView
      source={{ uri: require('./onMessage.html') }}
      onMessage={(e) => action('message from webview')(e.nativeEvent.data)}
    />
  );
};
