import React, { useState, useEffect } from 'react'
import StripeContainer from './StripeContainer';
import CampaignDonation from '../campaigndonationbox/CampaignDonation';

const Mainpage = () => {
  const [campaignData, setCampaignData] = useState({
    currentcampaignslug: '',
    currentgoalamount: '',
    amount: '',
    type: '',
    firstName: '',
    lastName: '',
    email: '',
    redirectUrl: '',
    campaignName: '',
    customerEmail: '',
    customerName: ''
  });

  useEffect(() => {
    // Get the base64 data from URL query parameter
    const queryString = window.location.search.substring(1); // Remove the '?' and get the rest
    const base64Data = queryString; // The entire query string is the base64 data
    
    if (base64Data && base64Data.length > 10) { // Basic check to ensure it's not empty or too short
      try {
        // Decode base64 to string
        const decodedString = atob(base64Data);
        // Parse the JSON data
        const decodedData = JSON.parse(decodedString);
        
        setCampaignData({
          currentcampaignslug: decodedData.currentcampaignslug || '',
          currentgoalamount: decodedData.currentgoalamount || '',
          amount: decodedData.amount || '',
          type: decodedData.type || '',
          firstName: decodedData.firstName || '',
          lastName: decodedData.lastName || '',
          email: decodedData.email || '',
          redirectUrl: decodedData.redirectUrl || '',
          campaignName: decodedData.campaignName || '',
          customerEmail: decodedData.customerEmail || '',
          customerName: decodedData.customerName || ''
        });
      } catch (error) {
        console.error('Error decoding URL data:', error);
      }
    }
  }, []);

  return (
    <div className="main-wrapper">
    <div className="campaign-info">
      <h2>We are committed to environmental conservation.</h2>
      <p>Shared meals will provide emergency food assistance to families in Palestine</p>
      <CampaignDonation 
        currentcampaignslug={campaignData.currentcampaignslug} 
        currentgoalamount={campaignData.currentgoalamount} 
      />
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

export default Mainpage