import React from 'react';
import './DonationTabs.css';
import BASE_URL from '../BaseUrl';

const DonationTabs = () => {
  return (
    <>
    <div className="campaign-right-sidebar-main">
      <div className="camapign-right-tabs-main" role="tablist">
        <a className="campaign-right-tabs w-button w--current" href="#once-tab">
          <div>Once</div>
        </a>
        <a className="campaign-right-tabs w-button" href="#monthly-tab">
          <div>Monthly</div>
        </a>
      </div>

      <div className="w-tab-content">
        {/* Tab 1: Once */}
        <div className="campaign-right-tab-content w-tab-pane w--tab-active" id="once-tab">
          <h4 className="campaign-right-donate">Donate</h4>
          <h2 className="campaign-right-tab-price">$1500</h2>
          <h3 className="campaign-right-meal-text">10 Meals</h3>

          <div className="campaign-right-btn-flex">
            <a href="#" className="campaign-right-price-btn active-btn w-button">$1500</a>
            <a href="#" className="campaign-right-price-btn w-button">$1800</a>
            <a href="#" className="campaign-right-price-btn w-button">$1900</a>
            <a href="#" className="campaign-right-price-btn w-button">$1500</a>
            <a href="#" className="campaign-right-price-btn w-button">$1800</a>
            <a href="#" className="campaign-right-price-btn w-button">$1900</a>
          </div>

          <form method="get" action="/stripe-checkout">
            <input
              className="campaign-right-input w-input"
              placeholder="Enter Your Amount"
              type="number"
              required
            />
           <label class="w-checkbox checkbox-field">
                <input type="checkbox" name="checkbox" id="checkbox" data-name="Checkbox" />
                <span class="campaign-right-checkbox-text w-form-label" for="checkbox">Yes, I want to see how I’m helping to provide food for children, families and communities in need. Send me occasional updates.</span>
            </label>
            <div className="campaign-detail-donate-btn">
              <input type="submit" className="campaign-right-donate-btn w-button" value="Donate" />
            </div>
          </form>
        </div>

        {/* Tab 2: Monthly */}
        <div className="campaign-right-tab-content w-tab-pane" id="monthly-tab">
          <h4 className="campaign-right-donate">Donate</h4>
          <h2 className="campaign-right-tab-price">$1500</h2>
          <h3 className="campaign-right-meal-text">10 Meals</h3>

          <div className="campaign-right-btn-flex">
            <a href="#" className="campaign-right-price-btn active-btn w-button">$1500</a>
            <a href="#" className="campaign-right-price-btn w-button">$1800</a>
            <a href="#" className="campaign-right-price-btn w-button">$1900</a>
            <a href="#" className="campaign-right-price-btn w-button">$1500</a>
            <a href="#" className="campaign-right-price-btn w-button">$1800</a>
            <a href="#" className="campaign-right-price-btn w-button">$1900</a>
          </div>

          <form method="get" action="/stripe-checkout">
            <input
              className="campaign-right-input w-input"
              placeholder="Enter Your Amount"
              type="number"
              required
            />
            <label className="w-checkbox checkbox-field">
              <input type="checkbox" className="w-checkbox-input" />
              <span className="campaign-right-checkbox-text w-form-label">
                Yes, I want to see how I’m helping to provide food for children, families and communities in need. Send me occasional updates.
              </span>
            </label>
            <div className="campaign-detail-donate-btn">
              <input type="submit" className="campaign-right-donate-btn w-button" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <div class="pr-100 pr-0-mob">
        <div class="skill-header-2 tablerow2 mt-0 mb-18">
            <div class="text_imgbox">
            <img loading="lazy" src={`${BASE_URL}images/raised.svg`} class="image-8" />
            <h4 class="tablerow2_text">Raised</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$120,000</h4>
        </div>
        <div class="customborder customborder2 border_b_0">
            <div class="inner_border inner_border2"></div>
        </div>
        <div class="skill-header-2 tablerow2 my-18">
            <div class="text_imgbox">
            <img loading="lazy" src={`${BASE_URL}images/goal.svg`} class="image-8" />
            <h4 class="tablerow2_text">Goal</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$200,000</h4>
        </div>
        <div class="customborder customborder2 border_b_0">
            <div class="inner_border inner_border2"></div>
        </div>
        <div class="skill-header-2 tablerow2 mt-18 mb-0">
            <div class="text_imgbox">
            <img loading="lazy" src={`${BASE_URL}images/donation.svg`} class="image-8" />
            <h4 class="tablerow2_text">Donations</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">70%</h4>
        </div>
    </div>

    <div className="donation-receive-list">
        <div class="skill-header-2 tablerow2">
            <div class="text_imgbox">
            <img
  loading="lazy"
  src={`${BASE_URL}images/tick.svg`}
  className="image-8"
/>
                <h4 class="tablerow2_text">John Doe Lorem</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$15000</h4>
        </div>
        <div class="customborder customborder2 border_b_0">
            <div class="inner_border inner_border2"></div>
        </div>
        <div class="skill-header-2 tablerow2">
            <div class="text_imgbox">
            <img
  loading="lazy"
  src={`${BASE_URL}images/tick.svg`}
  className="image-8"
/>
                <h4 class="tablerow2_text">John Doe Lorem</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$15000</h4>
        </div>
        <div class="customborder customborder2 border_b_0">
            <div class="inner_border inner_border2"></div>
        </div>
        <div class="skill-header-2 tablerow2">
            <div class="text_imgbox">
            <img
  loading="lazy"
  src={`${BASE_URL}images/tick.svg`}
  className="image-8"
/>
                <h4 class="tablerow2_text">John Doe Lorem</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$15000</h4>
        </div>
        <div class="customborder customborder2 border_b_0">
            <div class="inner_border inner_border2"></div>
        </div>
        <div class="skill-header-2 tablerow2">
            <div class="text_imgbox">
            <img
  loading="lazy"
  src={`${BASE_URL}images/tick.svg`}
  className="image-8"
/>
                <h4 class="tablerow2_text">John Doe Lorem</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$15000</h4>
        </div>
        <div class="customborder customborder2 border_b_0">
            <div class="inner_border inner_border2"></div>
        </div>
        <div class="skill-header-2 tablerow2">
            <div class="text_imgbox">
                <img loading="lazy"
  src={`${BASE_URL}images/tick.svg`}
  className="image-8"
/>
                <h4 class="tablerow2_text">John Doe Lorem</h4>
            </div>
            <h4 class="card-text tablerow2_righttext">$15000</h4>
        </div>
    </div>
    </>

    
  );
};

export default DonationTabs;
