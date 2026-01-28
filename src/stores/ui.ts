import { throttle } from '@/utils'

/**
 * UI Store - manages UI related state such as window dimensions and device pixel ratio.
 */
export const useUIStore = defineStore('ui', () => {
	const width = ref(window.innerWidth)
	const height = ref(window.innerHeight)
	const dpr = ref(window.devicePixelRatio || 1)

	const updateSize = throttle(() => {
		width.value = window.innerWidth
		height.value = window.innerHeight
		dpr.value = window.devicePixelRatio || 1
	}, 300)

	return {
		width,
		height,
		dpr,
		updateSize,
	}
})
