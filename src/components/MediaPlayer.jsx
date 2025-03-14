import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const MediaPlayer = ({ videoUrl, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleMute = () => setIsMuted(!isMuted);
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgress = (state) => {
    setProgress(state.played);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    playerRef.current?.seekTo(time);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8
        transition-all duration-500 ease-out backdrop-blur-xl
        ${isAnimating 
          ? 'opacity-100 bg-black/75' 
          : 'opacity-0 bg-black/0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        className={`relative w-full max-w-5xl mx-auto bg-gray-900/40 rounded-2xl overflow-hidden 
          shadow-2xl border border-white/10 transition-all duration-500 ease-out backdrop-blur-md
          ${isAnimating 
            ? 'opacity-100 scale-100 translate-y-0 shadow-[0_0_50px_-12px] shadow-white/20' 
            : 'opacity-0 scale-[0.8] -translate-y-24'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header line */}
        <div className={`absolute top-0 left-0 right-0 h-1 
          bg-white/20
          transition-transform duration-700 origin-left delay-100
          ${isAnimating ? 'scale-x-100' : 'scale-x-0'}`} 
        />
        
        {/* Player wrapper */}
        <div className="relative pt-[56.25%] bg-black group">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            onProgress={handleProgress}
            onDuration={setDuration}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  controls: 0
                }
              }
            }}
          />

          {/* Custom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 mb-4 rounded-full appearance-none bg-white/20 
                hover:bg-white/30 transition-colors cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:hover:bg-white/90"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleMute}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 rounded-full appearance-none bg-white/20 
                      hover:bg-white/30 transition-colors cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:hover:bg-white/90"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-sm">
                  {formatTime(duration * progress)} / {formatTime(duration)}
                </div>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-white/80 transition-colors"
              >
                {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer; 