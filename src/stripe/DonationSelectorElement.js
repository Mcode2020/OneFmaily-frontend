import React from 'react';
import ReactDOM from 'react-dom/client';
import DonationSelector from './DonationSelector';

class DonationSelectorElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Create a container for React
    const container = document.createElement('div');
    this.shadowRoot.appendChild(container);
    
    // Create React root
    this.root = ReactDOM.createRoot(container);
    
    // Render the React component
    this.render();
  }

  static get observedAttributes() {
    return ['amount', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  handleAmountChange = (amount) => {
    this.dispatchEvent(new CustomEvent('amountChange', {
      detail: { amount },
      bubbles: true,
      composed: true
    }));
  };

  handleTypeChange = (type) => {
    this.dispatchEvent(new CustomEvent('typeChange', {
      detail: { type },
      bubbles: true,
      composed: true
    }));
  };

  render() {
    const amount = parseInt(this.getAttribute('amount'), 10) || 1500;
    const type = this.getAttribute('type') || 'once';

    this.root.render(
      <DonationSelector
        onAmountChange={this.handleAmountChange}
        onTypeChange={this.handleTypeChange}
        initialAmount={amount}
        initialType={type}
      />
    );
  }

  disconnectedCallback() {
    // Clean up React root when element is removed
    this.root.unmount();
  }
}

// Register the custom element
if (!customElements.get('donation-selector')) {
  customElements.define('donation-selector', DonationSelectorElement);
}

export default DonationSelectorElement; 