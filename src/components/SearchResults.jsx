import React from 'react';
import MovieCard from './MovieCard';

const SearchResults = ({ results, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-center py-8">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-white text-center py-8">
        <p className="text-xl">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {results.map((movie) => (
        <div key={movie.id} className="flex justify-center">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults; 