import React, { useState, useEffect } from 'react';
import '../myaccount/MyAccount.css';

const MyAccountHeader = () => {
  const [totalAmount, setTotalAmount] = useState('$0');
  const [lifetimeTotal, setLifetimeTotal] = useState('$0');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.error('User email not found in localStorage');
          return;
        }

        // Fetch user name
        const nameResponse = await fetch(`https://donate.onefamilee.org/api/name/${userEmail}`);
        const nameData = await nameResponse.json();
        setUserName(nameData.name);

        // Fetch total amounts
        const response = await fetch(`https://donate.onefamilee.org/api/total-payments-amount/${userEmail}`);
        const data = await response.json();
        setTotalAmount(`$${parseFloat(data.currentYearTotal).toLocaleString()}`);
        setLifetimeTotal(`$${parseFloat(data.lifetimeTotal).toLocaleString()}`);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setTotalAmount('$0');
        setLifetimeTotal('$0');
        setUserName('');
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/*------------------------- TOP-IMPACT-PART-START ---------------------*/}
      <div className="acc-head">
        <h1 className="heading-22">Hi <strong className="bold-text-2">{userName}</strong>, welcome to <strong className="bold-text-2">OneFamilee!</strong></h1>
      </div>

      <section className="impact-donation">
        <div className="div-block-11">
          <h1 className="heading-17">Donations</h1>
          <div className="w-layout-grid grid-3 account-impact-grid">
            <div id="w-node-_83b502e6-46fd-0fb4-1e7e-8f27d642e205-e8f42a1d" className="div-block-8 eductaed">
              <div>
                <h1 className="heading-15">{totalAmount}</h1>
                <p className="paragraph-4">2025 Total Amount</p>
              </div>
              <div className="div-block-10">
                <img loading="lazy" src="https://donate.onefamilee.org/images/total.svg" />
              </div>
            </div>
            <div id="w-node-_83b502e6-46fd-0fb4-1e7e-8f27d642e20d-e8f42a1d" className="div-block-8">
              <div>
                <h1 className="heading-15">{lifetimeTotal}</h1>
                <p className="paragraph-4">Lifetime Amount</p>
              </div>
              <div className="div-block-10">
                <img loading="lazy" src="https://donate.onefamilee.org/images/coins.svg" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*------------------------- TOP-IMPACT-PART-END ---------------------*/}
    </>
  );
};

export default MyAccountHeader;