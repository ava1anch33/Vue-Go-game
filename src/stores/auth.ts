import { apiLogin, apiLogout, apiLookForUserInfo, apiRegister } from '@/api'
import router from '@/router'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const currentUser = ref<User | null>(null)

  async function logout() {
    try {
      await apiLogout()
    } finally {
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await apiLogin(email, password)
      if (res) {
        const { accessToken, user } = res
        setToken(accessToken)
        await getUserDetail(user.email)
        router.replace('/go/home')
      } else {
        throw new Error('Network Error')
      }
    } catch {
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  async function register(email: string, password: string) {
    try {
      const res = await apiRegister(email, password)
      console.log(res);
      
      if (res) {
        const { accessToken, user } = res
        setToken(accessToken)
        await getUserDetail(user.email)
        router.replace('/go/home')
      } else {
        throw new Error('Network Error')
      }
    } catch {
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  async function getUserDetail(email: string) {
    try {
      const res = await apiLookForUserInfo(email)
      if (res) {
        currentUser.value = res.user
      }
    } catch (error) {}
  }

  function hasToken(): boolean {
    syncTokenWithStore()
    return Boolean(token.value)
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('accessToken', newToken)
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('accessToken')
  }

  function syncTokenWithStore() {
    token.value = localStorage.getItem('accessToken')
  }

  return {
    get token() {
      return token
    },
    get user() {
      return currentUser
    },
    hasToken,
    login,
    register,
    logout,
    setToken,
    clearToken,
  }
})
