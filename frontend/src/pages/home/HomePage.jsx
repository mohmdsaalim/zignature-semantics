import HeroSection from '../../components/home/HeroSection'
import LogoLoop from '../../components/home/LogoLoop'
import { Link } from 'react-router-dom'
import logo from '../../assets/Logo_only.PNG'
import SEO from '../../components/seo/SEO'

function HomePage() {
  return (
    <>
      <SEO 
        title="Home"
        description="Engineering monolithic structural experiences for the digital frontier. We help businesses sell smarter, build better, and hire faster."
        keywords="web development, digital agency, growth execution, recruitment, sales, marketing, market expansion"
      />
      <div className="bg-primary-50 font-sans">
      {/* Hero Section */}
      <HeroSection />
      <LogoLoop />

      {/* About Us Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div>
              <div className="mb-6 border-4 border-primary-900 bg-primary-100 px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-2 w-fit">
                <span className="text-sm font-black text-primary-900 uppercase tracking-widest">We Make It Happen</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black text-primary-900 uppercase tracking-tighter mb-6 leading-[0.9]">
                Sell Smarter.<br/>
                <span className="text-primary-600">Build Better.</span><br/>
                Hire Faster.
              </h2>
              
              <p className="text-xl font-bold text-primary-800 leading-relaxed mb-8 max-w-lg">
                Zignature Semantics Private Limited is a growth execution partner helping businesses scale through sales, hiring, and market expansion. 
                <span className="block mt-4 bg-primary-200 p-4 border-l-4 border-primary-900 text-primary-900">
                  We don’t just support your business. we build the engine that drives it.
                </span>
              </p>
              
              {/* Stats Block */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white border-4 border-primary-900 p-4 text-center shadow-[4px_4px_0_0_#1e3a8a] hover:-translate-y-1 transition-transform">
                  <div className="text-3xl lg:text-4xl font-black text-primary-900">Fast</div>
                  <div className="text-[10px] sm:text-xs font-black text-primary-600 uppercase tracking-wider mt-1">Execution</div>
                </div>
                <div className="bg-white border-4 border-primary-900 p-4 text-center shadow-[4px_4px_0_0_#1e3a8a] hover:-translate-y-1 transition-transform">
                  <div className="text-3xl lg:text-4xl font-black text-primary-900">Scale</div>
                  <div className="text-[10px] sm:text-xs font-black text-primary-600 uppercase tracking-wider mt-1">Operations</div>
                </div>
                <div className="bg-white border-4 border-primary-900 p-4 text-center shadow-[4px_4px_0_0_#1e3a8a] hover:-translate-y-1 transition-transform">
                  <div className="text-3xl lg:text-4xl font-black text-primary-900">ROI</div>
                  <div className="text-[10px] sm:text-xs font-black text-primary-600 uppercase tracking-wider mt-1">Driven</div>
                </div>
              </div>
              
              <Link to="/about">
                <button className="boxy-btn text-lg px-10 py-4">About Us</button>
              </Link>
            </div>

            {/* Right Abstract Graphic */}
            <div className="relative mt-8 lg:mt-0 px-4 md:px-0">
              <div className="bg-primary-600 border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white h-32 border-4 border-primary-900 flex items-center justify-center">
                     <span className="font-black text-4xl text-primary-900"> <img src={logo} alt="ZEG Logo" className="h-18 md:h-20 w-auto object-contain mix-blend-darken" /></span>
                  </div>
                  <div className="bg-primary-200 h-32 border-4 border-primary-900"></div>
                  <div className="bg-primary-900 h-32 border-4 border-primary-900"></div>
                  <div className="bg-white h-32 border-4 border-primary-900 flex items-center justify-center p-4 text-center">
                    <span className="font-black text-xl text-primary-900 uppercase leading-tight tracking-tighter">Scale<br/>Faster</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 md:-bottom-8 -right-2 md:-right-6 bg-white text-primary-900 font-black text-lg md:text-xl px-6 py-4 border-4 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-3">
                Growth Execution Partner
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Breakout Banner: Why Choose Us */}
      <div className="w-full bg-primary-900 border-y-4 border-primary-900 py-12 px-4 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
            Why Companies Choose Us
          </h3>
          <p className="text-lg md:text-2xl font-bold text-primary-200 leading-relaxed">
            We focus on execution, helping businesses <span className="text-white bg-primary-600 px-3 rounded-md">acquire customers</span>, <span className="text-white bg-primary-600 px-3 rounded-md">expand markets</span>, and <span className="text-white bg-primary-600 px-3 rounded-md">scale operations</span> faster.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="mb-6 border-4 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-2 w-fit mx-auto">
              <span className="text-sm font-black text-primary-900 uppercase tracking-widest">What We Do</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-primary-900 uppercase tracking-tighter">
              Our <span className="text-primary-600">Solutions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service 1: Recruitment & Staffing */}
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-primary-600 border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="square" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-3 leading-tight tracking-tighter">Recruitment & Staffing</h3>
              <p className="text-primary-800 font-bold leading-relaxed mb-6 flex-grow">
                End-to-end talent acquisition for both IT and Non-IT sectors. We find the right people to build your engine.
              </p>
              <Link to="/services" className="text-primary-900 font-black uppercase tracking-widest text-sm hover:text-primary-600 transition-colors mt-auto border-t-2 border-primary-900 pt-4 w-fit">
                Explore →
              </Link>
            </div>

            {/* Service 2: Managed Sales */}
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-primary-200 border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="square" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-3 leading-tight tracking-tighter">Managed Sales & Acquisition</h3>
              <p className="text-primary-800 font-bold leading-relaxed mb-6 flex-grow">
                Accelerate revenue. We manage your sales pipeline and merchant acquisition so you can focus on scale.
              </p>
              <Link to="/services" className="text-primary-900 font-black uppercase tracking-widest text-sm hover:text-primary-600 transition-colors mt-auto border-t-2 border-primary-900 pt-4 w-fit">
                Explore →
              </Link>
            </div>

            {/* Service 3: Gig Workforce */}
            <div className="bg-primary-900 border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-white border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="square" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-3 leading-tight tracking-tighter">Gig Workforce Solutions</h3>
              <p className="text-primary-200 font-bold leading-relaxed mb-6 flex-grow">
                Flexible, on-demand workforce scaling to meet your immediate operational needs without the overhead.
              </p>
              <Link to="/services" className="text-white font-black uppercase tracking-widest text-sm hover:text-primary-300 transition-colors mt-auto border-t-2 border-primary-400 pt-4 w-fit">
                Explore →
              </Link>
            </div>

            {/* Service 4: Marketing Execution */}
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-primary-100 border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="square" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="square" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-3 leading-tight tracking-tighter">ATL & BTL Marketing</h3>
              <p className="text-primary-800 font-bold leading-relaxed mb-6 flex-grow">
                Comprehensive marketing execution. Above The Line and Below The Line strategies turned into physical results.
              </p>
              <Link to="/services" className="text-primary-900 font-black uppercase tracking-widest text-sm hover:text-primary-600 transition-colors mt-auto border-t-2 border-primary-900 pt-4 w-fit">
                Explore →
              </Link>
            </div>

            {/* Service 5: Web & App Dev */}
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-primary-600 border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="square" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-3 leading-tight tracking-tighter">Web & App Development</h3>
              <p className="text-primary-800 font-bold leading-relaxed mb-6 flex-grow">
                Custom software solutions. We build the digital infrastructure your business needs to operate efficiently.
              </p>
              <Link to="/services" className="text-primary-900 font-black uppercase tracking-widest text-sm hover:text-primary-600 transition-colors mt-auto border-t-2 border-primary-900 pt-4 w-fit">
                Explore →
              </Link>
            </div>

             {/* Service 6: Market Expansion */}
             <div className="bg-primary-100 border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-white border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="square" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-3 leading-tight tracking-tighter">Market Expansion</h3>
              <p className="text-primary-800 font-bold leading-relaxed mb-6 flex-grow">
                Break into new territories. We deploy the groundwork required to successfully enter and dominate new markets.
              </p>
              <Link to="/services" className="text-primary-900 font-black uppercase tracking-widest text-sm hover:text-primary-600 transition-colors mt-auto border-t-2 border-primary-900 pt-4 w-fit">
                Explore →
              </Link>
            </div>

          </div>

          <div className="text-center mt-16">
            <Link to="/services">
              <button className="bg-primary-900 text-white font-black py-4 px-12 uppercase tracking-wider border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] hover:bg-white hover:text-primary-900 hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all text-xl">
                View All Capabilities
              </button>
            </Link>
          </div>
        </div>
      </div>

     </div>
    </>
   )
 }

 export default HomePage