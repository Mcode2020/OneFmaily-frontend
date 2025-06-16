import React from 'react';
import ReactDOM from 'react-dom/client';
import MyAccount from '../myaccount/MyAccount';

class MyAccountElement extends HTMLElement {
  connectedCallback() {
    const root = ReactDOM.createRoot(this);
    root.render(
      <MyAccount /> 
    );
  }

  disconnectedCallback() {
    ReactDOM.createRoot(this).unmount();
  }
}

if (!customElements.get('my-account')) {
  customElements.define('my-account', MyAccountElement);
}