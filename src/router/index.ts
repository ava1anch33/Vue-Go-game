import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import HomeView from '../views/Home.vue'
import GameView from '../views/Game.vue'
import { useAuthStore } from '@/stores'

const isAuthenticated = () => {
  const auth = useAuthStore()
  return auth.hasToken()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  
  if (requiresAuth && !isAuthenticated()) {
    // no auth -> to login
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router