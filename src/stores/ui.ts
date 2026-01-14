/**
 * UI Store - manages UI related state such as window dimensions and device pixel ratio.
 */
export const useUIStore = defineStore('ui', () => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const dpr = ref(window.devicePixelRatio || 1)

  function updateSize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
    dpr.value = window.devicePixelRatio || 1
  }
  
  return {
    width,
    height,
    dpr,
    updateSize,
  }
})
