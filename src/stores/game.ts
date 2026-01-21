import type { Position } from '@/types'

export enum Stone {
  Empty = 0,
  Black = 1,
  White = 2,
}

/**
 * Game Store - manages the state of the Go game including board size, stones, current player, and history.
 */
export const useGameStore = defineStore('game', () => {
  /** Board size */
  const size = ref<19 | 13 | 9>(19)
  /** Position of Star */
  const starPoints = computed(() => {
    const points = []
    const starCoords =
      size.value === 19
        ? [3, 9, 15]
        : size.value === 13
          ? [3, 6, 9]
          : size.value === 9
            ? [2, 4, 6]
            : []
    for (const x of starCoords) {
      for (const y of starCoords) {
        points.push({ x, y })
      }
    }
    return points
  })
  /** real board data, use continue memory to enhance performance */
  let board = new Int8Array(size.value * size.value)
  /** Current player */
  const currentPlayer = ref<Stone>(Stone.Black)
  /** trigger webGL render stone */
  const changed = ref(false)
  /** playing history */
  const history = ref<
    {
      x: number
      y: number
      color: Stone
      captured: number[]
    }[]
  >([])

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]

  /** index position from 2-D to 1-D */
  const index = (x: number, y: number) => y * size.value + x
  const stoneAt = (x: number, y: number) => board[index(x, y)]

  /** to calculate a potion liberties */
  function getLiberties(board: Int8Array, x: number, y: number, size: number): number {
    const color = board[y * size + x]
    let liberties = 0
    let stack: [number, number][] = [[x, y]]
    let visited: Set<string> = new Set()

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!
      const key = `${cx},${cy}`
      if (visited.has(key)) continue
      visited.add(key)

      for (const [dx, dy] of directions) {
        const nx = cx + dx!
        const ny = cy + dy!
        if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
          const index = ny * size + nx
          const neighbor = board[index]
          if (neighbor === 0) {
            // if neighbor is empty, it's a liberty
            liberties++
          } else if (neighbor === color) {
            // if neighbor is same color, continue searching
            stack.push([nx, ny])
          }
        }
      }
    }

    return liberties
  }

  // function to determine if a stone can be placed at (x, y)
  function canPlaceStone(
    board: Int8Array,
    x: number,
    y: number,
    color: number,
    size: number,
    lastMove: Position | null,
  ): boolean {
    // check if the position is already occupied
    if (board[y * size + x] !== 0) return false

    // check for suicide move
    const liberties = getLiberties(board, x, y, size)
    if (liberties === 0) return false

    return true
  }

  function placeStone(x: number, y: number): boolean {
    const idx = index(x, y)

    if (
      !canPlaceStone(
        board,
        x,
        y,
        currentPlayer.value,
        size.value,
        history.value[history.value.length - 1]?.x !== undefined
          ? {
              x: history.value[history.value.length - 1]!.x,
              y: history.value[history.value.length - 1]!.y,
            }
          : null,
      )
    ) {
      console.log('Cannot place stone here!')
      return false
    }

    const color = currentPlayer.value
    board[idx] = color
    const captured: number[] = []

    directions.forEach(([dx, dy]) => {
      const nx = x + dx!
      const ny = y + dy!
      if (nx >= 0 && ny >= 0 && nx < size.value && ny < size.value) {
        const neighborIdx = index(nx, ny)
        const neighbor = board[neighborIdx]

        // if neighbor is opponent's stone, check if it has liberties
        if (neighbor !== 0 && neighbor !== color) {
          const liberties = getLiberties(board, nx, ny, size.value)
          if (liberties === 0) {
            const capturedStones = removeCapturedStones(board, nx, ny, size.value, neighbor!)
            captured.push(...capturedStones)
          }
        }
      }
    })

    // save history
    history.value.push({
      x,
      y,
      color,
      captured,
    })

    currentPlayer.value = color === Stone.Black ? Stone.White : Stone.Black

    // notify webGL to render
    changed.value = !changed.value
    return true
  }

  // remove all connected stones of the same color starting from (x, y)
  function removeCapturedStones(
    board: Int8Array,
    x: number,
    y: number,
    size: number,
    color: number,
  ): number[] {
    const captured: number[] = []
    const stack: [number, number][] = [[x, y]]
    const visited: Set<string> = new Set()

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!
      const key = `${cx},${cy}`
      if (visited.has(key)) continue
      visited.add(key)

      const idx = cy * size + cx
      if (board[idx] !== color) continue

      captured.push(idx)

      for (const [dx, dy] of directions) {
        const nx = cx + dx!
        const ny = cy + dy!
        if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
          const nidx = ny * size + nx
          if (board[nidx] === color && !visited.has(`${nx},${ny}`)) {
            stack.push([nx, ny])
          }
        }
      }
    }

    // remove captured stones from the board
    removeStones(captured)
    return captured
  }

  function removeStones(indices: number[]) {
    for (const idx of indices) {
      board[idx] = Stone.Empty
    }
  }

  function toggleChanged() {
    changed.value = !changed.value
  }

  function undo() {
    const last = history.value.pop()
    if (!last) return

    board[index(last.x, last.y)] = Stone.Empty

    for (const c of last.captured) {
      board[c] = last.color === Stone.Black ? Stone.White : Stone.Black
    }

    currentPlayer.value = last.color
    toggleChanged()
  }

  function reset(newSize: 19 | 13 | 9 = 19) {
    size.value = newSize
    board = new Int8Array(newSize * newSize)
    history.value = []
    currentPlayer.value = Stone.Black
    toggleChanged()
  }

  return {
    // state
    size,
    currentPlayer,
    changed,
    history,
    starPoints,
    // board access (readonly)
    get board() {
      return board
    },
    stoneAt,
    // actions
    placeStone,
    removeStones,
    undo,
    reset,
  }
})
