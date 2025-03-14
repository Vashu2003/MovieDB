import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Movies from "./components/Movies";
import WatchList from "./components/WatchList";
import Search from "./components/Search";
import Banner from './components/Banner'
import MovieCard from './components/MovieCard'
import { WatchlistProvider } from './context/WatchlistContext';

function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black flex flex-col">
          <Navbar />
          
          {/* Main Content */}
          <div className="flex-grow container mx-auto px-4">
            <Routes>
              <Route path="/" element={<Movies />} />
              <Route path="/watchlist" element={<WatchList />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>

          {/* Fixed Footer */}
          <footer className="w-full bg-black border-0 border-gray-800">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-gray-400 text-center">© 2024 MovieDB. All rights reserved.</p>
                <p className="text-gray-500 text-sm text-center">Your ultimate destination for movies and entertainment</p>
                <p className="text-gray-600 text-xs text-center">Powered by TMDB API | Made with ❤️ for movie lovers</p>
                <p className="text-gray-600 text-xs text-center">Created & Designed by Vashu Singh</p>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </WatchlistProvider>
  );
}

export default App;
