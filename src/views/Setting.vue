<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import { useAuthStore } from '@/stores';

const auth = useAuthStore()

</script>

<template>
  <div>
        setting works
        <Button type="danger" @click.stop="auth.logout">来日方长</Button>
        <Button type="danger">隐退江湖</Button>
    </div>
</template>

<style scoped></style>
