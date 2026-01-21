<script setup lang="ts">
import BoardPixi from './components/BoardPixi.vue'
import { useGameStore, useUIStore } from './stores'

const ui = useUIStore()
const game = useGameStore()

function determineWhoIsWinner() {
  const result = game.determineWhoIsWinner()
  alert(`Game Over! Winner: ${result.result}`)
}

onMounted(() => {
  ui.updateSize()
  window.addEventListener('resize', ui.updateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', ui.updateSize)
})
</script>

<template>
  <div id="app">
    <main class="app-main">
      <div class="board-section">
        <div class="board-layout">
          <BoardPixi />
        </div>
        <button @click.stop="determineWhoIsWinner()">tttttttestttttt</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-main {
  margin: 0 auto;
  width: 100%;
}

.board-section {
  width: 100%;
}

.board-layout {
  display: inline-block;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1200px) {
  .app-main {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }

  .app-main {
    padding: 20px;
  }
}
</style>
<style>
*,
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
