<script setup lang="ts">
import { useAuthStore } from '@/stores'
import Button from '@/components/ui/Button.vue'

const auth = useAuthStore()
const user = computed(() => auth.user)

const form = reactive({
  firstName: '',
  lastName: '',
  phoneCode: '',
  phone: '',
})

onMounted(() => {
  if (!user.value) return
  Object.assign(form, user.value.profile || {})
})

const save = async () => {
//   await auth.updateProfile({ profile: { ...form } })
}
</script>

<template>
  <div class="setting-bg">
    <div class="setting-panel">

      <section class="hud profile">
        <div class="avatar">
          <div class="stone white" />
        </div>

        <div class="identity">
          <div class="email">{{ user?.email }}</div>
          <div class="role">{{ user?.role.toUpperCase() }}</div>
        </div>
      </section>

      <section class="hud influence">
        <h3>个人势力范围</h3>

        <div class="grid">
          <input v-model="form.lastName" placeholder="姓" />
          <input v-model="form.firstName" placeholder="名" />
          <input v-model="form.phoneCode" placeholder="+86" />
          <input v-model="form.phone" placeholder="手机号" />
        </div>

        <Button type="primary" @click="save">同步棋盘</Button>
      </section>

      <!-- 安全 -->
      <section class="hud security">
        <h3>安全连接</h3>

        <div class="oauth">
          <span>Google</span>
          <i :class="user?.googleId ? 'stone white' : 'stone empty'" />
        </div>

        <div class="oauth">
          <span>GitHub</span>
          <i :class="user?.githubId ? 'stone white' : 'stone empty'" />
        </div>

        <Button type="secondary">修改密码</Button>
      </section>

      <!-- 危险区 -->
      <section class="hud danger">
        <Button type="danger" @click="auth.logout">落子 · 退出</Button>
      </section>

    </div>
  </div>
</template>

<style scoped>
.setting-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting-panel {
  width: 720px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* HUD 卡片 */
.hud {
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,.15);
  box-shadow: 0 0 40px rgba(102,126,234,.3);
  color: #fff;
}

.profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(0,0,0,.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.identity .email {
  font-weight: bold;
}

.identity .role {
  opacity: .7;
  font-size: 12px;
}

/* Influence */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 12px 0;
}

.grid input {
  background: rgba(0,0,0,.25);
  border: 1px solid rgba(255,255,255,.2);
  color: white;
  padding: 10px;
  border-radius: 8px;
}

/* 棋子 */
.stone {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.stone.white {
  background: radial-gradient(circle, #fff, #ddd);
  box-shadow: 0 0 10px rgba(255,255,255,.7);
}
.stone.empty {
  border: 1px dashed rgba(255,255,255,.4);
}

/* OAuth */
.oauth {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.danger {
  text-align: center;
}
</style>
