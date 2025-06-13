import React, { useState, useEffect } from 'react'
import "./CampaignDonation.css";
import BASE_URL from '../BaseUrl';

const CampaignDonation = () => {
  const [paymentData, setPaymentData] = useState({
    supporters: 0,
    raisedAmount: 0
  });

  const [currentCampaignSlug, setCurrentCampaignSlug] = useState('');
  const [currentGoalAmount, setCurrentGoalAmount] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let campaignSlugFromUrl = urlParams.get('c') || '';
    let goalAmountFromUrl = parseInt(urlParams.get('g') || '700000', 10);

    const encodedData = window.location.search.substring(1); // Get query string without '?'
    if (encodedData && encodedData.length > 100) { // Heuristic: encoded data is usually longer
      try {
        const decodedData = JSON.parse(atob(encodedData));
        if (decodedData.campaign) {
          campaignSlugFromUrl = decodedData.campaign;
        }
        if (decodedData.redirectUrl) {
          const redirectParams = new URLSearchParams(new URL(decodedData.redirectUrl).search);
          const decodedGoal = parseInt(redirectParams.get('g'), 10);
          if (!isNaN(decodedGoal)) {
            goalAmountFromUrl = decodedGoal;
          }
        }
      } catch (error) {
        console.error('Error decoding URL data:', error);
      }
    }

    setCurrentCampaignSlug(campaignSlugFromUrl);
    setCurrentGoalAmount(parseInt(goalAmountFromUrl) || 0); // Ensure goalAmount is always a number

    const fetchPaymentData = async () => {
      try {
        if (!currentCampaignSlug) { // Use state variable
          console.error('Campaign slug is required');
          return;
        }
        const response = await fetch(`https://donate.onefamilee.org/api/payments/${currentCampaignSlug}/${currentGoalAmount}`); // Use state variables
        const data = await response.json();
        setPaymentData({
          supporters: data.totalPayments,
          raisedAmount: parseFloat(data.totalAmount || '0') || 0 // Ensure raisedAmount is always a number
        });
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    fetchPaymentData();
  }, [currentCampaignSlug, currentGoalAmount]);

  const progressPercentage = (paymentData.raisedAmount / currentGoalAmount) * 100;

  return (
    <div className="supportersstatusbox desk-show">
        <div className="supportersbox">
            <img loading="lazy" src={`${BASE_URL}images/supporters-icon.svg`} alt="supporters-icon" />
            <h5 className="heading-2">{paymentData.supporters}&nbsp;supporters</h5>
        </div>
        <div className="prograssbar">
            <div className="skill">
                <div className="progres-bar-2 card-bar">
                <progress value={paymentData.raisedAmount} max={currentGoalAmount}></progress>
                </div>
            </div>
        </div>
        <div className="goalsraisedmoney">
            <div className="w-row">
                <div className="w-col w-col-6">
                    <h4 className="heading-11 goalsraisedmoneytitle">Goals</h4>
                    <div className="campaign-goal-flex">
                        <h4 className="heading-9">$</h4>
                        <h4 className="heading-9">
                          {typeof currentGoalAmount === 'number' && !isNaN(currentGoalAmount)
                            ? currentGoalAmount.toLocaleString()
                            : '0'}
                        </h4>
                    </div>
                </div>
                <div className="w-col w-col-6">
                    <h4 className="heading-11 goalsraisedmoneytitle righttext">Raised Money</h4>
                    <div className="campaign-goal-flex raised-flex-campaign">
                        <h4 className="heading-9 righttext">$</h4>
                        <h4 className="heading-9 righttext">
                          {typeof paymentData.raisedAmount === 'number' && !isNaN(paymentData.raisedAmount)
                            ? paymentData.raisedAmount.toLocaleString()
                            : '0'}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CampaignDonation