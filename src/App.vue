<script setup lang="ts">
import BoardPixi from './components/BoardPixi.vue'
import { useUIStore } from './stores/ui'

const ui = useUIStore()

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
          <div class="board-wrapper">
            <BoardPixi />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.board-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.board-layout {
  display: grid;
  grid-template-columns: auto minmax(320px, 360px);
  column-gap: 28px;
  align-items: stretch;
  justify-content: center;
  width: 100%;
}

.board-wrapper {
  position: relative;
  display: inline-block;
  background: white;
  padding: 20px;
  border-radius: 12px;
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

  .board-wrapper {
    padding: 10px;
    transform: scale(0.8);
    transform-origin: top center;
  }
}
</style>
