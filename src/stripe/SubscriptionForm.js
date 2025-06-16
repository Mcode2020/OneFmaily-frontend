import React, { useState, useEffect } from "react";
import "./SubscriptionForm.css";

// Add ErrorPopup component
const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="error-popup-overlay">
      <div className="error-popup">
        <div className="error-popup-content">
          <h3>Validation Error</h3>
          <div className="error-messages">
            {message.split('\n').map((error, index) => (
              <p key={index} className="error-message-item">{error}</p>
            ))}
          </div>
          <button onClick={onClose} className="error-popup-close">Close</button>
        </div>
      </div>
    </div>
  );
};

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
  const [expiryYearError, setExpiryYearError] = useState("");
  const [expiryMonthError, setExpiryMonthError] = useState("");

  const [totalAmount, setTotalAmount] = useState("");
  const [decodedUrlData, setDecodedUrlData] = useState({
    campaign: "",
    amount: "",
    type: "one-time",
    firstName: "",
    lastName: "",
    user_id: "",
    redirectUrl: ""
  });

  useEffect(() => {
    // Initialize Stripe
    if (window.Stripe && process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
      window.Stripe.setPublishableKey(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    }

    try {
      // Get encoded data directly from URL (without using URLSearchParams)
      const url = window.location.href;
      console.log('Full URL:', url);
      
      // Extract everything after the ? character
      const encodedData = url.split('?')[1];
      console.log('Raw encoded data from URL:', encodedData);
      
      if (encodedData) {
        // Decode and parse the URL data
        const decodedString = atob(encodedData);
        console.log('Base64 decoded string:', decodedString);
        
        const decodedData = JSON.parse(decodedString);
        console.log('Parsed URL data (decodedData):', decodedData);
        console.log('Amount from URL:', decodedData.amount);
        
        // Store the complete decoded data
        setDecodedUrlData(decodedData);
        
        // Set the amount
        setTotalAmount(decodedData.amount);
        
        // Update form data with URL data
        setFormData(prevData => ({
          ...prevData,
          type: decodedData.type || "one-time",
          amount: decodedData.amount,
          campaignName: decodedData.campaign || "",
          firstName: decodedData.firstName || "",
          lastName: decodedData.lastName || "",
          email: `${decodedData.firstName}.${decodedData.lastName}@example.com`.toLowerCase(),
          user_id: decodedData.user_id || "1",
          redirectUrl: decodedData.redirectUrl || "",
          address: initialAddressFields
        }));
      } else {
        console.log('No encoded data found in URL');
      }
    } catch (error) {
      console.error("Error decoding URL parameters:", error);
      console.error("Full error:", error.message);
      setError("Error processing payment information. Please try again.");
    }
  }, []);

  useEffect(() => {
    // Handle redirect after successful payment
    if (success && formData.redirectUrl) {
      setTimeout(() => {
        window.location.href = formData.redirectUrl;
      }, 6000); // 6 seconds delay
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

  // Add validation functions
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const validateCardNumber = (number) => {
    // Remove spaces and non-digit characters
    const cleanNumber = number.replace(/\s+/g, '');
    
    // Check if it's a valid length (13-19 digits)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    // Luhn algorithm for card validation
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return (sum % 10) === 0;
  };

  const validateCVC = (cvc) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const validateExpiryDate = (month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      e.target.value = value;
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (e.target.id === 'expiryMonth') {
      if (value.length <= 2) {
        const month = parseInt(value);
        if (value.length < 2) {
          // Allow partial input while typing
          e.target.value = value;
          setExpiryMonthError("");
        } else if (month >= 1 && month <= 12) {
          e.target.value = value;
          setExpiryMonthError("");
        } else {
          setExpiryMonthError("Month must be between 01 and 12");
        }
      }
    } else if (e.target.id === 'expiryYear') {
      const currentYear = new Date().getFullYear();
      const maxYear = currentYear + 20; // Allow up to 20 years in the future
      
      if (value.length <= 4) {
        const year = parseInt(value);
        if (year >= currentYear && year <= maxYear) {
          e.target.value = value;
          setExpiryYearError("");
        } else if (value.length < 4) {
          // Allow partial input while typing
          e.target.value = value;
          setExpiryYearError("");
        } else {
          // Show error for invalid year
          if (year < currentYear) {
            setExpiryYearError("Expiry year cannot be in the past");
          } else if (year > maxYear) {
            setExpiryYearError("Expiry year cannot be more than 20 years in the future");
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate card number
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, '');
    if (!validateCardNumber(cardNumber)) {
      setError("Please enter a valid card number");
      setLoading(false);
      return;
    }

    // Validate CVC
    const cvc = document.getElementById("cvv").value;
    if (!validateCVC(cvc)) {
      setError("Please enter a valid CVC (3-4 digits)");
      setLoading(false);
      return;
    }

    // Validate expiry date
    const month = document.getElementById("expiryMonth").value;
    const year = document.getElementById("expiryYear").value;
    if (!validateExpiryDate(month, year)) {
      setError("Please enter a valid expiry date");
      setLoading(false);
      return;
    }

    if (!window.Stripe) {
      setError("Stripe.js failed to load.");
      setLoading(false);
      return;
    }

    try {
      console.log('Form submission - Current form data:', formData);
      console.log('Form submission - Current decoded URL data:', decodedUrlData);
      console.log('Form submission - Total amount:', totalAmount);

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
          // Log data before constructing payload
          console.log('Before payload construction:');
          console.log('- decodedUrlData:', decodedUrlData);
          console.log('- formData:', formData);
          console.log('- totalAmount:', totalAmount);

          // Construct the payload using URL data
          const payload = {
            type: decodedUrlData.type || "one-time",
            amount: parseInt(decodedUrlData.amount || formData.amount || totalAmount),
            currency: "usd",
            payment_method: "pm_card_visa",
            customerEmail: formData.email,
            customerName: `${decodedUrlData.firstName} ${decodedUrlData.lastName}`,
            campaignName: decodedUrlData.campaign || formData.campaignName,
            user_id: decodedUrlData.user_id || "1",
            // Address details from form
            address_line1: formData.address.line1 || "",
            address_line2: formData.address.line2 || "",
            city: formData.address.city || "",
            state: formData.address.state || "",
            postal_code: formData.address.postalCode || "",
            country: formData.address.country || ""
          };

          console.log('Final payload being sent:', payload);

          const res = await fetch("https://donate.onefamilee.org/api/create-subscription", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          console.log('Success response:', data);
          setSuccess(true);
          if (onPaymentSuccess) {
            onPaymentSuccess(data);
          }
        } catch (error) {
          console.error("Payment processing error:", error);
          setError("Failed to process payment. Please try again.");
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="subscription-form-container">
        <div className="success-message-container" style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div className="form-title" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#48bb78',
            marginBottom: '1rem'
          }}>
            Thank you!
          </div>
          <p style={{ 
            textAlign: 'center', 
            color: '#2d3748',
            fontSize: '16px',
            marginBottom: '1rem'
          }}>
            Your subscription has been processed successfully.
          </p>
          <p style={{
            color: '#718096',
            fontSize: '14px'
          }}>
            Redirecting you in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-form-container">
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      
      <div className="total-price-section">
        <div className="total-price-card">
          <h2 className="total-price-title">Total Price:</h2>
          <span className="total-price-amount">${totalAmount}</span>
        </div>
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
              maxLength="19"
              onChange={handleCardNumberChange}
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
                className={`form-input ${expiryMonthError ? 'input-error' : ''}`}
                placeholder="MM"
                maxLength="2"
                onChange={handleExpiryChange}
                required
              />
              {expiryMonthError && (
                <div className="error-message">{expiryMonthError}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expiryYear">
                Expiry Year
              </label>
              <input
                id="expiryYear"
                type="text"
                name="expiryYear"
                className={`form-input ${expiryYearError ? 'input-error' : ''}`}
                placeholder="YYYY"
                maxLength="4"
                onChange={handleExpiryChange}
                required
              />
              {expiryYearError && (
                <div className="error-message">{expiryYearError}</div>
              )}
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
              maxLength="4"
              onChange={handleCVCChange}
              required
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
