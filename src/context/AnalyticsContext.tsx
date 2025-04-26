import React, { createContext, useState } from 'react';

interface AnalyticsContextType {
  propertyId: string;
  accessToken: string;
  setPropertyId: (id: string) => void;
  setAccessToken: (token: string) => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType>({
  propertyId: '',
  accessToken: '',
  setPropertyId: () => {},
  setAccessToken: () => {}
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [propertyId, setPropertyId] = useState('');
  const [accessToken, setAccessToken] = useState('');

  return (
    <AnalyticsContext.Provider
      value={{
        propertyId,
        accessToken,
        setPropertyId,
        setAccessToken
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}