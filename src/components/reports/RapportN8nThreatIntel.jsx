import { ReportHeader, H2, Table } from './ReportUI'

export default function RapportN8nThreatIntel() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Workflow n8n de Threat Intelligence agentique"
        subtitle="Enrichissement multi-sources d’IOC → Qualification par IA → Réponse automatisée"
        meta="CHERY Jean-Hadley · 23 nœuds · Orchestration n8n"
      />

      <H2>1. Le problème : la fatigue d&rsquo;alerte</H2>
      <p>
        Un analyste SOC passe une part considérable de son temps à qualifier des indicateurs de
        compromission un par un : cette adresse IP est-elle réellement malveillante, ou
        s&rsquo;agit-il d&rsquo;un scanner de recherche inoffensif ? La réponse exige d&rsquo;interroger
        plusieurs bases de réputation, de recouper les verdicts, puis de trancher.
      </p>
      <p>
        Répété des dizaines de fois par jour, ce travail est chronophage, répétitif, et c&rsquo;est
        précisément la cause de l&rsquo;
        <span className="text-zinc-100">alert fatigue</span> — l&rsquo;usure qui finit par faire
        passer une vraie menace pour du bruit.
      </p>

      <H2>2. Le principe</H2>
      <p>
        Ce workflow enchaîne automatiquement les trois temps du traitement d&rsquo;un indicateur :
        <span className="text-zinc-100"> enrichir</span>,{' '}
        <span className="text-zinc-100">qualifier</span>, puis{' '}
        <span className="text-zinc-100">réagir</span>. L&rsquo;analyste ne reçoit plus un
        indicateur brut à instruire, mais un verdict argumenté et déjà tracé.
      </p>

      <H2>3. Enrichissement multi-sources</H2>
      <p>
        Chaque indicateur est soumis en parallèle à cinq sources de réputation, dont les
        verdicts sont ensuite recoupés :
      </p>
      <Table
        head={['Source', 'Apport']}
        rows={[
          ['GreyNoise', 'Distingue le bruit de fond d’Internet (scanners de masse) d’une activité réellement ciblée.'],
          ['AbuseIPDB', 'Historique de signalements d’abus associés à l’adresse.'],
          ['VirusTotal', 'Verdicts agrégés d’un large ensemble de moteurs d’analyse.'],
          ['AlienVault OTX', 'Renseignement communautaire et rattachement à des campagnes connues.'],
          ['MISP', 'Base de partage de renseignement sur la menace — lecture et écriture.'],
        ]}
      />
      <p>
        Le croisement de ces cinq avis est ce qui permet d&rsquo;écarter un faux positif avec
        confiance : une IP vue par GreyNoise comme un scanner public et jamais signalée sur
        AbuseIPDB n&rsquo;appelle pas la même réaction qu&rsquo;une IP rattachée à une campagne
        active dans OTX.
      </p>

      <H2>4. Qualification par IA</H2>
      <p>
        Les résultats agrégés sont soumis à l&rsquo;
        <span className="text-zinc-100">API Claude d&rsquo;Anthropic</span>, qui produit une
        synthèse exploitable à partir de verdicts hétérogènes — chaque source ayant son propre
        format, sa propre échelle et son propre vocabulaire. C&rsquo;est le rôle que tiendrait
        l&rsquo;analyste : lire cinq réponses et en tirer une conclusion unique.
      </p>

      <H2>5. Réponse automatisée</H2>
      <Table
        head={['Action', 'Destination', 'Finalité']}
        rows={[
          ['Création d’événement', 'MISP', 'Le renseignement produit est capitalisé et partageable, pas perdu.'],
          ['Alerte', 'Slack', 'L’équipe est notifiée dans son canal de travail, sans consulter un outil de plus.'],
        ]}
      />
      <p>
        L&rsquo;écriture dans MISP est le point qui distingue ce workflow d&rsquo;un simple script
        de consultation : le système ne se contente pas de lire le renseignement disponible, il
        en produit et l&rsquo;archive au format standard de la communauté.
      </p>

      <H2>6. Architecture</H2>
      <Table
        head={['Composant', 'Rôle']}
        rows={[
          ['n8n', 'Orchestration des 23 nœuds, de la réception de l’indicateur à la réponse.'],
          ['Connecteurs d’enrichissement', 'GreyNoise · AbuseIPDB · MISP · VirusTotal · AlienVault OTX, interrogés en parallèle.'],
          ['Claude (Anthropic)', 'Qualification : synthèse d’un verdict unique à partir de cinq réponses hétérogènes.'],
          ['MISP', 'Écriture — l’événement produit est capitalisé au format standard.'],
          ['Slack', 'Notification de l’équipe dans son canal de travail.'],
        ]}
      />

      <H2>7. Limites assumées</H2>
      <ul className="list-disc list-inside space-y-1 my-3 marker:text-accent">
        <li>
          Le verdict dépend entièrement de la qualité des cinq sources. Un indicateur récent,
          inconnu de toutes, ressortira comme non malveillant — c&rsquo;est un angle mort
          structurel de l&rsquo;enrichissement par réputation.
        </li>
        <li>
          La qualification ne connaît pas le contexte de l&rsquo;organisation : une IP anodine
          dans l&rsquo;absolu peut être critique si elle contacte un actif sensible. Le verdict
          reste une aide à la décision, pas la décision.
        </li>
        <li>
          Le workflow traite les indicateurs un par un. Il ne corrèle pas plusieurs alertes
          entre elles — le raisonnement sur une chaîne d&rsquo;attaque complète reste à
          l&rsquo;analyste.
        </li>
      </ul>

      <H2>8. Ce que ce projet démontre</H2>
      <p>
        Il s&rsquo;agit d&rsquo;un <span className="text-zinc-100">SOAR fonctionnel</span> —
        orchestration, automatisation et réponse — construit et opéré personnellement. Il
        s&rsquo;exerce contre les détections du lab Wazuh décrit dans la section précédente : les
        deux systèmes ne sont pas indépendants, l&rsquo;un produit les alertes que l&rsquo;autre
        qualifie.
      </p>
    </article>
  )
}
