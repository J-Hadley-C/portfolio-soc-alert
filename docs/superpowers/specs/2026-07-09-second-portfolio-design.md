# Second portfolio — thème "alerte/danger" — Design

Date : 2026-07-09

## Contexte

Deuxième portfolio, projet séparé de `portfolio-soc` (le premier, thème cyan/violet). Inspiration structurelle : https://chrupek.fr/ (analysé via son vrai code source HTML/CSS). Contenu : KHEN (CHERY Jean-Hadley), même personne, même parcours réel que le premier portfolio — pas de nouvelle information inventée.

## 1. Base technique

- React 18 + Vite + TailwindCSS v3 + Framer Motion (même stack que le premier portfolio)
- Icônes : Bootstrap Icons via CDN (`bootstrap-icons.min.css`), comme le site de référence — pas de dépendance npm supplémentaire
- Déjà scaffoldé dans `C:\Users\ESHU\portfolio-soc-alert\`, dépôt git local initialisé, dépendances installées

## 2. Couleurs (`tailwind.config.js`, déjà en place)

- `bg` `#0a0505`, `surface` `#140a0a`, `elevated` `#1f1010`, `divider` `#2e1616` — fond très sombre à tonalité rouge
- `accent` (rouge) : DEFAULT `#ff2b2b`, dim `#3a0a0a`, muted `#b91c1c` — couleur principale décorative (boutons, liens, bordures, halos)
- `accent-orange` : DEFAULT `#ff8c00`, dim `#3a1f00`, muted `#c96a00` — second niveau d'alerte
- `critical` `#f85149`, `high` `#e3b341`, `medium` `#3fb950`, `info` `#58a6ff` — couleurs de gravité MITRE, **fonctionnelles**, reprises telles quelles du premier portfolio pour les 5 cas du lab

## 3. Typographie (déjà en place)

- `font-display` : Oswald (titres, condensé, impact — ton "alerte")
- `font-sans` : Inter (corps de texte, lisible)
- `font-mono` : JetBrains Mono (commandes dans les cartes projets, comme le premier portfolio)

## 4. Images

- Photo de profil : `public/profil.png` — montage généré par IA à partir d'une vraie photo de KHEN (mi-visage humain, mi-visage robot avec circuits lumineux dorés/bleus). C'est la seule image du dossier `Img_cybersec` dont les droits sont clairs (créée par KHEN lui-même) — **aucune des autres images stock trouvées dans ce dossier n'est utilisée** (Getty Images, Freepik, Pngtree, images d'articles de blogs tiers = droits d'auteur non réglés, décision prise avec KHEN pour éviter tout risque).
- La même image `profil.png` est réutilisée en fond de bannière d'accueil (recadrée large, assombrie, avec un effet de zoom lent) — pas de vidéo (aucun outil de génération vidéo disponible).

## 5. Structure des sections (`App.jsx`)

`Navbar` (fixe) → `Hero` → `Profil` → `Competences` → `Projets` → `Contact` → `Footer`

## 6. Bannière d'accueil (`Hero.jsx`)

- Fond : `public/profil.png` en `background-image`, assombri (voile noir `bg-black/75` par-dessus), animation `animate-slow-zoom` (déjà définie dans `tailwind.config.js`, `scale(1)` → `scale(1.12)` sur 20s, alternée en boucle)
- Grille technique en surimpression : classe `.hero-grid` (déjà en place dans `index.css`, lignes rouges très sourdines)
- Titre : nom + rôle animé (effet machine à écrire, même logique que le premier portfolio, liste de rôles à adapter : "SOC Analyst Junior", "Threat Detection", "Incident Response")
- Boutons : "Voir mes projets" (`#projets`), "Me contacter" (`#contact`)

## 7. Section Profil (`Profil.jsx`)

Remplace le duo "About + Parcours" du premier portfolio en une seule section, structure inspirée du site de référence (photo + bio à gauche/droite, puis frise en dessous) :

- Photo `public/profil.png` (recadrée, bordure rouge)
- Bio texte : reprise du contenu réel déjà écrit dans `portfolio-soc/src/components/About.jsx` (développeur reconverti SOC, lab construit, recherche de poste) — pas de nouveau texte inventé, adapté au ton du site
- Frise de parcours (4 étapes, contenu identique aux `KEY_POINTS` du premier portfolio) : Formation initiale → Reconversion → Lab monté → Statut, avec connecteurs en flèche, dégradé rouge → orange le long de la frise (au lieu du dégradé violet → cyan du premier site)
- Bouton "Télécharger mon CV" (même PDF déjà copié dans `public/`)

## 8. Section Compétences (`Competences.jsx`)

Format "service-box" du site de référence : cartes avec icône ronde (Bootstrap Icons) + titre + description, **pas** les 12 badges individuels du premier portfolio. 5 catégories, regroupant les 12 outils réels déjà documentés dans `portfolio-soc/src/components/Stack.jsx` — aucun outil inventé, juste regroupé différemment :

1. **Détection & SIEM** (`bi-shield-fill-check`) — Wazuh 4.12, MITRE ATT&CK
2. **Système & Infrastructure** (`bi-hdd-rack`) — Windows Server 2022 / Active Directory, VirtualBox, Docker/WSL2
3. **Outils offensifs** (`bi-bug-fill`) — Kali Linux, Metasploit/msfvenom, Impacket
4. **Réseau & Analyse** (`bi-diagram-3`) — Nmap, Wireshark/tshark
5. **Scripting** (`bi-terminal-fill`) — PowerShell, Bash

## 9. Section Projets (`Projets.jsx`)

**Écart assumé par rapport au site de référence** : chrupek.fr affiche une image de couverture par projet. KHEN n'a pas de captures d'écran réelles de ses 5 cas de lab prêtes à l'emploi pour ce nouveau format — plutôt que d'inventer/générer de fausses images de projet, on garde le même principe que le premier portfolio : **cartes accordéon** avec les vraies données déjà écrites (titre, gravité MITRE, règles Wazuh, commandes, détection, leçon), recolorées rouge/orange. Mêmes 5 cas, même contenu factuel, repris de `portfolio-soc/src/components/Projects.jsx`.

## 10. Section Contact (`Contact.jsx`)

Même principe que le premier portfolio : formulaire (Formspree, nouvel ID à créer — placeholder `YOUR_FORM_ID` en attendant), liens CV / Email / LinkedIn / GitHub. Couleur decorative rouge au lieu de cyan.

## 11. Footer

Simple, identique en structure au premier portfolio (copyright + liens), recoloré.

## 12. Animations

Framer Motion partout (pas de nouvelle dépendance), même motif `fadeUp`/`whileInView` que le premier portfolio.

## Hors périmètre

- Déploiement (GitHub/Vercel) — tâche séparée, à faire quand KHEN aura choisi lequel des deux portfolios (ou les deux) mettre en ligne.
- Les images stock non libres de droits ne sont utilisées nulle part sur le site.
