import React from 'react';
import WebView from 'WebView';

const html = '<html><body><h1>Hello world!</h1></body></html>';

export const basic = () => <WebView source={{ html }} />;
