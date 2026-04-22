import { Link } from 'react-router-dom'

const ServicesPage = () => {
  const services = [
    {
      id: '01',
      title: 'Digital Growth',
      desc: 'Scale your brand with data-driven strategies, performance marketing, and conversion optimization that delivers real results.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      features: ['Performance Marketing', 'SEO & Content Strategy', 'Conversion Optimization', 'Analytics & Reporting']
    },
    {
      id: '02',
      title: 'Brand Strategy',
      desc: 'Build a powerful brand identity that resonates with your audience and positions you ahead of the competition.',
      icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
      features: ['Brand Identity', 'Market Research', 'Positioning Strategy', 'Brand Guidelines']
    },
    {
      id: '03',
      title: 'Creative Studio',
      desc: 'Bold, memorable creative that captures attention and drives engagement across all digital channels.',
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
      features: ['UI/UX Design', 'Video Production', 'Social Media Content', 'Copywriting']
    },
    {
      id: '04',
      title: 'Web Development',
      desc: 'Custom websites and web applications built with cutting-edge technology for maximum performance.',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      features: ['Custom Websites', 'E-Commerce Solutions', 'Web Applications', 'CMS Development']
    },
    {
      id: '05',
      title: 'App Development',
      desc: 'Native and cross-platform mobile applications that provide seamless user experiences.',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      features: ['iOS Development', 'Android Development', 'Cross-Platform Apps', 'App Store Optimization']
    },
    {
      id: '06',
      title: 'Cloud Solutions',
      desc: 'Scalable cloud infrastructure and solutions that ensure reliability and performance.',
      icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
      features: ['Cloud Migration', 'AWS/Azure Solutions', 'DevOps Services', 'Security & Compliance']
    }
  ]

  const process = [
    { step: '01', title: 'Discovery', desc: 'We analyze your business, target audience, and competitors to build a foundation for success.' },
    { step: '02', title: 'Strategy', desc: 'We develop a customized roadmap aligned with your goals and market opportunities.' },
    { step: '03', title: 'Execution', desc: 'Our team implements solutions with precision, using industry best practices and cutting-edge tools.' },
    { step: '04', title: 'Optimization', desc: 'We continuously monitor, analyze, and refine to ensure maximum ROI and growth.' }
  ]

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
              <span className="text-sm font-black text-primary-900 uppercase tracking-[0.3em]">What We Do</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-primary-900 uppercase tracking-tighter leading-none mb-8">
              Our <span className="text-primary-600">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-800 max-w-3xl mx-auto leading-relaxed font-medium">
              Comprehensive digital solutions tailored to transform your business and drive measurable growth.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service) => (
              <div key={service.id} className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary-600 border-2 border-primary-900 flex items-center justify-center group-hover:bg-primary-900 transition-colors">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeWidth="2.5" d={service.icon} />
                    </svg>
                  </div>
                  <span className="text-4xl font-black text-primary-200 group-hover:text-primary-300 transition-colors">{service.id}</span>
                </div>
                <h3 className="text-2xl font-black text-primary-900 uppercase mb-4">{service.title}</h3>
                <p className="text-primary-700 leading-relaxed mb-6">{service.desc}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm font-medium text-primary-800">
                      <span className="w-2 h-2 bg-primary-600 mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="inline-block text-primary-900 font-bold uppercase tracking-wider text-sm hover:text-primary-600 transition-colors">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 border-2 border-primary-900 bg-primary-50 px-4 py-1 shadow-[2px_2px_0_0_#1e3a8a]">
                <span className="text-xs font-black text-primary-900 uppercase tracking-[0.2em]">Our Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter">
                How We <span className="text-primary-600">Work</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={item.step} className="relative">
                  {idx < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-300 -z-10"></div>
                  )}
                  <div className="bg-white border-4 border-primary-900 p-6 shadow-[6px_6px_0_0_#1e3a8a] hover:shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 text-center">
                    <div className="w-16 h-16 bg-primary-900 border-2 border-primary-900 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-black text-white">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-black text-primary-900 uppercase mb-3">{item.title}</h3>
                    <p className="text-sm text-primary-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-20 bg-white border-4 border-primary-900 p-8 md:p-12 shadow-[12px_12px_0_0_#1e3a8a]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4 border-2 border-primary-900 bg-primary-50 px-4 py-1 shadow-[2px_2px_0_0_#1e3a8a]">
                  <span className="text-xs font-black text-primary-900 uppercase tracking-[0.2em]">Why Zignature</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter mb-6">
                  Why Choose <span className="text-primary-600">Us</span>
                </h2>
                <p className="text-lg text-primary-700 leading-relaxed mb-8">
                  We're not just another agency. We're your growth partners committed to delivering exceptional results that impact your bottom line.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Proven Results</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Expert Team</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Transparent</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">24/7 Support</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 border-2 border-primary-900 p-6 text-center">
                  <div className="text-4xl font-black text-primary-900 mb-2">500+</div>
                  <div className="text-sm font-bold text-primary-600 uppercase">Projects</div>
                </div>
                <div className="bg-primary-900 text-white border-2 border-primary-900 p-6 text-center">
                  <div className="text-4xl font-black mb-2">98%</div>
                  <div className="text-sm font-bold opacity-80 uppercase">Success</div>
                </div>
                <div className="bg-primary-900 text-white border-2 border-primary-900 p-6 text-center">
                  <div className="text-4xl font-black mb-2">10+</div>
                  <div className="text-sm font-bold opacity-80 uppercase">Years</div>
                </div>
                <div className="bg-primary-50 border-2 border-primary-900 p-6 text-center">
                  <div className="text-4xl font-black text-primary-900 mb-2">50+</div>
                  <div className="text-sm font-bold text-primary-600 uppercase">Clients</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-900 border-4 border-primary-900 p-12 md:p-16 shadow-[12px_12px_0_0_#1e3a8a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
                Let's Build Something <span className="text-primary-400">Amazing</span>
              </h2>
              <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                Ready to take your business to the next level? Let's discuss how we can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="bg-white text-primary-900 font-bold py-4 px-10 uppercase tracking-wider border-2 border-white shadow-[4px_4px_0_0_#1e3a8a] hover:bg-primary-50 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-lg">
                    Get Started
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="bg-transparent text-white font-bold py-4 px-10 uppercase tracking-wider border-2 border-white shadow-[4px_4px_0_0_#1e3a8a] hover:bg-white hover:text-primary-900 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-lg">
                    Contact Us
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
  )
}

export default ServicesPage
