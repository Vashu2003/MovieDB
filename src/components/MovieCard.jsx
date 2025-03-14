import React, { useState } from "react";
import { IMAGE_URLS, API_ENDPOINTS, API_OPTIONS } from "../utils/api";
import MediaPlayer from './MediaPlayer';
import MovieDetails from './MovieDetails';
import { FaBookmark, FaRegBookmark, FaStar, FaPlay, FaInfoCircle } from 'react-icons/fa';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState('');
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleShowDetails = (e) => {
    e.stopPropagation();
    setIsDetailsOpen(true);
  };

  const fetchMovieTrailer = async (movieId, e) => {
    e?.stopPropagation();
    try {
      const response = await fetch(
        `${API_ENDPOINTS.MOVIE}/${movieId}/videos?language=en-US`,
        API_OPTIONS
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      if (!responseText) {
        console.error('Empty response received');
        return;
      }

      const data = JSON.parse(responseText);
      console.log('Video API Response:', data);

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

  if (!movie) return null;

  return (
    <>
      <div className="group relative w-[220px] h-[300px] rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/50">
        {/* Movie Poster */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full transform transition-all duration-500 ease-in-out group-hover:scale-105"
          style={{
            backgroundImage: `url(${IMAGE_URLS.POSTER(movie.poster_path)})`,
          }}
        />

        {/* Watchlist Button */}
        <button
          onClick={handleWatchlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-500 ease-in-out z-20 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0
            ${inWatchlist 
              ? 'bg-white text-gray-900 hover:bg-red-500' 
              : 'bg-gray-900/60 text-white hover:bg-white hover:text-gray-900'}`}
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {inWatchlist ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-[101%] group-hover:translate-y-0 transition-all duration-500 ease-in-out backdrop-blur-sm bg-black/30">
          <h3 className="text-white font-bold text-lg mb-2 truncate transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mb-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
            <span className="text-white text-sm flex items-center">
              <FaStar className="mr-1 text-white" size={12} />
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-white text-sm">
              {movie.release_date?.split("-")[0]}
            </span>
          </div>
          <div className="flex gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <button 
              onClick={(e) => fetchMovieTrailer(movie.id, e)}
              className="w-full sm:w-24 bg-white/10 backdrop-blur-md hover:bg-white hover:text-gray-900 text-white py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg hover:shadow-white/20"
            >
              <FaPlay className="mr-1" />
              Play
            </button>
            <button 
              onClick={handleShowDetails}
              className="w-full sm:w-24 bg-white/10 backdrop-blur-md hover:bg-white hover:text-gray-900 text-white py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg hover:shadow-white/20"
            >
              <FaInfoCircle className="mr-1" />
              Info
            </button>
          </div>
        </div>
      </div>

      <MediaPlayer
        videoUrl={currentTrailer}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setCurrentTrailer('');
        }}
      />

      <MovieDetails
        movie={movie}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
};

export default MovieCard;
