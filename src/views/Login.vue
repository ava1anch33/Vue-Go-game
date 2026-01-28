<template>
  <div class="go-login-container">
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <div class="glass-card">
      <div class="grid-line line-h"></div>
      <div class="grid-line line-v"></div>

      <div class="stone stone-black"></div>
      <div class="stone stone-white"></div>

      <div class="header">
        <h1 class="title">弈 · 境</h1>
        <p class="subtitle">{{ isLogin ? '重返棋局' : '初入棋坛' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="form-body">
        <div class="input-group">
          <label>Email</label>
          <input v-model="formData.email" type="text" placeholder="User ID / Email" required />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="formData.password" type="password" placeholder="Password" required />
        </div>

        <Transition name="fade-slide">
          <div v-if="!isLogin" class="input-group">
            <label>Confirm</label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>
        </Transition>

        <div class="actions">
          <button type="submit" class="btn-main">
            {{ isLogin ? 'Go' : 'Join' }}
          </button>
        </div>
      </form>

      <div class="footer">
        <span>{{ isLogin ? 'Not a Member?' : 'Is a Member?' }}</span>
        <a href="#" @click.prevent="toggleMode" class="toggle-link">
          {{ isLogin ? 'Join Now!' : 'Log in!' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'

const auth = useAuthStore()
const router = useRouter()

const isLogin = ref(true)

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  formData.password = ''
  formData.confirmPassword = ''
}

const handleSubmit = () => {
  try {
    if (isLogin.value) {
      auth.login(formData.email, formData.password)
    } else {
      auth.register(formData.email, formData.password)
    }
    router.replace('/home')
  } catch (error) {
    
  }
}
</script>

<style scoped>
/* --- 布局与背景 (保留你要求的背景色) --- */
.go-login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 核心背景色 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', sans-serif;
}

/* --- 背景光晕动画 --- */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 10s infinite ease-in-out;
}
.orb-1 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  top: -50px;
  left: -50px;
}
.orb-2 {
  width: 250px;
  height: 250px;
  background: rgba(0, 0, 0, 0.2);
  bottom: 5%;
  right: 5%;
  animation-delay: -5s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 30px);
  }
}

/* --- 毛玻璃卡片 --- */
.glass-card {
  position: relative;
  width: 380px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  color: #fff;
  z-index: 10;
  transition: height 0.3s ease;
}

/* --- 棋盘装饰线 --- */
.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  z-index: -1;
}
.line-h {
  width: 100%;
  height: 1px;
  top: 25%;
  left: 0;
}
.line-v {
  height: 100%;
  width: 1px;
  left: 75%;
  top: 0;
}

/* --- 棋子装饰 --- */
.stone {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.4);
}
.stone-black {
  background: radial-gradient(circle at 35% 35%, #555, #000);
  top: -18px;
  right: -18px;
}
.stone-white {
  background: radial-gradient(circle at 35% 35%, #fff, #ddd);
  bottom: -18px;
  left: -18px;
}

/* --- 内容样式 --- */
.header {
  text-align: center;
  margin-bottom: 30px;
}
.title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.subtitle {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 5px;
  letter-spacing: 1px;
}

/* 表单控件 */
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 6px;
  opacity: 0.8;
  padding-left: 4px;
}
.input-group input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}
.input-group input:focus {
  background: rgba(0, 0, 0, 0.35);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}
.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* 按钮 */
.actions {
  margin-top: 10px;
}
.btn-main {
  width: 100%;
  padding: 14px;
  border-radius: 50px;
  border: none;
  background: #fff;
  color: #667eea; /* 呼应背景色 */
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 4px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.btn-main:active {
  transform: translateY(0);
}

/* 底部文字 */
.footer {
  margin-top: 25px;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}
.toggle-link {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
}
.toggle-link:hover {
  border-bottom-style: solid;
}

/* --- Vue 动画过渡 (Transition) --- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
  opacity: 1;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
  transform: translateY(-10px);
}
</style>
