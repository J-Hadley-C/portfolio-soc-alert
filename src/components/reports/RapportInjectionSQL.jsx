import { ReportHeader, H2, H3, Cmd, Table } from './ReportUI'

export default function RapportInjectionSQL() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <ReportHeader
        title="Injection SQL : attaque, détection et correction"
        subtitle="Chaîne complète — SQLMap → Wazuh → requête préparée · Exercices 2B & 3, Chapitre 4 (Attaques Web)"
        meta="CHERY Jean-Hadley — Lab SOC personnel · 22 juillet 2026 · MITRE ATT&CK T1190 (Exploit Public-Facing Application)"
      />

      <H2>1. Objectif</H2>
      <p>
        Reproduire une attaque par injection SQL sur une application PHP vulnérable, la détecter comme un
        analyste SOC dans le SIEM Wazuh, puis la corriger avec une requête préparée. Trois volets :
        <span className="text-zinc-100"> attaquer, détecter, corriger.</span>
      </p>

      <H2>2. Environnement</H2>
      <Table
        head={['Rôle', 'Machine / Emplacement', 'Détail']}
        rows={[
          ['Attaquant', 'VM Kali (VirtualBox)', '[KALI]'],
          ['Cible (serveur web)', 'Hôte Windows 11 — XAMPP/Apache', 'http://[HOTE]/lab-sqli/login.php'],
          ['Agent SIEM', 'Agent Wazuh 001 « Ushu » (l’hôte)', 'lit C:\\xampp\\apache\\logs\\access.log'],
          ['SIEM', 'Wazuh 4.12 (Docker dans WSL2 Ubuntu)', 'Tableau de bord : https://localhost'],
          ['Base de données', 'MySQL « tuto » (table users)', '3 comptes de test'],
        ]}
      />

      <H2>3. C&rsquo;est quoi une injection SQL ?</H2>
      <p>
        Une application pose des questions à sa base : <em>« donne-moi la personne dont l&rsquo;email est X »</em>.
        Le problème vient d&rsquo;un code qui <span className="text-zinc-100 font-medium">colle directement</span> ce
        que tape le visiteur dans la question. Si le visiteur met un bout de commande au lieu d&rsquo;un email, ce
        bout se mélange à la question et en change le sens : la base ne fait plus la différence entre la
        <span className="text-zinc-100"> question</span> (écrite par le code) et la
        <span className="text-zinc-100"> valeur</span> (tapée par le visiteur). La donnée devient une commande.
      </p>

      <H2>4. L&rsquo;attaque avec SQLMap</H2>
      <p>Vérifier d&rsquo;abord que la cible répond, puis extraire la table users :</p>
      <Cmd term="Kali">{`curl -s -o /dev/null -w "%{http_code}\\n" "http://[HOTE]/lab-sqli/login.php"
sqlmap -u "http://[HOTE]/lab-sqli/login.php?email=test&mdp=test" -p email --batch --dump -D tuto -T users`}</Cmd>
      <p>
        Résultat : SQLMap indique le paramètre <code className="font-mono text-accent text-sm">email</code> injectable,
        identifie MySQL, puis affiche la table users avec les 3 comptes et leurs
        <span className="text-zinc-100 font-semibold"> mots de passe en clair</span> — la base entière est siphonnée
        via une seule faille.
      </p>

      <H2>5. La démonstration manuelle</H2>
      <p>Dans le champ Email de la page vulnérable, on tape simplement :</p>
      <Cmd>{`' OR '1'='1' -- `}</Cmd>
      <p>Le code construit alors littéralement cette requête :</p>
      <Cmd>{`SELECT id, nom, prenom, email FROM users
WHERE email = '' OR '1'='1' -- ' AND mdp = ''`}</Cmd>
      <p>
        Le <code className="font-mono text-accent text-sm">-- </code> est un commentaire : tout ce qui suit est
        ignoré (le mot de passe ne compte plus). Il reste
        <code className="font-mono text-accent text-sm"> email = '' OR '1'='1'</code>, toujours vrai → connexion
        <span className="text-zinc-100 font-semibold"> sans mot de passe valide</span>.
      </p>

      <H2>6. Détection dans Wazuh</H2>
      <p>
        Chaque requête de l&rsquo;attaque est écrite dans l&rsquo;<code className="font-mono text-accent text-sm">access.log</code> d&rsquo;Apache,
        lu par l&rsquo;agent 001, décodé par le manager (décodeur <code className="font-mono text-accent text-sm">web-accesslog</code>),
        qui en extrait l&rsquo;IP source et l&rsquo;URL. Une passe complète de SQLMap a généré
        <span className="text-zinc-100 font-semibold"> 81 alertes</span> depuis l&rsquo;IP de Kali.
      </p>
      <Table
        head={['Règle', 'Niveau', 'Description']}
        rows={[
          ['31171', '6', 'SQL injection attempt.'],
          ['31106', '6', 'A web attack returned code 200 (success).'],
        ]}
      />
      <p className="mt-2">
        <span className="text-accent font-semibold">Piège d&rsquo;analyste :</span> on attend souvent la règle
        « 31103 », mais Wazuh ne journalise que la règle <span className="text-zinc-100">finale</span> de la chaîne —
        ce sont donc 31171 et 31106 qui apparaissent. Filtre du tableau de bord :
        <code className="font-mono text-accent text-sm"> rule.id:31106 or rule.id:31171</code>.
      </p>

      <H2>7. La correction : requête préparée (PDO)</H2>
      <p><span className="text-zinc-100 font-medium">Avant</span> (vulnérable) — la saisie est collée dans la question :</p>
      <Cmd>{`$sql = "SELECT id, nom, prenom, email FROM users
        WHERE email = '$email' AND mdp = '$mdp'";
$bdd->query($sql);`}</Cmd>
      <p><span className="text-zinc-100 font-medium">Après</span> (sûr) — la question et les valeurs sont envoyées séparément :</p>
      <Cmd>{`$stmt = $bdd->prepare(
    "SELECT id, nom, prenom, email FROM users WHERE email = ? AND mdp = ?"
);
$stmt->execute([$email, $mdp]);`}</Cmd>
      <p>
        La structure de la requête est figée <span className="text-zinc-100">avant</span> de recevoir les valeurs.
        Ce que tape le visiteur est traité comme un simple texte, jamais comme une commande. Rejouée contre la
        version protégée, l&rsquo;attaque <span className="text-zinc-100 font-semibold">échoue</span> : la base cherche
        un email valant littéralement <code className="font-mono text-accent text-sm">' OR '1'='1' -- </code>,
        n&rsquo;en trouve aucun, et ne renvoie rien.
      </p>

      <H2>8. Les 3 questions de l&rsquo;exercice</H2>
      <H3>Pourquoi la première requête est-elle dangereuse ?</H3>
      <p>
        Parce qu&rsquo;elle colle directement la saisie du visiteur dans la question, sans la contrôler. Un bout de
        commande à la place de l&rsquo;email se mélange à la requête et en change le sens.
      </p>
      <H3>Que pourrait faire un attaquant ?</H3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Se connecter sans mot de passe (contourner l&rsquo;authentification).</li>
        <li>Extraire toute la base (emails, mots de passe, données personnelles).</li>
        <li>Lire, modifier ou supprimer des données.</li>
        <li>Dans les cas graves, prendre la main sur le serveur.</li>
      </ul>
      <H3>Comment la requête préparée protège-t-elle la base ?</H3>
      <p>
        Elle envoie la phrase et la valeur séparément ; la base sait que la valeur est uniquement une donnée à
        chercher, jamais un ordre. L&rsquo;injection est neutralisée à la racine.
      </p>

      <H2>9. Leçons d&rsquo;analyste</H2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <span className="text-zinc-100 font-medium">Une seule ligne mal codée</span> (concaténation) suffit à
          exposer toute une base.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Une attaque automatisée est bruyante :</span> 81 requêtes
          anormales tracées dans les logs, exploitables par le SIEM.
        </li>
        <li>
          <span className="text-zinc-100 font-medium">La bonne règle n&rsquo;est pas toujours celle attendue :</span>
          comprendre le chaînage des règles Wazuh (règle finale journalisée).
        </li>
        <li>
          <span className="text-zinc-100 font-medium">Détecter → corriger → re-tester :</span> la requête préparée
          ferme la faille, prouvée par un rejeu de l&rsquo;attaque. Bonus défensif : stocker les mots de passe hachés.
        </li>
      </ul>
    </article>
  )
}
