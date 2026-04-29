import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { careersApi } from '../../api/careers'

const benefits = [
  { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and family' },
  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Flexible Hours', desc: 'Work-life balance with flexible scheduling' },
  { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Remote Work', desc: 'Work from anywhere globally' },
  { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', title: 'Learning Budget', desc: 'Annual budget for courses and conferences' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Team Events', desc: 'Regular team building activities and celebrations' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Competitive Salary', desc: 'Industry-leading compensation packages' }
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true)
      careersApi.getJobBySlug(job.slug)
        .then(data => setDetail(data))
        .catch(err => console.error('Error fetching job detail:', err))
        // eslint-disable-next-line react-hooks/set-state-in-effect
        .finally(() => setLoading(false))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetail(null)
    }
  }, [isOpen, job?.slug])

  if (!isOpen || !job) return null

  const displayJob = detail || job

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white border-4 border-primary-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[16px_16px_0_0_#1e3a8a]">
        <div className="sticky top-0 bg-white border-b-4 border-primary-900 p-6 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{displayJob.company?.name || 'Company'}</span>
            <h3 className="text-2xl md:text-3xl font-black text-primary-900 uppercase">{displayJob.title}</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-primary-900 border-2 border-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-primary-50 border-2 border-primary-900 px-4 py-1 text-sm font-bold text-primary-900">{displayJob.location}</span>
            <span className="bg-primary-50 border-2 border-primary-900 px-4 py-1 text-sm font-bold text-primary-900">{displayJob.job_type_display}</span>
            <span className="bg-primary-50 border-2 border-primary-900 px-4 py-1 text-sm font-bold text-primary-900">{displayJob.experience_level_display}</span>
          </div>

          {loading ? (
            <p className="text-center py-8 text-primary-700">Loading job details...</p>
          ) : (
            <>
              <div className="mb-8">
                <h4 className="text-lg font-black text-primary-900 uppercase mb-3 border-b-2 border-primary-900 pb-2">Description</h4>
                <div className="text-primary-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: displayJob.description || 'No description available.' }} />
              </div>

              {displayJob.requirements && (
                <div className="mb-8">
                  <h4 className="text-lg font-black text-primary-900 uppercase mb-3 border-b-2 border-primary-900 pb-2">Requirements</h4>
                  <div className="text-primary-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: displayJob.requirements }} />
                </div>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/contact" className="flex-1">
              <button className="w-full boxy-btn text-lg py-4">Apply Now</button>
            </Link>
            <button onClick={onClose} className="flex-1 bg-white text-primary-900 font-bold py-4 px-8 uppercase tracking-wider border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] hover:bg-primary-50 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-lg">
              Close
            </button>
          </div>
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
  const [filter, setFilter] = useState('All')

  const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Remote']

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {}
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

    fetchJobs()
  }, [filter])

  return (
    <div className="w-full bg-primary-50 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-block mb-6 border-2 border-primary-900 bg-white px-6 py-2 shadow-[4px_4px_0_0_#1e3a8a] transform rotate-1">
                <span className="text-sm font-black text-primary-900 uppercase tracking-[0.3em]">Careers</span>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-primary-900 uppercase tracking-tighter leading-none mb-8">
                Join Our <span className="text-primary-600">Team</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-800 leading-relaxed font-medium mb-8 max-w-xl">
                We're building something extraordinary. Come be part of a team that pushes boundaries and redefines what's possible.
              </p>
              <p className="text-lg text-primary-700 leading-relaxed mb-8 max-w-xl">
                At Zignature, we believe in hiring the best and giving them the freedom to create. Join us in shaping the future of digital experiences.
              </p>
              <Link to="/contact">
                <button className="boxy-btn text-lg px-8 py-4">Get In Touch</button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-primary-900 border-4 border-primary-900 p-8 shadow-[12px_12px_0_0_#1e3a8a]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-primary-800 p-6 text-center">
                    <div className="text-4xl font-black text-white mb-2">50+</div>
                    <div className="text-sm font-bold text-primary-300 uppercase">Team Members</div>
                  </div>
                  <div className="bg-primary-700 p-6 text-center">
                    <div className="text-4xl font-black text-white mb-2">{totalCount}</div>
                    <div className="text-sm font-bold text-primary-300 uppercase">Open Roles</div>
                  </div>
                  <div className="bg-primary-600 p-6 text-center">
                    <div className="text-4xl font-black text-white mb-2">15+</div>
                    <div className="text-sm font-bold text-primary-200 uppercase">Countries</div>
                  </div>
                  <div className="bg-primary-900 p-6 text-center border-2 border-primary-700">
                    <div className="text-4xl font-black text-white mb-2">4.9</div>
                    <div className="text-sm font-bold text-primary-300 uppercase">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 border-2 border-primary-900 bg-white px-4 py-1 shadow-[2px_2px_0_0_#1e3a8a]">
                <span className="text-xs font-black text-primary-900 uppercase tracking-[0.2em]">Why Join Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter">
                Perks & <span className="text-primary-600">Benefits</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-white border-4 border-primary-900 p-6 shadow-[6px_6px_0_0_#1e3a8a] hover:shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-600 border-2 border-primary-900 mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeWidth="2" d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-primary-900 uppercase mb-2">{benefit.title}</h3>
                  <p className="text-primary-700 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 border-2 border-primary-900 bg-white px-4 py-1 shadow-[2px_2px_0_0_#1e3a8a]">
                <span className="text-xs font-black text-primary-900 uppercase tracking-[0.2em]">We're Hiring</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter">
                Open <span className="text-primary-600">Positions</span>
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-6 py-2 font-bold uppercase tracking-wider text-sm border-2 transition-all ${
                    filter === type
                      ? 'bg-primary-900 text-white border-primary-900 shadow-[4px_4px_0_0_#1e3a8a]'
                      : 'bg-white text-primary-900 border-primary-900 hover:bg-primary-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {loading && (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-primary-900">Loading job listings...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border-4 border-primary-900 p-6 md:p-8 shadow-[6px_6px_0_0_#1e3a8a] hover:shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{job.company?.name || 'Company'}</span>
                          <span className="w-1 h-1 bg-primary-900 rounded-full"></span>
                          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{job.slug}</span>
                        </div>
                        <h3 className="text-2xl font-black text-primary-900 uppercase mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-sm font-medium text-primary-700">{job.location}</span>
                          <span className="text-sm font-medium text-primary-700">•</span>
                          <span className="text-sm font-medium text-primary-700">{job.job_type_display}</span>
                          <span className="text-sm font-medium text-primary-700">•</span>
                          <span className="text-sm font-medium text-primary-700">{job.experience_level_display}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="bg-primary-900 text-white font-bold py-3 px-6 uppercase tracking-wider border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a] hover:bg-primary-700 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                          View Details
                        </button>
                        <Link to="/contact" className="boxy-btn py-3 px-6">
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl font-bold text-primary-900">No positions available.</p>
                    <p className="text-primary-700 mt-2">Check back soon for new opportunities!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-20 bg-white border-4 border-primary-900 p-8 md:p-12 shadow-[12px_12px_0_0_#1e3a8a]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4 border-2 border-primary-900 bg-primary-50 px-4 py-1 shadow-[2px_2px_0_0_#1e3a8a]">
                  <span className="text-xs font-black text-primary-900 uppercase tracking-[0.2em]">Our Culture</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter mb-6">
                  Work With <span className="text-primary-600">The Best</span>
                </h2>
                <p className="text-lg text-primary-700 leading-relaxed mb-6">
                  We foster an environment where creativity thrives, ideas are valued, and every team member has the opportunity to make an impact.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-4 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Collaborative & Supportive</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-4 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Continuous Learning</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-4 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Work-Life Balance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-8 h-8 bg-primary-600 border-2 border-primary-900 mr-4 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-primary-900">Innovation-Focused</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 border-2 border-primary-900 p-6 text-center">
                  <div className="text-4xl font-black text-primary-900 mb-2">🏆</div>
                  <div className="text-sm font-bold text-primary-600 uppercase">Best Places to Work 2024</div>
                </div>
                <div className="bg-primary-900 text-white p-6 text-center">
                  <div className="text-4xl font-black mb-2">⭐</div>
                  <div className="text-sm font-bold opacity-80 uppercase">4.9/5 on Glassdoor</div>
                </div>
                <div className="bg-primary-900 text-white p-6 text-center">
                  <div className="text-4xl font-black mb-2">🚀</div>
                  <div className="text-sm font-bold opacity-80 uppercase">Fastest Growing</div>
                </div>
                <div className="bg-primary-50 border-2 border-primary-900 p-6 text-center">
                  <div className="text-4xl font-black text-primary-900 mb-2">💡</div>
                  <div className="text-sm font-bold text-primary-600 uppercase">Innovation Award</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-900 border-4 border-primary-900 p-12 md:p-16 shadow-[12px_12px_0_0_#1e3a8a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
                Don't See The Right <span className="text-primary-400">Role</span>?
              </h2>
              <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
                We're always looking for exceptional talent. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="bg-white text-primary-900 font-bold py-4 px-10 uppercase tracking-wider border-2 border-white shadow-[4px_4px_0_0_#1e3a8a] hover:bg-primary-50 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-lg">
                    Submit Your Resume
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

      <JobModal job={selectedJob} isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  )
}

export default CareersPage
