import React from 'react';
import { WebView } from 'react-native-webview';
import { text } from '@storybook/addon-knobs';

export const basic = () => (
  <WebView
    source={{
      uri: text('URI', 'https://react-native-web-community.github.io/react-native-web-webview/'),
      method: text('Method', 'GET'),
    }}
  />
);
