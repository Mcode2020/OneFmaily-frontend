import React, { useState, useEffect } from "react";
import DonationPage from "./pages/DonationPage";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";
import CampaignDonation from "./campaigndonationbox/CampaignDonation";
import DonationTabs from "./donationtabs/DonationTabs";
import "./donationtabs/DonationTabs.css";
import StripeContainer from "./stripe/StripeContainer";

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

  // const renderPage = () => {
  //   if (currentPath === '/' || currentPath === '/donate') {
  //     return <DonationPage onNavigate={navigate} />;
  //   }
  //   if (currentPath.startsWith('/payment/')) {
  //     return <PaymentPage />;
  //   }
  //   return <DonationPage onNavigate={navigate} />;
  // };

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
              <a href="#" onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}>Back</a>
            </div>
          </div>
          <StripeContainer />
        </div>
        <DonationTabs campaignName="yourCampaign"  slug="campaign2023" goalAmount="700000" />
      </div>
    </div>
  );
}

export default App;
