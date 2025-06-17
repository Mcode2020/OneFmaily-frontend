import React from 'react'
import StripeContainer from './StripeContainer';
import CampaignDonation from '../campaigndonationbox/CampaignDonation';

const mainpage = () => {
  return (
    <div className="main-wrapper">
    <div className="campaign-info">
      <h2>We are committed to environmental conservation.</h2>
      <p>Shared meals will provide emergency food assistance to families in Palestine</p>
      <CampaignDonation currentcampaignslug="" currentgoalamount="" />
      <div className="back-btn">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}>Back</a>
      </div>
    </div>
    <StripeContainer />
  </div>  )
}

export default mainpage