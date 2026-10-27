# Le Royaume de mon cœur

Une expérience web romantique interactive — théâtre, royaume nocturne, déclaration
d'amour, galerie de souvenirs, promesse finale et lettre qui s'écrit devant elle.

Aucun emoji : tous les visuels (personnages, roses, étoiles, ornements, pétales,
particules) sont des illustrations **SVG originales** animées en CSS / Framer Motion.

---

## 1. Lancer l'application

Prérequis : [Node.js](https://nodejs.org) version 18 ou plus récente.

```bash
npm install        # installe les dépendances (une seule fois)
npm run dev        # démarre l'aperçu local → http://localhost:5173
```

Ouvrez l'adresse affichée dans votre navigateur (souvent `http://localhost:5173`).

Construire la version de production :

```bash
npm run build      # génère le dossier dist/
npm run preview    # teste localement la version construite
```

---

## 2. Ajouter vos médias (photos, vidéos, musique)

Tous les fichiers médias se déposent dans le dossier `public/media/`.
**Après avoir ajouté un fichier, redémarrez `npm run dev` si nécessaire.**

### Photos → `public/media/photos/`

1. Copiez vos images, par exemple :
   - `photo-01.jpg`, `photo-02.jpg`, `photo-03.jpg` …
   - Formats conseillés : `.jpg` ou `.webp` (compression qualité 80 environ).
   - Idéalement au moins 1200 px de large, orientation paysage ou portrait indifférente.
2. Déclarez chaque photo dans **`src/data/gallery.json`** :

```json
{
  "id": "souvenir-01",
  "src": "/media/photos/photo-01.jpg",
  "caption": "Notre premier fou rire…",
  "date": "12 juin 2024",
  "alt": "Nous deux au bord de la mer",
  "order": 1,
  "category": "voyages"
}
```

- `caption` et `date` sont facultatifs (laissez `""` si vide — un texte neutre s'affiche).
- `alt` : décrivez brièvement la photo (accessibilité).
- `order` : ordre d'affichage (petit numéro = première position).
- Ajoutez autant d'entrées que vous voulez : la galerie s'adapte toute seule.

### Vidéos → `public/media/videos/`

- `intro.mp4` : vidéo d'accueil diffusée derrière le rideau (désactivable via
  `site-config.json` → `media.showVideoOnCurtainScene`).
- Autres vidéos : déclarez-les dans **`src/data/videos.json`** comme les photos
  (`id`, `src`, `poster`, `caption`, `order`).
- Format conseillé : MP4 (H.264), quelques dizaines de secondes maximum.

### Image de couverture → `public/media/backgrounds/`

- `intro-poster.jpg` : affichée si la vidéo est absente ou échoue à charger.
- Vous pouvez aussi y déposer des fonds d'écran supplémentaires et les référencer
  ajoutez d autres images et référencez-les dans les fichiers JSON de scènes si besoin.

### Musique → `public/media/audio/`

- `romantic.mp3` : musique de fond (bouton lecture/pause + volume dans l'interface).
- ⚠️ Utilisez une musique **libre de droits** (ex. sources Pixabay Music, Free Music
  Archive licence CC, ou une composition personnelle). Ne pas utiliser une chanson
  commerciale protégée.
- La musique ne démarre **jamais** avec du son automatiquement (règle des navigateurs) ;
  le visiteur l'active lui-même.

**Si un média est absent, aucun écran cassé ne s'affiche** : un placeholder doré
élégant prend la place, avec un rappel discret en mode développement uniquement.

---

## 3. Modifier les textes

Les textes sont séparés du code. Modifiez simplement ces fichiers JSON puis
rechargez la page :

| Fichier | Contenu |
|---|---|
| `src/data/site-config.json` | Noms, titre du royaume, chapitres, chemins des médias, réglages (vitesses, durées, options on/off, couleurs) |
| `src/data/love-letter.json` | La grande déclaration d'amour (ouverture, paragraphes, conclusion, signature) |
| `src/data/gallery.json` | Les photos de la galerie |
| `src/data/videos.json` | Les vidéos |
| `src/data/memories.json` | Textes des scènes Souvenirs / Regrets / Futur |
| `src/data/promises.json` | Promesse finale, question, réponses possibles, épilogue secret |

Exemple de personnalisation principale dans `site-config.json` :

```json
{
  "title": "Le Royaume de mon cœur",
  "partnerName": "Prénom de votre amie",
  "authorName": "Francky",
  "media": {
    "introVideo": "/media/videos/intro.mp4",
    "introPoster": "/media/backgrounds/intro-poster.jpg",
    "backgroundMusic": "/media/audio/romantic.mp3"
  }
}
```

Astuce : après chaque modification d'un JSON, sauvegardez le fichier — Vite met à
jour l'aperçu automatiquement.

## 4. Changer les couleurs

Les couleurs de la palette sont définies dans `src/styles/global.css`, en variables CSS :

```css
--ink: #080808;         /* noir profond          */
--velvet: #11100f;      /* noir velours          */
--gold: #d4af69;        /* or champagne          */
--gold-bright: #f4d58d; /* or lumineux           */
--ivory: #f5f0e6;       /* ivoire doux           */
```

Modifiez ces valeurs et toute l'application suit (certains SVG les utilisent aussi).

## 5. Réglages & fonctionnalités optionnelles

Dans `site-config.json` → `settings` :

- `animationSpeed` : multiplicateur global des animations (`1` normal, `0.8` plus lent…).
- `transitionDurationMs` : durée des transitions entre chapitres (millisecondes).
- `site-config.json` → `settings.enableSecretStar` : active l'étoile cliquable qui ouvre l'**épilogue secret**.
- `site-config.json` → `chapters` (dernière entrée `epilogue`) : retirez ou masquez la scène secrète pour désactiver l'épilogue.
- `enableFullscreenButton`, `enableParticles`, `enableSoundEffects`, `enablePhotoRibbon`, `saveProgressLocally` : activent/désactivent chaque fonctionnalité optionnelle.
- `showVideoOnCurtainScene` : vidéo d'accueil derrière le rideau.

L'expérience respecte `prefers-reduced-motion` : les animations deviennent de simples
fondus si le système de votre amie demande des mouvements réduits.

## 6. Progression et reprise

- La progression est sauvegardée dans le navigateur (localStorage) : un rechargement
  reprend au chapitre où elle était.
- Le menu (en haut à droite) permet de revoir les chapitres **déjà visités**, de
  relancer l'expérience depuis le début (« Recommencer ») et de passer en plein écran.
- La navigation clavier fonctionne : Tab pour atteindre les boutons, Entrée/Espace
  pour activer, ←/→ dans le carrousel de la galerie.

## 7. Déployer le site (gratuit)

Le site est 100 % statique — aucune base de données, aucun compte, aucune clé secrète.

**Netlify :** glissez-déposez le dossier `dist/` (après `npm run build`) sur
<https://app.netlify.com/drop>, ou connectez le dépôt Git avec
commande de build `npm run build` et dossier `dist`.

**Vercel :** `npm i -g vercel && vercel --prod` dans le dossier du projet.

**GitHub Pages :** poussez le contenu de `dist/` sur la branche `gh-pages`
(ou utilisez l'action GitHub Pages) — la config Vite utilise déjà `base: './'`,
compatible avec les sous-dossiers.

⚠️ Pensez à vérifier la confidentialité de l'URL : si vous déployez publiquement,
protégez la page (mot de passe Netlify/Vercel) ou gardez le lien secret.

## 8. Structure du projet

```
public/media/{photos,videos,backgrounds,audio,illustrations}/   vos fichiers médias
src/components/     contrôles multimédias (vidéo, musique)
src/scenes/         les 9+ scènes narratives
src/animations/     Illustrations.tsx (SVG), rideau, machine à états
src/data/           tous les textes et réglages (JSON)
src/styles/         palette, typographies, animations
```

## 9. Dépannage rapide

- Une photo ne s'affiche pas → vérifiez que le nom du fichier dans `gallery.json`
  correspond exactement (majuscules incluses) au fichier dans `public/media/photos/`.
- La musique ne démarre pas → cliquez sur le bouton musique ; les navigateurs
  bloquent tout son automatique.
- Écran noir au chargement → attendez la révélation du royaume, puis cliquez
  « Ouvrir le rideau ».
- `npm run build` échoue après une modification de JSON → le fichier JSON a une
  virgule ou une parenthèse en trop ; comparez avec les exemples ci-dessus.

---

Fait avec le cœur — pour une seule personne.
