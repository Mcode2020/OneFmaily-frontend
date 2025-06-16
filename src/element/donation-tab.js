import React from 'react';
import ReactDOM from 'react-dom/client';
import DonationTabs from '../donationtabs/DonationTabs';

class DonationTabsElement extends HTMLElement {
  connectedCallback() {
    const slug = this.getAttribute('slug');
    const campaignName = this.getAttribute('campaignName');

    const goalAmount = this.getAttribute('goalAmount');
    const root = ReactDOM.createRoot(this);
    root.render(
      <DonationTabs campaignName={campaignName || ''} slug={slug || ''} goalAmount={goalAmount || ''} /> 
    );
  }
  disconnectedCallback() {
    ReactDOM.createRoot(this).unmount();
  }
}

if (!customElements.get('donation-tabs')) {
  customElements.define('donation-tabs', DonationTabsElement);
}