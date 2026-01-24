import type { User } from '@/types'
import { FetchPost } from './httpClient'

export async function apiLogin(email: string, password: string) {
  try {
    const res = await FetchPost<{ user: User; accessToken: string }>('/login', {
      email,
      password,
    })

    return res
  } catch {
    localStorage.clear()
    window.location.href = '/login'
  }
}

export async function apiLookForUserInfo(email: string) {
  try {
    const res = await FetchPost<{ user: User }>('/user', {
      email,
    })
    return res
  } catch {}
}
