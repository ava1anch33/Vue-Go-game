<template>
  <div class="game-layout">
    <div class="board-area">
      <BoardPixi 
        :callback="handleClick" 
        :loading="aiThinking"
        :disabled="aiThinking || !isGaming"
      />
    </div>

    <div class="settings-panel">
      <h2>游戏设置</h2>

      <!-- 游戏名称 -->
      <div class="form-item">
        <label>游戏名称</label>
        <el-input 
          v-model="gameSettingForm.name" 
          placeholder="请输入游戏名称"
          :disabled="isGaming"
        />
      </div>

      <!-- AI 执黑 -->
      <div class="form-item">
        <label>AI 先手（执黑）</label>
        <el-switch 
          v-model="gameSettingForm.aiFirst" 
          :disabled="isGaming"
        />
      </div>

      <!-- AI 尝试次数（滑块） -->
      <div class="form-item">
        <label>AI 思考强度（尝试次数）</label>
        <el-slider 
          v-model="gameSettingForm.aiAttempts"
          :min="10"
          :max="1000"
          :step="10"
          show-input
          :disabled="isGaming"
        />
        <div class="slider-tip">
          当前：{{ gameSettingForm.aiAttempts }} 次模拟
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <Button 
          type="primary" 
          :loading="isGaming && !aiThinking"
          @click="createNewGame"
          :disabled="isGaming"
        >
          创建新游戏
        </Button>

        <Button 
          type="danger" 
          @click="endGame"
          :disabled="!isGaming"
        >
          收官（结束游戏）
        </Button>
      </div>

      <!-- 当前状态提示 -->
      <div class="status-tip" v-if="isGaming">
        <span v-if="aiThinking">AI 正在思考...</span>
        <span v-else>轮到 {{ game.currentPlayer === Stone.Black ? '黑方（你）' : '白方（AI）' }} 下子</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import BoardPixi from '@/components/BoardPixi.vue'
import Button from '@/components/ui/Button.vue'
import { useGameStore } from '@/stores'
import { Stone } from '@/types'

const game = useGameStore()

const isGaming = ref(false)      // 是否正在进行游戏
const aiThinking = ref(false)    // AI 是否在思考

const gameSettingForm = reactive({
  name: 'newGame',
  aiFirst: false,
  aiAttempts: 500   // 默认 500 次，平衡速度与强度
})

const createNewGame = async () => {
  if (isGaming.value) return

  isGaming.value = true
  aiThinking.value = true

  try {
    await game.createNewGame(gameSettingForm.name, gameSettingForm.aiFirst)
    // 如果 AI 先手，已经在 store 里处理了
  } catch (err) {
    console.error('创建游戏失败', err)
  } finally {
    aiThinking.value = false
  }
}

const handleClick = async (x: number, y: number) => {
  if (!isGaming.value || aiThinking.value) return

  const success = game.placeStone(x, y)
  if (!success) return

  aiThinking.value = true
  try {
    await game.getAiThinking(gameSettingForm.aiAttempts)
  } finally {
    aiThinking.value = false
  }
}

const endGame = () => {
  if (!isGaming.value) return
  const result = game.determineWhoIsWinner()
  isGaming.value = false
  game.reset()
}
</script>

<style scoped>
.game-layout {
  display: flex;
  justify-content: space-between;
  padding: 24px;
}

.settings-panel {
  width: 360px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

h2 {
  margin: 0 0 24px;
  font-size: 1.5rem;
  color: #333;
}

.form-item {
  margin-bottom: 24px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.status-tip {
  margin-top: 24px;
  text-align: center;
  font-size: 1.1rem;
  color: #409eff;
}

.slider-tip {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}
</style>