import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from './MovieCard';

const WatchList = () => {
  const { watchlist } = useWatchlist();

  if (!watchlist.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your Watchlist is Empty</h1>
          <p className="text-gray-400">Add some movies to your watchlist to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Your Watchlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchlist.map((movie) => (
          <div key={movie.id} className="flex justify-center">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;
