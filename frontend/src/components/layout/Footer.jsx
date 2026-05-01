import { Link } from 'react-router-dom'
import { useFooterStore } from '../../stores/footerStore'
import logo from '../../assets/Logo.PNG'
import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa6'

function Footer() {
  const currentYear = new Date().getFullYear()
  const { footerLinks, companyInfo } = useFooterStore()

  return (
    <footer className="bg-white border-t-8 border-primary-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Manifesto */}
          <div className="md:col-span-2">
            <img src={logo} alt="ZEG Logo" className="h-13 mb-8 mix-blend-darken" />
            <p className="text-xl font-bold text-primary-900 uppercase tracking-tighter leading-tight max-w-sm mb-6">
              Engineering monolithic structural experiences for the digital frontier.
            </p>
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-primary-900"></div>
              <div className="w-8 h-2 bg-primary-600"></div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-black font-mono uppercase tracking-[0.2em] text-xs text-primary-900/40 mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-bold text-primary-900 uppercase tracking-tight hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black font-mono uppercase tracking-[0.2em] text-xs text-primary-900/40 mb-6">Contact</h4>
            <div className="space-y-4 font-bold text-primary-900 tracking-tight">
              <a href={`mailto:${companyInfo.email}`}>
                          {companyInfo.email}
              </a><br></br>
              <a href='tel:+919745188700'>+91 9745188700</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-primary-900/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-primary-900/40 uppercase tracking-[0.3em] font-bold">
            &copy; {currentYear} Zignature Semantics. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <a 
            href="https://x.com/zignatureX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg border-4 border-primary-900 bg-primary-600 flex items-center justify-center text-white shadow-[4px_4px_0px_primary-900] hover:shadow-[6px_6px_0px_primary-900] hover:bg-primary-700 transition-all duration-200">
              <FaXTwitter size={16} />
            </a>
            <a 
              href="https://www.linkedin.com/company/zignature-semantics/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border-4 border-primary-900 bg-primary-600 flex items-center justify-center text-white shadow-[4px_4px_0px_primary-900] hover:shadow-[6px_6px_0px_primary-900] hover:bg-primary-700 transition-all duration-200"
            >
              <FaLinkedinIn size={16} />
            </a>
            <a 
              href="https://www.facebook.com/share/1KxuKqhC7D/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border-4 border-primary-900 bg-primary-600 flex items-center justify-center text-white shadow-[4px_4px_0px_primary-900] hover:shadow-[6px_6px_0px_primary-900] hover:bg-primary-700 transition-all duration-200">
              <FaFacebookF size={16} />
            </a>
            <a 
              href="https://www.instagram.com/zignature.x?igsh=dmxhcXptMTRsNWE5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border-4 border-primary-900 bg-primary-600 flex items-center justify-center text-white shadow-[4px_4px_0px_primary-900] hover:shadow-[6px_6px_0px_primary-900] hover:bg-primary-700 transition-all duration-200">
              <FaInstagram size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer