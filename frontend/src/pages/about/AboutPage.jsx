import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="w-full bg-primary-50 relative z-10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-transparent to-primary-50"></div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 border-2 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-1">
              <span className="text-sm font-black text-primary-900 uppercase tracking-[0.3em]">Our Story</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-primary-900 uppercase tracking-tighter leading-none mb-8">
              We Build <span className="text-primary-600">Legacies</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-800 max-w-3xl mx-auto leading-relaxed font-medium">
              From startup to industry leader — we engineer growth strategies that transform businesses into market powerhouses.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            {/* Left - Story Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border-4 border-primary-900 p-8 md:p-12 shadow-[12px_12px_0_0_#1e3a8a] relative">
                <div className="absolute -top-4 -left-4 bg-primary-900 text-white font-black text-sm px-4 py-2 uppercase tracking-wider">
                  Since 2015
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter mb-6">
                  Systems <span className="text-primary-600">Over</span> Chaos
                </h2>
                <p className="text-lg text-primary-800 leading-relaxed mb-6">
                  We don't just design interfaces — we engineer monolithic structural experiences built for massive impact and uncompromising precision. Function strictly dictates form.
                </p>
                <p className="text-base text-primary-700 leading-relaxed">
                  Our protocol is simple: remove decorative fluff, optimize interaction pathways, and build systems that scale continuously without friction. True aesthetics are derived from structural perfection.
                </p>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-primary-900 text-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black mb-2">10+</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Years Experience</div>
              </div>
              <div className="bg-white text-primary-900 border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black mb-2">500+</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Projects Delivered</div>
              </div>
              <div className="bg-white text-primary-900 border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black mb-2">98%</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Success Rate</div>
              </div>
              <div className="bg-primary-600 text-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black mb-2">24/7</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Support</div>
              </div>
            </div>
          </div>

          {/* Mission Vision Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-14 h-14 bg-primary-600 border-2 border-primary-900 mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">Mission</h3>
              <p className="text-primary-700 leading-relaxed">
                To empower brands with data-driven strategies and bold creative that delivers measurable, sustainable growth.
              </p>
            </div>

            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-14 h-14 bg-primary-600 border-2 border-primary-900 mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="square" strokeWidth="3" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">Vision</h3>
              <p className="text-primary-700 leading-relaxed">
                To be the go-to growth partner for ambitious brands seeking to dominate their markets through innovation.
              </p>
            </div>

            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-14 h-14 bg-primary-600 border-2 border-primary-900 mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">Values</h3>
              <p className="text-primary-700 leading-relaxed">
                Innovation, integrity, and results. We obsess over outcomes, not just outputs. Every decision is data-backed.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-900 border-4 border-primary-900 p-12 md:p-16 shadow-[12px_12px_0_0_#1e3a8a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
                Ready to <span className="text-primary-400">Transform</span> Your Business?
              </h2>
              <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                Let's build something extraordinary together. Our team is ready to take your brand to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="bg-white text-primary-900 font-bold py-4 px-10 uppercase tracking-wider border-2 border-white shadow-[4px_4px_0_0_#1e3a8a] hover:bg-primary-50 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-lg">
                    Get In Touch
                  </button>
                </Link>
                <Link to="/services">
                  <button className="bg-transparent text-white font-bold py-4 px-10 uppercase tracking-wider border-2 border-white shadow-[4px_4px_0_0_#1e3a8a] hover:bg-white hover:text-primary-900 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-lg">
                    Our Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -left-20 top-1/4 w-40 h-40 border-4 border-primary-900/10 rotate-45 hidden lg:block"></div>
      <div className="absolute -right-20 bottom-1/4 w-60 h-60 border-4 border-primary-900/10 rotate-12 hidden lg:block"></div>
    </div>
  );
};

export default AboutPage;
