import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RapportN8nThreatIntel from './reports/RapportN8nThreatIntel'
import RapportVeilleHebdo from './reports/RapportVeilleHebdo'

const REPORTS = {
  1: RapportN8nThreatIntel,
  2: RapportVeilleHebdo,
}

const SYSTEMES = [
  {
    id: 1,
    icon: 'bi-robot',
    title: 'Threat Intelligence agentique',
    statut: 'SOAR',
    meta: '23 nœuds n8n',
    stack: 'n8n · API Claude · MISP · Slack',
    summary:
      "Enrichissement automatique des indicateurs de compromission auprès de cinq sources de réputation, qualification du verdict par IA, puis réponse : création d'événement MISP et alerte Slack. Traite le problème de l'alert fatigue à la racine — l'analyste reçoit un verdict argumenté, pas un indicateur brut.",
    flux: [
      'Réception d’un indicateur de compromission (IP, hash, domaine)',
      'Enrichissement parallèle : GreyNoise, AbuseIPDB, VirusTotal, AlienVault OTX, MISP',
      'Agrégation et recoupement des cinq verdicts',
      'Qualification par l’API Claude — synthèse d’une conclusion unique',
      'Création de l’événement MISP + notification Slack',
    ],
    resultats: [
      'Cinq sources de réputation interrogées sans intervention humaine',
      'Renseignement produit capitalisé au format MISP, donc partageable',
      'Équipe notifiée dans son canal de travail habituel',
    ],
    apport:
      "Un SOAR complet — orchestration, automatisation, réponse — construit et opéré personnellement. Il s'exerce contre les détections du lab Wazuh : les deux systèmes se répondent.",
  },
  {
    id: 2,
    icon: 'bi-calendar-week-fill',
    title: 'SOC-Threat-Intel-Weekly',
    statut: 'En production',
    meta: 'v1.0 — mai 2026',
    stack: 'n8n · CERT-FR · Claude Haiku · Notion · Gmail',
    summary:
      "Veille sur les vulnérabilités émergentes, automatisée de bout en bout. Chaque lundi à 06h00, le système interroge quatre sources de référence — CERT-FR en tête —, filtre sur les marqueurs d'exploitabilité, qualifie jusqu'à 20 menaces et produit un bulletin d'alerte au format constant : résumé, systèmes affectés, criticité, recommandation.",
    flux: [
      'Déclenchement cron — lundi 06h00 (Europe/Paris)',
      'Collecte : CERT-FR, CVEfeed, The Hacker News, BleepingComputer',
      'Fusion des articles en une liste unifiée',
      'Filtrage : CVE, RCE, zero-day, ransomware, exploit, backdoor, patch',
      'Plafonnement aux 20 articles les plus récents et pertinents',
      'Analyse Claude Haiku — résumé, systèmes affectés, criticité, action',
      'Archivage Notion + envoi du mail récapitulatif',
    ],
    resultats: [
      'Quatre flux bruyants réduits à 20 menaces qualifiées par semaine',
      'Bulletin au format constant : résumé, périmètre, criticité, action',
      'Trois décisions possibles — patcher, surveiller, bloquer',
      'Historique consultable, menaces comparables d’une semaine à l’autre',
    ],
    apport:
      "Une mission de SOC à part entière — veille sur les vulnérabilités émergentes et diffusion de bulletins d'alerte — rendue systématique. La compétence n'est pas dans la chaîne technique mais dans le tri : savoir où chercher, ce qui mérite une alerte, et comment le restituer pour qu'une équipe puisse agir.",
  },
]

function Carte({ s, idx, open, onToggle, onOpenReport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.08 }}
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
          style={{ background: 'linear-gradient(135deg, #0a1f3a 0%, #1f6feb 140%)' }}
        >
          <i className={`bi ${s.icon} text-6xl text-white/90`} />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4d9fff]">
              {s.statut}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400">{s.meta}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-zinc-100 leading-tight flex-1">
              {s.title}
            </h3>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onOpenReport(s) }}
              className="inline-flex items-center gap-1 border border-[#4d9fff] text-[#4d9fff] text-xs font-medium px-2.5 py-1 rounded-md hover:bg-[#4d9fff] hover:text-white transition-colors duration-150 flex-shrink-0 whitespace-nowrap"
            >
              <i className="bi bi-file-earmark-text" /> Documentation
            </button>
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
              <p className="text-xs text-zinc-400 uppercase tracking-wide pt-4">{s.stack}</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{s.summary}</p>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2.5">
                  Enchaînement du workflow
                </p>
                <div className="bg-bg border border-divider p-4 space-y-2">
                  {s.flux.map((etape, i) => (
                    <p key={i} className="font-mono text-xs text-zinc-300 leading-relaxed">
                      <span className="text-zinc-600 select-none mr-2">{i + 1}.</span>
                      {etape}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2.5">
                  Ce que le système produit
                </p>
                <div className="space-y-2">
                  {s.resultats.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[#4d9fff] text-sm mt-px">✓</span>
                      <span className="text-xs text-zinc-200 leading-relaxed">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2.5">
                  Apport SOC
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#4d9fff] pl-4">
                  {s.apport}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Automatisation() {
  const [openId, setOpenId] = useState(null)
  const [reportSys, setReportSys] = useState(null)
  const ReportComp = reportSys ? REPORTS[reportSys.id] : null

  return (
    <section id="automatisation" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 section-title-alert"
      >
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-zinc-100 uppercase">
          Automatisation
        </h2>
        <div className="line-alert" />
        <p className="text-zinc-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Deux systèmes d&rsquo;automatisation que j&rsquo;ai conçus et que je fais tourner :
          un SOAR de qualification d&rsquo;indicateurs de compromission, et une veille
          cybersécurité hebdomadaire en production. Cliquer sur une carte pour le détail,
          ou ouvrir la documentation complète.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6 items-start">
        {SYSTEMES.map((s, i) => (
          <Carte
            key={s.id}
            s={s}
            idx={i}
            open={openId === s.id}
            onToggle={() => setOpenId(id => (id === s.id ? null : s.id))}
            onOpenReport={setReportSys}
          />
        ))}
      </div>

      <AnimatePresence>
        {reportSys && ReportComp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
            onClick={() => setReportSys(null)}
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
                  <i className="bi bi-file-earmark-text text-[#4d9fff] flex-shrink-0" />
                  <span className="truncate">Documentation — {reportSys.title}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setReportSys(null)}
                  aria-label="Fermer"
                  className="text-zinc-400 hover:text-white transition-colors text-xl leading-none flex-shrink-0"
                >
                  ✕
                </button>
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
