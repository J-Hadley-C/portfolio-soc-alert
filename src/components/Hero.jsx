import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ROLES = [
  'SOC Analyst Junior',
  'Threat Detection',
  'Incident Response',
  'SIEM Engineering',
]

function Typewriter({ words }) {
  const [text, setText] = useState(words[0])
  const [wIdx, setWIdx] = useState(0)
  const [cIdx, setCIdx] = useState(words[0].length)
  const [deleting, setDeleting] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const word = words[wIdx % words.length]
    const delay = deleting ? 40 : 90
    timer.current = setTimeout(() => {
      if (!deleting) {
        if (cIdx < word.length) {
          setText(word.slice(0, cIdx + 1))
          setCIdx(c => c + 1)
        } else {
          setTimeout(() => setDeleting(true), 2000)
        }
      } else {
        if (cIdx > 0) {
          setText(word.slice(0, cIdx - 1))
          setCIdx(c => c - 1)
        } else {
          setDeleting(false)
          setWIdx(w => w + 1)
        }
      }
    }, delay)
    return () => clearTimeout(timer.current)
  }, [cIdx, deleting, wIdx, words])

  return (
    <span>
      {text}
      <span className="animate-blink text-accent ml-0.5">|</span>
    </span>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-grid">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{ backgroundImage: "url('/profil.png')" }}
        />
      </div>
      <div className="absolute inset-0 bg-black/75 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pt-20 pb-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500 mb-5">
            Portfolio — Cybersécurité SOC
          </p>

          <h1
            className="font-display font-extrabold uppercase text-hero leading-none mb-4"
            style={{ letterSpacing: '-0.01em' }}
          >
            <span className="text-zinc-100">CHERY</span>
            {' '}
            <span className="text-accent name-glow">Jean-Hadley</span>
          </h1>

          <p className="font-display font-bold text-hero-sub text-zinc-300 mb-6">
            <Typewriter words={ROLES} />
          </p>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
            Développeur en reconversion cybersécurité. Lab SOC complet monté de A à Z —
            Wazuh 4.12, Active Directory, Kali. Détection de menaces prouvée, cas par cas.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projets"
              className="bg-accent text-bg text-sm font-semibold px-7 py-3
                hover:bg-accent/90 active:scale-95 transition-all duration-150"
            >
              Voir mes projets
            </a>
            <a
              href="#contact"
              className="border border-accent text-accent text-sm font-semibold px-7 py-3
                hover:bg-accent-dim active:scale-95 transition-all duration-150"
            >
              Me contacter
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
