import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportActiveDirectory() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Active Directory : déploiement et analyse des journaux"
        subtitle="Création d'un domaine → rattachement d'un poste → gestion des identités → lecture SOC des traces"
        meta="CHERY Jean-Hadley — Lab SOC personnel · 15 septembre 2026 · Windows Server 2022 / Windows 11"
      />

      <H2>1. Objectif</H2>
      <p>
        Active Directory est l&rsquo;annuaire d&rsquo;identités de la quasi-totalité des environnements Windows
        d&rsquo;entreprise. C&rsquo;est aussi, pour cette raison, la{' '}
        <span className="text-zinc-100">cible prioritaire d&rsquo;un attaquant</span> : qui contrôle le contrôleur
        de domaine contrôle l&rsquo;ensemble des machines.
      </p>
      <p>
        L&rsquo;objectif n&rsquo;était pas seulement de déployer cette infrastructure, mais d&rsquo;être ensuite
        capable de <span className="text-zinc-100">retrouver et d&rsquo;interpréter, dans les journaux de sécurité,
        la trace de chaque action effectuée</span>. C&rsquo;est ce second temps qui relève du métier d&rsquo;analyste.
      </p>

      <H2>2. C&rsquo;est quoi un contrôleur de domaine ?</H2>
      <p>
        C&rsquo;est le serveur qui détient la liste des comptes et qui valide les connexions. Quand un employé tape
        son mot de passe le matin, ce n&rsquo;est pas son PC qui vérifie : son PC{' '}
        <span className="text-zinc-100">pose la question au serveur</span> et attend la réponse.
      </p>
      <Table
        head={['Sans domaine', 'Avec domaine']}
        rows={[
          ['Chaque poste a sa propre liste de comptes', 'Une seule liste, centralisée'],
          ['Un départ → passer sur chaque machine', 'Un départ → un compte désactivé, accès coupé partout'],
          ['Un mot de passe différent par machine', 'Un seul identifiant pour tout le parc'],
        ]}
      />
      <p>
        Corollaire défensif : <span className="text-zinc-100">un compte compromis n&rsquo;est plus une machine
        compromise</span>, c&rsquo;est un accès potentiel à l&rsquo;ensemble du parc.
      </p>

      <H2>3. Environnement</H2>
      <Table
        head={['Rôle', 'Machine', 'Détail']}
        rows={[
          ['Hyperviseur', 'VMware Workstation Pro 17', 'Type 2 — hôte Windows 11'],
          ['Serveur', 'Windows Server 2022 Standard', 'SRV-DC01 — [SERVEUR], adresse fixe'],
          ['Poste client', 'Windows 11 Enterprise 25H2', 'WKS-CLIENT01 — [CLIENT], DHCP'],
          ['Domaine', 'soc.lab', 'Forêt à domaine unique, niveau fonctionnel 2016'],
          ['Réseau', 'NAT', '[RESEAU]/24 — 4 Go et 2 cœurs par machine'],
        ]}
      />

      <H2>4. Promouvoir le contrôleur de domaine</H2>
      <Table
        head={['Opération', 'Pourquoi']}
        rows={[
          ['Adresse IP fixée en dur', 'Les postes doivent joindre le serveur en permanence pour s’authentifier. Une adresse changeante casserait l’ouverture de session sur tout le parc.'],
          ['DNS préféré = 127.0.0.1', 'Le serveur se désigne lui-même : il devient le serveur DNS du domaine à la promotion.'],
          ['Renommage AVANT la promotion', 'Le nom est inscrit dans l’annuaire et dans de nombreux enregistrements DNS. Le changer ensuite relève de l’opération lourde.'],
          ['Rôle puis promotion', 'Deux étapes distinctes : installer le rôle pose les outils et ne crée aucun domaine.'],
          ['Instantané avant promotion', 'Opération irréversible sans rétrogradation.'],
        ]}
      />
      <p>
        Vérification après redémarrage, dans les deux consoles : zones DNS{' '}
        <code className="font-mono text-accent text-sm">soc.lab</code> et{' '}
        <code className="font-mono text-accent text-sm">_msdcs.soc.lab</code> créées automatiquement, annuaire
        structuré et accessible.
      </p>

      <H2>5. Rattacher le poste client</H2>
      <p>
        Le DNS du poste est dirigé vers le serveur, puis la communication est vérifiée{' '}
        <span className="text-zinc-100">avant</span> toute opération :
      </p>
      <Cmd term="Windows 11 (poste client)">{`ping [SERVEUR]
  -> 4 paquets envoyes, 4 recus, 0 perdu

nslookup soc.lab
  -> Nom : soc.lab
     Address : [SERVEUR]`}</Cmd>
      <p>
        <span className="text-accent font-semibold">Le test décisif n&rsquo;est pas le ping.</span> Le ping prouve
        seulement que le serveur répond à son adresse.{' '}
        <code className="font-mono text-accent text-sm">nslookup</code> prouve que le poste sait{' '}
        <span className="text-zinc-100">retrouver le domaine par son nom</span> — ce dont il a besoin pour le rejoindre.
      </p>
      <p>
        <span className="text-accent font-semibold">Piège rencontré :</span> après le rattachement et le redémarrage,{' '}
        <code className="font-mono text-accent text-sm">whoami</code> retournait encore le compte local.{' '}
        <span className="text-zinc-100">Rejoindre un domaine ne connecte pas au domaine</span> — il faut explicitement
        ouvrir une session avec un compte du domaine.
      </p>

      <H2>6. Structurer l&rsquo;annuaire</H2>
      <Cmd term="Structure retenue">{`soc.lab
└── SOC-Utilisateurs
    ├── Informatique     -> marie.dupont
    ├── Comptabilite     -> thomas.bernard
    └── Direction        -> sophie.laurent`}</Cmd>
      <p>
        Ce découpage n&rsquo;est pas cosmétique :{' '}
        <span className="text-zinc-100">l&rsquo;unité d&rsquo;organisation est le périmètre auquel s&rsquo;appliquent
        les stratégies de groupe</span>. Un annuaire à plat impose une politique unique à tout le personnel, donc
        alignée sur le plus permissif.
      </p>
      <p>
        Un droit d&rsquo;accès au Bureau à distance est ensuite attribué par{' '}
        <span className="text-zinc-100">appartenance à un groupe</span>, puis validé par une ouverture de session
        réelle sur le poste.
      </p>

      <H2>7. L&rsquo;analyse des journaux — la partie SOC</H2>
      <p>
        Le journal de sécurité du contrôleur de domaine comptait{' '}
        <span className="text-zinc-100">plus de 7 600 lignes</span>. Un filtre sur trois identifiants
        d&rsquo;événements en a retenu <span className="text-zinc-100">25</span>.
      </p>
      <Cmd term="Observateur d'événements — filtre">{`Journaux Windows -> Securite
Clic droit -> Filtrer le journal actuel...
Tous les ID d'evenements : 4720,4724,4732

7 649 lignes  ->  25 lignes`}</Cmd>

      <H3>Corrélation des actions avec leurs traces</H3>
      <Table
        head={['Heure', 'Événements', 'Action correspondante']}
        rows={[
          ['20:06', '4720 + 4724', 'Rattachement du poste au domaine'],
          ['21:37', '4720 + 4724', 'Création d’un compte utilisateur'],
          ['21:39', '4720 + 4724', 'Création d’un compte utilisateur'],
          ['21:41', '4720 + 4724', 'Création d’un compte utilisateur'],
        ]}
      />

      <H3>Deux enseignements tirés de la lecture</H3>
      <p>
        <span className="text-zinc-100">Une action produit une séquence, pas une ligne.</span> Créer un compte génère
        un <code className="font-mono text-accent text-sm">4720</code> immédiatement suivi d&rsquo;un{' '}
        <code className="font-mono text-accent text-sm">4724</code>. Conséquence en analyse : un 4724{' '}
        <span className="text-zinc-100">sans</span> 4720 juste avant ne décrit pas une création, mais le changement de
        mot de passe d&rsquo;un compte existant — l&rsquo;un des signaux les plus surveillés, puisque c&rsquo;est
        ainsi qu&rsquo;on prend le contrôle du compte d&rsquo;un tiers.
      </p>
      <p>
        <span className="text-zinc-100">Compter est une méthode de détection.</span> Trois comptes créés doivent
        produire trois séquences. Une quatrième, à 20h06, ne correspondait à rien. En ouvrant le détail : le compte
        cible était <code className="font-mono text-accent text-sm">WKS-CLIENT01$</code>. Le{' '}
        <code className="font-mono text-accent text-sm">$</code> signale un{' '}
        <span className="text-zinc-100">compte d&rsquo;ordinateur</span>, créé automatiquement lors du rattachement
        au domaine. Les machines ont un compte, comme les employés.
      </p>
      <p>
        Le journal complet a ensuite été exporté en{' '}
        <code className="font-mono text-accent text-sm">.evtx</code>.{' '}
        <span className="text-accent font-semibold">On collecte l&rsquo;intégralité, on filtre ensuite :</span> le
        filtre est choisi en sachant ce que l&rsquo;on cherche, ce qui n&rsquo;est jamais le cas au début d&rsquo;une
        investigation.
      </p>

      <H2>8. Les identifiants d&rsquo;événements à connaître</H2>
      <Table
        head={['Identifiant', 'Signification', 'Journal concerné']}
        rows={[
          ['4720', 'Compte créé', 'Contrôleur de domaine'],
          ['4724', 'Mot de passe défini sur un compte', 'Contrôleur de domaine'],
          ['4741', 'Compte d’ordinateur créé', 'Contrôleur de domaine'],
          ['4624', 'Ouverture de session réussie', 'Contrôleur de domaine'],
          ['4732', 'Droit accordé par ajout à un groupe', 'Selon le groupe'],
        ]}
      />
      <p>
        <span className="text-accent font-semibold">Savoir où chercher vaut autant que savoir quoi chercher.</span>{' '}
        L&rsquo;événement 4732 est écrit sur la machine qui <span className="text-zinc-100">détient le groupe</span> :
        journal du domaine pour un groupe de domaine, journal local pour un groupe local. Chercher au mauvais endroit
        fait conclure à tort qu&rsquo;il ne s&rsquo;est rien passé.
      </p>

      <H2>9. Incidents rencontrés et résolus</H2>
      <p>
        Ces incidents n&rsquo;étaient pas prévus par la procédure. Ils ont imposé une démarche de diagnostic et non
        l&rsquo;application d&rsquo;un mode opératoire.
      </p>

      <H3>Image d&rsquo;installation non amorçable</H3>
      <p>
        Le centre d&rsquo;évaluation de l&rsquo;éditeur propose,{' '}
        <span className="text-zinc-100">avant</span> le lien attendu, une image de compléments linguistiques qui
        n&rsquo;est pas un support d&rsquo;installation.{' '}
        <span className="text-accent font-semibold">Méthode retenue :</span> vérifier une image par sa structure
        interne — signature ISO 9660 et enregistrement de démarrage — et non par son nom de fichier.
      </p>

      <H3>Échec de démarrage : « No Media »</H3>
      <Cmd term="Journal de l'hyperviseur">{`Guest: Status upon boot failure: No Media
Guest: EFI Shell inactive in default boot sequence.

20:20:47.889  lecteur CD connecte
20:20:52.023  echec du demarrage
              -> 4 secondes`}</Cmd>
      <p>
        Le message d&rsquo;erreur ne donnait pas la cause.{' '}
        <span className="text-zinc-100">Ce sont les horodatages qui l&rsquo;ont donnée</span> : le délai
        d&rsquo;attente du démarrage UEFI expirait faute d&rsquo;appui sur une touche, et le micrologiciel basculait
        sur un disque vierge. Correctif : démarrage forcé par le gestionnaire de démarrage du micrologiciel.
      </p>

      <H3>Machine virtuelle verrouillée</H3>
      <p>
        L&rsquo;hyperviseur refusait d&rsquo;ouvrir la machine, et la reprise de propriété échouait aussi. Aucun
        processus d&rsquo;exécution n&rsquo;était actif : la machine ne tournait donc pas. La lecture du fichier de
        verrou a <span className="text-zinc-100">désigné nommément le processus détenteur</span> — une seconde
        instance de l&rsquo;interface, lancée par un double-clic. Ni suppression de la machine, ni arrêt forcé : les
        deux auraient laissé un verrou orphelin.
      </p>

      <H3>Résolution de compte impossible — erreur 1332</H3>
      <p>
        « Le mappage entre les noms de compte et les ID de sécurité n&rsquo;a pas été effectué. » Le compte visé était
        un compte en ligne, non un compte local. Windows n&rsquo;identifie pas les comptes par leur nom mais par un{' '}
        <span className="text-zinc-100">identifiant de sécurité</span>. À retenir pour le SOC : quand un compte est
        supprimé, le nom disparaît des journaux et{' '}
        <span className="text-zinc-100">il ne reste que l&rsquo;identifiant</span>.
      </p>

      <H2>10. Choix techniques assumés</H2>
      <Table
        head={['Choix retenu', 'Justification']}
        rows={[
          ['Poste client sous Windows 11, non sous Windows Server', 'En entreprise, un poste utilisateur n’est jamais un système serveur.'],
          ['TPM virtuel et chiffrement de la machine', 'Conséquence du choix précédent, et manipulation concrète du démarrage sécurisé.'],
          ['Client en un processeur, deux cœurs', 'Un poste possède un processeur multi-cœurs ; le multi-socket est une architecture serveur.'],
          ['Compte local à l’installation, refus du compte en ligne', 'La machine doit être authentifiée par le domaine, non par un service tiers.'],
          ['Unités d’organisation par service', 'Permet d’appliquer des stratégies distinctes selon le département.'],
        ]}
      />

      <H2>11. Ce qu&rsquo;il faut retenir</H2>
      <Table
        head={['Constat', 'Conséquence pour un analyste']}
        rows={[
          ['Le contrôleur de domaine détient toutes les identités', 'C’est la cible prioritaire : toutes les attaques Windows y convergent.'],
          ['Sans DNS, le domaine est introuvable', '« Le DNS ne répond plus » et « le domaine est en panne » sont le même incident.'],
          ['Une action produit une séquence d’événements', 'L’analyse porte sur des motifs, pas sur des lignes isolées.'],
          ['Un compte terminé par $ désigne une machine', 'Sa création non expliquée signale une machine non maîtrisée sur le réseau.'],
          ['Les journaux ont une taille maximale', 'On exporte tôt et intégralement, sinon l’investigation devient impossible.'],
        ]}
      />
      <p className="mt-6">
        <span className="text-accent font-semibold">Documentation complète, captures et schéma d&rsquo;architecture :</span>{' '}
        <span className="text-zinc-100">github.com/J-Hadley-C/AD-Lab-Project</span>
      </p>
    </article>
  )
}
