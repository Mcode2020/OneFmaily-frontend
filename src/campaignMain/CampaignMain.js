import React, { useState, useEffect } from 'react'
import "./Campagin.css";
import BASE_URL from '../BaseUrl';

const CampaignMain= ({ currentcampaignslug, currentgoalamount }) => {
     const [paymentData, setPaymentData] = useState({
        supporters: 0,
        raisedAmount: 0,
        percentage: '0'
      });
    console.log(currentcampaignslug, currentgoalamount,'currentcampaignslug, currentgoalamount');
      useEffect(() => {
        const fetchPaymentData = async () => {
          try {
            if (!currentcampaignslug) {
              console.error('Campaign slug is required');
              return;
            }
            const response = await fetch(`https://donate.onefamilee.org/api/payments/${currentcampaignslug}/${currentgoalamount}`);
            const data = await response.json();
            setPaymentData({
              supporters: data.totalPayments,
              raisedAmount: parseFloat(data.totalAmount || '0') || 0,
              percentage: data.percentage || '0'
            });
          } catch (error) {
            console.error('Error fetching payment data:', error);
          }
        };
    
        fetchPaymentData();
      }, [currentcampaignslug, currentgoalamount]);
  return (
    <div className="camp-supporter">
        <div className="supportersbox">
            <img loading="lazy" src={`${BASE_URL}images/supporters-icon.svg`} alt="supporters-icon" className="campaign-supp-icon" />
            <h5 className="heading-2">{paymentData.supporters}&nbsp;supporters</h5>
        </div>
        <div className="prograssbar">
            <div className="skill">
                <div className="progres-bar-2 card-bar">
                <progress value={paymentData.percentage} max="100"></progress>
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
                        {currentgoalamount ? currentgoalamount.toLocaleString() : '0'}
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
    </div>  )
}

export default CampaignMain