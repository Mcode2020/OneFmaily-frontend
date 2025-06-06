import React from "react";
import StripeContainer from "./stripe/StripeContainer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container-1330">        
        <div className="header-logo">
          <img src="/images/logo.svg" alt="Logo" />
        </div>
        <div className="main-wrapper">
          <div className="campaign-info">
            <h2>We are committed to environmental conservation.</h2>
            <p>Shared meals will provide emergency food assistance to families in Palestine</p>
            <div className="supportersstatusbox desk-show">
              <div className="supportersbox">
                <img loading="lazy" src="/images/supporters-icon.svg" alt="supporters-icon" />
                <h5 className="heading-2">34,288&nbsp;supporters</h5>
              </div>
              <div className="prograssbar">
                <div className="skill">
                  <div className="progres-bar-2 card-bar">
                    <progress value="100000" max="200000"></progress>
                  </div>
                </div>
              </div>
              <div className="goalsraisedmoney">
                <div className="w-row">
                  <div className="w-col w-col-6">
                    <h4 className="heading-11 goalsraisedmoneytitle">Goals</h4>
                    <div className="campaign-goal-flex">
                      <h4 className="heading-9">$</h4>
                      <h4 className="heading-9">200000</h4>
                    </div>
                  </div>
                  <div className="w-col w-col-6">
                    <h4 className="heading-11 goalsraisedmoneytitle righttext">Raised Money</h4>
                    <div className="campaign-goal-flex raised-flex-campaign">
                      <h4 className="heading-9 righttext">$</h4>
                      <h4 className="heading-9 righttext">100000</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="back-btn">
              <a href="#">Back</a>
            </div>
          </div>
          <StripeContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
