import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

const ETAPES = [
  { titre: 'Formation initiale', texte: 'Développement logiciel' },
  { titre: '20 ans d\'expérience IT', texte: 'Technicien → Team Leader' },
  { titre: 'Reconversion', texte: 'Cybersécurité SOC' },
  {
    titre: 'Certification RNCP niveau 7',
    texte: 'Cybersécurité — niveau 7 du cadre national (équivalent Bac+5)',
  },
  { titre: 'Lab monté', texte: 'VirtualBox + Wazuh + AD + Kali' },
  {
    titre: 'Certification en cours',
    texte: 'CompTIA Security+ (SY0-701) — session visée : octobre 2026',
  },
  { titre: 'Statut', texte: 'Ouvert aux opportunités — 1er poste SOC Junior' },
]

const COULEURS = [
  '#ff2b2b', '#ff3d1e', '#ff4f1b', '#ff6118', '#ff7314', '#ff8510', '#ff9500',
]

const item = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function Profil() {
  return (
    <section id="profil" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div {...fadeUp()} className="mb-12 section-title-alert">
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Mon Profil
        </h2>
        <div className="line-alert" />
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
            20 ans d'expérience IT — de technicien informatique à{' '}
            <strong className="text-zinc-100 font-semibold">Team Leader</strong> — avant de
            choisir de me reconvertir vers la{' '}
            <strong className="text-zinc-100 font-semibold">cybersécurité SOC</strong> — attiré
            par la détection de menaces, l'investigation d'incidents et la défense des systèmes.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Pour valider mes compétences de manière concrète, j'ai monté un{' '}
            <strong className="text-zinc-300 font-medium">lab SOC complet de A à Z</strong> :{' '}
            VirtualBox, Wazuh 4.12.0 en Docker/WSL2, un Active Directory Windows Server 2022 et
            Kali Linux comme machine attaquante sur un réseau isolé.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Dans ce lab, je reproduis des techniques d'attaque réelles référencées dans le
            framework MITRE ATT&CK, je construis les règles de détection Wazuh, et je prouve que
            les alertes se déclenchent — de bout en bout, en conditions réelles.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Cette reconversion est validée par un{' '}
            <strong className="text-zinc-100 font-semibold">
              certificat RNCP de niveau 7 en cybersécurité
            </strong>{' '}
            — niveau 7 du cadre national des certifications professionnelles, soit l'équivalent
            d'un Bac+5. Je prépare actuellement la{' '}
            <strong className="text-zinc-100 font-semibold">CompTIA Security+</strong> pour la
            session d'octobre 2026.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Je cherche un{' '}
            <span className="text-accent font-semibold">premier poste de SOC Analyst Junior</span>{' '}
            pour continuer à apprendre au contact d'une équipe Blue Team.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <a
              href="/CV-CHERY-Jean-Hadley-SOC-Analyst.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-alert text-sm"
            >
              Télécharger mon CV <i className="bi bi-file-earmark-arrow-down-fill ml-1" />
            </a>
            <a
              href="https://www.linkedin.com/in/hadley-chery/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border border-divider text-zinc-300 px-5 py-2.5 rounded-[10px]
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

      <ul className="timeline-alert max-w-2xl mx-auto">
        {ETAPES.map((etape, i) => (
          <motion.li
            key={etape.titre}
            variants={item}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            style={{ '--dot-color': COULEURS[i] }}
          >
            <h4 className="font-display font-semibold text-lg text-zinc-100 mb-1">
              {etape.titre}
            </h4>
            <p className="text-sm text-zinc-300">{etape.texte}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
