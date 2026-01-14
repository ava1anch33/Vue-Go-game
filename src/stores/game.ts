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

  /** index position from 2-D to 1-D */
  const index = (x: number, y: number) => y * size.value + x
  const stoneAt = (x: number, y: number) => board[index(x, y)]

  function placeStone(x: number, y: number): boolean {
    const idx = index(x, y)
    if (board[idx] !== Stone.Empty) {
      return false
    }

    const color = currentPlayer.value
    board[idx] = color

    // TODO remove stone and capture logic
    const captured: number[] = []

    history.value.push({
      x,
      y,
      color: currentPlayer.value,
      captured,
    })
    changed.value = !changed.value
    currentPlayer.value = color === Stone.Black ? Stone.White : Stone.Black
    return true
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
