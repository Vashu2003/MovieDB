const BASE_URL = "https://api.themoviedb.org/3";

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMWE5Nzc3OGQyOGY3NGY1ZGE2NWUzM2Y3MjMxZDc0NSIsIm5iZiI6MTc0MTg1MTAyOC42OTcsInN1YiI6IjY3ZDI4OTk0MmVhMTM4OWY5ZjYwODU1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HKddEf7IEpjcBYhQi7_Mr6xREOS1MgnFw2ek-58jdCQ'
  }
};

// API endpoints without api_key (using Bearer token instead)
export const API_ENDPOINTS = {
  NOW_PLAYING: `${BASE_URL}/movie/now_playing?language=en-US&page=1`,
  POPULAR: `${BASE_URL}/movie/popular?language=en-US&page=1`,
  TOP_RATED: `${BASE_URL}/movie/top_rated?language=en-US&page=1`,
  MOVIE: `${BASE_URL}/movie`,
  SEARCH: (query) => `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
};

export const IMAGE_URLS = {
  POSTER: (path) => `https://image.tmdb.org/t/p/w500${path}`,
  BACKDROP: (path) => `https://image.tmdb.org/t/p/original${path}`,
};

// Helper function to fetch movies
export const fetchMovies = async (endpoint) => {
  try {
    const response = await fetch(endpoint, API_OPTIONS);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
