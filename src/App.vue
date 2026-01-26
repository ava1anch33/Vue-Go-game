<script setup lang="ts">
import { useUIStore } from './stores'

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
    <router-view />
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

.v-loading-mask {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
}

.v-loading-spinner {
  text-align: center;
  color: #409eff; /* Element 经典蓝 */
}

.circular {
  animation: loading-rotate 2s linear infinite;
  width: 50px;
  height: 50px;
}

.path {
  stroke: #409eff;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 1, 150;
  stroke-dashoffset: 0;
  animation: loading-dash 1.5s ease-in-out infinite;
}

.v-loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #409eff;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124px;
  }
}
</style>
