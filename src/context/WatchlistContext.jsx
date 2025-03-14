import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  // Initialize watchlist from localStorage if available, otherwise empty array
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      // Check if movie already exists in watchlist
      if (prev.some(m => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      addToWatchlist, 
      removeFromWatchlist,
      isInWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}; 