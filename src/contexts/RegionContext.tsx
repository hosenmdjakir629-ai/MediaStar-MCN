import React, { createContext, useContext, useState } from 'react';

type Region = {
  code: string;
  name: string;
  flag: string;
};

const regions: Region[] = [
  { code: 'GLOBAL', name: 'Global', flag: '🌐' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
];

interface RegionContextType {
  region: Region;
  setRegion: (code: string) => void;
  availableRegions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [currentRegion, setCurrentRegion] = useState<Region>(regions[0]);

  const setRegion = (code: string) => {
    const found = regions.find(r => r.code === code);
    if (found) {
      setCurrentRegion(found);
    }
  };

  return (
    <RegionContext.Provider value={{ 
      region: currentRegion, 
      setRegion, 
      availableRegions: regions 
    }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
