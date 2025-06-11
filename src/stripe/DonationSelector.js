class DonationSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Initialize state
    this._state = {
      selectedAmount: 1500,
      donationType: 'once',
      customAmount: '',
      receiveUpdates: false
    };

    this.predefinedAmounts = [
      { value: 1500, meals: 10 },
      { value: 1800, meals: 12 },
      { value: 2100, meals: 14 },
      { value: 2400, meals: 16 },
      { value: 2700, meals: 18 },
      { value: 3000, meals: 20 }
    ];

    // Initial render
    this.render();
    this.setupEventListeners();
  }

  // Observed attributes for external control
  static get observedAttributes() {
    return ['amount', 'type'];
  }

  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'amount':
          this._state.selectedAmount = parseInt(newValue, 10) || 1500;
          break;
        case 'type':
          this._state.donationType = newValue || 'once';
          break;
      }
      this.render();
    }
  }

  // Utility functions
  calculateMeals(amount) {
    return Math.floor(amount / 150);
  }

  // Event handlers
  handleAmountClick(amount) {
    this._state.selectedAmount = amount;
    this._state.customAmount = '';
    this.dispatchEvent(new CustomEvent('amountChange', {
      detail: { amount },
      bubbles: true,
      composed: true
    }));
    this.render();
  }

  handleCustomAmountChange(value) {
    this._state.customAmount = value;
    if (value) {
      const numValue = parseInt(value, 10);
      this._state.selectedAmount = numValue;
      this.dispatchEvent(new CustomEvent('amountChange', {
        detail: { amount: numValue },
        bubbles: true,
        composed: true
      }));
    }
    this.render();
  }

  handleTypeChange(type) {
    this._state.donationType = type;
    this.dispatchEvent(new CustomEvent('typeChange', {
      detail: { type },
      bubbles: true,
      composed: true
    }));
    this.render();
  }

  handleSpinnerClick(direction) {
    const currentValue = this._state.customAmount ? parseInt(this._state.customAmount, 10) : 0;
    const newValue = direction === 'up' ? currentValue + 100 : Math.max(0, currentValue - 100);
    this._state.customAmount = newValue.toString();
    this._state.selectedAmount = newValue;
    this.dispatchEvent(new CustomEvent('amountChange', {
      detail: { amount: newValue },
      bubbles: true,
      composed: true
    }));
    this.render();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target;
      
      if (target.classList.contains('amount-button')) {
        const amount = parseInt(target.dataset.amount, 10);
        this.handleAmountClick(amount);
      } else if (target.classList.contains('tab')) {
        const type = target.dataset.type;
        this.handleTypeChange(type);
      } else if (target.classList.contains('spinner-button')) {
        const direction = target.dataset.direction;
        this.handleSpinnerClick(direction);
      }
    });

    this.shadowRoot.addEventListener('input', (e) => {
      const target = e.target;
      
      if (target.classList.contains('custom-amount-input')) {
        this.handleCustomAmountChange(target.value);
      } else if (target.classList.contains('checkbox')) {
        this._state.receiveUpdates = target.checked;
        this.render();
      }
    });
  }

  // Render method
  render() {
    const styles = `
      .donation-selector {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        font-family: system-ui, -apple-system, sans-serif;
      }

      .donation-type-tabs {
        display: flex;
        margin: 0 -20px 30px;
      }

      .tab {
        flex: 1;
        padding: 15px;
        background: none;
        border: none;
        font-size: 18px;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        position: relative;
      }

      .tab.active {
        color: #6B46C1;
      }

      .tab.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #6B46C1;
      }

      .donation-content {
        text-align: center;
      }

      h2 {
        font-size: 24px;
        color: #1A1A1A;
        margin-bottom: 20px;
      }

      .amount-display {
        margin: 20px 0;
      }

      .currency {
        font-size: 48px;
        color: #6B46C1;
        font-weight: bold;
        display: inline-block;
        vertical-align: top;
        margin-right: 5px;
      }

      .amount {
        font-size: 48px;
        color: #6B46C1;
        font-weight: bold;
      }

      .meals-text {
        color: #666;
        font-size: 18px;
        margin: 10px 0 30px;
      }

      .amount-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 15px;
      }

      .amount-button {
        padding: 12px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        background: white;
        font-size: 18px;
        color: #1A1A1A;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .amount-button:hover {
        border-color: #6B46C1;
        color: #6B46C1;
      }

      .amount-button.selected {
        background: #6B46C1;
        border-color: #6B46C1;
        color: white;
      }

      .custom-amount {
        margin: 20px 0;
        position: relative;
      }

      .custom-amount-input {
        width: 100%;
        padding: 12px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        font-size: 16px;
        text-align: center;
        appearance: none;
        -moz-appearance: textfield;
      }

      .custom-amount-input::-webkit-inner-spin-button,
      .custom-amount-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .custom-amount-input:focus {
        outline: none;
        border-color: #6B46C1;
      }

      .spinner-buttons {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .spinner-button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: #666;
        font-size: 12px;
        line-height: 1;
      }

      .spinner-button:hover {
        color: #6B46C1;
      }

      .updates-checkbox {
        margin-top: 30px;
        text-align: left;
      }

      .updates-checkbox label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        color: #666;
        font-size: 14px;
        line-height: 1.4;
      }

      .checkbox {
        margin-top: 3px;
        width: 18px;
        height: 18px;
        accent-color: #6B46C1;
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="donation-selector">
        <div class="donation-type-tabs">
          <button
            class="tab ${this._state.donationType === 'once' ? 'active' : ''}"
            data-type="once"
          >
            Once
          </button>
          <button
            class="tab ${this._state.donationType === 'monthly' ? 'active' : ''}"
            data-type="monthly"
          >
            Monthly
          </button>
        </div>

        <div class="donation-content">
          <h2>Donate</h2>
          <div class="amount-display">
            <span class="currency">$</span>
            <span class="amount">${this._state.selectedAmount}</span>
          </div>
          <div class="meals-text">
            ${this.calculateMeals(this._state.selectedAmount)} Meals
          </div>

          <div class="amount-grid">
            ${this.predefinedAmounts.map(amount => `
              <button
                class="amount-button ${this._state.selectedAmount === amount.value ? 'selected' : ''}"
                data-amount="${amount.value}"
              >
                $${amount.value}
              </button>
            `).join('')}
          </div>

          <div class="custom-amount">
            <input
              type="number"
              class="custom-amount-input"
              placeholder="2"
              value="${this._state.customAmount}"
            />
            <div class="spinner-buttons">
              <button class="spinner-button" data-direction="up">▲</button>
              <button class="spinner-button" data-direction="down">▼</button>
            </div>
          </div>

          <div class="updates-checkbox">
            <label>
              <input
                type="checkbox"
                class="checkbox"
                ${this._state.receiveUpdates ? 'checked' : ''}
              />
              Yes, I want to see how I'm helping to provide food for children, families and communities in need. Send me occasional updates.
            </label>
          </div>
        </div>
      </div>
    `;
  }
}

// Register the custom element
if (!customElements.get('donation-selector')) {
  customElements.define('donation-selector', DonationSelector);
}

export default DonationSelector; 