import { createApp, h } from 'vue'
import Dialog from './Dialog.vue'

let instance: any

function getInstance() {
  if (!instance) {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const app = createApp({
      render: () => h(Dialog, { ref: 'dialog' })
    })

    const vm = app.mount(div) as any
    instance = vm.$refs.dialog
  }
  return instance
}

export function showDialog(options: { title?: string; content?: string }) {
  return getInstance().open(options)
}