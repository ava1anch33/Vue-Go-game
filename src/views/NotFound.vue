<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="notfound">
    <div class="container">
      <div class="code">404</div>
      <div class="title">页面不见了</div>
      <div class="desc">你访问的页面可能被移除、重命名，或者从未存在过</div>

      <div class="actions">
        <button class="btn" @click="goHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.container {
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.code {
  font-size: 120px;
  font-weight: 800;
  letter-spacing: 8px;
  line-height: 1;
  text-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.title {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 600;
}

.desc {
  margin-top: 12px;
  font-size: 16px;
  opacity: 0.85;
}

.actions {
  margin-top: 36px;
}

.btn {
  padding: 12px 32px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
