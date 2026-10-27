import { useCallback, useEffect, useRef, useState } from 'react'
import siteConfig from '../data/site-config.json'

/**
 * Contrôles multimédias : musique de fond (avec gestion des erreurs),
 * effets sonores légers générés en Web Audio (aucun fichier requis).
 */

export type MusicState = {
  available: boolean
  playing: boolean
  volume: number
}

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [available, setAvailable] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState<number>(siteConfig.settings.musicVolume)

  useEffect(() => {
    const audio = new Audio(siteConfig.media.backgroundMusic)
    audio.loop = true
    audio.preload = 'none' // on ne télécharge la musique qu'au premier clic utilisateur
    audio.volume = volume
    audio.addEventListener('error', () => setAvailable(false))
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !available) return
    if (audio.paused) {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [available])

  const changeVolume = useCallback((v: number) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  /** Transition sonore discrète entre chapitres (petit souffle de cordes simulé) */
  const chime = useCallback(
    (kind: 'soft' | 'click' | 'reveal' = 'soft') => {
      if (!siteConfig.settings.enableSoundEffects) return
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new Ctx()
        const now = ctx.currentTime
        const freqs = kind === 'click' ? [880] : kind === 'reveal' ? [523.25, 659.25, 783.99] : [392, 494]
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.value = f
          gain.gain.setValueAtTime(0, now + i * 0.08)
          gain.gain.linearRampToValueAtTime(kind === 'click' ? 0.04 : 0.06, now + i * 0.08 + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.9)
          osc.connect(gain).connect(ctx.destination)
          osc.start(now + i * 0.08)
          osc.stop(now + i * 0.08 + 1)
        })
        setTimeout(() => ctx.close().catch(() => undefined), 1600)
      } catch {
        /* audio non disponible : silencieux */
      }
    },
    [],
  )

  return { available, playing, volume, toggle, changeVolume, chime }
}
