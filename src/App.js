import React from "react";
import StripeContainer from "./stripe/StripeContainer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1 className="app-title">Premium Subscription</h1>
        <StripeContainer />
      </div>
    </div>
  );
}

export default App;
