import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="border-t border-divider bg-surface">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p className="text-xs text-zinc-600">
          CHERY Jean-Hadley — SOC Analyst Junior — 2026
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/hadley-chery/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/j-Hadley-C"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:jhadleyc@mail.com"
            className="text-xs text-zinc-600 hover:text-accent transition-colors"
          >
            Email
          </a>
        </div>
      </motion.div>
    </footer>
  )
}
