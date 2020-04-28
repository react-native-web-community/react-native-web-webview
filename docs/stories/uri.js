import React from 'react';
import { WebView } from 'react-native-webview';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

export const basic = () => <WebView source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }} />;

export const onMessage = () => (
  <WebView source={{ uri: require('./onMessage.html') }} onMessage={action(text('Text', 'onMessage'))} />
);
