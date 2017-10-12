import Qs from 'qs';
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default class extends Component {
  componentDidMount() {
    if (this.props.onMessage) {
      window.addEventListener('message', this.onMessage, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {onMessage} = nextProps

    if(this.props.onMessage && onMessage) return

    componentWillUnmount()

    if (onMessage) {
      window.addEventListener('message', this.onMessage, true);
    }
  }

  componentWillUnmount() {
    if (this.props.onMessage) {
      window.removeEventListener('message', this.onMessage, true);
    }
  }

  onMessage = nativeEvent => nativeEvent.isTrusted && this.props.onMessage({ nativeEvent });

  render() {
    const {source} = this.props
    const {headers, html, method, uri} = source

    if (method === 'POST') {
      let body = source.body

      const contentType = headers['Content-Type'];
      if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        body = JSON.stringify(Qs.parse(body));
      } else {
        console.warn('[WebView] Content type is not supported yet, please make a PR!', contentType);
        return;
      }

      if(this._window)
      {
        this._window.close()
        delete this._window
      }
      this._window = window.open(require('./postMock.html') + '?' + Qs.stringify({uri, body}));

      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <iframe
        src={uri}
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 0 }}
        allowFullScreen
        allowpaymentrequest="true"
        frameBorder="0"
        seamless
      />
    );
  }
}
