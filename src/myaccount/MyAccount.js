import React, { useState, useEffect } from 'react';
import './MyAccount.css';
import jsPDF from 'jspdf';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CampaignTabs from "../campaignTabs/campaignTabs";


const MyAccount = () => {
  const [totalAmount, setTotalAmount] = useState('$0');
  const [lifetimeTotal, setLifetimeTotal] = useState('$0');
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const itemsPerPage = 10;

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchPayments = async (date) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found in localStorage');
        setPayments([]);
        setNoDataFound(true);
        return;
      }
      const formattedDate = formatDateForAPI(date);
      const response = await fetch(`https://donate.onefamilee.org/api/all-payments/${userEmail}?start_date=${formattedDate}`);
      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
        setTotalPages(Math.ceil(data.data.length / itemsPerPage));
        setNoDataFound(data.data.length === 0);
      } else {
        // Handle "No data found" response
        setPayments([]);
        setTotalPages(1);
        setNoDataFound(true);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setNoDataFound(true);
    }
  };

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const response = await fetch('https://donate.onefamilee.org/api/total-payments-amount');
        const data = await response.json();
        setTotalAmount(`$${parseFloat(data.currentYearTotal).toLocaleString()}`);
        setLifetimeTotal(`$${parseFloat(data.lifetimeTotal).toLocaleString()}`);
      } catch (error) {
        console.error('Error fetching total amount:', error);
        setTotalAmount('$0');
        setLifetimeTotal('$0');
      }
    };

    // fetchTotalAmount();
    fetchPayments(selectedDate);
  }, [selectedDate]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return payments.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  const handleDownloadPdf = (payment) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Campaign Name as Title
    doc.setFontSize(22);
    doc.text(payment.campaignName, margin, 30);

    // Payment Details Section
    doc.setFontSize(10);
    doc.setTextColor(100); // Darker grey for labels
    doc.text('Date', margin, 50);
    doc.text('Total Amount', pageWidth / 2 - 20, 50);
    doc.text('Status', pageWidth - margin - 20, 50);

    doc.setFontSize(12);
    doc.setTextColor(0); // Black color for values
    doc.text(new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 58);
    doc.text(`$${parseFloat(payment.amount).toLocaleString()}`, pageWidth / 2 - 20, 58);

    // Status: Paid with green dot
    doc.setFillColor(60, 179, 113); // MediumSeaGreen color for dot
    doc.circle(pageWidth - margin - 25, 56, 2, 'F');
    doc.text('Paid', pageWidth - margin - 20, 58);

    // Description/Amount Table
    let startY = 75;
    let rowHeight = 15;
    let tableWidth = pageWidth - (2 * margin);

    // Draw outer box for the table section
    doc.setDrawColor(200, 200, 200); // Light grey border
    doc.setLineWidth(0.5);
    doc.rect(margin, startY, tableWidth, rowHeight * 3); // Covers header, one data row, and total row

    // Table Headers
    doc.setFillColor(235, 235, 235); // Slightly darker grey background for header
    doc.rect(margin, startY, tableWidth, rowHeight, 'F');
    doc.setTextColor(70, 70, 70); // Darker grey for headers
    doc.setFontSize(10);
    doc.text('Description', margin + 5, startY + 10);
    doc.text('Amount to pay', pageWidth - margin - 35, startY + 10);

    // Line after header
    doc.setDrawColor(200, 200, 200); // Light grey line
    doc.setLineWidth(0.1);
    doc.line(margin, startY + rowHeight, pageWidth - margin, startY + rowHeight);

    startY += rowHeight;

    // Table Row 1 (Campaign Name and Amount)
    doc.setFillColor(255); // White background for row
    doc.rect(margin, startY, tableWidth, rowHeight, 'F'); // Fill with white to cover previous background
    doc.setTextColor(0); // Black color for values
    doc.setFontSize(12);
    doc.text(payment.campaignName, margin + 5, startY + 10);
    doc.text(`$${parseFloat(payment.amount).toLocaleString()}`, pageWidth - margin - 35, startY + 10);

    startY += rowHeight;

    // Total Row
    doc.setFillColor(235, 235, 235); // Slightly darker grey background for total row
    doc.rect(margin, startY, tableWidth, rowHeight, 'F');
    doc.setTextColor(0); // Black color
    doc.setFontSize(12);
    doc.text('Total', pageWidth / 2 + 30, startY + 10);
    doc.text(`$${parseFloat(payment.amount).toLocaleString()}`, pageWidth - margin - 35, startY + 10);

    // Add a footer
    doc.setFontSize(10);
    doc.setTextColor(0); // Black color for footer
    doc.text('OneFamilee - Thank you for your support!', pageWidth / 2, doc.internal.pageSize.getHeight() - 20, null, null, 'center');

    doc.save(`payment_receipt_${payment.campaignName}.pdf`);
  };

  const handleViewClick = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
    console.log('Eye icon clicked for payment:', payment);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  return (
    <>
        {/*------------------------- CAMPAIGN-TABS-START ---------------------*/}
        <CampaignTabs />
        {/*------------------------- CAMPAIGN-TABS-END ---------------------*/}


        {/*------------------------- RECEIPTS-PART-START ---------------------*/}
        <div className="div-block-16 account-receipt-head">
            <h1 className="heading-18 m-0">Receipts</h1>
            <div className="div-block-15">
                <img 
                    loading="lazy" 
                    src="https://donate.onefamilee.org/images/calender.svg" 
                    className="image-10" 
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    style={{ cursor: 'pointer' }}
                />
                <div className="div-block-17"></div>
                {showDatePicker ? (
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                            fetchPayments(date);
                        }}
                        inline
                        style={{ position: 'absolute', zIndex: 1000 }}
                    />
                ) : (
                    <h1 className="heading-25">{selectedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</h1>
                )}
            </div>
        </div>
        <div className="div-block-18 account-receipt">
            <div className="w-layout-grid grid-4">
                <div>
                    <div className="form-block w-form">
                        <span className="checkbox-label w-form-label">Date</span>
                    </div>
                </div>
                <div>
                    <h1 className="heading-21">Amount</h1>
                </div>
                <div>
                    <h1 className="heading-21">Campaign name</h1>
                </div>
                <div>
                    <h1 className="heading-21">Action</h1>
                </div>
            </div>
            {noDataFound ? (
                <div className="no-data-found" style={{ textAlign: 'center', padding: '20px' }}>
                    <h2>No data found for the selected date</h2>
                </div>
            ) : (
                payments.slice((currentPage - 1) * 10, currentPage * 10).map((payment, index) => (
                    <div key={index} className={`w-layout-grid grid-4 ${index % 2 === 0 ? 'back-white' : ''}`}>
                        <div>
                            <div className="form-block w-form">
                                <span className="checkbox-label black account-check-lable w-form-label">
                                    {new Date(payment.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h1 className="heading-21 t-black account-receipt-amount">
                                ${parseFloat(payment.amount).toLocaleString()}
                            </h1>
                        </div>
                        <div>
                            <h1 className="heading-21 t-black account-receipt-camp-name">
                                {payment.campaignName}
                            </h1>
                        </div>
                        <div className="div-block-19">
                            <img data-w-id="83b502e6-46fd-0fb4-1e7e-8f27d642e32b" loading="lazy" src="https://donate.onefamilee.org/images/view.svg" className="image-14" onClick={() => handleViewClick(payment)} style={{cursor: 'pointer'}}/>
                            <img loading="lazy" src="https://donate.onefamilee.org/images/download.svg" onClick={() => handleDownloadPdf(payment)} style={{cursor: 'pointer'}}/>
                        </div>
                    </div>
                ))
            )}
            
            {/* Pagination Controls */}
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', gap: '10px' }}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    <img src="https://donate.onefamilee.org/images/slider-left.svg" />
                    Previous
                </button>
                
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(payments.length / 10)))}
                    disabled={currentPage === Math.ceil(payments.length / 10)}
                    className="pagination-button"
                >
                    Next
                    <img src="https://donate.onefamilee.org/images/slider-right.svg" />
                </button>
            </div>
        </div>
        {/*------------------------- RECEIPTS-PART-END ---------------------*/}

        {/* RECEIPTS-MOBILE-PART-START */}
        <div className="account-receipt-mobile">
            {noDataFound ? (
                <div className="no-data-found" style={{ textAlign: 'center', padding: '20px' }}>
                    <h2>No data found for the selected date</h2>
                </div>
            ) : (
                payments.slice((currentPage - 1) * 4, currentPage * 4).map((payment, index) => (
                    <div key={index} className="account-receipt-single-main">
                        <div className="account-receipt-single-head">
                            <div>
                                <h5 className="account-receipt-amount-text">Amount</h5>
                                <h4 className="account-receipt-amount">${parseFloat(payment.amount).toLocaleString()}</h4>
                            </div>
                            <div className="div-block-19 account-receipt-icons-main">
                                <img 
                                    data-w-id="842e2090-cb97-2e41-13cf-7eed7b1eee49" 
                                    loading="lazy" 
                                    src="https://donate.onefamilee.org/images/view.svg" 
                                    className="image-14" 
                                    onClick={() => handleViewClick(payment)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <img 
                                    loading="lazy" 
                                    src="https://donate.onefamilee.org/images/download.svg" 
                                    className="account-receipt-icons"
                                    onClick={() => handleDownloadPdf(payment)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                        <div className="account-receipt-single-body">
                            <h5 className="account-receipt-amount-text">Campaign name</h5>
                            <h4 className="account-receipt-mob-camp-name">{payment.campaignName}</h4>
                        </div>
                        <div className="account-receipt-single-body no-btm-brdr">
                            <h5 className="account-receipt-amount-text">Date</h5>
                            <h4 className="account-receipt-mob-camp-name">
                                {new Date(payment.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h4>
                        </div>
                    </div>
                ))
            )}
            {/* Pagination Controls for Mobile */} 
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', gap: '10px' }}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    <img src="/images/slider-left.svg" />
                    Previous
                </button>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(payments.length / 4)))} 
                    disabled={currentPage === Math.ceil(payments.length / 4)}
                    className="pagination-button"
                >
                    Next
                    <img src="/images/slider-right.svg" />
                </button>
            </div>
        </div>
        {/* RECEIPTS-MOBILE-PART-END */}

        {/* RECEIPTS-VIEW-MODAL-START */}
        <div className={`div-block-20 receipt-view-modal ${showModal ? 'show-modal' : ''}`}>
            <div className="modal receipt-popup">
                <div className="div-block-21 receipt-modal-head">
                    <h1 className="heading-23 receipt-title-modal">{selectedPayment?.campaignName}</h1>
                    <img data-w-id="d75bf2a9-2b92-31f3-47c4-6ce4395485d5" loading="lazy" src="https://donate.onefamilee.org/images/cross.svg" className="image-15" onClick={handleCloseModal} style={{cursor: 'pointer'}}/>
                </div>
                <div className="camp-receipt-modal-body">
                    <div>
                        <h5 className="camp-receipt-date-text">Date</h5>
                        <h4 className="camp-receipt-modal-date">{selectedPayment ? new Date(selectedPayment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</h4>
                    </div>
                    <div>
                        <h5 className="camp-receipt-date-text">Total Amount</h5>
                        <h4 className="camp-receipt-modal-date">{selectedPayment ? `$${parseFloat(selectedPayment.amount).toLocaleString()}` : ''}</h4>
                    </div>
                    <div>
                        <h5 className="camp-receipt-date-text">Status</h5>
                        <img src="https://donate.onefamilee.org/images/paid.svg" loading="lazy" className="camp-receipt-status-img" />
                    </div>
                </div>
                <div className="camp-modal-receipt-info-main">
                    <div className="camp-modal-receipt-info-flex">
                        <h6 className="camp-modal-receipt-info-discrip-text">Description</h6>
                        <h6 className="camp-modal-receipt-info-body-title for-mob">{selectedPayment?.campaignName}</h6>
                        <h6 className="camp-modal-receipt-info-discrip-text for-desk">Amount to pay</h6>
                    </div>
                    <div className="camp-modal-receipt-info-body">
                        <h6 className="camp-modal-receipt-info-body-title for-desk">{selectedPayment?.campaignName}</h6>
                        <h6 className="camp-modal-receipt-info-discrip-text for-mob">Amount to pay</h6>
                        <h6 className="camp-modal-receipt-info-body-title">{selectedPayment ? `$${parseFloat(selectedPayment.amount).toLocaleString()}` : ''}</h6>
                    </div>
                    <div className="camp-modal-receipt-info-footer">
                        <h5 className="camp-modal-receipt-info-footer-text">Total</h5>
                        <h5 className="camp-modal-receipt-info-footer-text">{selectedPayment ? `$${parseFloat(selectedPayment.amount).toLocaleString()}` : ''}</h5>
                    </div>
                </div>
                <div className="camp-receipt-modal-footer">
                    <a href="#" className="camp-receipt-modal-down-btn w-button" onClick={() => handleDownloadPdf(selectedPayment)}>Download</a>
                    <a href="#" className="camp-receipt-modal-back-btn w-button" onClick={handleCloseModal}>Back</a>
                </div>
            </div>
        </div>
        {/* RECEIPTS-VIEW-MODAL-END */}
    </>
  );
};

export default MyAccount;
