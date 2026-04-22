import React from 'react';

const logos = [
  "Zepto", "Swiggy", "Zomato", "Uber", "Blinkit", "CRED", "Razorpay", "Flipkart"
];

const LogoLoop = () => {
  // Duplicate logos to ensure a seamless infinite loop.
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full bg-primary-50 py-16 overflow-hidden flex flex-col items-center relative z-20">

      <div className="mb-10 border-2 border-primary-900 bg-white px-8 py-3 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-1">
        <h3 className="text-sm md:text-base font-black text-primary-900 uppercase tracking-[0.3em] text-center">
          Our Clients
        </h3>
      </div>

      {/* Tape-style loop */}
      <div className="w-full relative flex overflow-x-hidden group border-y-4 border-primary-900 py-8 bg-white/80 backdrop-blur-sm">

        {/* Track */}
        <div className="animate-marquee whitespace-nowrap flex items-center w-max">
          {duplicatedLogos.map((logo, idx) => (
            <div key={idx} className="flex items-center">
              <span
                className="mx-8 md:mx-16 text-5xl md:text-7xl font-black text-white hover:text-primary-900 uppercase tracking-tighter cursor-crosshair transition-all duration-300 hover:scale-105"
                style={{ WebkitTextStroke: '2px #1e3a8a' }}
              >
                {logo}
              </span>
              {/* Boxy separator */}
              <div className="w-3 h-3 bg-primary-600 border-2 border-primary-900 shadow-[2px_2px_0_0_#1e3a8a] rotate-45 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-primary-50 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-primary-50 to-transparent pointer-events-none z-10"></div>
      </div>
    </div>
  );
};

export default LogoLoop;
