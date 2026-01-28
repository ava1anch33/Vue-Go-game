import type { User } from '@/types'
import { FetchPost } from './httpClient'

export async function apiRegister(email: string, password: string) {
  return FetchPost<{ user: User; accessToken: string }>('/register', {
    payloadType: 'json',
    body: { email, password },
  })
}

export async function apiLogin(email: string, password: string) {
  return FetchPost<{ user: User; accessToken: string }>('/login', {
    payloadType: 'json',
    body: { email, password },
  })
}

export async function apiLogout() {
  return FetchPost('/logout', {
    payloadType: 'json',
  })
}

export async function apiLookForUserInfo(email: string) {
  return FetchPost<{ user: User }>('/user', {
    payloadType: 'json',
    body: { email },
  })
}
