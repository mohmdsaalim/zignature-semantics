import { Link } from 'react-router-dom'
import SEO from '../../components/seo/SEO'

const ServicesPage = () => {
  // Client-provided content mapped into your exact structure
  const services = [
    {
      id: '01',
      title: 'Managed Sales & Acquisition',
      desc: 'Aggressive market expansion and lead generation. We build and deploy high-performance sales teams to capture your target market.',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      features: ['Merchant Acquisition', 'Market Expansion', 'Lead Generation', 'Sales Team Deployment']
    },
    {
      id: '02',
      title: 'Merchant Lifecycle',
      desc: 'End-to-end management of your merchant network. We ensure high engagement from day one to long-term retention.',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      features: ['Onboarding & Activation', 'Order Handling', 'Upselling Strategies', 'Long-term Retention']
    },
    {
      id: '03',
      title: 'Recruitment & Staffing',
      desc: 'We find the right people to build your engine. Fast, reliable hiring solutions tailored to your operational requirements.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      features: ['IT & Non-IT Hiring', 'Bulk Recruitment', 'Sales Hiring', 'Executive Sourcing']
    },
    {
      id: '04',
      title: 'Marketing (ATL & BTL)',
      desc: 'Comprehensive marketing execution. We combine mass media reach with direct on-ground engagement to acquire customers rapidly.',
      icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
      features: ['Brand Campaigns (ATL)', 'Field Marketing (BTL)', 'Customer Acquisition', 'On-Ground Execution']
    },
    {
      id: '05',
      title: 'Technology Solutions',
      desc: 'We build the digital infrastructure your business needs to operate efficiently and scale without friction.',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      features: ['Website Development', 'Mobile App Development', 'Automation Tools', 'Custom Software']
    },
    {
      id: '06',
      title: 'Gig Workforce Solutions',
      desc: 'Flexible, on-demand workforce scaling to meet your immediate operational needs without the heavy overhead.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      features: ['On-Demand Scaling', 'Task-Based Deployment', 'Flex Staffing', 'Operational Agility']
    }
  ]

  const process = [
    { step: '01', title: 'Understand', desc: 'We align perfectly with your core business targets and current operational bottlenecks.' },
    { step: '02', title: 'Strategize', desc: 'We develop a rigid, no-nonsense execution plan. No overthinking. No delays.' },
    { step: '03', title: 'Execute', desc: 'We deploy real teams on-ground and online to deliver measurable outcomes immediately.' },
    { step: '04', title: 'Scale', desc: 'Once the system is proven, we rapidly expand your reach into new markets.' }
  ]

  return (
    <>
      <SEO
        title="Services"
        description="Explore our digital engineering and growth execution services including recruitment, managed sales, web development, and market expansion."
        keywords="web development, recruitment, sales acquisition, marketing, gig workforce, technology solutions, market expansion"
      />
      <div className="w-full bg-primary-50 relative z-10 overflow-hidden font-sans">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-transparent to-primary-50 pointer-events-none"></div>

        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-6 border-4 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-1">
                <span className="text-sm font-black text-primary-900 uppercase tracking-widest">Capabilities</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary-900 uppercase tracking-tighter leading-none mb-8">
                We Are the <span className="text-primary-600">Engine.</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-800 max-w-3xl mx-auto leading-relaxed font-bold border-t-4 border-primary-900 pt-8 mt-8">
                We deploy real teams, execute strategies, and deliver measurable outcomes across sales, marketing, technology, and staffing.
              </p>
            </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service) => (
              <div key={service.id} className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 group flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary-600 border-4 border-primary-900 flex items-center justify-center shadow-[4px_4px_0_0_#1e3a8a] group-hover:bg-primary-900 transition-colors">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeWidth="2.5" d={service.icon} />
                    </svg>
                  </div>
                  <span className="text-4xl font-black text-primary-200 group-hover:text-primary-300 transition-colors tracking-tighter">{service.id}</span>
                </div>
                <h3 className="text-2xl font-black text-primary-900 uppercase mb-4 tracking-tighter leading-tight">{service.title}</h3>
                <p className="text-primary-800 font-bold leading-relaxed mb-6 flex-grow">{service.desc}</p>
                
                <ul className="space-y-3 mb-8 border-t-2 border-primary-100 pt-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm font-black text-primary-900 uppercase tracking-widest">
                      <span className="w-3 h-3 bg-primary-600 border-2 border-primary-900 mr-3 shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto inline-block text-white bg-primary-900 px-6 py-3 font-black uppercase tracking-widest text-xs border-2 border-primary-900 hover:bg-white hover:text-primary-900 transition-colors w-fit shadow-[4px_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                  Deploy Team →
                </Link>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 border-4 border-primary-900 bg-primary-100 px-4 py-1 shadow-[4px_4px_0_0_#1e3a8a] -rotate-1">
                <span className="text-xs font-black text-primary-900 uppercase tracking-widest">Our Approach</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-primary-900 uppercase tracking-tighter">
                How We <span className="text-primary-600">Execute</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={item.step} className="relative">
                  {idx < process.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-1 bg-primary-900 -z-10"></div>
                  )}
                  <div className="bg-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 text-center h-full flex flex-col">
                    <div className="w-20 h-20 bg-primary-900 border-4 border-primary-900 mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0_0_#1e3a8a]">
                      <span className="text-3xl font-black text-white">{item.step}</span>
                    </div>
                    <h3 className="text-2xl font-black text-primary-900 uppercase mb-3 tracking-tighter">{item.title}</h3>
                    <p className="text-sm font-bold text-primary-800 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-20 bg-primary-900 border-4 border-primary-900 p-8 md:p-12 shadow-[12px_12px_0_0_#1e3a8a] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4 border-2 border-white bg-primary-600 px-4 py-1 shadow-[4px_4px_0_0_#ffffff] rotate-1">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Why Zignature</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                  Built For <span className="text-primary-300">Scale</span>
                </h2>
                <p className="text-lg font-bold text-primary-100 leading-relaxed mb-8 border-l-4 border-primary-400 pl-4">
                  We focus purely on execution. If you need a partner to actually do the heavy lifting, acquire customers, and scale operations rapidly—we are it.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <span className="w-10 h-10 bg-white border-4 border-primary-900 mr-3 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="font-black uppercase tracking-wider text-sm">Execution Focused</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-10 h-10 bg-white border-4 border-primary-900 mr-3 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="font-black uppercase tracking-wider text-sm">Fast & Reliable</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-10 h-10 bg-white border-4 border-primary-900 mr-3 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="font-black uppercase tracking-wider text-sm">Results Driven</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-10 h-10 bg-white border-4 border-primary-900 mr-3 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="font-black uppercase tracking-wider text-sm">National Reach</span>
                  </div>
                </div>
              </div>

              {/* Stats Block inside the Blue Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white text-primary-900 border-4 border-primary-900 p-6 text-center shadow-[4px_4px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform">
                  <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">B2B</div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary-600">Enterprise</div>
                </div>
                <div className="bg-primary-600 text-white border-4 border-primary-900 p-6 text-center shadow-[4px_4px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform">
                  <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">B2C</div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary-200">Consumer</div>
                </div>
                <div className="bg-primary-200 text-primary-900 border-4 border-primary-900 p-6 text-center shadow-[4px_4px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform">
                  <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">B2R</div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary-700">Retail</div>
                </div>
                <div className="bg-white text-primary-900 border-4 border-primary-900 p-6 text-center shadow-[4px_4px_0_0_#1e3a8a] transform hover:-translate-y-2 transition-transform">
                  <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">SMB</div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary-600">Small Business</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white border-4 border-primary-900 p-12 md:p-16 shadow-[12px_12px_0_0_#1e3a8a] relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-8 border-primary-100 rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-900 uppercase tracking-tighter mb-6 leading-tight">
                No Delays.<br className="hidden md:block"/>Just <span className="text-primary-600">Results.</span>
              </h2>
              <p className="text-xl font-bold text-primary-800 mb-10 max-w-2xl mx-auto">
                Stop planning and start executing. Contact our team today to deploy operations that scale your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contact">
                  <button className="bg-primary-900 text-white font-black py-4 px-10 uppercase tracking-wider border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] hover:bg-white hover:text-primary-900 hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all text-lg w-full sm:w-auto">
                    Contact Us
                  </button>
                </Link>
                <Link to="/about">
                  <button className="bg-white text-primary-900 font-black py-4 px-10 uppercase tracking-wider border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] hover:bg-primary-50 hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all text-lg w-full sm:w-auto">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
           
        </div>
      </div>
    </div>
    </>
  )
}

export default ServicesPage