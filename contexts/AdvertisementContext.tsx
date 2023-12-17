'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Advertisement {
  id: string;
  imageUrl: string;
  title: string;
  favoriteCount: number;
  lastUpdated: number;
  isUrgent: boolean;
}

interface AdvertisementsContextProps {
  advertisements: Advertisement[];
  addAdvertisement: (ad: Advertisement) => void;
  toggleFavorite: (id: string) => void;
  deleteAdvertisement: (id: string) => void;
}

export const AdvertisementsContext = createContext<AdvertisementsContextProps>({
  advertisements: [],
  addAdvertisement: () => {},
  toggleFavorite: () => {},
  deleteAdvertisement: () => {},
});

interface AdvertisementsProviderProps {
    children: ReactNode;
}

export const AdvertisementsProvider: React.FC<AdvertisementsProviderProps> = ({ children }) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    // İlanlar değiştiğinde, bunları localStorage'a kaydet
    if (advertisements.length > 0) {
        localStorage.setItem('advertisements', JSON.stringify(advertisements));
    }

  }, [advertisements]);

  useEffect(() => {
    // LocalStorage'dan 'advertisements' ile kaydedilmiş reklamları al
    try {
      const ads = localStorage.getItem('advertisements');
      if (ads) {
        setAdvertisements(JSON.parse(ads));
      }
    } catch (error) {
      console.error('Failed to load ads from localStorage:', error);
    }
  }, []);
  
  const addAdvertisement = (ad: Advertisement) => {
    setAdvertisements(prevAds => {
        const updatedAds = [...prevAds, ad];
        // Yeni ilan listesini Base64 string olarak localStorage'a kaydet
        localStorage.setItem('advertisements', JSON.stringify(updatedAds));
        return updatedAds;
      });
  };

  const toggleFavorite = (id: string) => {
    setAdvertisements(prevAds =>
      prevAds.map(ad =>
        ad.id === id ? { ...ad, favoriteCount: ad.favoriteCount + 1 } : ad,
      ),
    );
  };

  const deleteAdvertisement = (id: string) => {
    // Belirtilen ID'ye sahip reklamı durumdan (state) kaldırarak güncelleme yapın
    setAdvertisements(prevAds => prevAds.filter(ad => ad.id !== id));

    try {
      // LocalStorage'dan reklamları al, eğer yoksa boş bir dizi dön
      const storedAds: Advertisement[] = JSON.parse(localStorage.getItem('advertisements') || '[]');
      const updatedAds = storedAds.filter(ad => ad.id !== id);
      // Güncellenmiş reklamları LocalStorage'a kaydet
      localStorage.setItem('advertisements', JSON.stringify(updatedAds));
    } catch (error) {
      console.error('Failed to update ads in localStorage after deletion:', error);
    }
  };

  return (
    <AdvertisementsContext.Provider value={{ advertisements, addAdvertisement, toggleFavorite, deleteAdvertisement }}>
      {children}
    </AdvertisementsContext.Provider>
  );
};
