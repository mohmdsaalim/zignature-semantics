import HeroSection from '../../components/home/HeroSection'
import LogoLoop from '../../components/home/LogoLoop'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="bg-primary-50">
      {/* Hero Section */}
      <div className="min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-12">
            <div>
              <h1 className="text-8xl md:text-[9rem] leading-none font-black text-primary-900 tracking-tighter uppercase mb-6">
                    Hire<br />
                <span className="text-white text-stroke italic bg-primary-600 px-8 pb-4 inline-block transform -skew-x-6 border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a]">Better</span>
                <style>{`.text-stroke { -webkit-text-stroke: 2px #1e3a8a; }`}</style>
              </h1>
              <p className="max-w-xl text-2xl font-medium text-primary-800 border-primary-600 mt-8">
                "We Don't Just Plan Growth We Execute It."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="boxy-btn text-xl px-12 py-5">Hiring</button>
              <button className="bg-white text-primary-900 font-bold py-5 px-12 uppercase tracking-wider border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] hover:bg-primary-100 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-xl">
                View Work
              </button>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0 hidden lg:block">
            {/* Abstract Boxy Graphic */}
            <div className="w-full aspect-square relative z-10 boxy-card bg-primary-200 border-4 border-primary-900 flex items-center justify-center">
              <div className="text-primary-900 font-black text-6xl tracking-widest uppercase rotate-[-90deg] absolute left-[-60px] opacity-20">Zignature</div>
              <div className="grid grid-cols-2 gap-4 w-3/4 h-3/4">
                <div className="bg-primary-600 border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a]"></div>
                <div className="bg-white border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] row-span-2"></div>
                <div className="bg-primary-900 border-2 border-primary-900"></div>
              </div>
            </div>
            {/* Background offset decorative boxes */}
            <div className="absolute top-12 -right-12 w-full h-full border-4 border-primary-400 z-0"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary-100 border-4 border-primary-900 z-0 bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] [background-size:16px_16px]"></div>
          </div>

        </div>
      </div>

<LogoLoop />

      {/* About Us Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6 border-2 border-primary-900 bg-primary-50 px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-1 w-fit">
                <span className="text-sm font-black text-primary-900 uppercase tracking-[0.3em]">Who We Are</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-primary-900 uppercase tracking-tighter mb-8">
                About <span className="text-primary-600">Zignature</span>
              </h2>
              <p className="text-xl text-primary-800 leading-relaxed mb-8 max-w-lg">
                We are a results-driven growth agency that transforms ambitious brands into market leaders. Our data-led strategies and bold creative approaches ensure measurable ROI.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-primary-50 border-2 border-primary-900 p-4 text-center shadow-[4px_4px_0_0_#1e3a8a]">
                  <div className="text-3xl font-black text-primary-900">500+</div>
                  <div className="text-xs font-bold text-primary-600 uppercase">Projects</div>
                </div>
                <div className="bg-primary-50 border-2 border-primary-900 p-4 text-center shadow-[4px_4px_0_0_#1e3a8a]">
                  <div className="text-3xl font-black text-primary-900">10+</div>
                  <div className="text-xs font-bold text-primary-600 uppercase">Years</div>
                </div>
                <div className="bg-primary-50 border-2 border-primary-900 p-4 text-center shadow-[4px_4px_0_0_#1e3a8a]">
                  <div className="text-3xl font-black text-primary-900">98%</div>
                  <div className="text-xs font-bold text-primary-600 uppercase">Success</div>
                </div>
              </div>
              <Link to="/about">
                <button className="boxy-btn text-lg px-10 py-4">About Us</button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-primary-100 border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-600 h-32 border-2 border-primary-900"></div>
                  <div className="bg-white h-32 border-2 border-primary-900"></div>
                  <div className="bg-white h-32 border-2 border-primary-900"></div>
                  <div className="bg-primary-900 h-32 border-2 border-primary-900"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-900 text-white font-black text-xl px-6 py-4 border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a]">
                Let's Grow Together
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6 border-2 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-1 w-fit mx-auto">
              <span className="text-sm font-black text-primary-900 uppercase tracking-[0.3em]">What We Do</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-primary-900 uppercase tracking-tighter">
              Our <span className="text-primary-600">Services</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer">
              <div className="w-16 h-16 bg-primary-600 border-2 border-primary-900 mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">Digital Growth</h3>
              <p className="text-primary-700 leading-relaxed mb-6">
                Scale your brand with data-driven strategies, performance marketing, and conversion optimization that delivers real results.
              </p>
              <Link to="/services" className="text-primary-900 font-bold uppercase tracking-wider text-sm hover:text-primary-600 transition-colors">
                Learn More →
              </Link>
            </div>

            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer">
              <div className="w-16 h-16 bg-primary-600 border-2 border-primary-900 mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="3" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="square" strokeWidth="3" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">Brand Strategy</h3>
              <p className="text-primary-700 leading-relaxed mb-6">
                Build a powerful brand identity that resonates with your audience and positions you ahead of the competition.
              </p>
              <Link to="/services" className="text-primary-900 font-bold uppercase tracking-wider text-sm hover:text-primary-600 transition-colors">
                Learn More →
              </Link>
            </div>

            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer">
              <div className="w-16 h-16 bg-primary-600 border-2 border-primary-900 mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="3" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">Creative Studio</h3>
              <p className="text-primary-700 leading-relaxed mb-6">
                Bold, memorable creative that captures attention and drives engagement across all digital channels.
              </p>
              <Link to="/services" className="text-primary-900 font-bold uppercase tracking-wider text-sm hover:text-primary-600 transition-colors">
                Learn More →
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <button className="boxy-btn text-lg px-10 py-4">View All Services</button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default HomePage