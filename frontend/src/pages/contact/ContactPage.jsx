import React from 'react';

const ContactPage = ({ embedded = false }) => {
  return (
    <div className={`w-full bg-primary-900 relative z-10 flex flex-col lg:flex-row ${embedded ? '' : 'min-h-[calc(100vh-100px)]'} overflow-hidden`}>
      
      {/* Left Column - Contact Info */}
      <div className="w-full lg:w-5/12 bg-primary-900 p-6 md:p-10 lg:p-12 flex flex-col justify-between text-white relative flex-shrink-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-green-400 animate-pulse"></div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">COMMS__LINK_OPEN</p>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
              Deploy <br className="hidden md:block" /> The <br className="hidden md:block" /> System.
            </h2>

            <p className="text-sm md:text-base text-primary-200/80 font-medium leading-snug mb-8 max-w-sm">
              We do not accept standard briefs. We execute structural overrides. Submit your parameters, and our engineering team will initiate direct contact.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 font-mono text-sm mt-auto mb-10">
            <div>
              <p className="text-primary-400/60 uppercase tracking-widest mb-1 text-[9px] font-bold">/ Direct Feed</p>
              <a href="mailto:systems@zeg.studio" className="text-base font-bold tracking-tight hover:text-primary-300 transition-colors">systems@zeg.studio</a>
            </div>
            <div>
              <p className="text-primary-400/60 uppercase tracking-widest mb-1 text-[9px] font-bold">/ Secure Line</p>
              <p className="text-base font-bold tracking-tight">+1 (800) 555-0199</p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/20">
             <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">SECURE / END-TO-END ENCRYPTED</p>
          </div>
        </div>
      </div>

      {/* Right Column - The Form */}
      <div className="w-full lg:w-7/12 bg-primary-50 p-6 md:p-10 lg:p-16 border-l-0 lg:border-l-8 border-primary-900 relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[40rem] mx-auto lg:mx-0">
          
          <h3 className="text-2xl md:text-3xl font-black text-primary-900 uppercase tracking-tighter mb-8">Client Parameters</h3>
          
          <form className="flex flex-col gap-5 lg:gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              <div className="flex flex-col">
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="firstName">/ First Name</label>
                <input 
                  type="text" 
                  id="firstName"
                  autoComplete="given-name"
                  className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                  placeholder="Enter First Name"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="lastName">/ Last Name</label>
                <input 
                  type="text" 
                  id="lastName"
                  autoComplete="family-name"
                  className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="email">/ Target Email</label>
              <input 
                type="email" 
                id="email"
                autoComplete="email"
                className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                placeholder="Secure email address"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2" htmlFor="objective">/ Deployment Objective</label>
              <textarea 
                id="objective"
                rows="4"
                className="w-full bg-white border-2 border-primary-900/20 p-3 lg:p-4 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50] resize-none"
                placeholder="Specify the structural changes required..."
              ></textarea>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                className="w-full md:w-auto bg-primary-900 text-white font-black uppercase tracking-widest text-sm lg:text-base px-10 py-4 border-4 border-primary-900 hover:bg-white hover:text-primary-900 shadow-[6px_6px_0_0_#1e3a8a] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
              >
                Transmit Brief
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default ContactPage;