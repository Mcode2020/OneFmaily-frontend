import React, { useState, useEffect } from 'react';
import './campaignTabs.css';

const CampaignTabs = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [displayedCampaigns, setDisplayedCampaigns] = useState(3);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await fetch(`https://donate.onefamilee.org/api/campaign-stats/${userEmail}`);
        const result = await response.json();
        if (result.success) {
          setCampaigns(result.data);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Reset displayed campaigns when tab changes
  useEffect(() => {
    setDisplayedCampaigns(3);
  }, [activeTab]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getFilteredCampaigns = () => {
    switch (activeTab) {
      case 'archived':
        return campaigns.filter(campaign => campaign.status === 'archived');
      case 'active':
      case 'all':
      default:
        return campaigns;
    }
  };

  const handleLoadMore = () => {
    setDisplayedCampaigns(prev => prev + 3);
  };

  const renderCampaignCard = (campaign) => (
    <div className="innerpartcontent-2" key={campaign.campaign_slug}>
      <a data-w-id={campaign.campaign_slug} href="#" className="account-campaigns-link w-inline-block">
        <div className="div-block-13">
          <img 
            loading="lazy" 
            src={campaign.image_url || "/images/campaign.webp"} 
            alt={campaign.campaign_name} 
            className="image-11 account-camp-img" 
          />
          <h1 className="heading-20">{campaign.type === 'single' ? 'One-time' : 'Monthly'}</h1>
        </div>
        <h3 className="heading-16 camp-head">{campaign.campaign_name}</h3>
        <div className="goalsraisedmoney">
          <div className="w-row">
            <div className="p-0 w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6">
              <h4 className="heading-24 goalsraisedmoneytitle">Amount</h4>
              <h4 className="heading-19 camp-font">${campaign.total_amount}</h4>
            </div>
            <div className="p-0 w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6">
              <h4 className="heading-24 goalsraisedmoneytitle righttext">Created on</h4>
              <h4 className="heading-19 righttext camp-font">{formatDate(campaign.created_at)}</h4>
            </div>
          </div>
        </div>
        <div className="donatenowbtn">
          <h4 
            className="button-primary-8 loginbtnlink globalyellowbtn donatenonmainbtn top-10 account-camp-btn"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCampaign(campaign);
              setShowPopup(true);
            }}
          >
            Know More
          </h4>
        </div>
      </a>
    </div>
  );

  const renderNoDataFound = () => (
    <div className="no-data-found">
      <h3>No campaigns found</h3>
    </div>
  );

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  const filteredCampaigns = getFilteredCampaigns();
  const campaignsToShow = filteredCampaigns.slice(0, displayedCampaigns);
  const hasMoreCampaigns = filteredCampaigns.length > displayedCampaigns;
  const shouldShowLoadMore = filteredCampaigns.length > 3 && hasMoreCampaigns;

  return (
    <>
      {/* CAMPAIGN-TABS-START */}
      <div className="w-tabs account-campaign-tabs-main">
        <div className="account-campaign-tabs w-tab-menu" role="tablist">
          <a 
            className={`tab-link-tab-1 tab-c w-inline-block w-tab-link ${activeTab === 'all' ? 'w--current' : ''}`}
            onClick={() => setActiveTab('all')}
            role="tab"
          >
            <div className="text-block-7">All</div>
          </a> 
          <a 
            className={`tab-link-tab-2 tab-c w-inline-block w-tab-link ${activeTab === 'active' ? 'w--current' : ''}`}
            onClick={() => setActiveTab('active')}
            role="tab"
          >
            <div className="text-block-7">Active</div>
          </a> 
          <a 
            className={`tab-link-tab-3 tab-c w-inline-block w-tab-link ${activeTab === 'archived' ? 'w--current' : ''}`}
            onClick={() => setActiveTab('archived')}
            role="tab"
          >
            <div className="text-block-7">Archived</div>
          </a>
        </div>
        <div className="tabs-content w-tab-content">
          <div className="div-block-12">
            {campaignsToShow.length > 0 ? (
              campaignsToShow.map(renderCampaignCard)
            ) : (
              renderNoDataFound()
            )}
          </div>
          {shouldShowLoadMore && (
            <div className="div-block-14">
              <a 
                href="#" 
                className="button-primary-8 loginbtnlink globalyellowbtn ourvolunteerbtn no-back account-camp-load-btn w-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleLoadMore();
                }}
              >
                Load More
              </a>
            </div>
          )}
        </div>
      </div>
      {/* CAMPAIGN-TABS-END */}

      {/* CAMPAIGN-TABS-POPUP-START */}
      <div className={`camp-modal ${showPopup ? 'show' : ''}`}>
        <div className="modal">
          <div className="div-block-21" onClick={() => setShowPopup(false)}>
            <img 
              data-w-id="83b502e6-46fd-0fb4-1e7e-8f27d642e453" 
              loading="lazy" 
              alt="Close" 
              src="/images/camp-modal-close.svg" 
              className="image-15" 
            />
          </div>
          <div className="camp-modal-featured-image">
            <img 
              data-w-id="83b502e6-46fd-0fb4-1e7e-8f27d642e454" 
              sizes="100vw" 
              alt={selectedCampaign?.campaign_name} 
              src={selectedCampaign?.image_url || "/images/campaign.webp"} 
              loading="lazy" 
              className="image-13" 
            />
            <span>{selectedCampaign?.type === 'single' ? 'One-time' : 'Monthly'}</span>
          </div>
          <div>
            <h1 className="heading-23">{selectedCampaign?.campaign_name}</h1>
            <div className="text-block-9">
              <strong>Amount:</strong> ${selectedCampaign?.total_amount}
            </div>
            <div className="text-block-9">
              <strong>Created on:</strong> {selectedCampaign?.created_at ? formatDate(selectedCampaign.created_at) : ''}
            </div>
            <div className="text-block-9">
              <strong>Type:</strong> {selectedCampaign?.type === 'single' ? 'One-time' : 'Monthly'}
            </div>
          </div>
        </div>
      </div>
      {/* CAMPAIGN-TABS-POPUP-END */}
    </>
  );
};

export default CampaignTabs;