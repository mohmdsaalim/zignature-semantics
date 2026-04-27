import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans flex flex-col items-center justify-center pt-20 pb-16">
      {/* --- Global Styles & Animations --- */}
      <style>
        {`
          .bg-grid-pattern {
            background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px),
                              linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
            background-size: 40px 40px;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes float-delayed {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        `}
      </style>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80 z-0 pointer-events-none"></div>

      {/* --- Floating UI Elements --- */}
      
      {/* Top Left: Dedicated Agents */}
      <div className="absolute top-16 left-4 md:top-24 md:left-12 lg:left-24 bg-white rounded-2xl border border-gray-200 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3 z-20 animate-float">
        <div className="bg-gray-900 text-white p-2.5 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="hidden sm:block pr-2">
          <p className="text-sm font-bold text-gray-900 leading-tight">Dedicated Agents</p>
          <p className="text-[11px] text-gray-500">Finding well-paid roles</p>
        </div>
      </div>

      {/* Top Right: User Avatars */}
      <div className="absolute top-20 right-4 md:top-28 md:right-12 lg:right-24 bg-white rounded-full border border-gray-200 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center z-20 animate-float-delayed">
        <div className="flex -space-x-3 pr-4">
          <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0000FF] flex items-center justify-center text-white text-xs font-bold z-30">Z</div>
          <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold z-20">S</div>
          <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-200 flex items-center justify-center text-blue-800 text-xs font-bold z-10">M</div>
        </div>
        <div className="bg-gray-900 rounded-full p-2 text-white mr-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>

      {/* Bottom Left: Find Best Job */}
      <div className="absolute bottom-32 left-4 md:bottom-40 md:left-16 lg:left-32 bg-white rounded-2xl border border-gray-200 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center gap-2 z-20 animate-float-delayed">
        <div className="bg-gray-900 text-white p-3 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <p className="text-xs font-bold text-gray-900 text-center">Find Best Job</p>
      </div>

      {/* Bottom Right: Upload CV */}
      <div className="absolute bottom-24 right-4 md:bottom-36 md:right-16 lg:right-32 bg-white rounded-2xl border border-gray-200 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center gap-2 z-20 animate-float">
        <div className="bg-gray-900 text-white p-2.5 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        </div>
        <div className="text-center pb-1">
          <p className="text-xs font-bold text-gray-900">Upload Your CV</p>
          <p className="text-[9px] text-gray-500">Takes a few seconds</p>
        </div>
      </div>

      {/* --- Doodle Arrows --- */}
      {/* Top Left Arrow */}
      <svg className="absolute top-36 left-12 md:left-32 w-16 h-16 text-gray-400 z-10 hidden md:block" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M 20,20 Q 50,20 60,60 T 90,80" />
        <path d="M 75,70 L 90,80 L 85,95" />
      </svg>
      {/* Bottom Right Arrow */}
      <svg className="absolute bottom-56 right-16 md:right-40 w-16 h-16 text-gray-400 z-10 hidden md:block" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M 80,80 Q 60,80 50,40 T 20,20" />
        <path d="M 35,15 L 20,20 L 25,35" />
      </svg>


      {/* --- Main Center Content --- */}
      <div className="relative z-30 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-12 w-full">
        
        {/* Abstract "Group" Illustration Replacement (Stylized Avatars) */}
        <div className="relative flex justify-center items-end mb-8 h-32 w-full max-w-lg">
          <div className="absolute -left-4 bottom-0 w-20 h-28 bg-blue-50 rounded-t-full border-2 border-blue-200 flex flex-col items-center pt-4 z-10">
             <div className="w-10 h-10 rounded-full bg-blue-300 mb-2"></div>
          </div>
          <div className="absolute left-12 bottom-0 w-24 h-36 bg-gray-100 rounded-t-full border-2 border-gray-300 flex flex-col items-center pt-6 z-20 shadow-lg">
             <div className="w-12 h-12 rounded-full bg-gray-400 mb-2"></div>
          </div>
          <div className="relative bottom-0 w-28 h-40 bg-[#0000FF] rounded-t-full border-2 border-[#0000FF] flex flex-col items-center pt-6 z-30 shadow-xl">
             <div className="w-14 h-14 rounded-full bg-white mb-2"></div>
          </div>
          <div className="absolute right-12 bottom-0 w-24 h-36 bg-gray-100 rounded-t-full border-2 border-gray-300 flex flex-col items-center pt-6 z-20 shadow-lg">
             <div className="w-12 h-12 rounded-full bg-gray-400 mb-2"></div>
          </div>
          <div className="absolute -right-4 bottom-0 w-20 h-28 bg-blue-50 rounded-t-full border-2 border-blue-200 flex flex-col items-center pt-4 z-10">
             <div className="w-10 h-10 rounded-full bg-blue-300 mb-2"></div>
          </div>
          
          {/* Small badge overlapping the avatars */}
          <div className="absolute -left-12 md:-left-20 bottom-8 bg-white border shadow-sm px-4 py-2 rounded-xl text-sm font-bold text-gray-800 z-40 transform -rotate-3">
             Career Plus
          </div>
        </div>

        {/* Big Pill Shaped Text (Inspired by the purple "Understand The") */}
        <div className="bg-[#e5eaff] text-[#0000FF] rounded-full px-8 py-3 md:px-14 md:py-5 mb-4 shadow-sm w-full md:w-auto overflow-hidden relative">
            <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-black tracking-tight uppercase relative z-10">
              Accelerate Your
            </h2>
            {/* Subtle background shape inside the pill */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-30 rounded-full blur-xl z-0"></div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-gray-900 tracking-tight leading-none mb-8">
          Welcome to <span className="text-[#0000FF]">Zignature</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          In this fast-paced world, where information overload is the norm, let's cut to the chase and get to the point. How can we help you today?
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="bg-[#0000FF] hover:bg-blue-800 text-white font-semibold py-4 px-10 rounded-full transition-all hover:shadow-lg hover:-translate-y-1 text-lg w-full sm:w-auto">
            Find Jobs
          </button>
          <button className="bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-semibold py-4 px-10 rounded-full transition-all text-lg w-full sm:w-auto">
            Post a Job
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;