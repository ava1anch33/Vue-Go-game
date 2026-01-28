<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="dialog-mask" @click="onMaskClick">
        <div class="dialog" @click.stop>
          <header class="dialog-header">
            <slot name="title">{{ title }}</slot>
          </header>
          <section class="dialog-body">
            <slot>{{ content }}</slot>
          </section>
          <footer class="dialog-footer">
            <Button :type="'secondary'" @click="close">取消</Button>
            <Button :type="'primary'" @click="confirm">确定</Button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from './Button.vue'

const visible = ref(false)
const title = ref('提示')
const content = ref('')

let resolveFn: ((v: boolean) => void) | null = null

function open(options: { title?: string; content?: string }) {
  title.value = options.title ?? '提示'
  content.value = options.content ?? ''
  visible.value = true

  return new Promise<boolean>((resolve) => {
    resolveFn = resolve
  })
}

function close() {
  visible.value = false
  resolveFn?.(false)
  resolveFn = null
}

function confirm() {
  visible.value = false
  resolveFn?.(true)
  resolveFn = null
}

function onMaskClick() {
  close()
}

defineExpose({ open })
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.dialog {
  width: 360px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.dialog-header {
  padding: 12px 16px;
  font-weight: 600;
}
.dialog-body {
  padding: 16px;
}
.dialog-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
button.primary {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
