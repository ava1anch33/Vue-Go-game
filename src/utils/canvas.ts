import { Stone } from '@/stores'
import * as PIXI from 'pixi.js'

/**
 * create stone texture to make stone look 3D
 * @param radius radius of the stone
 * @returns PIXI Texture
 */
export function createStoneTexture(radius = 64): PIXI.Texture {
  const size = radius * 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)

  const cx = radius
  const cy = radius

  const gradient = ctx.createRadialGradient(
    cx - radius * 0.25,
    cy - radius * 0.25,
    radius * 0.2,
    cx,
    cy,
    radius,
  )

  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.5, '#e6e6e6')
  gradient.addColorStop(1, '#bdbdbd')

  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = radius * 0.05
  ctx.stroke()

  return PIXI.Texture.from(canvas)
}

const BASE_TEXTURE_SIZE = 128

export const texture = createStoneTexture()

/**
 * create stone particle for each point in board
 * @param x x coordinate of the stone
 * @param y y coordinate of the stone
 * @param stone the type of stone (black or white)
 * @param cellSize size of each cell in the board
 * @returns PIXI.IParticle
 */
export function createStoneParticle(
  x: number,
  y: number,
  stone: Stone,
  cellSize: number,
): PIXI.IParticle {
  const scale = cellSize / BASE_TEXTURE_SIZE

  return new PIXI.Particle({
    texture,
    x: (x + 0.5) * cellSize,
    y: (y + 0.5) * cellSize,

    scaleX: scale,
    scaleY: scale,

    anchorX: 0.5,
    anchorY: 0.5,

    rotation: 0,

    tint: stone === Stone.Black ? new PIXI.Color('black') : new PIXI.Color('white').setAlpha(1),
  })
}
