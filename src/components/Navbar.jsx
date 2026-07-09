import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { href: '#profil', label: 'Profil' },
  { href: '#competences', label: 'Compétences' },
  { href: '#projets', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -52, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur border-b border-divider' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between h-14">
        <a href="#home" className="font-display text-lg font-bold text-accent tracking-wide uppercase">
          JH Chery
        </a>

        <div className="hidden sm:flex items-center gap-8">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="nav-underline text-sm uppercase tracking-wide font-semibold text-zinc-200 hover:text-accent transition-colors duration-150 pb-1"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="sm:hidden text-zinc-400 hover:text-zinc-100 p-1"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          <i className={open ? 'bi bi-x-lg text-xl' : 'bi bi-list text-2xl'} />
        </button>
      </div>

      {open && (
        <div className="sm:hidden bg-surface border-b border-divider px-6 pb-5 pt-2 flex flex-col gap-4">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.nav>
  )
}
