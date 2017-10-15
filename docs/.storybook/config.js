import { setOptions } from '@storybook/addon-options';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

setOptions({
  name: 'WebView',
  url: 'https://react-native-web-community.github.io/react-native-web-webview',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  downPanelInRight: false,
});

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
