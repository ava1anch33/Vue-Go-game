<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const auth = useAuthStore()
const route = useRoute()

const avatarUrl = ref<string | null>(null)
const objectUrl = ref<string | null>(null)

const navLinks = [
	{ route: '/go/home', label: '主页', icon: '🏠' },
	{ route: '/go/ai-game', label: 'AI对弈', icon: '🤖' },
	{ route: '/go/practice', label: '练习', icon: '🪨' },
	{ route: '/go/analysis', label: '分析', icon: '📊' },
	{ route: '/go/setting', label: '设置', icon: '⚙️' },
]

const isActive = (linkRoute: string) => {
	return route.path === linkRoute || route.path.startsWith(linkRoute + '/')
}

const currentPageTitle = computed(() => {
	const matched = navLinks.find((item) => isActive(item.route))
	return matched ? matched.label : '弈境'
})

const updateAvatar = () => {
	const avatarData = auth.user?.profile?.avatar
	if (objectUrl.value) {
		URL.revokeObjectURL(objectUrl.value)
		objectUrl.value = null
	}

	if (!avatarData) {
		avatarUrl.value = null
		return
	}

	let blob: Blob

	if (avatarData instanceof Blob) {
		blob = avatarData
	} else if (avatarData instanceof ArrayBuffer || ArrayBuffer.isView(avatarData)) {
		blob = new Blob([avatarData], { type: 'image/jpeg' })
	} else if (typeof avatarData === 'string' && (avatarData as string).startsWith('data:image')) {
		avatarUrl.value = avatarData
		return
	} else {
		console.warn('未知的 avatar 資料格式')
		return
	}

	objectUrl.value = URL.createObjectURL(blob)
	avatarUrl.value = objectUrl.value
}

const handleImageError = () => {
	avatarUrl.value = null
}

onMounted(async () => {
	if (auth.token && auth.user && auth.user.email) {
		auth.getUserDetail(auth.user?.email)
	}
	updateAvatar()
})

onUnmounted(() => {
	if (objectUrl.value) {
		URL.revokeObjectURL(objectUrl.value)
	}
})
</script>

<template>
	<div class="home-page">
		<!-- 固定側邊欄 -->
		<aside class="sidebar">
			<div class="logo">
				<span class="logo-icon">⚫⚪</span>
				<h1>弈境</h1>
			</div>

			<nav class="nav-menu">
				<ul>
					<li v-for="item in navLinks" :key="item.route">
						<router-link
							:to="item.route"
							:class="{
								'nav-item': true,
								active: isActive(item.route),
							}"
						>
							<span class="icon">{{ item.icon }}</span>
							<span>{{ item.label }}</span>
						</router-link>
					</li>
				</ul>
			</nav>

			<div class="sidebar-footer"></div>
		</aside>

		<main class="main-content">
			<header class="header">
				<h2>{{ currentPageTitle }}</h2>

				<div class="user-area">
					<div class="user-profile">
						<div class="avatar-wrapper">
							<img
								v-if="avatarUrl"
								:src="avatarUrl"
								alt="用戶頭像"
								class="user-avatar"
								@error="handleImageError"
							/>
							<svg
								v-else
								viewBox="0 0 120 120"
								xmlns="http://www.w3.org/2000/svg"
								class="user-avatar default-avatar"
							>
								<defs>
									<radialGradient id="bg" cx="50%" cy="50%" r="55%">
										<stop offset="0%" stop-color="#667eea" />
										<stop offset="70%" stop-color="#764ba2" />
										<stop offset="100%" stop-color="#5a367a" />
									</radialGradient>
									<radialGradient id="black" cx="50%" cy="50%">
										<stop offset="0%" stop-color="#2d1b69" />
										<stop offset="100%" stop-color="#000" />
									</radialGradient>
									<radialGradient id="white" cx="50%" cy="50%">
										<stop offset="0%" stop-color="#f8f9ff" />
										<stop offset="100%" stop-color="#e0e7ff" />
									</radialGradient>
								</defs>

								<circle
									cx="60"
									cy="60"
									r="58"
									fill="url(#bg)"
									stroke="#a78bfa"
									stroke-width="2"
								/>
								<circle cx="60" cy="60" r="4" fill="#fbbf24" opacity="0.9" />
								<circle cx="28" cy="28" r="18" fill="url(#black)" />
								<circle cx="92" cy="92" r="18" fill="url(#white)" />
							</svg>
						</div>

						<span class="welcome">
							你好，{{ auth.user?.profile?.LastName || 'Client' }}
						</span>
					</div>
				</div>
			</header>

			<div class="content">
				<router-view />
			</div>
		</main>
	</div>
</template>

<style scoped>
.content {
	flex: 1;
	overflow-y: auto;
	min-height: 0;
}

.user-area {
	display: flex;
	align-items: center;
}

.user-profile {
	display: flex;
	align-items: center;
	gap: 12px;
}

.avatar-wrapper {
	width: 40px;
	height: 40px;
	position: relative;
}

.user-avatar,
.default-avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
	border: 2px solid rgba(255, 255, 255, 0.25);
	background: rgba(0, 0, 0, 0.2);
	transition: all 0.2s;
}

.user-avatar:hover {
	transform: scale(1.08);
	box-shadow: 0 0 12px rgba(167, 139, 250, 0.5);
}

.user-avatar[src^='blob:'] {
	border-color: #a78bfa;
}
.home-page {
	height: 100vh;
	display: flex;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #9f9cca;
	font-family:
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		sans-serif;
	overflow: hidden;
}

.sidebar {
	width: 260px;
	flex-shrink: 0;
	background: rgba(30, 30, 60, 0.72);
	backdrop-filter: blur(12px) saturate(160%);
	border-right: 1px solid rgba(255, 255, 255, 0.08);
	display: flex;
	flex-direction: column;
	padding: 24px 16px;
}

.logo {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 48px;
	user-select: none;
}

.logo-icon {
	font-size: 2.1rem;
	line-height: 1;
}

.logo h1 {
	font-size: 1.6rem;
	font-weight: 700;
	background: linear-gradient(90deg, #c4b5fd, #a78bfa);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin: 0;
}

.nav-menu ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.nav-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	border-radius: 10px;
	color: rgba(240, 240, 255, 0.9);
	text-decoration: none;
	font-size: 1.05rem;
	transition: all 0.2s;
}

.nav-item:hover {
	background: rgba(120, 100, 220, 0.22);
	color: white;
}

.nav-item.active {
	background: rgba(120, 100, 220, 0.38);
	color: white;
	font-weight: 500;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.disabled {
	opacity: 0.38;
	cursor: not-allowed;
}

.sidebar-footer {
	margin-top: auto;
	display: flex;
	gap: 12px;
	padding-top: 24px;
}

.btn-icon {
	background: rgba(255, 255, 255, 0.08);
	border: none;
	color: #ddd;
	width: 44px;
	height: 44px;
	border-radius: 10px;
	font-size: 1.3rem;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-icon:hover {
	background: rgba(255, 255, 255, 0.16);
}

/* 右侧主区域 */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.header {
	height: 72px;
	background: rgba(20, 20, 50, 0.78);
	backdrop-filter: blur(16px);
	border-bottom: 1px solid rgba(180, 160, 255, 0.12);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32px;
	flex-shrink: 0;
}

.header h2 {
	margin: 0;
	font-size: 1.5rem;
	font-weight: 600;
}

.user-area {
	font-size: 0.95rem;
	opacity: 0.9;
}

.hero {
	background: rgba(30, 30, 60, 0.4);
	border-radius: 16px;
	padding: 60px 48px;
	margin-bottom: 32px;
	position: relative;
	overflow: hidden;
}

.hero-text {
	position: relative;
	z-index: 2;
	max-width: 620px;
}

.hero h1 {
	font-size: 3.2rem;
	margin: 0 0 16px;
	line-height: 1.1;
}

.hero p {
	font-size: 1.18rem;
	opacity: 0.92;
	margin: 0 0 32px;
	line-height: 1.5;
}

.hero-actions {
	display: flex;
	gap: 16px;
}

.btn {
	padding: 14px 28px;
	border-radius: 12px;
	font-size: 1.05rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.22s;
	border: none;
	text-decoration: none;
	display: inline-block;
}

.btn.primary {
	background: linear-gradient(90deg, #7c3aed, #a78bfa);
	color: white;
	box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.btn.primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 28px rgba(124, 58, 237, 0.5);
}

.btn.secondary {
	background: rgba(255, 255, 255, 0.1);
	color: #e0d5ff;
	border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn.secondary:hover {
	background: rgba(255, 255, 255, 0.18);
}

.placeholder-section {
	background: rgba(30, 30, 60, 0.35);
	border-radius: 16px;
	padding: 40px;
	text-align: center;
}

.empty-tip {
	margin-top: 16px;
	opacity: 0.75;
	line-height: 1.6;
}
</style>
