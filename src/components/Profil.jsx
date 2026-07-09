import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

const ETAPES = [
  { titre: 'Formation initiale', texte: 'Développement logiciel' },
  { titre: 'Reconversion', texte: 'Cybersécurité SOC' },
  { titre: 'Lab monté', texte: 'VirtualBox + Wazuh + AD + Kali' },
  { titre: 'Statut', texte: 'Disponible — 1er poste SOC Junior' },
]

const COULEURS = ['#ff2b2b', '#ff5b1f', '#ff7a12', '#ff8c00']

const item = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function Profil() {
  return (
    <section id="profil" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div {...fadeUp()} className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent mb-3">
          Profil
        </p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Qui suis-je
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-12 items-start mb-20">
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
          <img
            src="/profil.png"
            alt="Photo de profil de CHERY Jean-Hadley"
            className="w-full rounded-sm border-2 border-accent object-cover"
          />
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="lg:col-span-3 space-y-5">
          <p className="text-zinc-300 leading-relaxed text-lg">
            Développeur de formation, j'ai choisi de me reconvertir vers la{' '}
            <strong className="text-zinc-100 font-semibold">cybersécurité SOC</strong> — attiré
            par la détection de menaces, l'investigation d'incidents et la défense des systèmes.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Pour valider mes compétences de manière concrète, j'ai monté un{' '}
            <strong className="text-zinc-300 font-medium">lab SOC complet de A à Z</strong> :{' '}
            VirtualBox, Wazuh 4.12.0 en Docker/WSL2, un Active Directory Windows Server 2022 et
            Kali Linux comme machine attaquante sur un réseau isolé.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Dans ce lab, je reproduis des techniques d'attaque réelles référencées dans le
            framework MITRE ATT&CK, je construis les règles de détection Wazuh, et je prouve que
            les alertes se déclenchent — de bout en bout, en conditions réelles.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Je cherche un{' '}
            <span className="text-accent font-semibold">premier poste de SOC Analyst Junior</span>{' '}
            pour continuer à apprendre au contact d'une équipe Blue Team.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <a
              href="/CV-CHERY-Jean-Hadley-SOC-Analyst.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-accent text-bg font-semibold px-5 py-2.5
                hover:bg-accent/90 transition-colors duration-200"
            >
              Télécharger mon CV
            </a>
            <a
              href="https://www.linkedin.com/in/hadley-chery/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border border-divider text-zinc-400 px-5 py-2.5
                hover:border-accent hover:text-accent transition-colors duration-200"
            >
              LinkedIn →
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div {...fadeUp()} className="mb-10">
        <h3 className="font-display font-bold text-2xl text-zinc-100 uppercase">
          Mon parcours de reconversion
        </h3>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {ETAPES.map((etape, i) => (
          <motion.div
            key={etape.titre}
            variants={item}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative bg-surface border border-divider p-6 mb-12 last:mb-0"
            style={{ borderTopColor: COULEURS[i], borderTopWidth: '3px' }}
          >
            {i > 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-8 w-0 h-0"
                style={{
                  borderLeft: '14px solid transparent',
                  borderRight: '14px solid transparent',
                  borderBottom: `14px solid ${COULEURS[i]}`,
                }}
              />
            )}
            <h4 className="font-display font-semibold text-lg text-zinc-100 mb-1">
              {etape.titre}
            </h4>
            <p className="text-sm text-zinc-400">{etape.texte}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
