import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./SubscriptionForm.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',              // changed from 16px to 14px as per your request
      color: '#000',                 // text color
      backgroundColor: '#f2f4f7',   // background color of input
      border: '1px solid #f2f4f7',  // border styling
      borderRadius: '8px',           // rounded corners
      padding: '8px 12px',           // padding inside the input
      height: '30px',                // height of the input
      transition: 'all 0.2s ease',  // smooth transition on focus, hover, etc.

      '::placeholder': {
        color: '#aab7c4',            // placeholder text color
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};


const SubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({
    campaignName: "",
    firstName: "",
    lastName: "",
    email: "",
    amount: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe.js hasn't loaded yet. Please try again later.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: {
            line1: formData.address.line1,
            line2: formData.address.line2,
            city: formData.address.city,
            state: formData.address.state,
            postal_code: formData.address.postalCode,
            country: formData.address.country,
          },
        },
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setLoading(false);
        return;
      }

      // Call your backend to create a subscription
      const response = await fetch("http://localhost:4242/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: paymentMethod.id,
          email: formData.email,
          amount: parseFloat(formData.amount),
          campaign_name: formData.campaignName,
          customer_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred while processing your subscription.");
      }

      const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret);
      
      if (confirmError) {
        throw new Error(confirmError.message);
      }

      setSuccess(true);
      cardElement.clear();
      setFormData({
        campaignName: "",
        firstName: "",
        lastName: "",
        email: "",
        amount: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="subscription-form-container">
        <div className="form-title">Thank you!</div>
        <p style={{ textAlign: 'center', color: '#48bb78' }}>
          Your subscription has been processed successfully.
        </p>
        <button 
          className="submit-button"
          onClick={() => setSuccess(false)}
          style={{ marginTop: '1rem' }}
        >
          Subscribe Again
        </button>
      </div>
    );
  }

  return (
 
    <div className="subscription-form-container">
        <div className="total-price-badge">
          <h3>Total Price:</h3>
          <span>$1500</span>
      </div>
      <form className="subscription-form" onSubmit={handleSubmit}>
        <div className="payment-fields">
          <h3 className="section-title">Card Details</h3>

          <div className="form-group">
            <label className="form-label" htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              name="cardNumber" 
              className="form-input"
              placeholder="1234 5678 9012 3456"
              required
              value=""
              // onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="expiryMonth">Expiry Month</label>
              <input
                id="expiryMonth"
                type="text"
                name="expiryMonth"
                className="form-input"
                placeholder="MM"
                required
                value= ""
                // onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expiryYear">Expiry Year</label>
              <input
                id="expiryYear"
                type="text"
                name="expiryYear"
                className="form-input"
                placeholder="YYYY"
                required
                value=""
                // onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="text"
              name="cvv"
              className="form-input"
              placeholder="123"
              required
              value={formData.cvv}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="address-section">
          <h3 className="section-title">Billing Address</h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="address.line1">
              Address Line 1
            </label>
            <input
              id="address.line1"
              name="address.line1"
              type="text"
              className="form-input"
              placeholder="Street address"
              required
              value={formData.address.line1}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address.line2">
              Address Line 2
            </label>
            <input
              id="address.line2"
              name="address.line2"
              type="text"
              className="form-input"
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.address.line2}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="address.city">
                City
              </label>
              <input
                id="address.city"
                name="address.city"
                type="text"
                className="form-input"
                placeholder="City"
                required
                value={formData.address.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address.state">
                State
              </label>
              <input
                id="address.state"
                name="address.state"
                type="text"
                className="form-input"
                placeholder="State"
                required
                value={formData.address.state}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="address.postalCode">
                Postal Code
              </label>
              <input
                id="address.postalCode"
                name="address.postalCode"
                type="text"
                className="form-input"
                placeholder="Postal code"
                required
                value={formData.address.postalCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label" htmlFor="address.country">
                Country
              </label>
              <input
                id="address.country"
                name="address.country"
                type="text"
                className="form-input"
                placeholder="Country"
                required
                value={formData.address.country}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button" 
          disabled={!stripe || loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Subscribe Now'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
