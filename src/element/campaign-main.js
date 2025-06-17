import React from 'react';
import ReactDOM from 'react-dom/client';
import CampaignMain from '../campaignMain/CampaignMain';

class CampaignDonationElement extends HTMLElement {
  connectedCallback() {
    const campaignSlug = this.getAttribute('currentcampaignslug');
    const goalAmount = this.getAttribute('currentgoalamount');

    const root = ReactDOM.createRoot(this);
    root.render(
      <CampaignMain currentcampaignslug={campaignSlug || ''} currentgoalamount={goalAmount || ''} /> 
    );
  }

  disconnectedCallback() {
    ReactDOM.createRoot(this).unmount();
  }
}

if (!customElements.get('campaign-main')) {
  customElements.define('campaign-main', CampaignDonationElement);
}