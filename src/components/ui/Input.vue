<template>
	<div class="input-wrapper" :class="{ 'input-disabled': disabled, 'input-error': error }">
		<input
			:type="showPassword ? 'text' : type"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:maxlength="maxlength"
			:minlength="minlength"
			:autocomplete="autocomplete"
			@input="handleInput"
			@focus="handleFocus"
			@blur="handleBlur"
			@keyup.enter="handleEnter"
			class="input-field"
		/>

		<div v-if="error" class="input-error-msg">{{ error }}</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	modelValue: string | number
	type?: 'text' | 'password' | 'number' | 'email' | 'search' // 默认 text
	placeholder?: string
	disabled?: boolean
	readonly?: boolean
	clearable?: boolean
	maxlength?: number
	minlength?: number
	autocomplete?: string
	prefixIcon?: any // 前置图标组件
	suffixIcon?: any // 后置图标组件
	error?: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number): void
	(e: 'input', value: string | number): void
	(e: 'focus'): void
	(e: 'blur'): void
	(e: 'enter'): void
	(e: 'clear'): void
}>()

const showPassword = ref(false)
const togglePassword = () => {
	showPassword.value = !showPassword.value
}

const handleInput = (e: Event) => {
	const target = e.target as HTMLInputElement
	emit('update:modelValue', target.value)
	emit('input', target.value)
}

const handleFocus = () => emit('focus')
const handleBlur = () => emit('blur')
const handleEnter = () => emit('enter')

const clear = () => {
	emit('update:modelValue', '')
	emit('clear')
}
</script>

<style scoped>
.input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	border: 1px solid #d9d9d9;
	border-radius: 6px;
	transition: all 0.2s;
	background: #fff;
}

.input-wrapper:hover {
	border-color: #409eff;
}

.input-wrapper:focus-within {
	border-color: #409eff;
	box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.input-disabled {
	background: #f5f7fa;
	cursor: not-allowed;
	opacity: 0.6;
}

.input-error {
	border-color: #f56c6c !important;
}

.input-error:focus-within {
	box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
}

.input-field {
	flex: 1;
	height: 40px;
	padding: 0 12px;
	border: none;
	outline: none;
	background: transparent;
	font-size: 14px;
	color: #303133;
}

.input-icon {
	display: flex;
	align-items: center;
	padding: 0 12px;
	color: #c0c4cc;
	font-size: 16px;
}

.input-icon.password-toggle,
.input-icon.clear {
	cursor: pointer;
}

.input-icon.clear:hover {
	color: #f56c6c;
}

.input-error-msg {
	position: absolute;
	bottom: -20px;
	left: 0;
	color: #f56c6c;
	font-size: 12px;
}
</style>
