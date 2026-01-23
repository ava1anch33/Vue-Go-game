// src/views/LoginView.vue
<template>
  <div class="login-container">
    <h1>登入</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>電子郵件</label>
        <input v-model="email" type="email" placeholder="請輸入電子郵件" required />
      </div>
      <div class="form-group">
        <label>密碼</label>
        <input v-model="password" type="password" placeholder="請輸入密碼" required />
      </div>
      <button type="submit">登入</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    auth.login(email.value, password.value)
  } catch (err) {
    error.value = '登入失敗，請檢查帳號密碼'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 20px;
}
button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>