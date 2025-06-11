import React, { useState, useEffect } from "react";
import DonationPage from "./pages/DonationPage";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const renderPage = () => {
    if (currentPath === '/' || currentPath === '/donate') {
      return <DonationPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/payment/')) {
      return <PaymentPage />;
    }
    return <DonationPage onNavigate={navigate} />;
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
