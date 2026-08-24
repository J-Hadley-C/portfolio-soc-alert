import { ReportHeader, H2, H3, Table } from './ReportUI'

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

      <H2>8. Exemple de traitement</H2>
      <p className="text-sm text-zinc-400 border-l-2 border-accent pl-4 my-4">
        <span className="text-zinc-100 font-semibold">Nature de cet exemple :</span> le format
        de traitement appliqué à une alerte CERT-FR réelle et publique —{' '}
        <span className="text-zinc-100">CERTFR-2026-ALE-008</span> du 22 juillet 2026. Il
        illustre la chaîne de décision, il ne reproduit pas une sortie archivée.
      </p>

      <H3>Entrée — ce que la collecte a remonté</H3>
      <Table
        head={['Élément', 'Valeur']}
        rows={[
          ['Référence', 'CERTFR-2026-ALE-008 — Multiples vulnérabilités dans Microsoft SharePoint'],
          ['Source', 'CERT-FR, publiée le 22 juillet 2026'],
          ['CVE concernées', 'CVE-2026-50522 et CVE-2026-58644'],
          ['Corroboration terrain', 'watchTowr (21 juillet) et Defused (20 juillet) — exploitation active et preuve de concept publique'],
        ]}
      />

      <H3>Filtrage — pourquoi l&rsquo;article est retenu</H3>
      <p>
        Quatre marqueurs déclenchent la rétention, ce qui place l&rsquo;élément très haut dans
        le tri :
      </p>
      <Table
        head={['Marqueur', 'Présent sous la forme']}
        rows={[
          ['CVE', 'Deux références nommées.'],
          ['RCE', '« Exécution de code arbitraire à distance », attaquant non authentifié.'],
          ['exploit', 'Preuve de concept publique signalée par watchTowr.'],
          ['patch', 'Correctifs publiés par Microsoft le 14 juillet 2026.'],
        ]}
      />

      <H3>Sortie — le bulletin produit</H3>
      <Table
        head={['Champ', 'Contenu']}
        rows={[
          ['Résumé', 'Deux vulnérabilités critiques de SharePoint permettent à un attaquant non authentifié d’exécuter du code à distance sur le serveur. Microsoft a publié les correctifs le 14 juillet et confirme que CVE-2026-58644 est activement exploitée. Une preuve de concept publique circule pour CVE-2026-50522, elle aussi exploitée.'],
          ['Systèmes affectés', 'SharePoint Enterprise Server 2016, SharePoint Server 2019 et SharePoint Server Subscription Edition, dans leurs versions antérieures aux correctifs de juillet 2026.'],
          ['Criticité', 'Critique'],
          ['Recommandation', 'Patcher — sans délai.'],
        ]}
      />

      <H3>Justification de la criticité</H3>
      <p>
        Trois facteurs se cumulent, et c&rsquo;est leur cumul qui impose le niveau maximal :
        l&rsquo;exécution de code à distance{' '}
        <span className="text-zinc-100">sans authentification préalable</span>,
        l&rsquo;exploitation <span className="text-zinc-100">déjà constatée</span> et non
        seulement théorique, et la{' '}
        <span className="text-zinc-100">disponibilité publique d&rsquo;une preuve de concept</span>,
        qui élargit le nombre d&rsquo;attaquants capables d&rsquo;en tirer parti. Une
        vulnérabilité critique sans exploitation observée serait restée en « Élevé ».
      </p>

      <H3>Le point d&rsquo;analyse que le bulletin doit porter</H3>
      <p className="border-l-2 border-accent pl-4 my-4">
        Appliquer le correctif ne suffit pas. Le CERT-FR précise qu&rsquo;en cas de soupçon de
        compromission, les secrets doivent être renouvelés —{' '}
        <span className="text-zinc-100">
          y compris les clés de machine ASP.NET du serveur SharePoint
        </span>{' '}
        —, faute de quoi un attaquant ayant déjà volé ces clés{' '}
        <span className="text-zinc-100">revient après la mise à jour</span>.
        <br />
        <br />
        C&rsquo;est exactement ce qu&rsquo;un bulletin de veille doit faire remonter : la
        remédiation évidente est incomplète, et l&rsquo;omettre laisse une porte ouverte que
        l&rsquo;équipe croira fermée.
      </p>

      <H3>Ce que ce cas valide dans la conception</H3>
      <p>
        Le CERT-FR fournit l&rsquo;avis qui fait autorité ; watchTowr et Defused fournissent la
        confirmation que l&rsquo;exploitation est réelle. C&rsquo;est précisément le couple{' '}
        <span className="text-zinc-100">référentiel + terrain</span> décrit en section 2 : sans
        les sources de terrain, cette alerte aurait été traitée comme une vulnérabilité critique
        parmi d&rsquo;autres, et non comme une urgence avérée.
      </p>

      <H2>9. Ce que ce projet démontre</H2>
      <p>
        Savoir où chercher le renseignement, savoir ce qui mérite une alerte, et savoir le
        restituer dans un format qu&rsquo;une équipe peut exploiter. La chaîne technique n&rsquo;est
        qu&rsquo;un moyen : la compétence est dans le tri et dans le bulletin.
      </p>
    </article>
  )
}
