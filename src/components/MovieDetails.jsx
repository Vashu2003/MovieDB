import React from 'react';
import { FaStar, FaCalendar, FaClock, FaGlobe, FaTimes, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useWatchlist } from '../context/WatchlistContext';

const MovieDetails = ({ movie, isOpen, onClose }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  if (!isOpen || !movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8
        transition-all duration-500 ease-out backdrop-blur-xl
        ${isOpen ? 'opacity-100 bg-black/75' : 'opacity-0 bg-black/0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl mx-auto bg-gray-900/40 rounded-2xl overflow-hidden 
          shadow-2xl border border-white/10 transition-all duration-500 ease-out backdrop-blur-md
          transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          aria-label="Close details"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover"
            />
            {/* Watchlist Button */}
            <button
              onClick={handleWatchlist}
              className={`absolute top-4 left-4 p-3 rounded-full transition-all duration-300
                ${inWatchlist 
                  ? 'bg-yellow-400 text-gray-900 hover:bg-red-500' 
                  : 'bg-gray-900/60 text-white hover:bg-yellow-400 hover:text-gray-900'}`}
              aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
            </button>
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <h2 className="text-3xl font-bold text-white mb-4">{movie.title}</h2>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <FaStar className="mr-2" />
                <span>{movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center text-white/80">
                <FaCalendar className="mr-2" />
                <span>{movie.release_date}</span>
              </div>
              <div className="flex items-center text-white/80">
                <FaClock className="mr-2" />
                <span>{movie.runtime || 'N/A'} min</span>
              </div>
              <div className="flex items-center text-white/80">
                <FaGlobe className="mr-2" />
                <span>{movie.original_language?.toUpperCase()}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
              <p className="text-white/80 leading-relaxed">{movie.overview}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Additional Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white/60 mb-1">Vote Count</h4>
                  <p className="text-white">{movie.vote_count}</p>
                </div>
                <div>
                  <h4 className="text-white/60 mb-1">Popularity</h4>
                  <p className="text-white">{movie.popularity?.toFixed(1)}</p>
                </div>
                <div>
                  <h4 className="text-white/60 mb-1">Original Title</h4>
                  <p className="text-white">{movie.original_title}</p>
                </div>
                <div>
                  <h4 className="text-white/60 mb-1">Adult Content</h4>
                  <p className="text-white">{movie.adult ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 