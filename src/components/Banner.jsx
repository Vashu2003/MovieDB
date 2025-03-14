import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
import { API_ENDPOINTS, API_OPTIONS } from '../utils/api';
import MediaPlayer from './MediaPlayer';
import MovieDetails from './MovieDetails';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

const Banner = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovieTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.MOVIE}/${movieId}/videos?language=en-US`,
        API_OPTIONS
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text(); // Get response as text first
      if (!responseText) {
        console.error('Empty response received');
        return;
      }

      const data = JSON.parse(responseText); // Parse the text to JSON
      console.log('Video API Response:', data); // Debug log

      if (!data.results || data.results.length === 0) {
        console.log('No trailers found for this movie');
        return;
      }

      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      
      if (trailer) {
        setCurrentTrailer(`https://www.youtube.com/watch?v=${trailer.key}`);
        setIsPlayerOpen(true);
      } else {
        console.log('No YouTube trailer found for this movie');
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.NOW_PLAYING, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovies(data.results?.slice(0, 5) || []); // Get first 5 movies for banner
      setError(null);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError('Failed to load banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
    arrows: false,
    dotsClass: "slick-dots custom-dots"
  };

  const handleMoreInfo = (movie) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-red-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[90%] mx-auto">
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id}>
            <div
              className="relative w-full aspect-[2.1/1] bg-cover bg-center rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-4 md:p-6 lg:p-8 w-full md:w-2/3">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                  {movie.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-3 md:mb-4 line-clamp-2">
                  {movie.overview}
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => fetchMovieTrailer(movie.id)}
                    className="w-full sm:w-36 md:w-40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-gray-900 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-medium shadow-lg hover:shadow-white/20"
                  >
                    <FaPlay className="mr-2" />
                    Play Now
                  </button>
                  <button 
                    onClick={() => handleMoreInfo(movie)}
                    className="w-full sm:w-36 md:w-40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-gray-900 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-medium shadow-lg hover:shadow-white/20"
                  >
                    <FaInfoCircle className="mr-2" />
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <MediaPlayer
        videoUrl={currentTrailer}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setCurrentTrailer('');
        }}
      />

      <MovieDetails
        movie={selectedMovie}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedMovie(null);
        }}
      />
    </div>
  );
};

export default Banner;
