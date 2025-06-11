import React from 'react';
import DonationTabs from '../donationtabs/DonationTabs';
import '../donationtabs/DonationTabs.css';

const DonationTabsPage = () => {
  return (
    <div className="container-1330">        
      <div className="header-logo">
        <img src="/images/logo.svg" alt="Logo" />
      </div>
      
        <DonationTabs />
    </div>
  );
};

export default DonationTabsPage; 