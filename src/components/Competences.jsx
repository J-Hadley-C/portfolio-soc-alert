import { motion } from 'framer-motion'

const CATEGORIES = [
  {
    icon: 'bi-robot',
    titre: 'Automatisation & IA (SOAR)',
    texte: "Deux systèmes conçus et opérés : un workflow n8n de Threat Intelligence agentique (23 nœuds) — enrichissement multi-sources (GreyNoise, AbuseIPDB, MISP, VirusTotal, AlienVault OTX), analyse par IA (API Claude) et réponse automatisée ; et SOC-Threat-Intel-Weekly, une veille cybersécurité hebdomadaire en production (CERT-FR, CVEfeed, bulletins Notion et Gmail).",
  },
  {
    icon: 'bi-shield-fill-check',
    titre: 'Détection & SIEM',
    texte: "Déploiement et configuration de Wazuh 4.12 (SIEM open-source) : écriture de règles de détection personnalisées, tests de déclenchement prouvés de bout en bout. Techniques d'attaque reproduites et cartographiées selon le framework MITRE ATT&CK.",
  },
  {
    icon: 'bi-hdd-rack-fill',
    titre: 'Système & Infrastructure',
    texte: "Administration Windows Server 2022 avec Active Directory, virtualisation du lab complet sous VirtualBox, conteneurisation du SIEM avec Docker sous WSL2.",
  },
  {
    icon: 'bi-bug-fill',
    titre: 'Outils offensifs',
    texte: "Utilisation de Kali Linux, Metasploit et msfvenom pour reproduire des attaques réelles (phishing, exfiltration, credential dumping), et d'Impacket pour la post-exploitation — en conditions réelles, Defender actif.",
  },
  {
    icon: 'bi-diagram-3-fill',
    titre: 'Réseau & Analyse',
    texte: "Capture et analyse de trafic réseau avec Wireshark/tshark, reconnaissance et scan avec Nmap — identification de signatures d'attaque (scan SYN, exfiltration HTTP).",
  },
  {
    icon: 'bi-terminal-fill',
    titre: 'Scripting',
    texte: "Automatisation et exploitation via PowerShell côté Windows, Bash côté Linux.",
  },
]

const container = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
}
const item = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

export default function Competences() {
  return (
    <section id="competences" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 section-title-alert"
      >
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Mes Compétences
        </h2>
        <div className="line-alert" />
      </motion.div>

      <motion.div
        variants={container}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {CATEGORIES.map(c => (
          <motion.div
            key={c.titre}
            variants={item}
            className="group bg-surface rounded-2xl p-8 pt-10 text-center
              shadow-[0_13px_8px_-10px_rgba(0,0,0,0.3)]"
          >
            <span className="inline-flex items-center justify-center w-[100px] h-[100px] rounded-full mb-4
              shadow-[0_0_0_10px_rgba(255,43,43,0.15)] bg-elevated
              transition-colors duration-300 group-hover:bg-accent">
              <i className={`bi ${c.icon} text-4xl text-accent group-hover:text-bg transition-colors duration-300`} />
            </span>
            <h3 className="font-display font-bold text-lg text-zinc-100 uppercase mb-3">
              {c.titre}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{c.texte}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
