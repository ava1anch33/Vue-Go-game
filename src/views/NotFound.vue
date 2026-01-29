<template>
	<div ref="container" class="notfound-root">
		<div class="overlay">
			<h1>404</h1>
			<p>棋局之外 · 此路不通</p>
			<button @click="goHome">回到首页</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as PIXI from 'pixi.js'

const container = ref<HTMLDivElement | null>(null)
const router = useRouter()

let app: PIXI.Application | null = null
let particleLayer: PIXI.Container | null = null

const goHome = () => {
	router.replace({ name: 'Practice' })
}

function random(min: number, max: number) {
	return Math.random() * (max - min) + min
}

async function initPixi() {
	if (!container.value) return

	app = new PIXI.Application()
	await app.init({
		resizeTo: container.value,
		backgroundAlpha: 0,
		antialias: true,
		resolution: window.devicePixelRatio || 1,
	})

	container.value.appendChild(app.canvas)

	particleLayer = new PIXI.Container()
	app.stage.addChild(particleLayer)

	for (let i = 0; i < 100; i++) {
		const g = new PIXI.Graphics()
		const isBlack = Math.random() > 0.5
		const size = random(4, 10)

		g.circle(0, 0, size).fill({ color: isBlack ? 0x111111 : 0xffffff, alpha: 0.35 })

		g.x = random(0, app.renderer.width)
		g.y = random(0, app.renderer.height)
		;(g as any).vx = random(-0.3, 0.3)
		;(g as any).vy = random(-0.3, 0.3)

		particleLayer.addChild(g)
	}

	app.ticker.add(() => {
		particleLayer!.children.forEach((p: any) => {
			p.x += p.vx
			p.y += p.vy

			if (p.x < 0 || p.x > app!.renderer.width) p.vx *= -1
			if (p.y < 0 || p.y > app!.renderer.height) p.vy *= -1
		})
	})
}

onMounted(initPixi)

onUnmounted(() => {
	app?.destroy(true, { children: true })
	app = null
})
</script>

<style scoped>
.notfound-root {
	position: relative;
	width: 100vw;
	height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	overflow: hidden;
}

.overlay {
	position: absolute;
	inset: 0;
	z-index: 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	pointer-events: auto;
	color: #fff;
	text-align: center;
	backdrop-filter: blur(2px);
}

.overlay h1 {
	font-size: 120px;
	margin: 0;
	font-weight: 800;
	letter-spacing: 6px;
}

.overlay p {
	font-size: 18px;
	opacity: 0.85;
	margin-bottom: 32px;
}

.overlay button {
	padding: 12px 28px;
	font-size: 16px;
	border-radius: 24px;
	border: none;
	cursor: pointer;
	color: #764ba2;
	background: #fff;
	font-weight: 600;
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease;
}

.overlay button:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}
</style>
