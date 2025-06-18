import React, { useState, useEffect } from "react";
import DonationPage from "./pages/DonationPage";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";
import CampaignDonation from "./campaigndonationbox/CampaignDonation";
import DonationTabs from "./donationtabs/DonationTabs";
import "./donationtabs/DonationTabs.css";
import StripeContainer from "./stripe/StripeContainer";
import MyAccount from "./myaccount/MyAccount";
import MyAccountHeader from "./my-account-header/my-account-header";
import MainPage from "./stripe/mainpage";
import CampaignTabs from "./campaignTabs/campaignTabs";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };



  return (
    <div className="App">
      <div className="container-1330">        
        <div className="header-logo">
          <img src="/images/logo.svg" alt="Logo" />
        </div>
        <MainPage />
        {/* <DonationTabs campaignName="unlocking-opportunities-breaking-the-cycle-of-poverty"  slug="unlocking-opportunities-breaking-the-cycle-of-poverty" goalAmount="700000" /> */}
        {/* <MyAccountHeader /> */}
        {/* <MyAccount /> */}
        {/* <CampaignDonation currentcampaignslug="unlocking-opportunities-breaking-the-cycle-of-poverty" currentgoalamount="10000"/> */}
        {/* <MyAccount /> */}
        {/* <CampaignTabs /> */}
      </div>
    </div>
  );
}

export default App;
