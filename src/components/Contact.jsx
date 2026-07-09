import { useState } from 'react'
import { motion } from 'framer-motion'

// Remplacer YOUR_FORM_ID après inscription sur formspree.io
const FORMSPREE = 'https://formspree.io/f/YOUR_FORM_ID'

const LINKS = [
  { label: 'CV', value: 'Voir en ligne', href: '/CV-CHERY-Jean-Hadley-SOC-Analyst.pdf', external: true },
  { label: 'Email', value: 'jhadleyc@mail.com', href: 'mailto:jhadleyc@mail.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/hadley-chery', href: 'https://www.linkedin.com/in/hadley-chery/', external: true },
  { label: 'GitHub', value: 'github.com/j-Hadley-C', href: 'https://github.com/j-Hadley-C', external: true },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 section-title-alert"
      >
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Travaillons Ensemble
        </h2>
        <div className="line-alert" />
        <p className="text-zinc-400 mt-4 max-w-md mx-auto leading-relaxed">
          Disponible pour un poste SOC Junior, un stage ou tout échange autour de la
          cybersécurité.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          {LINKS.map(l => (
            <a
              key={`${l.label}-${l.value}`}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-5 p-5 bg-surface border border-divider
                hover:border-accent/50 hover:bg-elevated/40 transition-all duration-200 group"
            >
              <span className="text-xs text-zinc-500 uppercase tracking-wider w-16 flex-shrink-0">
                {l.label}
              </span>
              <span className="text-sm text-zinc-300 group-hover:text-accent transition-colors truncate">
                {l.value}
              </span>
              <span className="ml-auto text-zinc-600 group-hover:text-accent transition-colors flex-shrink-0 text-lg">
                →
              </span>
            </a>
          ))}

          <div className="mt-4 p-4 border border-accent/20 bg-accent-dim/30">
            <p className="text-sm text-accent font-semibold">Disponible — Immédiatement</p>
            <p className="text-xs text-zinc-400 mt-1">
              En recherche active d'un premier poste SOC Analyst Junior.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {status === 'success' ? (
            <div className="min-h-[280px] flex flex-col items-center justify-center
              bg-surface border border-accent/30 p-8 text-center">
              <span className="text-accent text-4xl mb-4">✓</span>
              <p className="font-display font-bold text-xl text-zinc-100 mb-2 uppercase">
                Message envoyé
              </p>
              <p className="text-sm text-zinc-400">Je vous répondrai dès que possible.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-xs text-zinc-500 hover:text-accent transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {[
                { name: 'name',  label: 'Nom',   type: 'text',  ph: 'Votre nom' },
                { name: 'email', label: 'Email', type: 'email', ph: 'votre@email.com' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 block mb-2">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={onChange}
                    placeholder={f.ph}
                    required
                    className="w-full bg-surface border border-divider text-zinc-100 text-sm
                      px-4 py-3 focus:outline-none focus:border-accent transition-colors
                      placeholder:text-zinc-600"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 block mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Votre message..."
                  required
                  rows={5}
                  className="w-full bg-surface border border-divider text-zinc-100 text-sm
                    px-4 py-3 focus:outline-none focus:border-accent transition-colors
                    placeholder:text-zinc-600 resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-critical">
                  Erreur lors de l'envoi. Écrivez-moi directement à jhadleyc@mail.com.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-accent text-bg text-sm font-semibold py-3
                  hover:bg-accent/90 active:scale-[0.99] transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
