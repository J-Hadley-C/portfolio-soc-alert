import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { REPORTS } from './reports'

const SEV = {
  critical: { label: 'CRITICAL', bar: 'bg-critical', text: 'text-critical', border: 'border-l-critical' },
  high:     { label: 'HIGH',     bar: 'bg-high',     text: 'text-high',     border: 'border-l-high' },
  medium:   { label: 'MEDIUM',   bar: 'bg-medium',   text: 'text-medium',   border: 'border-l-medium' },
}

const ICONS = {
  7: 'bi-database-fill-lock',
  9: 'bi-person-badge-fill',
  10: 'bi-journal-text',
  11: 'bi-lightning-charge-fill',
}

const PROJECTS = [
  {
    id: 10,
    title: 'Analyse de logs Linux \u2014 Du manuel au SIEM Splunk',
    sev: 'high',
    rules: [],
    report: '/rapports/logs-linux-splunk.pdf',
    mitre: 'T1110.001 \u2014 Password Guessing',
    technique: 'Lecture manuelle + Excel/Power Query + Python + Splunk Enterprise 10.6',
    date: '2026-10-20',
    summary: "Investigation sur 2 000 lignes de journaux d'authentification d'un serveur Linux expos\u00e9, couvrant 42,7 jours : 490 \u00e9checs depuis 47 adresses distinctes, dont 71,8 % visant le compte root. Le m\u00eame fichier trait\u00e9 trois fois \u2014 \u00e0 l'\u0153il, par script Python, puis dans Splunk \u2014 et chacun des trois a trouv\u00e9 un \u00e9l\u00e9ment que les deux autres ne pouvaient pas voir. Verdict rendu sur la question qui compte : l'attaque a-t-elle abouti ?",
    steps: [
      'Lecture directe de 150 lignes, puis tableau d\u2019analyse \u00e0 six colonnes via Excel et Power Query',
      'Script Python de d\u00e9tection par motifs + export CSV \u2014 puis une v2 corrig\u00e9e, \u00e9cart mesur\u00e9',
      'Ingestion dans Splunk Enterprise 10.6 (install\u00e9 et administr\u00e9) \u2014 index main, sourcetype d\u00e9di\u00e9',
      'SPL : stats count by rhost | sort -count \u2192 classement des 47 sources',
      'Les quatre vues (\u00c9v\u00e9nements / Patterns / Statistiques / Visualisation), une question par vue',
    ],
    detection: [
      '490 authentication failure \u00b7 47 sources \u00b7 71,8 % sur root  [T1110.001]',
      '10 tentatives au m\u00eame horodatage \u00e0 la seconde  \u2192  automatisation prouv\u00e9e',
      'Patterns : 2 motifs couvrent 99,83 % des 608 \u00e9v\u00e8nements  \u2192  signature de programme',
      'Seuil d\u2019alerte calibr\u00e9 sur la donn\u00e9e : 39 des 47 adresses d\u00e9passent 5 \u00e9checs en 60 s',
      'Verdict : 0 Accepted, 36 sessions \u00e9cart\u00e9es par 3 preuves  \u2192  tentative, pas compromission',
    ],
    lesson: "Mon propre script fonctionnait parfaitement et ne voyait pas l'attaquant principal : son p\u00e9rim\u00e8tre couvrait 15 % du fichier, et l'adresse la plus active \u2014 80 tentatives \u2014 \u00e9tait en dehors. Autre surprise : \u00ab Failed password \u00bb, le motif le plus cit\u00e9 dans la documentation sur la force brute, n'appara\u00eet pas une seule fois ici \u2014 ce journal parle le langage de PAM, pas celui de sshd. Une r\u00e8gle b\u00e2tie sur ce mot-cl\u00e9 n'aurait rien d\u00e9tect\u00e9. Et le finding le plus utile \u00e0 l'exploitant \u2014 logrotate qui \u00e9choue 43 fois, une par jour, donc des journaux non conserv\u00e9s \u2014 ne contient aucun mot-cl\u00e9 d'authentification : seul l'\u0153il pouvait le trouver.",
  },
  {
    id: 11,
    title: 'Automatisation SOAR \u2014 Threat Intelligence agentique',
    sev: 'high',
    rules: [],
    report: '/rapports/automatisation-soar-n8n.pdf',
    mitre: 'Enrichissement d\u2019IOC \u00b7 qualification assist\u00e9e par IA',
    technique: 'n8n (23 n\u0153uds) + 6 sources de r\u00e9putation + API Claude + MISP/Slack',
    date: '2026-05-13',
    summary: "Workflow n8n de 23 n\u0153uds qui qualifie un indicateur de compromission sans intervention humaine : d\u00e9tection du type (IP, domaine, URL ou hash), interrogation en parall\u00e8le de six sources de r\u00e9putation, fusion des r\u00e9ponses, score de risque de 0 \u00e0 100, puis qualification par l'API Claude. Si le verdict est malveillant : cr\u00e9ation d'un \u00e9v\u00e9nement MISP et alerte Slack \u00e0 l'\u00e9quipe. Con\u00e7u pendant la formation AcadiaCyberSec.",
    steps: [
      'D\u00e9clenchement : soumission d\u2019un IOC, d\u00e9tection du type et routage automatique',
      'Enrichissement parall\u00e8le : GreyNoise, AbuseIPDB, MISP, VirusTotal, AlienVault OTX, URLscan.io',
      'Fusion des r\u00e9ponses et scoring pond\u00e9r\u00e9 \u2192 MALICIOUS / SUSPICIOUS / BENIGN',
      'Qualification par l\u2019API Claude : confirmation du verdict et identification des TTP MITRE',
      'R\u00e9ponse : \u00e9v\u00e9nement MISP, alerte Slack, rapport HTML pour l\u2019analyste',
    ],
    detection: [
      'Six sources de r\u00e9putation interrog\u00e9es sans intervention humaine',
      'Score de risque 0-100 et verdict unique l\u00e0 o\u00f9 six r\u00e9ponses h\u00e9t\u00e9rog\u00e8nes arrivaient',
      'Renseignement capitalis\u00e9 au format MISP, donc partageable \u00e0 d\u2019autres \u00e9quipes',
      'Analyste notifi\u00e9 dans son canal de travail habituel',
    ],
    lesson: "La difficult\u00e9 n'est pas d'appeler six API, c'est de normaliser des r\u00e9ponses dont les formats et les crit\u00e8res de r\u00e9putation diff\u00e8rent, pour en tirer un verdict coh\u00e9rent. Ce projet m'a fait comprendre que l'automatisation ne remplace pas l'analyste : elle lui retire les t\u00e2ches r\u00e9p\u00e9titives pour lui laisser le temps des investigations qui demandent du contexte et du jugement. Le d\u00e9tail du workflow est d\u00e9taill\u00e9 dans la section Automatisation, plus bas.",
  },
  {
    id: 9,
    title: 'Active Directory — Déploiement & analyse des journaux',
    sev: 'medium',
    rules: [],
    report: '/rapports/active-directory.pdf',
    mitre: 'T1136 — Create Account · T1098 — Account Manipulation',
    technique: 'Windows Server 2022 + analyse Event Viewer',
    date: '2026-09-15',
    summary: "Déploiement d'un domaine Active Directory de zéro : contrôleur de domaine, DNS intégré, rattachement d'un poste Windows 11, annuaire structuré par service et comptes provisionnés. Puis la partie analyste : retrouver chaque action dans le journal de sécurité — 7 600 lignes filtrées à 25 — et l'interpréter. Quatre pannes réelles diagnostiquées en chemin.",
    steps: [
      'Adresse IP fixe + DNS sur 127.0.0.1, renommage AVANT la promotion (SRV-DC01)',
      'Installation du rôle AD DS, puis promotion — forêt soc.lab (deux étapes distinctes)',
      'DNS du poste vers le serveur → ping + nslookup soc.lab → rattachement au domaine',
      'Unités d\'organisation par service, trois comptes, droit attribué par groupe',
      'Observateur d\'événements : filtre 4720,4724,4732 → corrélation → export .evtx',
    ],
    detection: [
      '4720 + 4724  —  compte créé, puis mot de passe posé  (séquence, pas ligne isolée)',
      '4741 / compte en $  —  une machine a rejoint le domaine',
      '4732  —  droit accordé par groupe : journal du domaine OU journal local selon le groupe',
      'Verdict : 4 séquences pour 3 comptes créés → la 4e était le compte d\'ordinateur du poste',
    ],
    lesson: "Une ligne de journal seule ne raconte presque rien : c'est la séquence qui donne le sens. Un 4724 sans 4720 juste avant n'est pas une création de compte mais un mot de passe changé sur un compte existant — l'un des signaux les plus surveillés. Et savoir SUR QUELLE MACHINE chercher un événement vaut autant que connaître son numéro : chercher au mauvais endroit fait conclure à tort qu'il ne s'est rien passé.",
  },
  {
    id: 7,
    title: 'Injection SQL — Attaque, Détection & Correction',
    sev: 'critical',
    report: '/rapports/injection-sql.pdf',
    rules: ['31171 (niv.6)', '31106 (niv.6)'],
    mitre: 'T1190 — Exploit Public-Facing Application',
    technique: 'SQLMap (GET) + requête préparée PDO',
    date: '2026-07-22',
    summary: "Chaîne complète sur une application PHP vulnérable : extraction de toute la base avec SQLMap, détection de bout en bout dans Wazuh via l'access.log Apache (81 alertes), puis correction par requête préparée prouvée par un rejeu de l'attaque.",
    steps: [
      'sqlmap -u ".../login.php?email=test&mdp=test" -p email --batch --dump -D tuto -T users  (Kali)',
      "Injection manuelle : ' OR '1'='1' --  → connexion sans mot de passe",
      'Correction : requête préparée PDO ($bdd->prepare(...)->execute([...]))',
      'Rejeu SQLMap sur la version protégée → paramètre non injectable, aucun dump',
    ],
    detection: [
      'Rule 31171 niv.6  —  SQL injection attempt',
      'Rule 31106 niv.6  —  A web attack returned code 200 (success)  [T1190]',
    ],
    lesson: "Une seule ligne concaténée expose toute une base ; l'attaque automatisée est bruyante (81 alertes) donc détectable ; et il faut comprendre le chaînage des règles Wazuh (la règle finale est journalisée, pas celle attendue). La requête préparée ferme la faille.",
  },
]

function Tile({ p, idx, open, onToggle, onOpenReport }) {
  const s = SEV[p.sev]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.06 }}
      className="group bg-surface rounded-2xl overflow-hidden
        shadow-[0_13px_8px_-10px_rgba(0,0,0,0.3)]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        className="w-full text-left cursor-pointer"
        aria-expanded={open}
      >
        <div
          className="h-40 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #3a0a0a 0%, #ff2b2b 140%)' }}
        >
          <i className={`bi ${ICONS[p.id]} text-6xl text-white/90`} />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${s.text}`}>
              {s.label}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400">{p.date}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-zinc-100 leading-tight flex-1">
              {p.title}
            </h3>
            {p.report && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onOpenReport(p) }}
                className="inline-flex items-center gap-1 border border-accent text-accent text-xs font-medium px-2.5 py-1 rounded-md hover:bg-accent hover:text-white transition-colors duration-150 flex-shrink-0 whitespace-nowrap"
              >
                <i className="bi bi-file-earmark-text" /> Rapport
              </button>
            )}
          </div>
        </div>
      </div>

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
            <div className="px-5 pb-6 pt-2 border-t border-divider space-y-5">
              <p className="text-xs text-zinc-400 uppercase tracking-wide pt-4">
                {p.mitre} &nbsp;·&nbsp; {p.technique}
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">{p.summary}</p>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2.5">
                  Commandes exécutées
                </p>
                <div className="bg-bg border border-divider p-4 space-y-2">
                  {p.steps.map((step, i) => (
                    <p key={i} className="font-mono text-xs text-zinc-300 leading-relaxed">
                      <span className="text-zinc-600 select-none mr-2">{i + 1}.</span>
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2.5">
                  Alertes déclenchées
                </p>
                <div className="space-y-2">
                  {p.detection.map((d, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-accent text-sm mt-px">✓</span>
                      <span className="font-mono text-xs text-zinc-200 leading-relaxed">{d}</span>
                    </div>
                  ))}
                  {p.rules.map(r => (
                    <p key={r} className="text-xs text-zinc-500">Rule {r}</p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2.5">
                  Leçon SOC
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-accent pl-4">
                  {p.lesson}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Projets() {
  const [openId, setOpenId] = useState(null)
  const [reportProj, setReportProj] = useState(null)
  const ReportComp = reportProj ? REPORTS[reportProj.id] : null

  return (
    <section id="projets" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 section-title-alert"
      >
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Mes Projets
        </h2>
        <div className="line-alert" />
        <p className="text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed">
          Quatre projets, choisis pour couvrir chacun une compétence distincte : une
          investigation complète sur des journaux Linux menée du papier au SIEM Splunk,
          l’automatisation d’une chaîne de Threat Intelligence, le déploiement d’une
          infrastructure Active Directory analysée par ses journaux, et une chaîne complète
          d’injection SQL — attaque, détection, correction. Cliquer sur une carte pour les
          détails.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {PROJECTS.map((p, i) => (
          <Tile
            key={p.id}
            p={p}
            idx={i}
            open={openId === p.id}
            onToggle={() => setOpenId(id => (id === p.id ? null : p.id))}
            onOpenReport={setReportProj}
          />
        ))}
      </div>

      <AnimatePresence>
        {reportProj && ReportComp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
            onClick={() => setReportProj(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-surface rounded-xl overflow-hidden w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-divider flex-shrink-0">
                <span className="text-sm font-medium text-zinc-200 flex items-center gap-2 min-w-0">
                  <i className="bi bi-file-earmark-text text-accent flex-shrink-0" />
                  <span className="truncate">Rapport — {reportProj.title}</span>
                </span>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {reportProj.report && (
                    <a
                      href={reportProj.report}
                      download
                      className="text-xs text-zinc-400 hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <i className="bi bi-download" /> PDF
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setReportProj(null)}
                    aria-label="Fermer"
                    className="text-zinc-400 hover:text-white transition-colors text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
                <ReportComp />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
