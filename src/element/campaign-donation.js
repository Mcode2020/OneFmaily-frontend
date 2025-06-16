import React from 'react';
import ReactDOM from 'react-dom/client';
import CampaignDonation from '../campaigndonationbox/CampaignDonation';

class CampaignDonationElement extends HTMLElement {
  connectedCallback() {
    const campaignSlug = this.getAttribute('campaignSlug');
    const goalAmount = this.getAttribute('goalAmount');

    const root = ReactDOM.createRoot(this);
    root.render(
      <CampaignDonation currentCampaignSlug={campaignSlug || ''} currentGoalAmount={goalAmount || ''} /> 
    );
  }

  disconnectedCallback() {
    ReactDOM.createRoot(this).unmount();
  }
}

if (!customElements.get('campaign-donation')) {
  customElements.define('campaign-donation', CampaignDonationElement);
}