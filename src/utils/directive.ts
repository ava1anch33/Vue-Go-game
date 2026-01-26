import type { Directive } from "vue"

export const loadingDirective: Directive<HTMLElement, boolean> = {
  mounted(el, binding) {
    const loadingEl = document.createElement('div')
    loadingEl.className = 'v-loading-mask'
    loadingEl.innerHTML = `
      <div class="v-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" />
        </svg>
        <span class="v-loading-text">${binding.value ? '加载中...' : ''}</span>
      </div>
    `
    loadingEl.style.display = 'none'

    el.style.position = 'relative'
    el.appendChild(loadingEl);

    (el as any)._loadingEl = loadingEl
  },

  updated(el, binding) {
    const loadingEl = (el as any)._loadingEl as HTMLElement
    if (!loadingEl) return

    if (binding.value) {
      loadingEl.style.display = 'flex'
      const textEl = loadingEl.querySelector('.v-loading-text') as HTMLElement
      if (textEl && typeof binding.value === 'string') {
        textEl.textContent = binding.value
      } else if (textEl) {
        textEl.textContent = '加载中...'
      }
    } else {
      loadingEl.style.display = 'none'
    }
  },

  beforeUnmount(el) {
    const loadingEl = (el as any)._loadingEl
    if (loadingEl && loadingEl.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl)
    }
    delete (el as any)._loadingEl
  }
}