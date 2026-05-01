import React from 'react';
import logo from '../../assets/Logo_only.PNG'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="relative w-full bg-primary-50 overflow-hidden flex flex-col items-center pt-29 lg:pt-18 sm:pt-24 pb-24 px-4 sm:px-6">
      
      {/* --- Global Styles & Animations --- */}
      <style>
        {`
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(30, 58, 138, 0.15) 2px, transparent 2px),
                              linear-gradient(to bottom, rgba(30, 58, 138, 0.15) 2px, transparent 2px);
            background-size: 48px 48px;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          .animate-float { animation: float 5s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 1s; }
          .text-stroke-primary { -webkit-text-stroke: 2px #1e3a8a; }
          @media (max-width: 640px) {
             .text-stroke-primary { -webkit-text-stroke: 1px #1e3a8a; }
          }
        `}
      </style>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 z-0 pointer-events-none"></div>

      {/* --- Inner Wrapper: Keeps floaters close to the text --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* =========================================
            FLOATING ELEMENTS (Desktop Only)
            These hug the max-w-6xl container now!
        ========================================== */}
        
        {/* Top Left: Dedicated Agents */}
        <div className="hidden lg:flex absolute top-4 -left-4 xl:-left-12 bg-white border-4 border-primary-900 p-2 shadow-[4px_4px_0_0_#1e3a8a] items-center gap-3 animate-float cursor-default">
          <div className="bg-primary-600 text-white p-1.5 border-2 border-primary-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="square" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="pr-2 text-left">
            <p className="text-xs font-black uppercase text-primary-900 tracking-wider leading-tight">Dedicated Agents</p>
            <p className="text-[10px] font-bold text-primary-600">Finding Roles</p>
          </div>
        </div>

        {/* Top Right: User Avatars */}
        <div className="hidden lg:flex absolute top-12 -right-4 xl:-right-12 bg-primary-100 border-4 border-primary-900 p-1.5 shadow-[4px_4px_0_0_#1e3a8a] items-center animate-float-delayed cursor-default">
        <div className="flex -space-x-3 pr-3 pl-1 py-1">
          {/* Avatar 1 */}
          <div className="w-10 h-10 rounded-full border-4 border-primary-900 bg-white overflow-hidden z-30">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK6gonZOgSNlGpzehTZxzghOJ-L2wXK6_ilg&s" 
              alt="User 1" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Avatar 2 */}
          <div className="w-10 h-10 rounded-full border-4 border-primary-900 bg-primary-200 overflow-hidden z-20">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3NWlso4xu4cCFvp7-CbkPA5-CVNGgMQLUUw&s" 
              alt="User 2" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar 3 */}
          <div className="w-10 h-10 rounded-full border-4 border-primary-900 bg-primary-600 overflow-hidden z-10">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/025/465/161/small/young-blonde-woman-in-glasses-monochrome-flat-linear-character-head-short-bob-haircut-editable-outline-hand-drawn-human-face-icon-2d-cartoon-spot-avatar-illustration-for-animation-vector.jpg" 
              alt="User 3" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>


        {/* Bottom Left: Find Best Job */}
        <div className="hidden lg:flex absolute bottom-12 left-0 xl:-left-4 bg-white border-4 border-primary-900 p-3 shadow-[4px_4px_0_0_#1e3a8a] flex-col items-center gap-2 animate-float-delayed cursor-default">
          <div className="bg-primary-900 text-white p-2 border-2 border-primary-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="square" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-primary-900 text-center">Find Jobs</p>
        </div>

        {/* Bottom Right: Upload CV */}
        <div className="hidden lg:flex absolute bottom-4 right-0 xl:-right-4 bg-primary-600 border-4 border-primary-900 p-2.5 shadow-[4px_4px_0_0_#1e3a8a] flex-col items-center gap-2 animate-float cursor-default">
          <div className="bg-white text-primary-900 p-1.5 border-2 border-primary-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="square" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          </div>
          <div className="text-center pb-0.5">
            <p className="text-xs font-black text-white uppercase tracking-wider">Upload CV</p>
          </div>
        </div>

        {/* --- Doodle Arrows (Hidden on Mobile) --- */}
        <svg className="absolute top-19 left-12 xl:left-8 w-12 h-12 text-primary-900 hidden lg:block opacity-40" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3c7 0 10 8 18 11" />
          <path d="M16 14.5l5 0.5l-1 -5" />
        </svg>

        <svg className="absolute bottom-27 right-16 xl:right-12 w-12 h-12 text-primary-900 hidden lg:block opacity-40" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 21c-7 0-10-8-18-11" />
          <path d="M8 9.5l-5 -0.5l1 5" />
        </svg>



        {/* =========================================
            MAIN CENTER CONTENT (Responsive)
        ========================================== */}
        
        {/* Abstract Boxy Cards Graphic - Scaled properly for mobile & desktop */}
        <div className="relative flex justify-center items-end mb-8 md:mb-10 h-28 md:h-36 w-full z-20 scale-90 sm:scale-100">
          
          {/* Left Card */}
          <div className="absolute left-1/2 -translate-x-[110px] md:-translate-x-[140px] bottom-0 w-20 md:w-24 h-28 md:h-32 bg-white border-4 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] -rotate-12 flex flex-col items-center pt-3">
            <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-primary-900 bg-primary-100 rounded-full mb-2"></div>
            <div className="w-12 md:w-14 h-2 bg-primary-900 mb-2"></div>
            <div className="w-8 md:w-10 h-2 bg-primary-900"></div>
          </div>
          
          {/* Center Card */}
          <div className="relative bottom-2 w-28 md:w-32 h-36 md:h-40 bg-primary-600 border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] z-20 flex flex-col items-center pt-5">
            <div className="w-12 h-12 md:w-14 md:h-14 border-4 border-primary-900 bg-white flex items-center justify-center font-black text-xl md:text-2xl text-primary-900 rounded-full mb-3 overflow-hidden"> <img src={logo} alt="ZEG Logo" className="h-16 md:h-20 w-auto object-cover mix-blend-darken" /></div>
            <div className="w-14 md:w-16 h-2 md:h-2.5 bg-primary-900 mb-2"></div>
            <div className="w-10 md:w-12 h-2 md:h-2.5 bg-primary-900"></div>
          </div>

          {/* Right Card */}
          <div className="absolute left-1/2 translate-x-[30px] md:translate-x-[44px] bottom-0 w-20 md:w-24 h-28 md:h-32 bg-primary-200 border-4 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] rotate-12 flex flex-col items-center pt-3">
            <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-primary-900 bg-white rounded-full mb-2"></div>
            <div className="w-12 md:w-14 h-2 bg-primary-900 mb-2"></div>
            <div className="w-8 md:w-10 h-2 bg-primary-900"></div>
          </div>
          
          {/* "Job Plus" style badge */}
          <div className="absolute left-1/2 -translate-x-[130px] md:-translate-x-[170px] bottom-6 md:bottom-8 bg-white border-4 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] px-3 py-1 text-xs md:text-sm font-black text-primary-900 tracking-widest uppercase z-30 transform -rotate-6">
             Job Plus
          </div>
        </div>

        {/* Big Skewed Text */}
        <div className="mb-4 md:mb-6 z-20 relative px-2">
          <span className="text-white text-stroke-primary text-3xl sm:text-4xl md:text-5xl italic bg-primary-600 px-6 md:px-8 pt-2 pb-3 inline-block transform -skew-x-6 border-4 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] md:shadow-[6px_6px_0_0_#1e3a8a] uppercase font-black tracking-tighter">
            Accelerate Your
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black text-primary-900 uppercase tracking-tighter leading-[1.1] mb-6">
          Welcome to <br className="hidden sm:block" />
          <span className="text-primary-600 relative inline-block">
             Zignature
             {/* Underline decorative block */}
             <div className="absolute -bottom-3 md:-bottom-2 left-0 w-full h-3 md:h-4 bg-primary-900 transform -skew-x-12 -z-10"></div>
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl font-bold text-primary-800 mb-10 px-2 leading-relaxed">
          In this fast-paced world, where information overload is the norm, let's cut to the chase and get to the point. How can we help you today?
        </p>

        {/* Call to Actions - Using your provided CSS classes! */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 z-20">
          <Link to='/careers' className="boxy-btn w-full sm:w-auto text-lg md:text-xl px-12">
            Find Jobs
          </Link>
          <Link to='/about' className="boxy-btn-secondary w-full sm:w-auto text-lg md:text-xl px-12">
            About US
          </Link>
        </div>
            
      </div>
    </section>
  );
};

export default HeroSection;