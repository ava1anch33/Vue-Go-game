import type { User } from '@/types'
import { FetchPost } from './httpClient'

export async function apiLogin(email: string, password: string) {
  try {
    return await FetchPost<{ user: User; accessToken: string }>('/login', {
      email,
      password,
    })
  } catch {
    throw new Error()
  }
}

export async function apiLogout() {
    try {
        return await FetchPost('/logout')
  } catch {
    throw new Error()
  }
}

export async function apiLookForUserInfo(email: string) {
  try {
    return await FetchPost<{ user: User }>('/user', {
      email,
    })
  } catch {}
}
