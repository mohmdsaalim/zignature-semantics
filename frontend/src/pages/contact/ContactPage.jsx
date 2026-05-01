import React from 'react';
import { HiOutlineChatBubbleLeftEllipsis, HiOutlineBuildingOffice, HiOutlineEnvelope } from 'react-icons/hi2';
import SEO from '../../components/seo/SEO';

const ContactPage = ({ embedded = false }) => {
  return (
    <>
      <SEO 
        title="Contact Us"
        description="Get in touch with Zignature Semantics. We'd love to hear from you. Contact us for business inquiries, support, or partnerships."
        keywords="contact zignature, support, business inquiries, employer sales, job seeker support, headquarters"
      />
      <div className={`relative w-full bg-primary-50 font-sans ${embedded ? '' : 'min-h-screen pb-24 pt-28 md:pt-36'} px-4 sm:px-6 lg:px-8`}>
      
      {/* Background Grid Pattern */}
      {!embedded && (
        <>
          <style>
            {`
              .bg-grid-pattern {
                background-image: linear-gradient(to right, rgba(30, 58, 138, 0.10) 2px, transparent 2px),
                                  linear-gradient(to bottom, rgba(30, 58, 138, 0.10) 2px, transparent 2px);
                background-size: 40px 40px;
              }
            `}
          </style>
          <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"></div>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block mb-4 border-2 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-2">
            <span className="text-sm font-black text-primary-900 uppercase tracking-[0.2em]">We're here to help</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary-900 uppercase tracking-tighter leading-none">
            Get In <span className="text-primary-600">Touch</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl font-bold text-primary-800 max-w-2xl">
            Whether you're a candidate looking for your next big role or an employer scaling your team, our dedicated support staff is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border-4 border-primary-900 p-6 md:p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-primary-100 border-4 border-primary-900 flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#1e3a8a]">
                <HiOutlineChatBubbleLeftEllipsis className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tighter mb-2">Job Seeker Support</h3>
              <p className="text-primary-700 font-bold mb-4">Need help with your profile, applications, or resume formatting?</p>
              <a href="mailto:support@zignature.com" className="text-lg font-black text-primary-600 hover:text-primary-900 uppercase underline decoration-4 underline-offset-4">support@zignature.com</a>
            </div>

            <div className="bg-primary-900 text-white border-4 border-primary-900 p-6 md:p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-primary-600 border-4 border-white flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#ffffff]">
                <HiOutlineBuildingOffice className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Employer Sales</h3>
              <p className="text-primary-200 font-bold mb-4">Want to post jobs in bulk or need a custom hiring solution?</p>
              <a href="mailto:employers@zignature.com" className="text-lg font-black text-white hover:text-primary-300 uppercase underline decoration-4 underline-offset-4">employers@zignature.com</a>
            </div>

            <div className="bg-primary-100 border-4 border-primary-900 p-6 md:p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-white border-4 border-primary-900 flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#1e3a8a]">
                <HiOutlineEnvelope className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tighter mb-2">Global HQ</h3>
              <p className="text-primary-800 font-bold">
                123 Innovation Drive<br />
                Tech District, NY 10001<br />
                United States
              </p>
            </div>

          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] p-6 md:p-10">
              <h2 className="text-3xl font-black text-primary-900 uppercase tracking-tighter mb-8 border-b-4 border-primary-900 pb-4">Send us a message</h2>
              
              <form className="flex flex-col gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="firstName">First Name</label>
                    <input 
                      type="text" id="firstName"
                      className="w-full bg-primary-50 border-2 border-primary-900 p-4 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" id="lastName"
                      className="w-full bg-primary-50 border-2 border-primary-900 p-4 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="email">Email Address</label>
                    <input 
                      type="email" id="email"
                      className="w-full bg-primary-50 border-2 border-primary-900 p-4 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="category">I am a...</label>
                    <div className="relative">
                      <select 
                        id="category"
                        className="w-full bg-primary-50 border-2 border-primary-900 p-4 font-bold text-primary-900 appearance-none focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all cursor-pointer"
                      >
                        <option value="job_seeker">Job Seeker</option>
                        <option value="employer">Employer / Hiring Manager</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none border-l-2 border-primary-900">
                        <svg className="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold text-primary-900 uppercase tracking-wider mb-2 text-sm" htmlFor="message">Message</label>
                  <textarea 
                    id="message" rows="5"
                    className="w-full bg-primary-50 border-2 border-primary-900 p-4 font-bold text-primary-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#1e3a8a] transition-all resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  className="w-full mt-2 bg-primary-900 text-white font-black uppercase tracking-widest text-lg px-8 py-5 border-4 border-primary-900 hover:bg-white hover:text-primary-900 shadow-[6px_6px_0_0_#1e3a8a] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
                >
                  Send Message
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;