import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import HomeView from '../views/Home.vue'
import GameView from '../views/Practice.vue'
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
    },
    {
      path: '/go',
      component: () => import('@/views/HomeLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/Home.vue'),
        },
        {
          path: 'practice',
          name: 'Practice',
          component: () => import('@/views/Practice.vue'),
        },
        {
          path: 'analysis',
          name: 'Analysis',
          component: () => import('@/views/Analyst.vue'),
        },
        {
          path: 'setting',
          name: 'Setting',
          component: () => import('@/views/Setting.vue'),
        },
        {
          path: 'ai-game',
          name: 'AiGame',
          component: () => import('@/views/AiGame.vue'),
        },
        {
          path: '',
          redirect: { name: 'Home' },
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  console.log(isAuthenticated())

  if (requiresAuth && !isAuthenticated()) {
    // no auth -> to login
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
