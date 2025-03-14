import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_ENDPOINTS, fetchMovies } from '../utils/api';
import SearchResults from './SearchResults';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query?.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMovies(API_ENDPOINTS.SEARCH(query));
        setResults(data.results || []);
      } catch (err) {
        setError('Failed to search movies. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      {query && (
        <h2 className="text-white text-2xl font-bold mb-6">
          Search Results for "{query}"
        </h2>
      )}
      <SearchResults
        results={results}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Search; 