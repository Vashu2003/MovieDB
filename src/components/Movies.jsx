import React, { useState, useEffect } from 'react'
import Banner from './Banner'
import MovieCard from './MovieCard'
import { API_ENDPOINTS, API_OPTIONS } from '../utils/api'

const Movies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      const [popularResponse, topRatedResponse] = await Promise.all([
        fetch(API_ENDPOINTS.POPULAR, API_OPTIONS),
        fetch(API_ENDPOINTS.TOP_RATED, API_OPTIONS)
      ]);

      if (!popularResponse.ok || !topRatedResponse.ok) {
        throw new Error('Failed to fetch movies');
      }

      const popularData = await popularResponse.json();
      const topRatedData = await topRatedResponse.json();

      console.log('Popular Movies:', popularData); // Debug log
      console.log('Top Rated Movies:', topRatedData); // Debug log

      setPopularMovies(popularData.results?.slice(0, 10) || []);
      setTopRatedMovies(topRatedData.results?.slice(0, 10) || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  const splitIntoRows = (movies) => {
    const firstRow = movies.slice(0, 5);
    const secondRow = movies.slice(5, 10);
    return [firstRow, secondRow];
  };

  return (
    <div className="container mx-auto px-4">
      {/* Banner Section */}
      <div className="mb-12">
        <Banner />
      </div>

      {/* Popular Movies Section */}
      {popularMovies.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Popular Movies</h2>
          <div className="space-y-8">
            {splitIntoRows(popularMovies).map((row, rowIndex) => (
              <div key={`popular-row-${rowIndex}`} className="grid grid-cols-5 gap-6">
                {row.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Rated Movies Section */}
      {topRatedMovies.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Top Rated Movies</h2>
          <div className="space-y-8">
            {splitIntoRows(topRatedMovies).map((row, rowIndex) => (
              <div key={`top-rated-row-${rowIndex}`} className="grid grid-cols-5 gap-6">
                {row.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Movies
