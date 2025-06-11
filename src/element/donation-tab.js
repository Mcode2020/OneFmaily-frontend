import React from 'react';
import ReactDOM from 'react-dom/client';
import DonationTabs from '../donationtabs/DonationTabs';

class DonationTabsElement extends HTMLElement {
  connectedCallback() {
    const root = ReactDOM.createRoot(this);
    root.render(
      <DonationTabs /> 
    );
  }

  disconnectedCallback() {
    ReactDOM.createRoot(this).unmount();
  }
}

if (!customElements.get('donation-tabs')) {
  customElements.define('donation-tabs', DonationTabsElement);
}