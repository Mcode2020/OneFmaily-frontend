import React from 'react';
import ReactDOM from 'react-dom/client';
import CampaignDonation from '../campaigndonationbox/CampaignDonation';

class CampaignDonationElement extends HTMLElement {
  connectedCallback() {
    const campaignSlug = this.getAttribute('currentcampaignslug');
    const goalAmount = this.getAttribute('currentgoalamount');

    const root = ReactDOM.createRoot(this);
    root.render(
      <CampaignDonation currentcampaignslug={campaignSlug || ''} currentgoalamount={goalAmount || ''} /> 
    );
  }

  disconnectedCallback() {
    ReactDOM.createRoot(this).unmount();
  }
}

if (!customElements.get('campaign-donation')) {
  customElements.define('campaign-donation', CampaignDonationElement);
}