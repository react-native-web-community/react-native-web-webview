import React, { Component } from 'react';

export default class extends Component {
  constructor(props) {
    super(props);

    if (props.onMessage) {
      window.addEventListener('message', this.onMessage, true);
    }
  }

  onMessage = nativeEvent => nativeEvent.isTrusted && this.props.onMessage({ nativeEvent });

  render() {
    return (
      <iframe
        src={this.props.source.uri}
        srcDoc={this.props.source.html}
        style={{ width: '100%', height: '100%', border: 0 }}
        allowFullScreen
        allowpaymentrequest="true"
        frameBorder="0"
        seamless
      />
    );
  }
}
