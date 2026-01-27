<template>
  <div class="slider-wrapper">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      v-model.number="innerValue"
      class="gradient-slider"
    />
    <div class="value">{{ innerValue }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(Number(props.modelValue))

watch(() => props.modelValue, (v) => {
  innerValue.value = Number(v)
})

watch(innerValue, (v) => {
  emit('update:modelValue', v)
})
</script>

<style scoped>
.slider-wrapper {
  width: 100%;
  max-width: 400px;
}

.gradient-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  outline: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Chrome / Edge */
.gradient-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #764ba2;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* Firefox */
.gradient-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #764ba2;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.value {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #555;
}
</style>
