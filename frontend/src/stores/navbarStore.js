import { create } from 'zustand'

export const useNavbarStore = create((set) => ({
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Careers', path: '/careers' },
  ],
  setNavLinks: (links) => set({ navLinks: links }),
}))