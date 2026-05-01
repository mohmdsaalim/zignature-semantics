import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { careersApi } from '../../api/careers'
import SEO from '../../components/seo/SEO'
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineMapPin, 
  HiOutlineBriefcase, 
  HiOutlineBuildingOffice2,
  HiOutlineTrophy,
  HiOutlineStar,
  HiOutlineRocketLaunch,
  HiOutlineLightBulb,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiXMark
} from 'react-icons/hi2'

const benefits = [
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Fast Growth', desc: 'Rapid career progression based entirely on your performance and execution.' },
  { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z', title: 'Real Responsibility', desc: 'Take ownership of your projects from day one. No micromanagement, just results.' },
  { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Learning Opportunities', desc: 'Continuous upskilling, mentorship, and exposure to top-tier enterprise strategies.' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Competitive Comp', desc: 'Industry-leading base salaries paired with performance-based incentives.' },
  { icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Execution Culture', desc: 'Work alongside top-tier talent who value action, logic, and measurable outcomes.' },
  { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Flexible Operations', desc: 'Deploy across various environments based on your role, team, and objectives.' }
]

const JOB_TYPE_MAP = {
  'All': null,
  'Full Time': 'full_time',
  'Part Time': 'part_time',
  'Contract': 'contract',
  'Remote': 'remote',
}

const JobModal = ({ job, isOpen, onClose }) => {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && job?.slug) {
      setLoading(true)
      careersApi.getJobBySlug(job.slug)
        .then(data => setDetail(data))
        .catch(err => console.error('Error fetching job detail:', err))
        .finally(() => setLoading(false))
    } else {
      setDetail(null)
    }
  }, [isOpen, job?.slug])

  if (!isOpen || !job) return null
  const displayJob = detail || job

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary-900/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white border-4 border-primary-900 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[16px_16px_0_0_#1e3a8a]">
         
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b-4 border-primary-900 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineBuildingOffice2 className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-black text-primary-600 uppercase tracking-wider">{displayJob.company?.name || 'Zignature'}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-primary-900 uppercase tracking-tighter leading-none">{displayJob.title}</h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white border-4 border-primary-900 flex items-center justify-center hover:bg-primary-100 shadow-[4px_4px_0_0_#1e3a8a] active:shadow-none active:translate-y-1 transition-all shrink-0">
            <HiXMark className="w-8 h-8 text-primary-900" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-primary-50">
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-white border-2 border-primary-900 px-4 py-2 text-sm font-black text-primary-900 uppercase flex items-center gap-2 shadow-[2px_2px_0_0_#1e3a8a]">
              <HiOutlineMapPin className="w-4 h-4"/> {displayJob.location}
            </span>
            <span className="bg-white border-2 border-primary-900 px-4 py-2 text-sm font-black text-primary-900 uppercase flex items-center gap-2 shadow-[2px_2px_0_0_#1e3a8a]">
              <HiOutlineBriefcase className="w-4 h-4"/> {displayJob.job_type_display || 'Full Time'}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
               <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent animate-spin mb-4" />
               <p className="font-black uppercase tracking-widest text-primary-900">Loading details...</p>
             </div>
          ) : (
            <div className="bg-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a]">
              <div className="mb-8">
                <h4 className="text-xl font-black text-primary-900 uppercase mb-4 tracking-wider">Job Description</h4>
                <div className="text-primary-800 leading-relaxed font-medium prose prose-blue" dangerouslySetInnerHTML={{ __html: displayJob.description || 'No description available.' }} />
              </div>

              {displayJob.requirements && (
                <div>
                  <h4 className="text-xl font-black text-primary-900 uppercase mb-4 tracking-wider border-t-4 border-primary-50 pt-8">Requirements</h4>
                  <div className="text-primary-800 leading-relaxed font-medium prose prose-blue" dangerouslySetInnerHTML={{ __html: displayJob.requirements }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t-4 border-primary-900 bg-white">
          <Link to="/contact" className="block w-full">
            <button className="w-full bg-primary-900 text-white font-black py-4 px-8 uppercase tracking-widest border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a] hover:bg-primary-800 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-xl">
              Apply For This Position
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function CareersPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedJob, setSelectedJob] = useState(null)
  
  // Search & Filter States
  const [keyword, setKeyword] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [filter, setFilter] = useState('All')
  
  // Pagination States
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Remote']

  const fetchJobs = async (currentPage = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page: currentPage,
        search: keyword || undefined,
        location: locationQuery || undefined,
      }
      
      const jobTypeParam = JOB_TYPE_MAP[filter]
      if (jobTypeParam) {
        params.job_type = jobTypeParam
      }

      const data = await careersApi.getJobs(params)
      setJobs(data.results || [])
      setTotalCount(data.count || 0)
    } catch (err) {
      setError('Failed to load job listings. Please try again later.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Trigger fetch on Filter or Page change
  useEffect(() => {
    fetchJobs(page)
  }, [filter, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to page 1 on new search
    fetchJobs(1)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <>
      <SEO 
        title="Careers"
        description="Join Zignature Semantics. View open positions in sales, recruitment, marketing, and technology. Grow your career with us."
        keywords="jobs, careers, hiring, job openings, recruitment, sales jobs, technology jobs, growth careers"
      />
      <div className="w-full bg-primary-50 relative z-10 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>

        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6 border-4 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-1">
                <span className="text-sm font-black text-primary-900 uppercase tracking-widest">Careers</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary-900 uppercase tracking-tighter leading-none mb-6">
                Execute. <span className="text-primary-600">Grow.</span> Scale.
              </h1>
              <p className="text-xl text-primary-800 font-bold max-w-2xl mx-auto border-t-4 border-primary-900 pt-6">
                Join a performance-driven company focused on growth and execution. Explore open roles in Sales, Recruitment, Marketing, and Technology.
              </p>
            </div>

            {/* Brutalist Search Bar */}
            <div className="bg-white border-4 border-primary-900 p-4 md:p-6 shadow-[12px_12px_0_0_#1e3a8a] mb-16">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-900" />
                  <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, keywords, or department" 
                    className="w-full bg-primary-50 border-4 border-primary-900 py-4 pl-12 pr-4 font-bold text-primary-900 placeholder-primary-900/50 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <HiOutlineMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-900" />
                  <input 
                    type="text" 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City, state, or remote" 
                    className="w-full bg-primary-50 border-4 border-primary-900 py-4 pl-12 pr-4 font-bold text-primary-900 placeholder-primary-900/50 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
                <button type="submit" className="bg-primary-900 text-white font-black uppercase tracking-widest py-4 px-10 border-4 border-primary-900 hover:bg-primary-800 transition-colors shrink-0">
                  Search Roles
                </button>
              </form>
            </div>

            {/* Main Job Board Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              
              {/* Left Sidebar - Filters */}
              <div className="lg:col-span-3">
                <div className="bg-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] sticky top-32">
                  <h3 className="text-xl font-black text-primary-900 uppercase tracking-tighter border-b-4 border-primary-900 pb-4 mb-6">Filter By Type</h3>
                  <div className="flex flex-col gap-3">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => { setFilter(type); setPage(1); }}
                        className={`text-left px-4 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${
                          filter === type
                            ? 'bg-primary-900 text-white border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-primary-50 text-primary-900 border-primary-900 hover:bg-white hover:shadow-[4px_4px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Area - Job Results */}
              <div className="lg:col-span-9">
                <div className="mb-6 flex justify-between items-center bg-primary-900 text-white p-4 border-4 border-primary-900 shadow-[6px_6px_0_0_#1e3a8a]">
                  <h2 className="text-xl font-black uppercase tracking-widest">{totalCount} Roles Found</h2>
                  {filter !== 'All' && <span className="bg-primary-600 px-3 py-1 font-bold text-xs uppercase">{filter}</span>}
                </div>

                {loading ? (
                  <div className="bg-white border-4 border-primary-900 p-12 shadow-[8px_8px_0_0_#1e3a8a] flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent animate-spin mb-4" />
                    <p className="font-black text-primary-900 uppercase tracking-widest">Searching Roles...</p>
                  </div>
                ) : error ? (
                  <div className="bg-white border-4 border-red-600 p-8 shadow-[8px_8px_0_0_#dc2626]">
                    <p className="text-xl font-black text-red-600 uppercase">{error}</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="bg-white border-4 border-primary-900 p-12 shadow-[8px_8px_0_0_#1e3a8a] text-center">
                    <p className="text-2xl font-black text-primary-900 uppercase mb-2">No positions found</p>
                    <p className="text-primary-700 font-bold">Try adjusting your search keywords or location.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {jobs.map((job) => (
                      <div key={job.id} className="bg-white border-4 border-primary-900 p-6 shadow-[8px_8px_0_0_#1e3a8a] hover:shadow-[12px_12px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer" onClick={() => setSelectedJob(job)}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          
                          {/* Job Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 text-primary-600">
                              <HiOutlineBuildingOffice2 className="w-5 h-5" />
                              <span className="text-sm font-black uppercase tracking-widest">{job.company?.name || 'Zignature'}</span>
                            </div>
                            
                            <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tighter mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                              {job.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-3">
                              <span className="bg-primary-50 border-2 border-primary-900 px-3 py-1 text-xs font-black text-primary-900 uppercase tracking-wider flex items-center gap-1">
                                  <HiOutlineMapPin className="w-4 h-4"/> {job.location}
                              </span>
                              <span className="bg-primary-50 border-2 border-primary-900 px-3 py-1 text-xs font-black text-primary-900 uppercase tracking-wider flex items-center gap-1">
                                  <HiOutlineBriefcase className="w-4 h-4"/> {job.job_type_display || 'Full Time'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Apply Button */}
                          <div className="shrink-0 flex items-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                              className="w-full md:w-auto bg-white text-primary-900 font-black py-3 px-8 uppercase tracking-widest border-4 border-primary-900 hover:bg-primary-900 hover:text-white transition-colors"
                            >
                              View Role
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* API Driven Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="mt-10 flex justify-center items-center gap-4">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-12 h-12 bg-white border-4 border-primary-900 flex items-center justify-center shadow-[4px_4px_0_0_#1e3a8a] disabled:opacity-50 disabled:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                    >
                      <HiOutlineChevronLeft className="w-6 h-6 text-primary-900" />
                    </button>
                    
                    <span className="font-black text-primary-900 uppercase tracking-widest bg-primary-100 px-6 py-2 border-4 border-primary-900">
                      Page {page} of {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-12 h-12 bg-white border-4 border-primary-900 flex items-center justify-center shadow-[4px_4px_0_0_#1e3a8a] disabled:opacity-50 disabled:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                    >
                      <HiOutlineChevronRight className="w-6 h-6 text-primary-900" />
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter border-b-8 border-primary-900 inline-block pb-2">
                  What We Offer
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a] hover:bg-primary-900 hover:text-white group transition-colors duration-300">
                    <div className="w-14 h-14 bg-primary-100 border-4 border-primary-900 mb-6 flex items-center justify-center group-hover:bg-white transition-colors">
                      <svg className="w-7 h-7 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="2.5" d={benefit.icon} />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-tight">{benefit.title}</h3>
                    <p className="font-bold opacity-80">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Culture / Performance Section */}
            <div className="mb-20 bg-primary-900 border-4 border-primary-900 p-8 md:p-12 shadow-[12px_12px_0_0_#1e3a8a] text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                    A Culture of <span className="text-primary-300">Execution</span>
                  </h2>
                  <p className="text-lg text-primary-100 font-bold leading-relaxed mb-6 border-l-4 border-primary-400 pl-4">
                    We don't offer standard jobs. We offer fast growth, real responsibility, and unparalleled learning opportunities for those willing to put in the work.
                  </p>
                  <Link to="/about" className="inline-block bg-white text-primary-900 font-black px-8 py-3 uppercase tracking-widest border-4 border-white hover:bg-transparent hover:text-white transition-colors">
                    Learn About Us
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-800 border-4 border-primary-700 p-6 text-center flex flex-col items-center justify-center">
                    <HiOutlineRocketLaunch className="w-12 h-12 mb-3 text-primary-300" />
                    <div className="text-xs font-black uppercase tracking-widest text-white">Fast Career Growth</div>
                  </div>
                  <div className="bg-primary-800 border-4 border-primary-700 p-6 text-center flex flex-col items-center justify-center">
                    <HiOutlineTrophy className="w-12 h-12 mb-3 text-primary-300" />
                    <div className="text-xs font-black uppercase tracking-widest text-white">Real Responsibility</div>
                  </div>
                  <div className="bg-primary-800 border-4 border-primary-700 p-6 text-center flex flex-col items-center justify-center">
                    <HiOutlineLightBulb className="w-12 h-12 mb-3 text-primary-300" />
                    <div className="text-xs font-black uppercase tracking-widest text-white">Learning Potential</div>
                  </div>
                  <div className="bg-primary-800 border-4 border-primary-700 p-6 text-center flex flex-col items-center justify-center">
                    <HiOutlineStar className="w-12 h-12 mb-3 text-primary-300" />
                    <div className="text-xs font-black uppercase tracking-widest text-white">Top Performers</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <JobModal job={selectedJob} isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} />
      </div>
    </>
  )
}

export default CareersPage
