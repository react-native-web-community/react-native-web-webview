import React from 'react';
import WebView from 'WebView';
import { action } from '@storybook/addon-actions';

export const basic = () => <WebView source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }} />;

export const onMessage = () => (
  <WebView source={{ uri: require('./onMessage.html') }} onMessage={action('onMessage')} />
);
