<template>
  <div
    ref="canvasContainer"
    :style="{
      backgroundImage: `url(${boardImg})`,
    }"
    class="canvas-wrapper"
    @click.stop="handleBoardClick"
  ></div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores'
import { useUIStore } from '@/stores/ui'
import { createStoneParticle, texture } from '@/utils'
import * as PIXI from 'pixi.js'
import { boardImg } from '@/assets'
import { Stone } from '@/types'

const props = withDefaults(
  defineProps<{
    showInfluence?: boolean
    forbiddenClick?: boolean
    callback?: (x: number, y: number) => void
  }>(),
  {
    showInfluence: false,
    forbiddenClick: false,
    callback: () => {},
  },
)

const game = useGameStore()
const ui = useUIStore()

watch(
  () => game.changed,
  () => {
    rerender()
  },
  { deep: true },
)

const padding = 60
const displaySize = computed(() => {
  const minSide = Math.min(ui.width, ui.height)
  return Math.floor((minSide - padding) / game.size) * game.size
})
const cellSize = computed(() => displaySize.value / game.size)

let app: PIXI.Application | null = null
let stoneLayer: PIXI.ParticleContainer | null = null
const canvasContainer = ref<HTMLElement | null>(null)
let boardLayer: PIXI.Container | null = null
let influenceLayer: PIXI.Container | null = null

async function initPixi() {
  await initApp()
  initLayerTree()
  drawBoard()
  syncStones()
}

/**
 * order the board and stone layers in case of wrong rendering order
 */
function initLayerTree() {
  boardLayer = new PIXI.Container()
  influenceLayer = new PIXI.Container()
  stoneLayer = new PIXI.ParticleContainer({
    texture,
    dynamicProperties: {
      position: true,
      color: true,
      rotation: false,
      uvs: false,
      vertex: false,
    },
  })

  app && app.stage.addChild(boardLayer)
  app && app.stage.addChild(influenceLayer)
  app && app.stage.addChild(stoneLayer)
}

/**
 * initialize PIXI application
 */
async function initApp() {
  if (!canvasContainer.value) return
  app = new PIXI.Application()

  await app.init({
    width: displaySize.value,
    height: displaySize.value,
    antialias: true,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  canvasContainer.value.appendChild(app.canvas as HTMLCanvasElement)
}

/**
 * draw the Go board grid and star points
 */
function drawBoard() {
  if (!app || !boardLayer) return

  const size = displaySize.value
  const cell = cellSize.value
  const halfCell = cell / 2

  const starPoints = [
    {
      x: 3,
      y: 3,
    },
    {
      x: 3,
      y: 9,
    },
    {
      x: 3,
      y: 15,
    },
    {
      x: 9,
      y: 3,
    },
    {
      x: 9,
      y: 9,
    },
    {
      x: 9,
      y: 15,
    },
    {
      x: 15,
      y: 3,
    },
    {
      x: 15,
      y: 9,
    },
    {
      x: 15,
      y: 15,
    },
  ]

  boardLayer.removeChildren()
  const g = new PIXI.Graphics()

  for (let i = 1; i <= game.size; i++) {
    const loc = (i - 0.5) * cell
    g.moveTo(halfCell, loc)
      .lineTo(size - halfCell, loc)
      .stroke({ color: 0x000000, width: 1, alpha: 1 })
    g.moveTo(loc, halfCell)
      .lineTo(loc, size - halfCell)
      .stroke({ color: 0x000000, width: 1, alpha: 1 })
  }

  starPoints.forEach((p) => {
    const cx = (p.x + 0.5) * cell
    const cy = (p.y + 0.5) * cell
    g!.circle(cx, cy, 3).fill({ color: 0x000000 })
  })

  boardLayer.addChild(g)
}

function getPositionByIndex(i: number) {
  const x = i % game.size
  const y = Math.floor(i / game.size)
  return { x, y }
}

/**
 * synchronize the stone influence zone
 */
function syncInfluence() {
  if (!influenceLayer || !app || !props.showInfluence) return
  influenceLayer.removeChildren()
  const cell = cellSize.value
  for (let i = 0; i < game.influenceBoard.length; i++) {
    const v = game.influenceBoard[i]
    if (v === Stone.Empty) continue
    const { x, y } = getPositionByIndex(i)
    const g = new PIXI.Graphics()

    if (v === Stone.Black) {
      g.rect(x * cell, y * cell, cell, cell).fill({ color: 0x000000, alpha: 0.18 })
    }

    if (v === Stone.White) {
      g.rect(x * cell, y * cell, cell, cell).fill({ color: 0xffffff, alpha: 0.18 })
    }
    influenceLayer.addChild(g)
  }
}

/**
 * synchronize the stones on the board with the game state
 */
function syncStones() {
  if (!stoneLayer || !app) return
  stoneLayer.removeParticles()
  const cell = cellSize.value
  for (let i = 0; i < game.board.length; i++) {
    const stone = game.board[i] as Stone
    if (stone === Stone.Empty) continue
    const { x, y } = getPositionByIndex(i)
    const particle = createStoneParticle(x, y, stone, cell)
    stoneLayer.addParticle(particle)
  }
}

onMounted(async () => {
  await initPixi()
})

onUnmounted(() => {
  if (app) {
    app.destroy(true, { children: true })
    app = null
  }
})

watch(displaySize, async () => {
  rerender()
})

function rerender() {
  if (!app || !app.renderer) return
  const size = displaySize.value
  app.renderer.resize(size, size)
  drawBoard()
  syncInfluence()
  syncStones()
}

// handle board click event
const handleBoardClick = (e: MouseEvent) => {
  if (props.forbiddenClick) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / cellSize.value)
  const y = Math.floor((e.clientY - rect.top) / cellSize.value)

  if (x < 0 || y < 0 || x >= game.size || y >= game.size) return

  props.callback(x, y)
}
</script>

<style scoped>
.canvas-wrapper {
  display: inline-flex;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
}
</style>
