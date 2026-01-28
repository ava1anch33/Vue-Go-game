<template>
	<label class="radio-label" :class="{ disabled: isDisabled }">
		<input
			type="radio"
			:name="groupName"
			:value="value"
			:checked="isChecked"
			:disabled="isDisabled"
			@change="handleChange"
			class="radio-input"
		/>
		<span class="radio-outer">
			<span class="radio-inner" />
		</span>
		<span class="radio-text">
			<slot />
		</span>
	</label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

const props = defineProps<{
	value: string | number | boolean
	disabled?: boolean
	name?: string
}>()

const group = inject<{
	modelValue: any
	disabled: boolean
	updateValue: (val: any) => void
}>('radioGroupContext', {
	modelValue: null,
	disabled: false,
	updateValue: () => {}, // 空函数占位
})

const isChecked = computed(() => {
	return group ? group.modelValue === props.value : false
})

const isDisabled = computed(() => {
	return group?.disabled || props.disabled || false
})

const groupName = computed(() => props.name || 'default-radio-group')

const handleChange = () => {
	if (!isDisabled.value && group) {
		group.updateValue(props.value)
	}
}
</script>

<style scoped>
.radio-label {
	display: flex;
	align-items: center;
	cursor: pointer;
	user-select: none;
	font-size: 14px;
	color: #303133;
}

.radio-label.disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

.radio-input {
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
}

.radio-outer {
	position: relative;
	width: 16px;
	height: 16px;
	margin-right: 8px;
	border: 1px solid #dcdfe6;
	border-radius: 50%;
	flex-shrink: 0;
	background: #fff;
	transition: all 0.2s;
}

.radio-input:checked + .radio-outer {
	border-color: #764ba2;
}

.radio-inner {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	opacity: 0;
	transition: opacity 0.2s;
}

.radio-input:checked + .radio-outer .radio-inner {
	opacity: 1;
}

.radio-text {
	color: inherit;
}
</style>
