import type { Stone } from '@/types'
import { FetchPost } from './httpClient'

export async function apiCreateNewGame(name: string, aiFirst: boolean) {
  try {
    return await FetchPost<{
      board: Array<Stone>
      currentPlayer: Stone
      gameId: string
    }>('/create-new-game', {
      name,
      aiFirst,
    })
  } catch {
    throw new Error('')
  }
}

export async function apiAiThinking(
  board: Int8Array<ArrayBuffer>,
  gameId: string,
  currentPlayer: Stone,
  aiAttempts: number,
) {
  try {
    return await FetchPost<{
      board: Array<Stone>
      currentPlayer: Stone,
      aiSuccess: boolean
    }>('/ai-thinking', {
      board: Array.from(board),
      gameId,
      currentPlayer,
      aiAttempts,
    })
  } catch (error) {
    throw new Error('')
  }
}
