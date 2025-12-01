import Qs from 'qs';
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, unstable_createElement as createElement } from 'react-native';

export class WebView extends Component {
  static defaultProps = {
    scrollEnabled: true,
  };

  state = {
    html: null,
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.handleSource(props.source, props.newWindow);
  }

  setRef = (ref) => {
    this.frameRef = ref;
    if (ref) {
      // Trigger onLoadStart when iframe is mounted
      this.handleLoadStart();
    }
  };

  // Navigation methods
  goBack = () => {
    if (this.frameRef && this.frameRef.contentWindow) {
      this.frameRef.contentWindow.history.back();
    }
  };

  goForward = () => {
    if (this.frameRef && this.frameRef.contentWindow) {
      this.frameRef.contentWindow.history.forward();
    }
  };

  reload = () => {
    if (this.frameRef && this.frameRef.contentWindow) {
      this.frameRef.contentWindow.location.reload();
    }
  };

  stopLoading = () => {
    if (this.frameRef && this.frameRef.contentWindow) {
      try {
        this.frameRef.contentWindow.stop();
      } catch (e) {
        // Some browsers may not support window.stop()
        console.warn('[WebView] stopLoading not supported in this browser');
      }
    }
  };

  // Dynamic JavaScript injection
  injectJavaScript = (script) => {
    if (this.frameRef && this.frameRef.contentWindow) {
      try {
        this.frameRef.contentWindow.eval(script);
      } catch (e) {
        console.error('[WebView] Error injecting JavaScript:', e);
      }
    }
  };

  handleSource = (source, newWindow) => {
    if (!source.method) return;

    if (newWindow) {
      this.handleSourceInNewWindow(source, newWindow);
    } else {
      this.handleSourceInIFrame(source);
    }
  };

  handleSourceInIFrame = (source) => {
    const { uri, ...options } = source;
    const baseUrl = uri.substr(0, uri.lastIndexOf('/') + 1);
    fetch(uri, options)
      .then((response) => {
        // Check for HTTP errors when using fetch
        if (!response.ok && this.props.onHttpError) {
          this.props.onHttpError({
            nativeEvent: {
              url: uri,
              statusCode: response.status,
              description: response.statusText || `HTTP Error ${response.status}`,
            },
          });
        }
        return response.text();
      })
      .then((html) => this.setState({ html: `<base href="${baseUrl}" />` + html }))
      .catch((error) => {
        // Handle network errors
        if (this.props.onError) {
          this.props.onError({
            nativeEvent: {
              url: uri,
              title: '',
              description: error.message || 'Network error',
            },
          });
        }
      });
  };

  handleSourceInNewWindow = (source, newWindow) => {
    if (source.method === 'POST') {
      const contentType = source.headers['Content-Type'];
      let body = '';
      if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        body = Qs.parse(source.body);
      } else {
        console.warn(
          '[WebView] When opening a new window, this content-type is not supported yet, please make a PR!',
          contentType
        );
        return;
      }

      window.open(
        require('./postMock.html') +
          '?' +
          Qs.stringify({
            uri: source.uri,
            body: JSON.stringify(body),
          }),
        newWindow.name || 'webview',
        newWindow.features || undefined
      );
    } else {
      console.warn(
        '[WebView] When opening a new window, this method is not supported yet, please make a PR!',
        source.method
      );
    }
  };

  componentDidMount() {
    if (this.props.onMessage) {
      window.addEventListener('message', this.onMessage, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.source.uri !== nextProps.source.uri ||
      this.props.source.method !== nextProps.source.method ||
      this.props.source.body !== nextProps.source.body
    ) {
      // Trigger onLoadStart when source changes
      this.handleLoadStart();
      this.handleSource(nextProps.source, nextProps.newWindow);
    }
  }

  componentWillUnmount() {
    if (this.props.onMessage) {
      window.removeEventListener('message', this.onMessage, true);
    }
  }

  onMessage = (nativeEvent) => this.props.onMessage({ nativeEvent });

  postMessage = (message, origin) => {
    this.frameRef.contentWindow.postMessage(message, origin);
  };

  // Event handlers
  handleLoadStart = (e) => {
    this.setState({ isLoading: true });
    if (this.props.onLoadStart) {
      const { onLoadStart } = this.props;
      const url = (this.frameRef && this.frameRef.contentWindow && this.frameRef.contentWindow.location && this.frameRef.contentWindow.location.href)
        || (this.props.source && this.props.source.uri) || '';
      const title = (this.frameRef && this.frameRef.contentDocument && this.frameRef.contentDocument.title) || '';
      onLoadStart({
        nativeEvent: {
          url: url,
          loading: true,
          title: title,
        },
      });
    }
  };

  handleLoadEnd = (e) => {
    this.setState({ isLoading: false });
    if (this.props.onLoadEnd) {
      const { onLoadEnd } = this.props;
      const url = (this.frameRef && this.frameRef.contentWindow && this.frameRef.contentWindow.location && this.frameRef.contentWindow.location.href)
        || (this.props.source && this.props.source.uri) || '';
      const title = (this.frameRef && this.frameRef.contentDocument && this.frameRef.contentDocument.title) || '';
      onLoadEnd({
        nativeEvent: {
          url: url,
          loading: false,
          title: title,
        },
      });
    }
  };

  handleLoad = (e) => {
    this.handleLoadEnd(e);

    // Check for HTTP errors (limited to same-origin or already-fetched content)
    this.checkHttpError();

    // Inject userAgent override if specified
    if (this.props.userAgent) {
      this.injectJavaScript(`
        Object.defineProperty(navigator, 'userAgent', {
          get: function() { return '${this.props.userAgent.replace(/'/g, "\\'")}'; }
        });
      `);
    }

    // Call original onLoad if provided
    if (this.props.onLoad) {
      this.props.onLoad(e);
    }
  };

  handleError = (e) => {
    this.setState({ isLoading: false });
    if (this.props.onError) {
      const { onError } = this.props;
      const url = (this.props.source && this.props.source.uri) || '';
      onError({
        nativeEvent: {
          url: url,
          title: '',
          description: 'Failed to load page',
        },
      });
    }
  };

  // Note: onHttpError is limited in iframe context due to same-origin policy
  // We can only detect HTTP errors for same-origin content or when using srcDoc/fetch
  checkHttpError = () => {
    if (this.props.onHttpError && this.frameRef) {
      try {
        // Try to access the iframe's document to check for error status
        // This will only work for same-origin iframes
        const doc = this.frameRef.contentDocument;
        if (doc && doc.title && doc.title.includes('Error')) {
          // Best-effort detection of error pages
          const url = (this.props.source && this.props.source.uri) || '';
          this.props.onHttpError({
            nativeEvent: {
              url: url,
              statusCode: 0, // Unknown status code due to iframe limitations
              description: 'HTTP Error detected',
            },
          });
        }
      } catch (e) {
        // Cross-origin access blocked - cannot detect HTTP errors
      }
    }
  };

  handleInjectedJavaScript = (html) => {
    if (this.props.injectedJavaScript) {
      if (html) {
        return html.replace('</body>', `<script>${this.props.injectedJavaScript}</script></body>`);
      } else {
        return html;
      }
    } else {
      return html;
    }
  };

  render() {
    if (this.props.newWindow) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    const { title, source, scrollEnabled } = this.props;
    const styleObj = StyleSheet.flatten(this.props.style);
    return createElement('iframe', {
      title,
      ref: this.setRef,
      src: !source.method ? source.uri : undefined,
      srcDoc: this.handleInjectedJavaScript(this.state.html || source.html),
      width: styleObj && styleObj.width,
      height: styleObj && styleObj.height,
      style: StyleSheet.flatten([styles.iframe, scrollEnabled && styles.noScroll, this.props.style]),
      allowFullScreen: true,
      allowpaymentrequest: 'true',
      frameBorder: '0',
      seamless: true,
      onLoad: this.handleLoad,
      onError: this.handleError,
    });
  }
}

export default WebView;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  noScroll: {
    overflow: 'hidden',
  },
});
