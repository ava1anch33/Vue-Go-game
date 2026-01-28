import { apiAiThinking, apiCreateNewGame, apiGivenGameAnalyst } from '@/api'
import { Stone, type Position } from '@/types'

/**
 * Game Store - manages the state of the Go game including board size, stones, current player, and history.
 */
export const useGameStore = defineStore('game', () => {
  /** Board size */
  const size = 19
  /** real board data, use continue memory to enhance performance */
  const board = new Int8Array(size * size).fill(0)
  const influenceBoard = new Int8Array(size * size).fill(0)

  /** Current player */
  const currentPlayer = ref<Stone>(Stone.Black)
  /** trigger webGL render stone */
  const changed = ref(false)
  const gameId = ref<string | null>(null)
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
  /** black need more komi place to win since it is first move */
  const komi = ref<number>(7.5)

  /** index position from 2-D to 1-D */
  const index = (x: number, y: number) => y * size + x
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
  function canPlaceStone(board: Int8Array, x: number, y: number, size: number): boolean {
    // check if the position is already occupied
    if (board[y * size + x] !== 0) return false

    // check for suicide move
    const liberties = getLiberties(board, x, y, size)
    if (liberties === 0) return false

    return true
  }

  function placeStone(x: number, y: number): boolean {
    const idx = index(x, y)

    if (!canPlaceStone(board, x, y, size)) {
      return false
    }

    const color = currentPlayer.value
    board[idx] = color
    const captured: number[] = []

    directions.forEach(([dx, dy]) => {
      const nx = x + dx!
      const ny = y + dy!
      if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
        const neighborIdx = index(nx, ny)
        const neighbor = board[neighborIdx]

        // if neighbor is opponent's stone, check if it has liberties
        if (neighbor !== 0 && neighbor !== color) {
          const liberties = getLiberties(board, nx, ny, size)
          if (liberties === 0) {
            const capturedStones = removeCapturedStones(board, nx, ny, size, neighbor!)
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
    toggleChanged()
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

  /** notify webGL to rerender the board and stone */
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

  function reset() {
    batchSetBoard(new Int8Array(size * size))
    history.value = []
    currentPlayer.value = Stone.Black
    toggleChanged()
  }

  function batchSetBoard(arr: Int8Array) {
    for (let index = 0; index < arr.length; index++) {
      board[index] = arr[index]!
    }
  }

  function batchSetInfluenceBoard(arr: Int8Array) {
    for (let index = 0; index < arr.length; index++) {
      influenceBoard[index] = arr[index]!
    }
  }

  function inBoard(x: number, y: number, size: number): boolean {
    return x >= 0 && y >= 0 && x < size && y < size
  }

  /** to determine territories belong to black or white */
  function floodFillTerritory(
    board: Int8Array,
    startX: number,
    startY: number,
    size: number,
    visited: Set<number>,
  ) {
    const stack: [number, number][] = [[startX, startY]]
    const territory: number[] = []

    let touchesBlack = false
    let touchesWhite = false

    while (stack.length) {
      const [x, y] = stack.pop()!
      const idx = y * size + x

      if (visited.has(idx)) continue
      visited.add(idx)

      if (board[idx] !== Stone.Empty) continue

      territory.push(idx)

      for (const [dx, dy] of directions) {
        const nx = x + dx!
        const ny = y + dy!
        if (!inBoard(nx, ny, size)) continue

        const nidx = ny * size + nx
        const v = board[nidx]

        if (v === Stone.Empty) {
          stack.push([nx, ny])
        } else if (v === Stone.Black) {
          touchesBlack = true
        } else if (v === Stone.White) {
          touchesWhite = true
        }
      }
    }

    if (touchesBlack && !touchesWhite) {
      return { owner: Stone.Black, count: territory.length }
    }
    if (touchesWhite && !touchesBlack) {
      return { owner: Stone.White, count: territory.length }
    }

    return { owner: Stone.Empty, count: 0 }
  }

  const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

  function numberToChinese(n: number): string {
    if (n < 10) return CN_NUM[n]!
    if (n < 20) return '十' + (n % 10 === 0 ? '' : CN_NUM[n % 10])
    if (n < 100) {
      const tens = Math.floor(n / 10)
      const ones = n % 10
      return CN_NUM[tens] + '十' + (ones === 0 ? '' : CN_NUM[ones])
    }
    return n.toString()
  }

  function formatGoScore(diff: number): string {
    const sign = diff > 0 ? '黑胜 ' : '白胜 '
    const abs = Math.abs(diff)

    const integer = Math.floor(abs)
    const fraction = abs - integer

    let result = ''

    if (integer > 0) {
      result += numberToChinese(integer)
    }

    if (fraction > 0) {
      const fracMap: Record<number, string> = {
        0.25: '四分之一',
        0.5: '二分之一',
        0.75: '四分之三',
      }

      const fracText = fracMap[fraction]
      if (fracText) {
        result += integer > 0 ? '又' + fracText : fracText
      }
    }

    return sign + result + '子'
  }

  function determineWhoIsWinner() {
    let blackStones = 0
    let whiteStones = 0
    let blackTerritory = 0
    let whiteTerritory = 0

    const visited = new Set<number>()

    for (let i = 0; i < board.length; i++) {
      const v = board[i]

      if (v === Stone.Black) {
        blackStones++
        continue
      }

      if (v === Stone.White) {
        whiteStones++
        continue
      }

      if (v === Stone.Empty && !visited.has(i)) {
        const x = i % size
        const y = (i / size) | 0

        const res = floodFillTerritory(board, x, y, size, visited)
        if (res.owner === Stone.Black) blackTerritory += res.count
        if (res.owner === Stone.White) whiteTerritory += res.count
      }
    }

    const blackScore = blackStones + blackTerritory
    const whiteScore = whiteStones + whiteTerritory + komi.value

    const diff = blackScore - whiteScore

    return {
      black: {
        stones: blackStones,
        territory: blackTerritory,
        total: blackScore,
      },
      white: {
        stones: whiteStones,
        territory: whiteTerritory,
        komi: komi.value,
        total: whiteScore,
      },
      result: diff === 0 ? 'Draw' : formatGoScore(diff),
    }
  }

  async function createNewGame(name: string, aiFirst: boolean) {
    const {
      board: newBoard,
      currentPlayer: newCurrentPlayer,
      gameId: id,
    } = await apiCreateNewGame(name, aiFirst)
    reRenderBoardFromBackend(newBoard, newCurrentPlayer, id)
  }

  async function getAiThinking(aiAttempts: number) {
    if (!gameId.value) return
    const {
      aiSuccess,
      board: newBoard,
      currentPlayer: newCurrentPlayer,
    } = await apiAiThinking(board, gameId.value, currentPlayer.value, aiAttempts)
    if (aiSuccess) {
      reRenderBoardFromBackend(newBoard, newCurrentPlayer)
    }
    return aiSuccess
  }

  function reRenderBoardFromBackend(newBoard: Array<number>, newCurrentPlayer: Stone, id?: string) {
    const safeArray = convertArrayToInt8Array(newBoard)
    batchSetBoard(safeArray)
    currentPlayer.value = newCurrentPlayer
    if (id) {
      gameId.value = id
    }
    toggleChanged()
  }

  function convertArrayToInt8Array(arr: Array<number>) {
    const safeArray = new Int8Array(arr.length)
    arr.forEach((v, i) => {
      const num = Number(v)
      safeArray[i] = Number.isNaN(num) || !Number.isInteger(num) ? 0 : num
    })
    return safeArray
  }

  async function analystImgGame() {
    const { influence: newInfluence } = await apiGivenGameAnalyst(board)
    batchSetInfluenceBoard(convertArrayToInt8Array(newInfluence))
    toggleChanged()
  }

  return {
    // state
    size,
    currentPlayer,
    changed,
    history,
    komi,
    board,
    influenceBoard,
    stoneAt,
    // actions
    placeStone,
    removeStones,
    undo,
    determineWhoIsWinner,
    reset,
    createNewGame,
    getAiThinking,
    analystImgGame,
  }
})
