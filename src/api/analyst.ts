import type { Stone } from '@/types'
import { FetchPost } from './httpClient'

export async function apiGivenGameAnalyst(board: Int8Array) {
	return FetchPost<{
		board: Array<Stone>
		influence: Array<Stone>
	}>('/game-analyst', {
		payloadType: 'json',
		body: {
			board: Array.from(board),
		},
	})
}
