import React, { useState, useEffect } from "react";
import "./SubscriptionForm.css";

const SubscriptionForm = ({ onPaymentSuccess }) => {
  // Initial form state with empty address fields
  const initialAddressFields = {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };

  const [formData, setFormData] = useState({
    // Fields that can be pre-filled from URL
    campaignName: "",
    firstName: "",
    lastName: "",
    email: "",
    amount: "",
    type: "recurring", // Add type to state
    user_id: "", // Add user_id to state
    redirectUrl: "", // Add redirectUrl to state
    // Address fields - always empty initially for manual entry
    address: initialAddressFields,
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Initialize Stripe
    if (window.Stripe && process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
      window.Stripe.setPublishableKey(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    }

    try {
      // Get encoded data from URL path
      const pathSegments = window.location.pathname.split('/');
      const encodedData = pathSegments[pathSegments.length - 1];
      
      if (encodedData && encodedData !== '') {
        // Simple base64 decode
        const decodedString = atob(encodedData);
        console.log('Decoded string:', decodedString);
        const decodedData = JSON.parse(decodedString);
        console.log('Parsed data:', decodedData);
        
        setFormData(prevData => ({
          ...prevData,
          campaignName: decodedData.campaign || "",
          amount: decodedData.amount || "",
          type: decodedData.type || "recurring",
          firstName: decodedData.customerName?.split(' ')[0] || "", // Get first name from full name
          lastName: decodedData.customerName?.split(' ')[1] || "", // Get last name from full name
          email: decodedData.customerEmail || "",
          user_id: decodedData.user_id || "", // Get user_id from URL
          redirectUrl: decodedData.redirectUrl || "", // Store redirectUrl
          address: initialAddressFields
        }));
      }
    } catch (error) {
      console.error("Error decoding URL parameters:", error);
    }
  }, []);

  useEffect(() => {
    // Handle redirect after successful payment
    if (success && formData.redirectUrl) {
      setTimeout(() => {
        window.location.href = formData.redirectUrl;
      }, 3000); // 3 seconds delay
    }
  }, [success, formData.redirectUrl]);

  const handleAmountChange = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type === 'once' ? 'one-time' : 'recurring'
    }));
  };

  // Generate encoded URL
  const generateEncodedURL = (data) => {
    const baseUrl = 'https://4f77-122-173-31-58.ngrok-free.app';
    
    const dataToEncode = {
      campaign: data.campaignName,
      amount: data.amount,
      type: data.type,
      customerName: `${data.firstName} ${data.lastName}`.trim(),
      customerEmail: data.email
    };

    // Simple base64 encode
    const jsonString = JSON.stringify(dataToEncode);
    const encodedData = btoa(jsonString);
    
    return `${baseUrl}/${encodedData}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add utility functions for encoding/decoding
  const encodeFormData = (data) => {
    const encoded = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        encoded[key] = encodeFormData(value);
      } else {
        encoded[key] = encodeURIComponent(value);
      }
    }
    return encoded;
  };

  const decodeFormData = (data) => {
    const decoded = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        decoded[key] = decodeFormData(value);
      } else {
        decoded[key] = decodeURIComponent(value);
      }
    }
    return decoded;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!window.Stripe) {
      setError("Stripe.js failed to load.");
      setLoading(false);
      return;
    }

    const cardData = {
      number: document.getElementById("cardNumber").value,
      exp_month: document.getElementById("expiryMonth").value,
      exp_year: document.getElementById("expiryYear").value,
      cvc: document.getElementById("cvv").value,
      name: `${formData.firstName} ${formData.lastName}`,
      address_line1: formData.address.line1,
      address_line2: formData.address.line2,
      address_city: formData.address.city,
      address_state: formData.address.state,
      address_zip: formData.address.postalCode,
      address_country: formData.address.country,
    };

    window.Stripe.card.createToken(cardData, async (status, response) => {
      if (response.error) {
        setError(response.error.message);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: formData.type,
            payment_method: "pm_card_visa",
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            amount: formData.amount,
            campaignName: formData.campaignName,
            currency: "usd",
            user_id: formData.user_id,
            address_line1: formData.address.line1,
            address_line2: formData.address.line2,
            city: formData.address.city,
            state: formData.address.state,
            postal_code: formData.address.postalCode,
            country: formData.address.country,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Subscription failed.");
        }

        setSuccess(true);
        onPaymentSuccess(); // Call the success callback

        setFormData({
          campaignName: "",
          amount: "",
          type: "recurring",
          firstName: "",
          lastName: "",
          email: "",
          user_id: "",
          redirectUrl: "",
          address: initialAddressFields,
          cvv: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
  };

  if (success) {
    return (
      <div className="subscription-form-container">
        <div className="success-msg-container">
          <h3>Thank you!</h3>
          <p>Your subscription has been processed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-form-container">
      <div className="total-price-badge">
        <h3>Total Price:</h3>
        <span>${formData.amount}</span>
      </div>
      
      <form className="subscription-form" onSubmit={handleSubmit}>
        <div className="payment-fields">
          <h3 className="section-title">Card Details</h3>

          <div className="form-group">
            <label className="form-label" htmlFor="cardNumber">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              name="cardNumber"
              className="form-input"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="expiryMonth">
                Expiry Month
              </label>
              <input
                id="expiryMonth"
                type="text"
                name="expiryMonth"
                className="form-input"
                placeholder="MM"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expiryYear">
                Expiry Year
              </label>
              <input
                id="expiryYear"
                type="text"
                name="expiryYear"
                className="form-input"
                placeholder="YYYY"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cvv">
              CVV
            </label>
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

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Processing...
            </>
          ) : (
            "Subscribe Now"
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
