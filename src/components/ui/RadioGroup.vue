<template>
	<div class="radio-group" :class="direction">
		<slot />
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	modelValue: string | number | boolean
	direction?: 'horizontal' | 'vertical'
	disabled?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number | boolean): void
}>()

const groupContext = reactive({
	modelValue: props.modelValue,
	disabled: props.disabled ?? false,
	updateValue: (value: string | number | boolean) => {
		emit('update:modelValue', value)
	},
})

watch(
	() => props.modelValue,
	(newVal) => {
		groupContext.modelValue = newVal
	},
)

watch(
	() => props.disabled,
	(newVal) => {
		groupContext.disabled = newVal ?? false
	},
)

provide('radioGroupContext', groupContext)
</script>

<style scoped>
.radio-group {
	display: flex;
	gap: 24px;
}

.radio-group.vertical {
	flex-direction: column;
	gap: 16px;
}
</style>
