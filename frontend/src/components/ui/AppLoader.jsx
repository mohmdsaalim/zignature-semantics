import React from 'react';

function AppLoader() {
  return (
    // PERFECT CENTERING: Uses 150vw/vh to beat the 0.8 zoom, perfectly centered using translate
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-primary-50 flex flex-col items-center justify-center z-[9999]">
      
      {/* Subtle Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(30, 58, 138, 0.15) 2px, transparent 2px), linear-gradient(to bottom, rgba(30, 58, 138, 0.15) 2px, transparent 2px)',
          backgroundSize: '48px 48px'
        }}
      ></div>

      {/* Main Content Wrapper - Added px-6 for mobile breathing room */}
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-6 px-6 w-full max-w-sm">
        
        {/* Brand Identity - Scaled down for mobile */}
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 border-[3px] md:border-4 border-primary-900 flex items-center justify-center shadow-[3px_3px_0_0_#1e3a8a] md:shadow-[4px_4px_0_0_#1e3a8a] shrink-0">
            <span className="text-white font-black text-xl md:text-2xl leading-none">Z</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter truncate">
            Zignature
          </h1>
        </div>

        {/* Minimal Brutalist Progress Bar - Responsive Width */}
        <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[320px] h-6 md:h-8 bg-white border-[3px] md:border-4 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] md:shadow-[6px_6px_0_0_#1e3a8a] overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-primary-600 border-r-[3px] md:border-r-4 border-primary-900 animate-brutal-load"></div>
        </div>

        {/* Status Text - Scaled down tracking and text size for mobile */}
        <div className="flex items-center justify-center gap-2 md:gap-3 mt-1 w-full">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-primary-900 animate-pulse shrink-0"></div>
          <p className="font-bold text-[10px] sm:text-xs md:text-sm text-primary-900 uppercase tracking-widest md:tracking-[0.2em] text-center">
            Connecting Workspace
          </p>
        </div>

      </div>

      {/* High-Performance Animation CSS */}
      <style>
        {`
          @keyframes brutalLoad {
            0% { transform: translate3d(-100%, 0, 0); }
            100% { transform: translate3d(200%, 0, 0); }
          }
          .animate-brutal-load {
            animation: brutalLoad 0.8s infinite cubic-bezier(0.65, 0, 0.35, 1);
            will-change: transform;
          }
        `}
      </style>

    </div>
  )
}

export default AppLoader;