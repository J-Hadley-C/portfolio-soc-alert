import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ParticleNetwork from './ParticleNetwork'

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
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-4 bg-cover bg-center animate-slow-zoom"
          style={{ backgroundImage: "url('/profil.png')" }}
        />
      </div>
      <div className="absolute inset-0 bg-black/80 pointer-events-none" />
      <ParticleNetwork />
      <div className="absolute inset-0 hero-grid animate-grid-drift pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none animate-pulse-alert"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,43,43,0.5) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-x-0 h-56 pointer-events-none animate-scan-line"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,43,43,0.25), transparent)' }}
      />
      <div className="absolute inset-x-0 h-24 pointer-events-none animate-scan-line" style={{ animationDelay: '2s', animationDuration: '5s' }}>
        <div className="w-full h-full" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,140,0,0.2), transparent)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1
            className="font-display font-bold uppercase text-hero leading-none mb-4"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          >
            <span className="text-zinc-100">CHERY </span>
            <span className="text-accent name-glow">Jean-Hadley</span>
          </h1>

          <p
            className="font-display font-semibold text-hero-sub text-zinc-100"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
          >
            <Typewriter words={ROLES} />
          </p>
        </motion.div>
      </div>
    </section>
  )
}
