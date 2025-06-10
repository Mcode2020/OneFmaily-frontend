import React from "react";
import StripeContainer from "./stripe/StripeContainer";
import "./App.css";
import CampaignDonation from "./campaigndonationbox/CampaignDonation";
import DonationTabs from "./donationtabs/DonationTabs";

function App() {
  return (
    <div className="App">
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
              <a href="#">Back</a>
            </div>
          </div>
          <StripeContainer />
        </div>
        <DonationTabs />
      </div>
    </div>
  );
}

export default App;
