import React from 'react';

const logos = [
  "Zepto", "Swiggy", "Uber", "Bharatpe", "flipkart", "Aditya Birla Capital"
];

const LogoLoop = () => {
  // Duplicate logos to ensure a seamless infinite loop.
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full bg-primary-50 pb-2 overflow-hidden flex flex-col items-center relative z-20">

      {/* --- MATCHING GRID BACKGROUND --- */}
      <style>
        {`
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(30, 58, 138, 0.15) 2px, transparent 2px),
                              linear-gradient(to bottom, rgba(30, 58, 138, 0.15) 2px, transparent 2px);
            background-size: 48px 48px;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-grid-pattern opacity-60 z-0 pointer-events-none"></div>
      {/* -------------------------------- */}

      {/* Main Track Wrapper */}
      <div className="w-full relative mt-8 z-10">
        
        {/* "OUR CLIENTS" Badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
          <div className="border-4 border-primary-900 bg-primary-200 px-8 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
            <h3 className="text-sm md:text-base font-black text-primary-900 uppercase tracking-widest text-center">
              Our Clients
            </h3>
          </div>
        </div>

        {/* Ticker Tape Track */}
        <div className="w-full relative flex overflow-x-hidden group border-y-4 border-primary-900 py-8 bg-white shadow-[0_6px_0_0_#1e3a8a]">
          
          <div className="animate-marquee whitespace-nowrap flex items-center w-max">
            {duplicatedLogos.map((logo, idx) => (
              <div key={idx} className="flex items-center">
                <span
                  className="mx-8 md:mx-16 text-5xl md:text-7xl font-black text-white uppercase tracking-tighter cursor-crosshair transition-all duration-300 hover:text-primary-900 hover:scale-105 hover:-rotate-3"
                  style={{ WebkitTextStroke: '3px #1e3a8a' }}
                >
                  {logo}
                </span>
                
                {/* Boxy separator */}
                <div className="w-4 h-4 bg-primary-600 border-2 border-primary-900 shadow-[2px_2px_0_0_#1e3a8a] rotate-45 shrink-0 transition-transform duration-500 group-hover:rotate-[135deg]"></div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default LogoLoop;