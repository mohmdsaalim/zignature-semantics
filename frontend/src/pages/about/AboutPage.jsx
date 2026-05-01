import { Link } from 'react-router-dom'
import SEO from '../../components/seo/SEO'

const AboutPage = () => {
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about Zignature Semantics, our execution-focused mission, and why companies choose us as their growth partner."
        keywords="about zignature, growth execution, business scaling, execution partner, company mission"
      />
      <div className="w-full bg-primary-50 relative z-10 overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-transparent to-primary-50 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 border-4 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-1">
              <span className="text-sm font-black text-primary-900 uppercase tracking-[0.3em]">Who We Are</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary-900 uppercase tracking-tighter leading-none mb-8">
              We Don't Just <span className="text-primary-600">Plan.</span><br/>We Execute.
            </h1>
            <p className="text-xl md:text-2xl text-primary-800 max-w-3xl mx-auto leading-relaxed font-bold border-t-4 border-primary-900 pt-8 mt-8">
              Most companies know exactly what to do. They just don’t have the right team to do it. That’s where Zignature Semantics comes in.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            
            {/* Left - Story Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border-4 border-primary-900 p-8 md:p-12 shadow-[12px_12px_0_0_#1e3a8a] relative h-full flex flex-col justify-center">
                <div className="absolute -top-4 -left-4 bg-primary-900 text-white font-black text-sm px-4 py-2 uppercase tracking-wider">
                  The Problem Solvers
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter mb-6 leading-tight">
                  Consultants Talk.<br/><span className="text-primary-600">We Deliver.</span>
                </h2>
                <p className="text-lg font-bold text-primary-800 leading-relaxed mb-6">
                  Zignature Semantics Private Limited was built to solve the execution bottleneck in business growth. We don't just hand you a strategy document—we deploy real teams, execute aggressive strategies, and deliver measurable outcomes.
                </p>
                <div className="bg-primary-50 border-l-4 border-primary-900 p-4">
                  <p className="text-base font-black text-primary-900 uppercase tracking-widest">
                    No overthinking. No delays. Just results.
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Our Approach (2x2 Grid replacing stats) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-primary-900 text-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center">
                <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">01</div>
                <div className="text-sm md:text-base font-black uppercase tracking-widest text-primary-300">Understand</div>
                <p className="text-xs mt-2 opacity-80 font-bold hidden sm:block">Aligning with your core business targets.</p>
              </div>
              <div className="bg-white text-primary-900 border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center">
                <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">02</div>
                <div className="text-sm md:text-base font-black uppercase tracking-widest text-primary-600">Execute</div>
                <p className="text-xs mt-2 font-bold hidden sm:block">Deploying teams on-ground and online.</p>
              </div>
              <div className="bg-white text-primary-900 border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center">
                <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">03</div>
                <div className="text-sm md:text-base font-black uppercase tracking-widest text-primary-600">Scale</div>
                <p className="text-xs mt-2 font-bold hidden sm:block">Expanding into new markets rapidly.</p>
              </div>
              <div className="bg-primary-600 text-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center">
                <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">04</div>
                <div className="text-sm md:text-base font-black uppercase tracking-widest text-primary-200">Deliver</div>
                <p className="text-xs mt-2 opacity-90 font-bold hidden sm:block">Generating measurable ROI and growth.</p>
              </div>
            </div>
          </div>

          {/* Mission / Expertise / Edge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            
            {/* Mission */}
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-primary-600 border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4 tracking-tighter">Our Mission</h3>
              <p className="text-primary-800 font-bold leading-relaxed">
                To help businesses <span className="text-primary-600 uppercase font-black">sell smarter</span>, <span className="text-primary-600 uppercase font-black">build better</span>, and <span className="text-primary-600 uppercase font-black">hire faster</span> with strong systems and relentless execution.
              </p>
            </div>

            {/* Expertise */}
            <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-primary-600 border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase mb-4 tracking-tighter">Domain Expertise</h3>
              <p className="text-primary-800 font-bold leading-relaxed mb-4">
                We operate across multiple market verticals, executing strategies for:
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['B2B', 'B2C', 'B2Retail', 'B2B2C', 'B2SMB'].map(tag => (
                  <span key={tag} className="bg-primary-100 text-primary-900 border-2 border-primary-900 px-2 py-1 text-xs font-black uppercase">{tag}</span>
                ))}
              </div>
            </div>

            {/* Why Us */}
            <div className="bg-primary-900 border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#1e3a8a] transition-all duration-300 flex flex-col text-white">
              <div className="w-14 h-14 bg-white border-4 border-primary-900 mb-6 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">Why Choose Us</h3>
              <ul className="space-y-3 font-bold text-primary-100">
                <li className="flex items-center gap-2"><span className="text-white">▪</span> Execution-focused</li>
                <li className="flex items-center gap-2"><span className="text-white">▪</span> Fast and reliable deployment</li>
                <li className="flex items-center gap-2"><span className="text-white">▪</span> Engineered for scale</li>
                <li className="flex items-center gap-2"><span className="text-white">▪</span> Strictly results-driven</li>
              </ul>
            </div>

          </div>

          {/* CTA Section */}
          <div className="bg-white border-4 border-primary-900 p-12 md:p-16 shadow-[12px_12px_0_0_#1e3a8a] relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-8 border-primary-100 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-8 border-primary-100 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-block mb-4 bg-primary-900 text-white px-4 py-1 text-sm font-black uppercase tracking-widest border-2 border-primary-900">
                Take Action
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-900 uppercase tracking-tighter mb-6">
                Ready to <span className="text-primary-600">Execute?</span>
              </h2>
              <p className="text-xl font-bold text-primary-800 mb-10 max-w-2xl mx-auto">
                We don't just support your business—we build the engine that drives it. Let's deploy the right team for your growth today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contact">
                  <button className="bg-primary-900 text-white font-black py-4 px-10 uppercase tracking-wider border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] hover:bg-white hover:text-primary-900 hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all text-lg w-full sm:w-auto">
                    Contact Us
                  </button>
                </Link>
                <Link to="/services">
                  <button className="bg-white text-primary-900 font-black py-4 px-10 uppercase tracking-wider border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] hover:bg-primary-50 hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all text-lg w-full sm:w-auto">
                    View Services
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

     </div>
    </>
   );
 };

export default AboutPage;