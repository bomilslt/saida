/**
 * Automatisation médias — Le Royaume de mon cœur
 *
 * 1. Renomme tous les fichiers de public/media/{photos,videos,backgrounds}
 *    en 1, 2, 3… (extension d'origine conservée, tri par nom alphabétique).
 * 2. Régénère src/data/gallery.json et src/data/videos.json en correspondance,
 *    avec « Toi » comme libellé unique (alt + caption).
 * 3. Met à jour src/data/site-config.json (introVideo, introPoster, partnerName).
 *
 * Utilisation : node scripts/rename-and-sync-media.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mediaDir = path.join(root, 'public', 'media')
const dataDir = path.join(root, 'src', 'data')

const EXT_BY_TYPE = {
  photos: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
  videos: ['.mp4', '.webm', '.mov', '.m4v'],
  backgrounds: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
}

function mediaFiles(sub) {
  const dir = path.join(mediaDir, sub)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => EXT_BY_TYPE[sub].includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
}

/**
 * Renommage en deux passes (tmp-N.ext puis N.ext) pour éviter
 * qu'un fichier cible écrase un fichier source pas encore déplacé.
 */
function renameSequential(sub) {
  const dir = path.join(mediaDir, sub)
  const files = mediaFiles(sub)
  files.forEach((f, i) => {
    const ext = path.extname(f).toLowerCase()
    const tmp = `__tmp-${i + 1}${ext}`
    fs.renameSync(path.join(dir, f), path.join(dir, tmp))
  })
  files.forEach((_, i) => {
    const ext = path.extname(files[i]).toLowerCase()
    fs.renameSync(path.join(dir, `__tmp-${i + 1}${ext}`), path.join(dir, `${i + 1}${ext}`))
  })
  return files.map((f, i) => `${i + 1}${path.extname(f).toLowerCase()}`)
}

const photos = renameSequential('photos')
const videos = renameSequential('videos')
const backgrounds = renameSequential('backgrounds')
console.log(`Renommés : ${photos.length} photos, ${videos.length} vidéos, ${backgrounds.length} fonds.`)

if (photos.length === 0) {
  console.error('Aucune photo trouvée : gallery.json non régénéré.')
} else {
  const gallery = photos.map((src, i) => ({
    id: `souvenir-${String(i + 1).padStart(2, '0')}`,
    src: `/media/photos/${src}`,
    caption: 'Toi',
    date: '',
    alt: 'Toi',
    order: i + 1,
    category: 'nous',
  }))
  fs.writeFileSync(path.join(dataDir, 'gallery.json'), JSON.stringify(gallery, null, 2) + '\n')
}

if (videos.length > 0) {
  const videoItems = videos.map((src, i) => ({
    id: `video-${String(i + 1).padStart(2, '0')}`,
    src: `/media/videos/${src}`,
    poster: '',
    caption: 'Toi',
    alt: 'Toi',
    order: i + 1,
  }))
  fs.writeFileSync(path.join(dataDir, 'videos.json'), JSON.stringify(videoItems, null, 2) + '\n')
}

const configPath = path.join(dataDir, 'site-config.json')
const siteConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
if (videos.length > 0) siteConfig.media.introVideo = `/media/videos/${videos[0]}`
if (backgrounds.length > 0) siteConfig.media.introPoster = `/media/backgrounds/${backgrounds[0]}`
siteConfig.partnerName = 'Toi'
fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2) + '\n')

console.log('gallery.json, videos.json et site-config.json mis à jour.')
