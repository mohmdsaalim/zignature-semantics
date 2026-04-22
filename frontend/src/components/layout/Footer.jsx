import { Link } from 'react-router-dom'
import { useFooterStore } from '../../stores/footerStore'
import logo from '../../assets/Logo.jpg'

function Footer() {
  const currentYear = new Date().getFullYear()
  const { footerLinks, companyInfo } = useFooterStore()

  return (
    <footer className="bg-white border-t-8 border-primary-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Manifesto */}
          <div className="md:col-span-2">
            <img src={logo} alt="ZEG Logo" className="h-10 mb-8 mix-blend-darken" />
            <p className="text-xl font-bold text-primary-900 uppercase tracking-tighter leading-tight max-w-sm mb-6">
              Engineering monolithic structural experiences for the digital frontier.
            </p>
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-primary-900"></div>
              <div className="w-4 h-2 bg-primary-600"></div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-primary-900/40 mb-6">/ Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-base font-black text-primary-900 uppercase tracking-widest hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-primary-900/40 mb-6">/ Terminal</h4>
            <div className="space-y-4 font-bold text-primary-900 tracking-tight">
              <p>{companyInfo.email}</p>
              <p>+1 (800) 555-0199</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-primary-900/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-primary-900/40 uppercase tracking-[0.3em] font-bold">
            &copy; {currentYear} Zignature Semantics. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="font-mono text-[10px] text-primary-900 font-bold uppercase tracking-widest border-b border-primary-900/20 hover:border-primary-900">Twitter</a>
            <a href="#" className="font-mono text-[10px] text-primary-900 font-bold uppercase tracking-widest border-b border-primary-900/20 hover:border-primary-900">LinkedIn</a>
            <a href="#" className="font-mono text-[10px] text-primary-900 font-bold uppercase tracking-widest border-b border-primary-900/20 hover:border-primary-900">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer