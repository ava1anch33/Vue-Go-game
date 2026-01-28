<script setup lang="ts">
import BoardPixi from '@/components/BoardPixi.vue'
import { useGameStore } from '@/stores'

const game = useGameStore()
const analyzing = ref(false)

onMounted(() => {
  game.reset()
})

function clickBoard(x: number, y: number) {
  game.placeStone(x, y)
}

async function analystImage() {
  await game.analystImgGame()
}
</script>

<template>
  <div class="game-layout">
    <div>
      <BoardPixi :forbidden-click="analyzing" :callback="clickBoard" :show-influence="true" />
    </div>

    <div class="settings-panel">
      <h3 class="panel-title">棋盘识别</h3>
      <button class="action-btn" @click="analystImage">开始分析</button>
    </div>
  </div>
</template>
<style lang="css" scoped>
.game-layout {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  gap: 24px;
}

.cursor-disable {
  cursor: not-allowed;
}

.settings-panel {
  width: 360px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.upload-box {
  border: 2px dashed #bbb;
  border-radius: 12px;
  padding: 32px 16px;
  text-align: center;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-box:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.06);
}

.file-name {
  font-size: 14px;
  color: #333;
  word-break: break-all;
}

.action-btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
