import React, { useState, useEffect } from 'react';
import './DonationTabs.css';

const DonationTabs = ({ campaignName = "campaign2023", email, slug, goalAmount }) => {
  const [activeTab, setActiveTab] = useState('once');
  const [selectedPrice, setSelectedPrice] = useState(1500);
  const [customAmount, setCustomAmount] = useState('');
  const [campaignData, setCampaignData] = useState({
    totalAmount: 0,
    goalAmount: 0,
    donations: []
  });
  const [urlGoalAmount, setUrlGoalAmount] = useState(0);
  const [userPayments, setUserPayments] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(campaignName);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let goalAmount = parseInt(urlParams.get('g') || '600000', 10);
    let campaign = campaignName;

    const encodedData = window.location.search.substring(1);
    if (encodedData && encodedData.length > 100) { 
      try {
        const decodedData = JSON.parse(atob(encodedData));
        if (decodedData.campaign) {
          campaign = decodedData.campaign;
        }
        if (decodedData.redirectUrl) {
          const redirectParams = new URLSearchParams(new URL(decodedData.redirectUrl).search);
          const decodedGoal = parseInt(redirectParams.get('g'), 10);
          if (!isNaN(decodedGoal)) {
            goalAmount = decodedGoal;
          }
        }
      } catch (error) {
        console.error('Error decoding URL data:', error);
      }
    } else {
      const campaignFromUrl = urlParams.get('c');
      if (campaignFromUrl) {
        campaign = campaignFromUrl;
      }
    }

    setCurrentCampaign(campaign);
    setUrlGoalAmount(goalAmount);
  }, []); // Empty dependency array since we only want to run this once on mount

  useEffect(() => {
    if (!currentCampaign) return;

    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`https://donate.onefamilee.org/api/payments/${currentCampaign}/${urlGoalAmount}`);
        const data = await response.json();
        setCampaignData(data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    const fetchUserPayments = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('u') || urlParams.get('user_id') || '1';
        const response = await fetch(`https://donate.onefamilee.org/api/user/${email}`);
        const data = await response.json();
        setUserPayments(data.payments || []);
      } catch (error) {
        console.error('Error fetching user payments:', error);
      }
    };

    fetchCampaignData();
    fetchUserPayments();
  }, [currentCampaign, urlGoalAmount]); // Only re-run when these values change

  const handleTabClick = (tab, e) => {
    console.log(tab,"tab")
    e.preventDefault();
    setActiveTab(tab);
  };

  const handlePriceClick = (price, e) => {
    e.preventDefault();
    setSelectedPrice(price);
    setCustomAmount(price.toString());
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedPrice(0);
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    
    if (!customAmount && !selectedPrice) {
      alert('Please enter or select an amount');
      return;
    }

    // Check if email exists
    if (!email) {
      // Redirect to login page if no email found
      window.location.href = '/log-in';
      return;
    }

    const data = {
      campaign: slug,
      amount: customAmount || selectedPrice,
      type: activeTab === 'once' ? 'one-time' : 'recurring',
      firstName: "John",
      lastName: "Doe",
      email: email,
      redirectUrl: window.location.href,
      goalAmount: goalAmount
    };

    const encodedData = btoa(JSON.stringify(data));
    window.location.href = `https://donate.onefamilee.org/?${encodedData}`;
  };

  const onceTabPrices = [
    { value: 1500, display: '$1500' },
    { value: 1800, display: '$1800' },
    { value: 1900, display: '$1900' },
    { value: 2000, display: '$2000' },
    { value: 2200, display: '$2200' },
    { value: 2500, display: '$2500' }
  ];

  const monthlyTabPrices = [
    { value: 2200, display: '$2200' },
    { value: 2400, display: '$2400' },
    { value: 2600, display: '$2600' },
    { value: 2800, display: '$2800' },
    { value: 3000, display: '$3000' },
    { value: 3200, display: '$3200' }
  ];

  return (
    <>
    <div className="campaign-right-sidebar-main">
      <div className="camapign-right-tabs-main" role="tablist">
        <a 
          className={`campaign-right-tabs w-button ${activeTab === 'once' ? 'w--current' : ''}`} 
          href="javascript:void(0)"
          onClick={(e) => handleTabClick('once', e)}
        >
          <div>Once</div>
        </a>
        <a 
          className={`campaign-right-tabs w-button ${activeTab === 'monthly' ? 'w--current' : ''}`} 
          href="javascript:void(0)"
          onClick={(e) => handleTabClick('monthly', e)}
        >
          <div>Monthly</div>
        </a>
      </div>

      <div className="w-tab-content">
        {/* Tab 1: Once */}
        <div className={`campaign-right-tab-content w-tab-pane ${activeTab === 'once' ? 'w--tab-active' : ''}`} id="once-tab">
          <h4 className="campaign-right-donate">Donate</h4>
          <h2 className="campaign-right-tab-price">${customAmount || selectedPrice}</h2>

          <div className="campaign-right-btn-flex">
            {onceTabPrices.map((price) => (
              <a 
                key={price.value}
                href="#" 
                className={`campaign-right-price-btn ${selectedPrice === price.value ? 'active-btn' : ''} w-button`}
                onClick={(e) => handlePriceClick(price.value, e)}
              >
                {price.display}
              </a>
            ))}
          </div>

          <form onSubmit={handleDonateSubmit}>
            <input
              className="campaign-right-input w-input"
              placeholder="Enter Your Amount"
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
            <label className="w-checkbox checkbox-field">
              <input type="checkbox" name="checkbox" id="checkbox" data-name="Checkbox" />
              <span className="campaign-right-checkbox-text w-form-label">
                Yes, I want to see how I'm helping to provide food for children, families and communities in need. Send me occasional updates.
              </span>
            </label>
            <div className="campaign-detail-donate-btn">
              <input type="submit" className="campaign-right-donate-btn w-button" value="Donate" />
            </div>
          </form>
        </div>

        {/* Tab 2: Monthly */}
        <div className={`campaign-right-tab-content w-tab-pane ${activeTab === 'monthly' ? 'w--tab-active' : ''}`} id="monthly-tab">
          <h4 className="campaign-right-donate">Donate</h4>
          <h2 className="campaign-right-tab-price">${customAmount || selectedPrice}</h2>
          <h3 className="campaign-right-meal-text">10 Meals</h3>

          <div className="campaign-right-btn-flex">
            {monthlyTabPrices.map((price) => (
              <a 
                key={price.value}
                href="#" 
                className={`campaign-right-price-btn ${selectedPrice === price.value ? 'active-btn' : ''} w-button`}
                onClick={(e) => handlePriceClick(price.value, e)}
              >
                {price.display}
              </a>
            ))}
          </div>

          <form onSubmit={handleDonateSubmit}>
            <input
              className="campaign-right-input w-input"
              placeholder="Enter Your Amount"
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
            <label className="w-checkbox checkbox-field">
              <input type="checkbox" name="checkbox" id="checkbox" data-name="Checkbox" />
              <span className="campaign-right-checkbox-text w-form-label">
                Yes, I want to see how I'm helping to provide food for children, families and communities in need. Send me occasional updates.
              </span>
            </label>
            <div className="campaign-detail-donate-btn">
              <input type="submit" className="campaign-right-donate-btn w-button" value="Donate" />
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <div className="camp-sidenumbers-main">
          <div class="pr-100 pr-0-mob">
              <div class="skill-header-2 tablerow2 mt-0 mb-18">
                  <div class="text_imgbox">
                  <img src={`https://donate.onefamilee.org/images/raised.svg`} className="image-8" />
                  <h4 class="tablerow2_text">Raised</h4>
                  </div>
                  <h4 class="card-text tablerow2_righttext">
                    {typeof campaignData?.totalAmount === 'number' && !isNaN(campaignData.totalAmount)
                      ? `$${campaignData.totalAmount.toLocaleString()}`
                      : '$0'}
                  </h4>
              </div>
              <div class="customborder customborder2 border_b_0">
                  <div class="inner_border inner_border2"></div>
              </div>
              <div class="skill-header-2 tablerow2 my-18">
                  <div class="text_imgbox">
                  <img src={`https://donate.onefamilee.org/images/goal.svg`} class="image-8" />
                  <h4 class="tablerow2_text">Goal</h4>
                  </div>
                  <h4 class="card-text tablerow2_righttext">
                    {typeof urlGoalAmount === 'number' && !isNaN(urlGoalAmount)
                      ? `$${urlGoalAmount.toLocaleString()}`
                      : '$0'}
                  </h4>
              </div>
              <div class="customborder customborder2 border_b_0">
                  <div class="inner_border inner_border2"></div>
              </div>
              <div class="skill-header-2 tablerow2 mt-18 mb-0">
                  <div class="text_imgbox">
                  <img src={`https://donate.onefamilee.org/images/donation.svg`} class="image-8" />
                  <h4 class="tablerow2_text">Donations</h4>
                  </div>
                  <h4 class="card-text tablerow2_righttext">
                    {campaignData?.totalAmount && urlGoalAmount
                      ? Math.round((campaignData.totalAmount / urlGoalAmount) * 100)
                      : 0}%
                  </h4>
              </div>
          </div>

          <div className="donation-receive-list">
              {userPayments.map((payment, index) => {
                const amount = parseFloat(payment?.amount || '0');
                return (
                  <React.Fragment key={index}>
                    <div className="skill-header-2 tablerow2">
                      <div className="text_imgbox">
                        <img
                          loading="lazy"
                          src={`https://donate.onefamilee.org/images/tick.svg`}
                          className="image-8"
                        />
                        <h4 className="tablerow2_text">{payment.name}</h4>
                      </div>
                      <h4 className="card-text tablerow2_righttext">
                        {`$${!isNaN(amount) ? amount.toLocaleString() : '0'}`}
                      </h4>
                    </div>
                    <div className="customborder customborder2 border_b_0">
                      <div className="inner_border inner_border2"></div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
    </div>
    </>
  );
};

export default DonationTabs;
