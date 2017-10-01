import React, { Component } from 'react';

export default class extends Component {
  render() {
    return (
      <iframe
        src={this.props.source.uri}
        srcDoc={this.props.source.html}
        style={{ width: '100%', height: '100%', border: 0 }}
        allowfullscreen
        allowpaymentrequest
        frameBorder="0"
        seamless
      />
    );
  }
}

