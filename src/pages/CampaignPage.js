import React from 'react';
import CampaignDonation from '../campaigndonationbox/CampaignDonation';

const CampaignPage = () => {
  return (
    <div className="container-1330">        
      <div className="header-logo">
        <img src="/images/logo.svg" alt="Logo" />
      </div>
      <div className="main-wrapper">
        <div className="campaign-info">
          <h2>We are committed to environmental conservation.</h2>
          <p>Shared meals will provide emergency food assistance to families in Palestine</p>
          <CampaignDonation />
          <div className="back-btn">
            <a href="/">Back to Payment</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPage; 