import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportLogsLinuxSplunk() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Analyse de logs Linux et investigation d'incidents"
        subtitle="Démarche complète : lecture manuelle → script Python → SIEM Splunk"
        meta="CHERY Jean-Hadley — 20 octobre 2026 · 2 000 lignes de journaux, 42,7 jours · jeu de données public LogHub"
      />

      <H2>1. Objectif et cadre</H2>
      <p>
        Caractériser l&rsquo;activité suspecte dans les journaux d&rsquo;authentification d&rsquo;un serveur Linux
        exposé sur Internet, <span className="text-zinc-100">déterminer si une intrusion a réussi</span>, et
        produire des recommandations applicables par l&rsquo;exploitant.
      </p>
      <p>
        Les journaux proviennent de <span className="text-zinc-100">LogHub</span>, bibliothèque publique de jeux de
        données utilisée dans la recherche en cybersécurité : des journaux réels et anonymisés. Aucun système
        n&rsquo;a été attaqué pour produire ce rapport. Ce qui est transposable, c&rsquo;est la méthode.
      </p>

      <H2>2. La démarche : trois temps, dans cet ordre</H2>
      <p>
        J&rsquo;ai traité le même fichier trois fois, avec trois moyens différents. L&rsquo;ordre compte :{' '}
        <span className="text-zinc-100">on ne peut pas écrire une règle de détection avant d&rsquo;avoir vu à quoi
        ressemble ce qu&rsquo;on veut détecter.</span>
      </p>
      <Table
        head={['Temps', 'Moyen', 'Ce qu’il apporte', 'Sa limite']}
        rows={[
          ['1', 'Lecture directe, puis Excel et Power Query', 'Voir la donnée réelle, découvrir les motifs, juger la sévérité', 'Ne passe pas l’échelle'],
          ['2', 'Script Python', 'Reproductible, instantané, exportable', 'Ne trouve que ce qu’on lui a demandé'],
          ['3', 'SIEM Splunk', 'Agrégation, classement, visualisation sur la totalité', 'N’évalue pas la qualité de ce qu’on lui donne'],
        ]}
      />
      <H3>Ce que chaque temps a trouvé seul</H3>
      <p>
        C&rsquo;est le résultat le plus intéressant du projet, et il n&rsquo;était pas prévu. Chacun des trois
        moyens a produit un constat que les deux autres étaient{' '}
        <span className="text-zinc-100">structurellement incapables</span> de produire.
      </p>
      <Table
        head={['Temps', 'Ce qu’il a trouvé, et que les autres ont manqué']}
        rows={[
          ['Lecture directe', 'L’échec quotidien de logrotate, 43 fois. Cette ligne ne contient aucun mot-clé d’authentification : ni le script ni la requête SPL ne pouvaient la voir.'],
          ['Script Python', 'L’absence totale de « Failed password » dans le fichier — donc l’inadéquation des règles de détection usuelles à cette source.'],
          ['SIEM Splunk', 'La vue d’ensemble : 47 sources classées, et la réduction de 608 évènements à seulement deux comportements.'],
        ]}
      />

      <H2>3. Le temps manuel</H2>
      <p>
        Lecture des 150 premières lignes, une par une, sans filtre ni comptage automatique. Quatre constats en sont
        sortis, dont un qu&rsquo;aucun outil n&rsquo;aurait trouvé.
      </p>
      <H3>Une rafale sur le compte root</H3>
      <p>
        Dix tentatives en échec sur <span className="text-zinc-100">root</span>, toutes depuis la même source,{' '}
        <span className="text-zinc-100">toutes portant le même horodatage à la seconde</span>.
      </p>
      <Cmd>{`Jun 15 02:04:59 combo sshd(pam_unix)[20882]: authentication failure; ... rhost=220-135-151-1.hinet-ip.hinet.net  user=root
Jun 15 02:04:59 combo sshd(pam_unix)[20884]: authentication failure; ... rhost=220-135-151-1.hinet-ip.hinet.net  user=root
Jun 15 02:04:59 combo sshd(pam_unix)[20883]: authentication failure; ... rhost=220-135-151-1.hinet-ip.hinet.net  user=root
          [ ... sept lignes identiques, même seconde, mêmes paramètres ... ]`}</Cmd>
      <p>
        Dix mots de passe dans la même seconde ne sont pas le fait d&rsquo;un opérateur. Le journal n&rsquo;écrit pas
        une adresse mais un nom de machine : c&rsquo;est pourtant la même, le fournisseur a composé le nom à partir
        de l&rsquo;adresse en remplaçant les points par des tirets. Ne pas voir cette correspondance conduit à{' '}
        <span className="text-zinc-100">compter deux fois la même source</span>.
      </p>
      <H3>Une anomalie sans lien avec l&rsquo;attaque</H3>
      <Cmd>{`Jun 15 04:06:20 combo logrotate: ALERT exited abnormally with [1]`}</Cmd>
      <p>
        <span className="text-zinc-100">43 occurrences, une par jour vers 4 heures du matin</span>, toujours le même
        message et sans aucun détail. logrotate archive et renouvelle les fichiers de journaux : s&rsquo;il échoue
        tous les jours, leur conservation n&rsquo;est plus garantie.{' '}
        <span className="text-zinc-100">Une défaillance de journalisation est une défaillance de détection.</span>
      </p>
      <H3>Le coût du travail manuel, mesuré</H3>
      <p>
        Saisie chronométrée : <span className="text-zinc-100">cinq minutes pour dix lignes</span>.
      </p>
      <Table
        head={['Volume', 'Temps de saisie manuelle']}
        rows={[
          ['Les 301 lignes de l’extrait traité par le script', '2 h 30'],
          ['Les 2 000 lignes du fichier', '16 h 40'],
          ['Les 200 000 lignes du fichier complet de LogHub', 'plus de 1 600 heures'],
        ]}
      />
      <H3>Trois pièges d&rsquo;outil, tous silencieux</H3>
      <p>
        La structuration dans Excel via Power Query a appris plus que le résultat lui-même. Les trois pièges ont la
        même forme : <span className="text-zinc-100">l&rsquo;outil produit une donnée plausible et fausse, sans rien
        signaler.</span>
      </p>
      <Table
        head={['Piège', 'Ce qu’il produit', 'Pourquoi c’est grave ici']}
        rows={[
          ['Excel transforme une date en une autre', '« Jun 14 » devient « juin 2014 »', 'Le jour du mois disparaît, remplacé par une année inventée'],
          ['Power Query type la colonne des heures', '15:16:01 devient 15:16', 'Le critère de force brute se mesure en secondes — 5 échecs en 60 s. Réduit à la minute, il devient inapplicable'],
          ['Le tableau croisé compare des chaînes, pas des adresses', 'La même source écrite avec un point puis un tiret → 8 + 1 au lieu de 9', 'Une source répétée, découpée en deux entrées, passe sous le seuil d’alerte'],
        ]}
      />
      <p>
        Le troisième est le plus instructif, parce qu&rsquo;il travaille contre la détection. C&rsquo;est{' '}
        <span className="text-zinc-100">la raison d&rsquo;être de la normalisation des champs dans un SIEM</span> :
        unifier les écritures d&rsquo;une même entité avant de compter quoi que ce soit.
      </p>
      <H3>La sévérité : un jugement, pas un calcul</H3>
      <p>
        La grille de référence ne tranche pas le cas rencontré plusieurs fois : l&rsquo;échec{' '}
        <em>isolé</em> sur root. J&rsquo;ai donc posé ma règle —{' '}
        <span className="text-zinc-100">le compte visé prime sur le volume</span>, le volume restant un facteur
        aggravant au-delà de cinq occurrences. Le raisonnement : une tentative de connexion en root depuis Internet
        n&rsquo;a aucune raison légitime d&rsquo;exister, puisque sur un serveur correctement configuré cet accès est
        désactivé. Une seule tentative est donc déjà un signal.
      </p>
      <p>
        Cette règle vaut pour les quinze lignes analysées à la main, et elles seules :{' '}
        <span className="text-zinc-100">quinze lignes ne hiérarchisent rien</span>. La suite l&rsquo;a démontré.
      </p>

      <H2>4. Le temps du script</H2>
      <p>
        Script Python de détection par mots-clés, avec export CSV. Résultat sur l&rsquo;extrait de 301 lignes :
      </p>
      <Table
        head={['Catégorie', 'Nombre']}
        rows={[
          ['Échecs de connexion (Failed password)', '0'],
          ['Échecs d’authentification', '114'],
          ['Utilisateurs inconnus', '26'],
          ['Total retenu', '140'],
        ]}
      />
      <H3>Trois constats, aucun attendu</H3>
      <Table
        head={['Constat', 'Conséquence opérationnelle']}
        rows={[
          ['« Failed password » n’apparaît pas une seule fois dans les 2 000 lignes', 'Ce journal enregistre la couche PAM, pas le démon sshd. Une règle de détection écrite autour de ce mot-clé n’aurait rien vu de cette attaque.'],
          ['140 lignes ne font pas 140 évènements', 'Les 26 lignes « user unknown » portent toutes le même numéro de processus qu’une ligne « authentication failure » : ce sont deux moitiés d’une même tentative. Le volume réel est de 114.'],
          ['161 des 301 lignes ne sont pas classées', 'Plus de la moitié, ignorée en silence. Ce qu’une règle ne classe pas, elle ne le signale pas.'],
        ]}
      />
      <H3>Une seconde version, et ce que la première ne voyait pas</H3>
      <p>
        Le script d&rsquo;origine portait deux défauts : son périmètre ne couvrait que 301 lignes sur 2 000, et sa
        comparaison distinguait les majuscules. J&rsquo;ai écrit une version corrigée et{' '}
        <span className="text-zinc-100">mesuré l&rsquo;écart plutôt que de l&rsquo;effacer</span>.
      </p>
      <Table
        head={['', 'Version 1', 'Version 2']}
        rows={[
          ['Périmètre lu', '301 lignes (15 %)', '2 000 lignes (100 %)'],
          ['Total retenu', '140', '608'],
          ['Adresses sources identifiées', '12', '47'],
        ]}
      />
      <p>
        <span className="text-zinc-100">Le constat décisif est ailleurs que dans ces totaux.</span> L&rsquo;adresse
        la plus active du fichier — 150.183.249.110, 80 tentatives — est{' '}
        <span className="text-zinc-100">absente du périmètre de la version 1</span>. Le script d&rsquo;origine
        fonctionnait parfaitement, et ne voyait pas l&rsquo;attaquant principal.
      </p>
      <p>
        L&rsquo;effet propre de la casse, à périmètre égal, est d&rsquo;une seule ligne : 607 contre 608. Un détail
        ici, un <span className="text-zinc-100">faux négatif silencieux</span> en production — une simple variation
        d&rsquo;écriture suffirait à passer sous le radar.
      </p>
      <p>
        Et une vérification qui compte plus que le gain de temps :{' '}
        <span className="text-zinc-100">les 608 lignes de la version 2 correspondent exactement aux 608 évènements
        trouvés ensuite par Splunk</span>. Deux outils indépendants, deux langages, le même chiffre.
      </p>

      <H2>5. Le temps du SIEM</H2>
      <H3>Ingestion, et une décision à justifier</H3>
      <p>
        Chargement dans Splunk Enterprise 10.6 — installé et administré par mes soins — index main, type de source
        dédié. La procédure prévoyait de renseigner le champ <span className="text-zinc-100">host</span> avec le nom
        du poste qui importe ; je l&rsquo;ai renseigné avec{' '}
        <span className="text-zinc-100">le nom du serveur qui a réellement produit les journaux</span>.
      </p>
      <p>
        Le champ host doit désigner la machine émettrice, pas celle qui importe : une provenance fausse rend la
        donnée inexploitable pour l&rsquo;analyste qui cherchera plus tard les attaques sur ce serveur. État vérifié
        après ingestion : 2 000 évènements.
      </p>
      <H3>Les recherches</H3>
      <Cmd term="Splunk — barre de recherche (SPL)">{`source="Linux2k.log" sourcetype="Linux" ("Failed password" OR "authentication failure" OR "invalid user" OR "user unknown")
  → 608 évènements

source="Linux2k.log" sourcetype="Linux" "authentication failure" | stats count by rhost | sort -count
  → 47 adresses, 150.183.249.110 en tête avec 80 tentatives`}</Cmd>
      <p>
        La seconde requête filtre sur un seul motif alors que la première en interrogeait quatre. Ce n&rsquo;est pas
        une incohérence : <span className="text-zinc-100">la question a changé</span>. On cherche désormais{' '}
        <em>qui</em>, et seul ce motif porte le champ rhost. On ne filtre pas sur ce qui est le plus fréquent, mais
        sur ce qui porte la réponse à la question posée.
      </p>
      <H3>Quatre vues, quatre questions</H3>
      <p>
        Les quatre onglets ne relancent aucune recherche : ce sont quatre angles sur les mêmes 608 évènements.
      </p>
      <Table
        head={['Onglet', 'La question à laquelle il répond']}
        rows={[
          ['Événements', 'Que dit exactement cette ligne ?'],
          ['Patterns', 'Qu’est-ce qui se passe, globalement ?'],
          ['Statistiques', 'Qui, et combien de fois ?'],
          ['Visualisation', 'Comment le montrer à quelqu’un ?'],
        ]}
      />
      <p>
        Patterns et Statistiques sont souvent confondus, à tort :{' '}
        <span className="text-zinc-100">Patterns regroupe sur la forme de la phrase, Statistiques compte sur la
        valeur d&rsquo;un champ.</span>
      </p>
      <p>
        Résultat de la vue Patterns : <span className="text-zinc-100">deux motifs couvrent 99,83 % des
        évènements</span> — 80,59 % et 19,24 %. Une activité humaine produit des erreurs variées ; cette uniformité
        est la signature d&rsquo;un programme. La monotonie du résultat n&rsquo;est pas un défaut de présentation,
        elle est la preuve.
      </p>
      <H3>Deux pièges de lecture rencontrés</H3>
      <Table
        head={['Piège', 'Ce qu’il produit', 'La parade']}
        rows={[
          ['La vue Patterns affiche une adresse en exemple', 'C’est un représentant du groupe, pas une caractéristique de ses 490 membres — cette adresse n’apparaît que 23 fois et n’est pas la plus active', 'Le classement réel ne s’obtient que par la vue Statistiques'],
          ['Un clic sur un en-tête de colonne écrase le « sort -count » de la requête', 'Les chiffres restent justes, mais l’ordre devient celui du clic. J’ai d’abord capturé un tableau trié à l’envers : donnée exacte, démonstration fausse', 'Relancer la recherche plutôt que viser l’en-tête'],
        ]}
      />
      <p>
        Pour la visualisation, j&rsquo;ai écarté le graphique en courbes proposé par l&rsquo;interface.{' '}
        <span className="text-zinc-100">Une courbe relie les points : elle affirme une continuité entre deux valeurs
        voisines.</span> Or l&rsquo;axe horizontal porte des adresses IP, qui n&rsquo;ont ni ordre naturel ni
        distance entre elles — la pente n&rsquo;y signifie rien. L&rsquo;histogramme est la forme juste pour comparer
        des catégories indépendantes.
      </p>

      <H2>6. Findings</H2>
      <Table
        head={['Indicateur', 'Valeur mesurée']}
        rows={[
          ['Échecs d’authentification SSH', '490'],
          ['Adresses sources distinctes', '47'],
          ['Tentatives de l’adresse la plus active', '80'],
          ['Durée de cette rafale', '95 secondes, sans pause supérieure à une minute'],
          ['Pic par minute', '50 tentatives'],
          ['Pic par seconde', '10 tentatives dans la même seconde'],
          ['Compte root visé', '351 tentatives, soit 71,8 %'],
          ['Échecs quotidiens de logrotate', '43, un par jour'],
          ['Failed password · invalid user · Accepted', '0 · 0 · 0'],
        ]}
      />
      <p>
        Deux lectures se superposent, et il faut les distinguer :{' '}
        <span className="text-zinc-100">à l&rsquo;échelle d&rsquo;une adresse l&rsquo;attaque est brève et
        violente</span> — 80 tentatives en 95 secondes —, mais{' '}
        <span className="text-zinc-100">à l&rsquo;échelle du serveur elle ne s&rsquo;arrête jamais</span> : 47
        sources sur six semaines. Ce n&rsquo;est pas un incident ponctuel, c&rsquo;est un état permanent.
      </p>
      <p>
        Et la surface exposée dépasse SSH : ftpd représente 916 lignes du fichier — plus que sshd — avec 909
        connexions depuis 38 sources, et klogind enregistre 23 échecs Kerberos depuis une source unique.{' '}
        <span className="text-zinc-100">45 % du fichier n&rsquo;a pas été analysé.</span>
      </p>

      <H2>7. L&rsquo;attaque a-t-elle abouti ?</H2>
      <p>
        C&rsquo;est la question que doit trancher un analyste, et elle ne se déduit pas du nombre de tentatives.{' '}
        <span className="text-zinc-100">490 échecs prouvent une tentative. Ils ne disent rien d&rsquo;une
        réussite.</span>
      </p>
      <Table
        head={['Vérification', 'Résultat']}
        rows={[
          ['Lignes « Accepted password » ou « Accepted publickey »', '0'],
          ['Connexions réussies citant une des 47 adresses attaquantes', '0'],
          ['Sessions SSH ouvertes dans le fichier', '36, toutes sur un compte nommé test'],
        ]}
      />
      <p>
        Ces 36 sessions ont exigé une vérification, puisque test figurait parmi les comptes attaqués.{' '}
        <span className="text-zinc-100">Elles ne sont pas le fait de l&rsquo;attaquant</span>, et trois éléments
        concordants l&rsquo;établissent :
      </p>
      <Table
        head={['Élément', 'Constat']}
        rows={[
          ['Chronologie', 'Les sessions commencent le 17 juin ; le compte test n’a été attaqué que le 8 juillet. Trois semaines séparent les deux : l’effet précéderait la cause.'],
          ['Comportement', 'Les sessions s’ouvrent et se ferment dans la même seconde, par rafales de dix. Un intrus qui obtient un accès l’exploite et reste ; ce profil est celui d’un script local.'],
          ['Origine', 'Aucune de ces lignes ne porte d’adresse source : rien ne les rattache à une connexion distante.'],
        ]}
      />
      <H3>Conclusion, et sa réserve</H3>
      <p>
        <span className="text-accent font-semibold">
          Campagne de force brute SSH automatisée, distribuée et continue, ciblant prioritairement le compte root.
          Aucune compromission établie sur la période analysée.
        </span>
      </p>
      <p>
        Classification <span className="text-zinc-100">MITRE ATT&amp;CK T1110.001 — Password Guessing</span> :
        l&rsquo;adversaire essaie de nombreux mots de passe contre un compte qu&rsquo;il sait exister, plutôt que peu
        de mots de passe contre de nombreux comptes. Stade : accès initial, tentative non aboutie.
      </p>
      <p>
        Cette conclusion porte sur ce que la preuve montre, et pas au-delà. Le fichier est un échantillon de
        2 000 lignes, et les lignes de session ne portent pas d&rsquo;adresse source.{' '}
        <span className="text-zinc-100">L&rsquo;absence de preuve d&rsquo;intrusion n&rsquo;est pas une preuve
        d&rsquo;absence d&rsquo;intrusion.</span> Un rapport qui affirmerait « le serveur n&rsquo;a pas été
        compromis » dépasserait ce que les données autorisent.
      </p>

      <H2>8. Recommandations</H2>
      <p>Classées par rapport entre l&rsquo;effet obtenu et l&rsquo;effort demandé.</p>
      <Table
        head={['Mesure', 'Justification par la mesure']}
        rows={[
          ['Interdire la connexion SSH directe à root — PermitRootLogin no', '351 des 490 tentatives visent root : cette seule ligne annule 71,8 % de la surface d’attaque observée, et rend chaque action d’administration traçable à une personne'],
          ['Déployer fail2ban', '39 des 47 adresses dépassent 5 échecs en 60 secondes : avec ce seuil, 83 % des sources auraient été bloquées sans intervention humaine'],
          ['Créer une alerte SIEM : 5 échecs en 60 s depuis une même adresse', 'Seuil calibré sur les données réelles, pas repris d’un guide — 39 sources sur 47 le franchissent, et le pic atteint 50 échecs par minute'],
          ['Filtrer au pare-feu, sans en faire la mesure principale', 'Avec 47 sources renouvelées sur six semaines, le blocage manuel adresse par adresse est une course perdue : il traite le symptôme du jour'],
          ['Supprimer ou renommer le compte test', 'Un compte nommé test joignable en SSH figure en tête des dictionnaires d’attaque, et il a été visé le 8 juillet'],
          ['Investiguer l’échec quotidien de logrotate', '43 échecs consécutifs : tant que la rotation ne fonctionne pas, la conservation des journaux n’est pas assurée — et sans journaux, aucune investigation'],
          ['Étendre la surveillance au-delà de SSH', 'ftpd est le service le plus volumineux du fichier et n’est pas surveillé ; klogind enregistre 23 échecs Kerberos depuis une source unique'],
          ['Imposer des mots de passe robustes, supprimer les identifiants d’usine', 'Les 351 tentatives sur root ne réussissent que si le mot de passe est devinable'],
        ]}
      />

      <H2>9. Limites de l&rsquo;analyse</H2>
      <Table
        head={['Limite', 'Portée']}
        rows={[
          ['Échantillon', '2 000 lignes, non la totalité des journaux du serveur'],
          ['Périmètre fonctionnel', 'Seul SSH analysé en profondeur ; ftpd représente 45 % du fichier et reste inexploré'],
          ['Horodatage non fiable', 'Le format syslog ne porte pas l’année. Splunk a comblé ce vide avec l’année courante : 2026 au lieu de 2005, la seule année réelle du fichier. Vingt et un ans d’écart — toute conclusion fondée sur l’année serait fausse par construction.'],
          ['Enrichissement absent', 'Aucune corrélation avec une base de réputation d’adresses. L’analyse du nom de domaine d’une source reste une déduction, pas un constat vérifié.'],
        ]}
      />

      <H2>10. Ce qu&rsquo;il faut retenir</H2>
      <Table
        head={['Constat', 'Conséquence pour un analyste']}
        rows={[
          ['Un mot-clé doit correspondre au vocabulaire réel de la source', 'Une règle écrite autour de « Failed password » n’aurait rien vu : ce journal parle le langage de PAM, pas celui de sshd'],
          ['Un périmètre réduit peut masquer l’essentiel', 'Le script d’origine fonctionnait parfaitement et ne voyait pas l’attaquant principal'],
          ['Un outil qui complète une donnée manquante le fait sans prévenir', 'Excel a perdu les secondes, Splunk a inventé l’année. Dans les deux cas : plausible et faux, sans avertissement'],
          ['Une donnée exacte peut servir une démonstration fausse', 'Un tableau trié à l’envers montre les bons chiffres et désigne la mauvaise source'],
          ['Tentative n’est pas compromission', 'C’est la distinction que l’analyste doit trancher, et elle se démontre — elle ne se déduit pas du volume'],
        ]}
      />
      <p className="mt-6">
        <span className="text-accent font-semibold">Aucun des trois outils n&rsquo;aurait suffi.</span>{' '}
        <span className="text-zinc-100">L&rsquo;automatisation ne remplace pas la lecture — elle la prolonge.</span>
      </p>
      <p className="mt-4 text-xs text-zinc-500">
        Jeu de données public LogHub (github.com/logpai/loghub) : aucun système réel n&rsquo;a été attaqué, aucune
        donnée personnelle n&rsquo;est traitée. Les adresses citées appartiennent à ce jeu de données de recherche.
      </p>
    </article>
  )
}
