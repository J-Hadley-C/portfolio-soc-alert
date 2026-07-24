import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportBruteForce() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Force brute RDP : détection dans le SIEM"
        subtitle="Attaque (Hydra) → Détection (Wazuh, règle 100014) → Investigation analyste"
        meta="CHERY Jean-Hadley — Lab SOC personnel · 24 juillet 2026 · MITRE ATT&CK T1110 (Brute Force)"
      />

      <H2>1. Objectif</H2>
      <p>
        Simuler une attaque par force brute sur le service RDP d&rsquo;un serveur, la faire détecter par le SIEM
        Wazuh (règle personnelle <span className="text-zinc-100">100014</span>), puis l&rsquo;investiguer et y réagir
        comme un analyste SOC. But : valider une règle de détection de bout en bout et savoir lire une alerte dans
        le tableau de bord.
      </p>

      <H2>2. C&rsquo;est quoi une force brute ?</H2>
      <p>
        Un attaquant essaie <span className="text-zinc-100">énormément de mots de passe à la suite, très vite</span>,
        en espérant tomber sur le bon et entrer dans un compte. C&rsquo;est un des tout premiers vecteurs d&rsquo;intrusion
        réels (souvent via un RDP exposé). Côté défense : chaque échec de connexion Windows génère l&rsquo;évènement
        <code className="font-mono text-accent text-sm"> 4625</code>. Une <span className="text-zinc-100">rafale</span> de
        4625 depuis la même source = la signature d&rsquo;une force brute.
      </p>

      <H2>3. Environnement</H2>
      <Table
        head={['Rôle', 'Machine', 'Détail']}
        rows={[
          ['Attaquant', 'VM Kali', '192.168.56.100 — outil : hydra'],
          ['Cible', 'Windows Server 2022 (contrôleur de domaine)', '192.168.56.101 — WIN-0HPD19SJVPQ.lab.local'],
          ['Agent SIEM', 'Agent Wazuh 002 (sur la cible)', 'collecte le journal Security (Event 4625)'],
          ['SIEM', 'Wazuh 4.12 (Docker dans WSL2)', 'Tableau de bord : https://localhost'],
        ]}
      />

      <H2>4. Préparer la cible (activer RDP)</H2>
      <p>RDP écoute sur le port <span className="text-zinc-100">3389</span>. Sur le serveur (PowerShell admin) :</p>
      <Cmd term="Windows Server 2022 (admin)">{`Set-ItemProperty -Path "HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server" \`
  -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -Group "@FirewallAPI.dll,-28752"
Get-NetTCPConnection -LocalPort 3389 -State Listen`}</Cmd>
      <p>
        <span className="text-accent font-semibold">Bon réflexe :</span> vérifier la stratégie de verrouillage avec
        <code className="font-mono text-accent text-sm"> net accounts</code> (ligne « Seuil de verrouillage »). Ici : Jamais.
      </p>

      <H2>5. L&rsquo;attaque (Hydra, depuis Kali)</H2>
      <p>
        On cible volontairement un <span className="text-zinc-100">faux compte</span> (<code className="font-mono text-accent text-sm">hacktest</code>) :
        aucun compte réel ne risque d&rsquo;être bloqué, et Windows note quand même l&rsquo;échec (4625) pour un nom inconnu.
      </p>
      <Cmd term="Kali">{`printf 'azerty\\n123456\\npassword\\nadmin\\nqwerty\\nletmein\\nsoleil\\nmotdepasse\\ntest123\\nroot\\n' > /tmp/pw.txt
hydra -l hacktest -P /tmp/pw.txt rdp://192.168.56.101 -t 4 -V`}</Cmd>
      <Table
        head={['Option', 'Rôle']}
        rows={[
          ['-l hacktest', 'le login à tester (minuscule = un seul login)'],
          ['-P /tmp/pw.txt', 'la LISTE de mots de passe (majuscule = fichier)'],
          ['rdp://192.168.56.101', 'le service (rdp) et l’adresse de la cible'],
          ['-t 4 / -V', 'essais en parallèle / affiche chaque essai'],
        ]}
      />
      <p className="mt-2">
        <span className="text-accent font-semibold">Pièges :</span> <code className="font-mono text-accent text-sm">-p</code> minuscule
        = UN seul mot de passe, <code className="font-mono text-accent text-sm">-P</code> majuscule = un fichier liste. Le module RDP
        d&rsquo;hydra est « expérimental » ; avec <code className="font-mono text-accent text-sm">-t 4</code> il peut afficher
        <code className="font-mono text-accent text-sm"> freerdp: connection failed</code> (RDP+NLA n&rsquo;aime pas le parallèle) —
        il génère quand même les 4625, <code className="font-mono text-accent text-sm">-t 1</code> le fiabilise.
      </p>

      <H2>6. La chaîne de détection Wazuh</H2>
      <Cmd>{`Kali (hydra)
  -> Serveur : chaque échec = Event 4625 (journal Security)
  -> Agent Wazuh 002 lit Security et l'envoie au central
  -> Règle native 60122 : "Logon Failure" (matche 4625, niveau 5)
  -> Règle 100014 : 5x 60122 sur le même compte en 30s -> ALARME (niveau 12)`}</Cmd>
      <H3>La règle personnelle 100014</H3>
      <Cmd>{`<rule id="100014" level="12" frequency="5" timeframe="30">
  <if_matched_sid>60122</if_matched_sid>
  <same_field>win.eventdata.targetUserName</same_field>
  <description>Brute force detecte : 5 echecs en 30 s sur le meme compte</description>
  <mitre><id>T1110</id></mitre>
</rule>`}</Cmd>
      <p>
        <code className="font-mono text-accent text-sm">frequency=5 / timeframe=30</code> = 5 échecs en 30 s ;
        <code className="font-mono text-accent text-sm"> same_field targetUserName</code> = sur le <span className="text-zinc-100">même compte</span>.
      </p>

      <H2>7. Voir l&rsquo;attaque dans le SIEM</H2>
      <p>
        <code className="font-mono text-accent text-sm">https://localhost</code> → <span className="text-zinc-100">Threat Hunting</span> →
        onglet <span className="text-zinc-100">Events</span> → période <span className="text-zinc-100">Last 24 hours</span> → recherche :
      </p>
      <Cmd>rule.id:100014</Cmd>
      <p>
        Les alertes de force brute s&rsquo;affichent (niveau 12), l&rsquo;histogramme montre les <span className="text-zinc-100">pics</span>
        des rafales. Déplier une ligne : source <code className="font-mono text-accent text-sm">192.168.56.100</code>, compte visé
        <code className="font-mono text-accent text-sm"> hacktest</code>, MITRE T1110, agent WindowsServer2022.
      </p>
      <p className="mt-2">
        <span className="text-accent font-semibold">Piège SIEM vécu :</span> un filtre resté actif
        (<code className="font-mono text-accent text-sm">rule.level: 15 to +∞</code>) cachait l&rsquo;alerte (niveau 12) et affichait
        « No results ». Toujours vérifier les filtres actifs avant de conclure qu&rsquo;une alerte n&rsquo;existe pas.
      </p>
      <p className="mt-2">
        <span className="text-accent font-semibold">Faux positifs vécus :</span> la règle native
        <code className="font-mono text-accent text-sm"> 92213</code> (niveau 15) criait « Executable dropped in malware folder »
        en masse — mais c&rsquo;étaient des fichiers <code className="font-mono text-accent text-sm">__PSScriptPolicyTest_*.ps1</code>
        créés normalement par PowerShell. Leçon : <span className="text-zinc-100">un niveau élevé n&rsquo;est pas une vraie menace</span> ;
        trier le vrai du faux est le cœur du métier.
      </p>

      <H2>8. Investigation : l&rsquo;attaque a-t-elle réussi ?</H2>
      <p>
        Le réflexe d&rsquo;analyste : voir des échecs ne suffit pas. LA question = <span className="text-zinc-100">l&rsquo;attaquant est-il entré ?</span>
        On cherche une connexion réussie (Event 4624) depuis la même IP :
      </p>
      <Cmd>data.win.eventdata.ipAddress:192.168.56.100 and data.win.system.eventID:4624</Cmd>
      <Table
        head={['Résultat', 'Interprétation', 'Réaction']}
        rows={[
          ['0 résultat (4624)', 'aucune connexion n’a abouti', 'tentative échouée — à surveiller'],
          ['1+ résultat (4624)', 'quelqu’un a réussi à entrer', 'COMPROMISSION — incident, escalade'],
        ]}
      />
      <p className="mt-2 text-zinc-100 font-semibold">
        Verdict : 0 connexion réussie, 43 échecs depuis Kali sur hacktest → attaque échouée, pas de compromission.
        Réaction réelle : bloquer l&rsquo;IP source au pare-feu, surveiller le compte visé, tracer.
      </p>

      <H2>9. Piège de production débogué : l&rsquo;agent muet</H2>
      <p>
        Point majeur. L&rsquo;agent 002 apparaissait <span className="text-zinc-100">« Active » (connecté)</span> mais
        <span className="text-zinc-100"> n&rsquo;envoyait aucun évènement</span> : le serveur notait bien les 4625, mais rien
        n&rsquo;arrivait au SIEM.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <span className="text-zinc-100 font-medium">Cause :</span> le journal Security de l&rsquo;agent avait un filtre local
          (liste d&rsquo;exclusions <code className="font-mono text-accent text-sm">EventID != ...</code>) qui, après le redémarrage
          du serveur, s&rsquo;est coincé et a bloqué tout le canal. L&rsquo;agent de l&rsquo;hôte, sans ce filtre, fonctionnait.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Diagnostic gagnant :</span> comparer l&rsquo;agent muet à un agent qui marche,
          et lire le journal de l&rsquo;agent (<code className="font-mono text-accent text-sm">ossec.log</code>) — il indiquait
          « Log file 'Security' is duplicated ».
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Correctif :</span> retirer le bloc filtre local (sauvegarde faite), ne garder
          que la collecte propre, puis redémarrer l&rsquo;agent (<code className="font-mono text-accent text-sm">Restart-Service WazuhSvc</code>).
        </li>
      </ul>
      <p className="mt-2">
        <span className="text-accent font-semibold">Leçon SOC en or :</span> un agent « vert / connecté » peut ne plus rien envoyer =
        un <span className="text-zinc-100">angle mort de détection</span>. Surveiller la <span className="text-zinc-100">santé</span> des
        agents (envoient-ils vraiment ?), pas seulement leur connectivité.
      </p>

      <H2>10. Bilan</H2>
      <p>
        Règle 100014 validée (7 déclenchements, niveau 12, T1110), attaque tracée jusqu&rsquo;à la source, verdict d&rsquo;analyste rendu
        (échec, pas de compromission), et un angle mort d&rsquo;agent corrigé. Cycle complet : détecter → voir → investiguer → réagir.
      </p>
    </article>
  )
}
