import React, { useEffect, useRef } from 'react';
import './DonationSelector';

const DonationSelectorReact = ({ onAmountChange, onTypeChange, initialAmount, initialType }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    if (element) {
      // Set up event listeners
      if (onAmountChange) {
        element.addEventListener('amountChange', onAmountChange);
      }
      if (onTypeChange) {
        element.addEventListener('typeChange', onTypeChange);
      }

      // Clean up event listeners
      return () => {
        if (onAmountChange) {
          element.removeEventListener('amountChange', onAmountChange);
        }
        if (onTypeChange) {
          element.removeEventListener('typeChange', onTypeChange);
        }
      };
    }
  }, [onAmountChange, onTypeChange]);

  return (
    <donation-selector
      ref={elementRef}
      amount={initialAmount}
      type={initialType}
    />
  );
};

export default DonationSelectorReact; 