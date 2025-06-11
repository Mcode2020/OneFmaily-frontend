import React from "react";
import SubscriptionForm from "./SubscriptionForm";

const StripeContainer = ({ onPaymentSuccess }) => {
  return (
    <SubscriptionForm onPaymentSuccess={onPaymentSuccess} />
  );
};

export default StripeContainer;
