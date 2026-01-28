<script setup lang="ts">
import BoardPixi from '@/components/BoardPixi.vue'
import Button from '@/components/ui/Button.vue'
import { useGameStore } from '@/stores'
import { Stone } from '@/types'
import Input from '@/components/ui/Input.vue'
import RadioGroup from '@/components/ui/RadioGroup.vue'
import Radio from '@/components/ui/Radio.vue'
import Slider from '@/components/ui/Slider.vue'
import { showDialog } from '@/components/ui/dialog'
import { apiEndGame } from '@/api'

const game = useGameStore()

const isGaming = ref(false)
const aiThinking = ref(false)

const gameSettingForm = reactive({
  name: 'newGame',
  aiFirst: false,
  aiAttempts: 100,
})

const createNewGame = async () => {
  if (isGaming.value) return

  isGaming.value = true
  aiThinking.value = true

  try {
    await game.createNewGame(gameSettingForm.name, gameSettingForm.aiFirst)
  } catch (err) {
    console.error('创建游戏失败', err)
    isGaming.value = false
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
    const aiSuccess = await game.getAiThinking(gameSettingForm.aiAttempts)
    if (aiSuccess === false) {
      await showDialog({
        title: '收官！',
        content: 'AI认输！',
      })
      game.reset()
    }
  } finally {
    aiThinking.value = false
  }
}

const endGame = async () => {
  if (!isGaming.value) return
  const result = game.determineWhoIsWinner()

  await showDialog({
    title: '胜负判断',
    content: result.result,
  })

  apiEndGame(game.gameId!, game.board)

  isGaming.value = false
  game.reset()
}

onMounted(() => {
  game.reset()
})
</script>

<template>
  <div class="game-layout">
    <div
      :class="{
        'cursor-disable': aiThinking || !isGaming,
      }"
    >
      <BoardPixi :callback="handleClick" :loading="aiThinking" />
    </div>

    <div class="settings-panel">
      <h2>游戏设置</h2>

      <div class="form-item">
        <label>游戏名称</label>
        <Input v-if="!isGaming" v-model="gameSettingForm.name" />
        <div v-else class="value">{{ gameSettingForm.name }}</div>
      </div>

      <div class="form-item">
        <label>AI 先手（执黑）?</label>
        <RadioGroup v-model="gameSettingForm.aiFirst" direction="horizontal" :disabled="isGaming">
          <Radio :value="true">是</Radio>
          <Radio :value="false">否</Radio>
        </RadioGroup>
      </div>

      <div class="form-item">
        <label>AI 思考强度（尝试次数）</label>
        <Slider v-model="gameSettingForm.aiAttempts" :min="5" :max="1000" :step="5" />
        <div class="slider-tip">当前：{{ gameSettingForm.aiAttempts }} 次模拟</div>
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

        <Button type="danger" @click="endGame" :disabled="!isGaming"> 收官（结束游戏） </Button>
      </div>

      <!-- 当前状态提示 -->
      <div class="status-tip" v-if="isGaming">
        <span v-if="aiThinking">AI 正在思考...</span>
        <span v-else
          >轮到 {{ game.currentPlayer === Stone.Black ? '黑方（你）' : '白方（AI）' }} 下子</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  font-weight: 800;
  color: #555;
}

.form-item .value {
  display: block;
  font-weight: 500;
  color: #111111;
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
