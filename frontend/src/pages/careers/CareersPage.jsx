import { useState } from 'react'
import { Link } from 'react-router-dom'

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '4-6 years',
    description: 'We are looking for an experienced Frontend Developer to build cutting-edge web applications. You will work with React, TypeScript, and modern tooling to create exceptional user experiences.',
    requirements: [
      '4+ years of experience with React and modern JavaScript',
      'Strong understanding of web performance optimization',
      'Experience with TypeScript and state management',
      'Excellent communication and collaboration skills'
    ],
    responsibilities: [
      'Build and maintain responsive web applications',
      'Collaborate with design and backend teams',
      'Mentor junior developers',
      'Participate in code reviews and technical planning'
    ]
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Join our design team to create beautiful, functional interfaces. You will be responsible for designing user-centered digital experiences across all platforms.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating design skills',
      'Understanding of design systems and accessibility'
    ],
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with developers for implementation',
      'Maintain and evolve design systems'
    ]
  },
  {
    id: 3,
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'We need a results-driven Digital Marketing Manager to lead our marketing initiatives and drive growth through data-driven campaigns.',
    requirements: [
      '3+ years in digital marketing roles',
      'Experience with SEO, SEM, and social media marketing',
      'Strong analytical skills and data-driven mindset',
      'Proven track record of successful campaigns'
    ],
    responsibilities: [
      'Plan and execute digital marketing campaigns',
      'Analyze campaign performance and optimize strategies',
      'Manage social media presence and content',
      'Coordinate with creative teams for marketing materials'
    ]
  },
  {
    id: 4,
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Looking for a Backend Developer to build scalable server-side applications and APIs. You will work with modern technologies to ensure high performance.',
    requirements: [
      '3+ years of backend development experience',
      'Proficiency in Node.js, Python, or Go',
      'Experience with databases and API design',
      'Knowledge of cloud services and DevOps'
    ],
    responsibilities: [
      'Develop and maintain backend services',
      'Design and implement APIs',
      'Optimize database queries and performance',
      'Ensure code quality and best practices'
    ]
  },
  {
    id: 5,
    title: 'Project Manager',
    department: 'Operations',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '4-7 years',
    description: 'Join us as a Project Manager to lead cross-functional teams and deliver projects on time and within budget.',
    requirements: [
      '4+ years of project management experience',
      'PMP or similar certification preferred',
      'Strong organizational and communication skills',
      'Experience with Agile methodologies'
    ],
    responsibilities: [
      'Manage project timelines and deliverables',
      'Coordinate with stakeholders and teams',
      'Identify and mitigate project risks',
      'Report project status and metrics'
    ]
  },
  {
    id: 6,
    title: 'Content Writer',
    department: 'Content',
    location: 'Remote',
    type: 'Part-time',
    experience: '1-3 years',
    description: 'We are seeking a creative Content Writer to produce engaging content for our clients across various platforms.',
    requirements: [
      '1+ years of content writing experience',
      'Excellent written communication skills',
      'Ability to write in different tones and styles',
      'Basic understanding of SEO'
    ],
    responsibilities: [
      'Create blog posts, articles, and website content',
      'Develop copy for marketing campaigns',
      'Edit and proofread content',
      'Research industry topics'
    ]
  }
]

const benefits = [
  { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and family' },
  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Flexible Hours', desc: 'Work-life balance with flexible scheduling' },
  { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Remote Work', desc: 'Work from anywhere globally' },
  { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', title: 'Learning Budget', desc: 'Annual budget for courses and conferences' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Team Events', desc: 'Regular team building activities and celebrations' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Competitive Salary', desc: 'Industry-leading compensation packages' }
]

const JobModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white border-4 border-primary-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[16px_16px_0_0_#1e3a8a]">
        <div className="sticky top-0 bg-white border-b-4 border-primary-900 p-6 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{job.department}</span>
            <h3 className="text-2xl md:text-3xl font-black text-primary-900 uppercase">{job.title}</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-primary-900 border-2 border-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-primary-50 border-2 border-primary-900 px-4 py-1 text-sm font-bold text-primary-900">{job.location}</span>
            <span className="bg-primary-50 border-2 border-primary-900 px-4 py-1 text-sm font-bold text-primary-900">{job.type}</span>
            <span className="bg-primary-50 border-2 border-primary-900 px-4 py-1 text-sm font-bold text-primary-900">{job.experience}</span>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-black text-primary-900 uppercase mb-3 border-b-2 border-primary-900 pb-2">Description</h4>
            <p className="text-primary-700 leading-relaxed">{job.description}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-black text-primary-900 uppercase mb-3 border-b-2 border-primary-900 pb-2">Requirements</h4>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 mt-2 mr-3 shrink-0"></span>
                  <span className="text-primary-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-black text-primary-900 uppercase mb-3 border-b-2 border-primary-900 pb-2">Responsibilities</h4>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 mt-2 mr-3 shrink-0"></span>
                  <span className="text-primary-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

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
  const [selectedJob, setSelectedJob] = useState(null)
  const [filter, setFilter] = useState('All')

  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Operations', 'Content']
  const filteredJobs = filter === 'All' ? jobs : jobs.filter(job => job.department === filter)

  return (
    <div className="w-full bg-primary-50 relative z-10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      {/* Hero Section */}
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
                    <div className="text-4xl font-black text-white mb-2">6</div>
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

          {/* Benefits Section */}
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

          {/* Open Positions */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 border-2 border-primary-900 bg-white px-4 py-1 shadow-[2px_2px_0_0_#1e3a8a]">
                <span className="text-xs font-black text-primary-900 uppercase tracking-[0.2em]">We're Hiring</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-primary-900 uppercase tracking-tighter">
                Open <span className="text-primary-600">Positions</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setFilter(dept)}
                  className={`px-6 py-2 font-bold uppercase tracking-wider text-sm border-2 transition-all ${
                    filter === dept
                      ? 'bg-primary-900 text-white border-primary-900 shadow-[4px_4px_0_0_#1e3a8a]'
                      : 'bg-white text-primary-900 border-primary-900 hover:bg-primary-50'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white border-4 border-primary-900 p-6 md:p-8 shadow-[6px_6px_0_0_#1e3a8a] hover:shadow-[8px_8px_0_0_#1e3a8a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{job.department}</span>
                        <span className="w-1 h-1 bg-primary-900 rounded-full"></span>
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{job.id.toString().padStart(2, '0')}</span>
                      </div>
                      <h3 className="text-2xl font-black text-primary-900 uppercase mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="text-sm font-medium text-primary-700">{job.location}</span>
                        <span className="text-sm font-medium text-primary-700">•</span>
                        <span className="text-sm font-medium text-primary-700">{job.type}</span>
                        <span className="text-sm font-medium text-primary-700">•</span>
                        <span className="text-sm font-medium text-primary-700">{job.experience}</span>
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
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-primary-900">No positions available in this department.</p>
                <p className="text-primary-700 mt-2">Check back soon for new opportunities!</p>
              </div>
            )}
          </div>

          {/* Culture Section */}
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

          {/* CTA Section */}
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

      {/* Job Modal */}
      <JobModal job={selectedJob} isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  )
}

export default CareersPage
