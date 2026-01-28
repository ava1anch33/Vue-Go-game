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
	const auth = useAuthStore()

	if (to.name === 'login' && auth.hasToken()) {
		next({ name: 'Home' })
		return
	}

	if (to.meta.requiresAuth && !auth.hasToken()) {
		next({ name: 'login' })
		return
	}

	next()
})

export default router
