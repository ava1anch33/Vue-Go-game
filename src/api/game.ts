import type { Stone } from '@/types'
import { FetchPost } from './httpClient'

export async function apiCreateNewGame(name: string, aiFirst: boolean) {
  return FetchPost<{
    board: Array<Stone>
    currentPlayer: Stone
    gameId: string
  }>('/create-new-game', {
    payloadType: 'json',
    body: { name, aiFirst },
  })
}

export async function apiEndGame(gameId: string, board: Int8Array) {
    return FetchPost('/end-game', {
        payloadType: 'json',
        body: { board, gameId },
    })
}

/**
 * AI 落子思考
 */
export async function apiAiThinking(
  board: Int8Array,
  gameId: string,
  currentPlayer: Stone,
  aiAttempts: number,
) {
  return FetchPost<{
    board: Array<Stone>
    currentPlayer: Stone
    aiSuccess: boolean
  }>('/ai-thinking', {
    payloadType: 'json',
    body: {
      board: Array.from(board),
      gameId,
      currentPlayer,
      aiAttempts,
    },
  })
}
