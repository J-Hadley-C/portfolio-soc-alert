import { ReportHeader, H2, Table } from './ReportUI'

export default function RapportVeilleHebdo() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="SOC-Threat-Intel-Weekly : veille vulnérabilités automatisée"
        subtitle="Collecte multi-sources → Filtrage sur marqueurs critiques → Qualification → Bulletin d’alerte"
        meta="CHERY Jean-Hadley · Version 1.0 — mai 2026 · En production depuis mai 2026"
      />

      <H2>1. La mission couverte</H2>
      <p>
        La veille sur les vulnérabilités émergentes et la diffusion de bulletins d&rsquo;alerte
        sont une mission de SOC à part entière. Elle consiste à surveiller les sources de
        référence, à isoler ce qui menace réellement le périmètre, et à en produire une
        synthèse actionnable pour les équipes.
      </p>
      <p>
        Ce système exécute cette mission chaque semaine, de la collecte à la diffusion, sans
        intervention. Il ne remplace pas le jugement de l&rsquo;analyste : il lui présente une
        matière déjà triée et formatée.
      </p>

      <H2>2. Les sources, et pourquoi celles-là</H2>
      <Table
        head={['Source', 'Nature', 'Ce qu’elle apporte']}
        rows={[
          ['CERT-FR', 'Officielle', 'Centre gouvernemental français de réponse aux urgences informatiques. Avis et alertes qui font autorité sur le périmètre national.'],
          ['CVEfeed', 'Référentiel', 'Vulnérabilités identifiées et normalisées (CVE) — la base commune de tout suivi de vulnérabilités.'],
          ['The Hacker News', 'Média', 'Contexte et campagnes observées à l’échelle mondiale.'],
          ['BleepingComputer', 'Média', 'Incidents en cours et exploitation active constatée sur le terrain.'],
        ]}
      />
      <p>
        Le couple <span className="text-zinc-100">référentiel + terrain</span> est délibéré :
        une CVE publiée n&rsquo;a pas la même urgence selon qu&rsquo;elle est théorique ou
        déjà exploitée. Les deux médias servent à détecter ce second cas.
      </p>

      <H2>3. Le filtrage</H2>
      <p>
        Les articles collectés sont retenus sur présence de marqueurs qui signalent une menace
        exploitable :
      </p>
      <Table
        head={['Marqueur', 'Ce qu’il signale']}
        rows={[
          ['CVE', 'Vulnérabilité identifiée et référencée.'],
          ['RCE', 'Exécution de code à distance — la classe la plus critique.'],
          ['zero-day', 'Faille exploitée avant tout correctif disponible.'],
          ['ransomware', 'Menace à impact métier immédiat.'],
          ['exploit', 'Preuve d’exploitabilité publiée.'],
          ['backdoor', 'Compromission persistante.'],
          ['patch', 'Correctif disponible — conditionne la recommandation.'],
        ]}
      />
      <p>
        Le volume est ensuite plafonné aux 20 éléments les plus récents et pertinents. Ce
        plafond est un choix de qualification : mieux vaut vingt menaces réellement instruites
        qu&rsquo;une liste exhaustive que personne ne lira.
      </p>

      <H2>4. Le bulletin produit</H2>
      <p>
        C&rsquo;est le livrable, et le cœur du projet. Chaque menace retenue est restituée dans
        un format constant, celui d&rsquo;un bulletin de veille :
      </p>
      <Table
        head={['Champ', 'Rôle analytique']}
        rows={[
          ['Résumé', 'Ce qui se passe, en langage accessible à un lecteur non spécialiste.'],
          ['Systèmes affectés', 'Le périmètre concerné — sans quoi l’alerte n’est pas actionnable.'],
          ['Criticité', 'Critique / Élevé / Moyen — donne l’ordre de traitement.'],
          ['Recommandation', 'Patcher, surveiller ou bloquer — la décision opérationnelle.'],
        ]}
      />
      <p>
        Le format est identique d&rsquo;une semaine à l&rsquo;autre. C&rsquo;est ce qui rend le
        bulletin lisible en diagonale et comparable dans le temps — un lecteur sait où trouver
        l&rsquo;information sans relire l&rsquo;ensemble.
      </p>

      <H2>5. Les trois décisions possibles</H2>
      <Table
        head={['Recommandation', 'Quand', 'Ce qu’elle engage']}
        rows={[
          ['Patcher', 'Correctif disponible et périmètre exposé.', 'Action corrective planifiée.'],
          ['Surveiller', 'Pas de correctif, ou exposition à confirmer.', 'Mise sous observation, détection à renforcer.'],
          ['Bloquer', 'Exploitation active et pas de correctif.', 'Mesure de contournement immédiate.'],
        ]}
      />
      <p>
        Réduire une menace à l&rsquo;une de ces trois issues force la synthèse : une veille qui
        n&rsquo;aboutit pas à une décision n&rsquo;est qu&rsquo;une revue de presse.
      </p>

      <H2>6. Architecture</H2>
      <Table
        head={['Composant', 'Rôle']}
        rows={[
          ['n8n', 'Orchestration des 7 étapes, du déclenchement à la diffusion.'],
          ['Déclencheur cron', 'Lundi 06h00, fuseau Europe/Paris.'],
          ['Collecteurs', '4 sources interrogées en parallèle, puis fusionnées.'],
          ['Filtre', 'Sélection sur marqueurs, plafond à 20 éléments.'],
          ['Claude Haiku (Anthropic)', 'Qualification : synthèse, périmètre, criticité, recommandation.'],
          ['Notion', 'Archivage — historique consultable semaine par semaine.'],
          ['Gmail', 'Diffusion du bulletin.'],
        ]}
      />

      <H2>7. Limites assumées</H2>
      <ul className="list-disc list-inside space-y-1 my-3 marker:text-accent">
        <li>
          Le filtrage par mots-clés laisse passer des faux positifs et peut manquer une menace
          formulée autrement — c&rsquo;est un premier tri, pas une qualification définitive.
        </li>
        <li>
          La criticité est proposée hors contexte : elle ignore le périmètre réel d&rsquo;une
          organisation donnée. En production, elle devrait être repondérée selon les actifs
          exposés.
        </li>
        <li>
          Le plafond de 20 éléments écarte volontairement du volume. Sur une semaine
          exceptionnellement chargée, une relecture manuelle reste nécessaire.
        </li>
      </ul>

      <H2>8. Ce que ce projet démontre</H2>
      <p>
        Savoir où chercher le renseignement, savoir ce qui mérite une alerte, et savoir le
        restituer dans un format qu&rsquo;une équipe peut exploiter. La chaîne technique n&rsquo;est
        qu&rsquo;un moyen : la compétence est dans le tri et dans le bulletin.
      </p>
    </article>
  )
}
