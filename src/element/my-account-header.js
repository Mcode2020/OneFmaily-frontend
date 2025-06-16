import React from 'react';
import ReactDOM from 'react-dom/client';
import MyAccount from '../my-account-header/my-account-header';

class MyAccountHeaderElement extends HTMLElement {
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

if (!customElements.get('my-account-header')) {
  customElements.define('my-account-header', MyAccountHeaderElement);
}