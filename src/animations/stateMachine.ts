import { useMemo } from 'react'

/**
 * Machine à états du scénario — source de vérité de la navigation.
 * Les scènes ne sont jamais toutes affichées : une seule scène active.
 */

export type ChapterId =
  | 'curtain'
  | 'invitation'
  | 'kingdom'
  | 'declaration'
  | 'gallery'
  | 'regrets'
  | 'future'
  | 'promise'
  | 'epilogue'
  | 'finalletter'

export const CHAPTER_ORDER: ChapterId[] = [
  'curtain',
  'invitation',
  'kingdom',
  'declaration',
  'gallery',
  'regrets',
  'future',
  'promise',
  'finalletter',
]

const STORAGE_KEY = 'royaume-progress-v1'

export type ProgressState = {
  current: ChapterId
  visited: ChapterId[]
  queenAccepted: boolean
  secretFound: boolean
}

export const initialProgress: ProgressState = {
  current: 'curtain',
  visited: ['curtain'],
  queenAccepted: false,
  secretFound: false,
}

type Action =
  | { type: 'GOTO'; chapter: ChapterId }
  | { type: 'NEXT' }
  | { type: 'ACCEPT_QUEEN' }
  | { type: 'FIND_SECRET' }
  | { type: 'RESET' }
  | { type: 'RESTORE'; state: ProgressState }

export function progressReducer(state: ProgressState, action: Action): ProgressState {
  switch (action.type) {
    case 'GOTO': {
      // Le royaume secret n'est accessible qu'après la promesse visitée.
      if (action.chapter === 'epilogue' && !state.visited.includes('promise')) return state
      // La progression normale exige l'accord de la reine pour quitter l'invitation.
      if (state.current === 'invitation' && action.chapter !== 'invitation' && !state.queenAccepted) {
        return state
      }
      const visited = state.visited.includes(action.chapter)
        ? state.visited
        : [...state.visited, action.chapter]
      return { ...state, current: action.chapter, visited }
    }
    case 'NEXT': {
      const idx = CHAPTER_ORDER.indexOf(state.current)
      if (idx < 0 || idx >= CHAPTER_ORDER.length - 1) {
        // Après la promesse : accès possible à l'épilogue s'il a été découvert.
        if (state.current === 'promise' && state.secretFound) {
          return { ...state, current: 'epilogue', visited: [...new Set([...state.visited, 'epilogue' as ChapterId])] }
        }
        return state
      }
      const next = CHAPTER_ORDER[idx + 1]
      if (state.current === 'invitation' && !state.queenAccepted) return state
      return { ...state, current: next, visited: [...new Set([...state.visited, next])] }
    }
    case 'ACCEPT_QUEEN':
      return { ...state, queenAccepted: true }
    case 'FIND_SECRET':
      return { ...state, secretFound: true }
    case 'RESET':
      return { ...initialProgress }
    case 'RESTORE':
      return action.state
    default:
      return state
  }
}

export function loadProgress(): ProgressState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ProgressState
    if (!parsed?.current || !Array.isArray(parsed.visited)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* stockage indisponible : on continue sans sauvegarde */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
}

/** Préférence "mouvement réduit" réactive */
export function usePrefersReducedMotion(): boolean {
  return useMemo(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    return mq.matches
  }, [])
}
