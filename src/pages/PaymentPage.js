import React, { useState, useEffect } from "react";
import StripeContainer from "../stripe/StripeContainer";

function PaymentPage() {
  const [paymentSummary, setPaymentSummary] = useState({
    totalAmount: 0,
    totalPayments: 0,
    goals: 80 // Default value if not in URL
  });

  const [redirectUrl, setRedirectUrl] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Get goals and redirectUrl from URL if present
    try {
      const pathSegments = window.location.pathname.split('/');
      const encodedData = pathSegments[pathSegments.length - 1];
      
      if (encodedData && encodedData !== '') {
        const decodedString = atob(encodedData);
        const decodedData = JSON.parse(decodedString);
        if (decodedData.goals) {
          setPaymentSummary(prev => ({
            ...prev,
            goals: parseFloat(decodedData.goals)
          }));
        }
        if (decodedData.redirectUrl) {
          setRedirectUrl(decodedData.redirectUrl);
        }
      }
    } catch (error) {
      console.error("Error decoding URL parameters:", error);
    }

    const fetchPaymentSummary = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/payment-summary');
        const data = await response.json();
        setPaymentSummary(prev => ({
          ...prev,
          totalAmount: parseFloat(data.totalAmount) || 0,
          totalPayments: data.totalPayments || 0
        }));
      } catch (error) {
        console.error('Error fetching payment summary:', error);
      }
    };

    fetchPaymentSummary();
  }, []);

  // Handle redirect after successful payment
  useEffect(() => {
    if (paymentSuccess && redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
    }
  }, [paymentSuccess, redirectUrl]);

  return (
    <div className="container-1330">        
      <div className="header-logo">
        <img src="/images/logo.svg" alt="Logo" />
      </div>
      <div className="main-wrapper">
        <div className="campaign-info">
          <h2>We are committed to environmental conservation.</h2>
          <p>Shared meals will provide emergency food assistance to families in Palestine</p>
          <div className="supportersstatusbox desk-show">
            <div className="supportersbox">
              <img loading="lazy" src="/images/supporters-icon.svg" alt="supporters-icon" />
              <h5 className="heading-2">{paymentSummary.totalPayments.toLocaleString()}&nbsp;supporters</h5>
            </div>
            <div className="prograssbar">
              <div className="skill">
                <div className="progres-bar-2 card-bar">
                  <progress value={paymentSummary.totalAmount} max={paymentSummary.goals}></progress>
                </div>
              </div>
            </div>
            <div className="goalsraisedmoney">
              <div className="w-row">
                <div className="w-col w-col-6">
                  <h4 className="heading-11 goalsraisedmoneytitle">Goals</h4>
                  <div className="campaign-goal-flex">
                    <h4 className="heading-9">$</h4>
                    <h4 className="heading-9">{paymentSummary.goals.toLocaleString()}</h4>
                  </div>
                </div>
                <div className="w-col w-col-6">
                  <h4 className="heading-11 goalsraisedmoneytitle righttext">Raised Money</h4>
                  <div className="campaign-goal-flex raised-flex-campaign">
                    <h4 className="heading-9 righttext">$</h4>
                    <h4 className="heading-9 righttext">{paymentSummary.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="back-btn">
            <a href="/donate">Back</a>
          </div>
        </div>
        <StripeContainer onPaymentSuccess={() => setPaymentSuccess(true)} />
      </div>
    </div>
  );
}

export default PaymentPage; 