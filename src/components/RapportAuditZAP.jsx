// Rapport d'audit OWASP ZAP — rendu HTML natif (affichage fiable dans la modale,
// indépendant du lecteur PDF du navigateur).

function H2({ children }) {
  return (
    <h3 className="font-display font-bold text-xl text-accent uppercase tracking-wide mt-8 mb-3 first:mt-0">
      {children}
    </h3>
  )
}

function H3({ children }) {
  return <h4 className="font-display font-semibold text-base text-zinc-100 mt-5 mb-2">{children}</h4>
}

function Cmd({ term, children }) {
  return (
    <div className="my-3">
      {term && (
        <p className="text-xs font-semibold text-accent mb-1">Terminal : {term}</p>
      )}
      <pre className="bg-bg border border-divider rounded-md p-3 overflow-x-auto">
        <code className="font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre">{children}</code>
      </pre>
    </div>
  )
}

function Table({ head, rows }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="border-b-2 border-accent/50 py-2 pr-4 text-xs uppercase tracking-wide text-accent font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-divider">
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-4 text-zinc-300 align-top leading-relaxed">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RapportAuditZAP() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <header className="mb-6 pb-4 border-b border-divider">
        <h2 className="font-display font-bold text-2xl text-zinc-100 mb-2">
          Procédure d'audit web avec OWASP ZAP
        </h2>
        <p className="text-sm text-zinc-400">
          Détection — Remédiation — Vérification &nbsp;·&nbsp; Exercice 2A, Chapitre 4 (Attaques Web)
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          CHERY Jean-Hadley — Lab SOC personnel &nbsp;·&nbsp; 20 juillet 2026 &nbsp;·&nbsp; OWASP ZAP 2.17.0 (scan passif)
        </p>
      </header>

      <H2>1. Objectif</H2>
      <p>
        Auditer une application web réelle avec OWASP ZAP : détecter les vulnérabilités, les corriger,
        puis re-tester pour prouver la correction. Document conçu comme une procédure reproductible —
        chaque commande est indiquée avec sa machine, son terminal et son résultat.
      </p>

      <H2>2. Environnement</H2>
      <Table
        head={['Élément', 'Détail']}
        rows={[
          ['Machine attaquante', 'Kali Linux (VM) — terminal Kali'],
          ["Poste d'administration", 'Windows 11 « ESHU » — terminal PowerShell'],
          ['Cible', 'Portfolio statique React/Vite hébergé sur Vercel'],
          ['Dépôt Git', 'GitHub → déploiement automatique Vercel'],
        ]}
      />

      <H2>3. Phase 1 — Détection</H2>
      <H3>Étape 1 — Vérifier si ZAP est installé</H3>
      <Cmd term="Kali">which zaproxy</Cmd>
      <p>Résultat : aucune sortie → ZAP non installé.</p>

      <H3>Étape 2 — Installer ZAP</H3>
      <Cmd term="Kali">sudo apt update && sudo apt install -y zaproxy</Cmd>

      <H3>Étape 3 — Lancer ZAP</H3>
      <Cmd term="Kali">zaproxy &</Cmd>

      <H3>Étape 4 — Scan passif (interface ZAP)</H3>
      <p>
        Principe du scan passif : ZAP se place en proxy entre le navigateur et le site et observe le
        trafic, sans envoyer d'attaque. Quick Start → Manual Explore → saisir l'URL → Launch Browser,
        puis naviguer sur les pages du site.
      </p>
      <p className="mt-2">
        <span className="text-accent font-semibold">Règle de périmètre (essentielle) :</span> ne pas
        suivre les liens sortants (LinkedIn, GitHub, e-mail). Un scan passif suit tout le trafic ; cliquer
        ces liens ferait analyser des sites tiers hors périmètre.
      </p>

      <H3>Étape 5 — Lire les résultats</H3>
      <p>
        Panneau du bas → onglet Alerts (rouge = High, orange = Medium, jaune = Low, bleu = Info).
        <span className="text-zinc-100 font-semibold"> Résultat initial : 16 alertes, 0 grave</span> —
        en majorité des en-têtes de sécurité HTTP manquants.
      </p>

      <H2>4. Vulnérabilités détectées</H2>
      <Table
        head={['Vulnérabilité', 'Gravité', 'Impact']}
        rows={[
          ['CSP Not Set', 'Moyen', 'Pas de liste blanche → injection de scripts possible'],
          ['Missing Anti-clickjacking Header', 'Moyen', 'Site piégeable dans une iframe (clickjacking)'],
          ['Mauvaise configuration CORS', 'Moyen', 'Access-Control-Allow-Origin: *'],
          ['HSTS Not Set', 'Faible', 'HTTPS non imposé'],
          ['X-Content-Type-Options Missing', 'Faible', 'MIME sniffing possible'],
          ['Server / X-Powered-By Leaks', 'Faible', 'Techno et version serveur révélées'],
          ['Sub Resource Integrity Missing', 'Faible', 'Ressources externes non vérifiées'],
          ['Private IP Disclosure', 'Faible', 'IP privée exposée'],
          ['Constats divers (comments, cache…)', 'Info', 'Pas des failles'],
        ]}
      />

      <H2>5. Phase 2 — Remédiation</H2>
      <p>
        Correction centralisée via le fichier <code className="font-mono text-accent text-sm">vercel.json</code> :
        ajout des en-têtes de sécurité à toutes les réponses du serveur.
      </p>
      <H3>Étape 6 — Éditer vercel.json (extrait)</H3>
      <Cmd>{`"headers": [{
  "source": "/(.*)",
  "headers": [
    { "key": "Content-Security-Policy", "value": "default-src 'self'; ..." },
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
  ]
}]`}</Cmd>
      <p>Le CSP est adapté au site (autorise Google Fonts et le formulaire Formspree).</p>

      <H3>Étape 7 — Déployer</H3>
      <Cmd term="PowerShell Windows">{`git add vercel.json
git commit -m "Ajoute les en-tetes de securite HTTP (audit OWASP ZAP)"
git push`}</Cmd>

      <H3>Étape 8 — Vérifier les en-têtes en ligne</H3>
      <Cmd term="PowerShell Windows">{`Invoke-WebRequest -Uri "<url>" -Method Head -UseBasicParsing`}</Cmd>
      <p>Résultat : les 6 en-têtes présents sur le serveur.</p>

      <H3>Étape 9 — Re-scanner</H3>
      <p>
        Nouvelle session ZAP → Manual Explore → même URL → re-scan.
        <span className="text-zinc-100 font-semibold"> Résultat : 9 alertes, 0 grave</span>
        (3 Moyen · 2 Faible · 4 Info). Anti-clickjacking, MIME sniffing et fuites de version ont disparu.
      </p>

      <H2>6. Correspondance vulnérabilité → correction</H2>
      <Table
        head={['Vulnérabilité', 'Correction', 'Statut']}
        rows={[
          ['CSP Not Set', 'En-tête Content-Security-Policy', '✅ Corrigé'],
          ['Anti-clickjacking', 'X-Frame-Options: DENY', '✅ Corrigé'],
          ['HSTS Not Set', 'Strict-Transport-Security', '✅ Corrigé (vérifié)'],
          ['X-Content-Type-Options', 'nosniff', '✅ Corrigé'],
          ['Referrer / Permissions', 'En-têtes dédiés', '✅ Corrigé'],
          ['Server / X-Powered-By', '—', '❌ Non corrigeable (infra Vercel)'],
          ['CSP style-src unsafe-inline', 'Requis par React/Framer Motion', '⚠️ Compromis assumé'],
          ['CORS Allow-Origin: *', 'Sans risque sur site statique', '⚠️ Accepté'],
          ['Faux positifs / constats', '—', 'ℹ️ Aucun risque'],
        ]}
      />
      <p className="mt-2 text-zinc-100 font-semibold">
        Bilan : 6 vulnérabilités corrigées et vérifiées, 9 alertes résiduelles dont aucune exploitable.
      </p>

      <H2>7. Leçons d'analyste</H2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <span className="text-zinc-100 font-medium">Définir le périmètre avant de scanner.</span> Un scan
          passif suit les liens sortants ; ZAP a même remonté une faille High sur une librairie de LinkedIn
          (DOMPurify, CVE-2024-47875) — hors périmètre, écartée.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Trier le réel du bruit.</span> Qualifier chaque alerte :
          risque réel, compromis assumé, faux positif ou constat.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Attention au cache CDN,</span> qui peut afficher un état
          périmé des en-têtes : vérifier l'état réel du serveur.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Détecter → corriger → re-tester :</span> le cycle complet
          transforme un scan en démarche de sécurisation prouvée.
        </li>
      </ul>

      <H2>8. Conclusion</H2>
      <p>
        Audit passif mené de bout en bout : 16 faiblesses détectées, 6 en-têtes de sécurité ajoutés et
        vérifiés, second scan à 9 alertes dont 0 exploitable. Posture de sécurité web renforcée, conforme
        aux bonnes pratiques OWASP sur les en-têtes HTTP.
      </p>
    </article>
  )
}
