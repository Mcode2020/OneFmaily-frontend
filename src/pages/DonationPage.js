import React from 'react';
import DonationSelectorReact from '../stripe/DonationSelectorReact';
import './DonationPage.css';

const DonationPage = ({ onNavigate }) => {
  const handleAmountChange = (e) => {
    console.log('Amount changed:', e.detail.amount);
    // Add your amount change handling logic here
  };

  const handleTypeChange = (e) => {
    console.log('Type changed:', e.detail.type);
    // Add your type change handling logic here
  };

  const handleDonateClick = () => {
    // Create the data object for encoding
    const dataToEncode = {
      campaign: "donation-campaign",
      amount: 1800,
      type: 'once',
      redirectUrl: "https://mcodeinfosoft.com/home" // Replace with your redirect URL
    };

    // Encode the data
    const encodedData = btoa(JSON.stringify(dataToEncode));

    // Navigate to the payment form
    onNavigate(`/payment/${encodedData}`);
  };

  return (
    <div className="donation-page">
      <div className="donation-page-content">
        <h1>Make a Difference Today</h1>
        <p className="subtitle">Your donation helps provide meals to those in need</p>
        
        <DonationSelectorReact
          initialAmount={1800}
          initialType="once"
          onAmountChange={handleAmountChange}
          onTypeChange={handleTypeChange}
        />

        <button 
          className="donate-button"
          onClick={handleDonateClick}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default DonationPage; 