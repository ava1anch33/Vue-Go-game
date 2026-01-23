import { apiLogin } from "@/api"
import router from "@/router"

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const currentUser = ref(null)

    async function login(email: string, password: string) {
        try {
            const res = await apiLogin(email, password)
            if (res) {
                const { accessToken, user } = res
                setToken(accessToken)
                currentUser.value = user
                console.log(currentUser.value);
                console.log(token.value);
                
                
                router.replace('/home')
            } else {
                throw new Error('Network Error')
            }
        } catch (error) {
            
        }
    }

    function hasToken(): boolean {
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

    return {
        get token() {
            return token.value
        },
        get user() {
            return currentUser.value
        },
        hasToken,
        login,
        setToken,
        clearToken,
    }
})