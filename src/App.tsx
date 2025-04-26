import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './screens/Onboarding';
import Insights from './screens/Insights';
import Analytics from './screens/Analytics';
import { AnalyticsProvider } from './context/AnalyticsContext';

function App() {
  return (
    <AnalyticsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AnalyticsProvider>
  );
}

export default App;