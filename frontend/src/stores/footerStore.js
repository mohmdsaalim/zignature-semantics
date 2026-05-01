import { create } from 'zustand'

export const useFooterStore = create((set) => ({
  footerLinks: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ],
  companyInfo: {
    name: 'Zignature',
    tagline: 'Building the future with innovative solutions.',
    email: 'zignature.in@gmail.com',
  },
  setFooterLinks: (links) => set({ footerLinks: links }),
  setCompanyInfo: (info) => set({ companyInfo: info }),
}))