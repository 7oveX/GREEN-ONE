<template>
  <div class="sidebar">
    <div class="logo">
      <div class="logo-icon">🌱</div>
      <span class="logo-text">绿芽环保</span>
    </div>

    <nav class="menu">
      <!-- 永远可点击的菜单 -->
      <router-link to="/dashboard" class="menu-item">
        <span class="menu-icon">📊</span>
        <span>数据大屏</span>
      </router-link>
      <router-link to="/garbage-classification" class="menu-item">
        <span class="menu-icon">🗑️</span>
        <span>垃圾分类</span>
      </router-link>

      <!-- 登录后可点击，未登录灰掉不可点 -->
      <router-link 
        to="/environmental-check-in" 
        class="menu-item" 
        :class="{ disabled: !isLoggedIn }"
        @click.prevent="!isLoggedIn && goToLogin()"
      >
        <span class="menu-icon">📅</span>
        <span>环保打卡</span>
      </router-link>
      <router-link 
        to="/carbon-footprint" 
        class="menu-item" 
        :class="{ disabled: !isLoggedIn }"
        @click.prevent="!isLoggedIn && goToLogin()"
      >
        <span class="menu-icon">🌱</span>
        <span>碳足迹</span>
      </router-link>
      <router-link 
        to="/incident-reporting" 
        class="menu-item" 
        :class="{ disabled: !isLoggedIn }"
        @click.prevent="!isLoggedIn && goToLogin()"
      >
        <span class="menu-icon">📝</span>
        <span>事件上报</span>
      </router-link>
      <router-link 
        to="/points-mall" 
        class="menu-item" 
        :class="{ disabled: !isLoggedIn }"
        @click.prevent="!isLoggedIn && goToLogin()"
      >
        <span class="menu-icon">🎁</span>
        <span>积分商城</span>
      </router-link>
      <router-link 
        to="/personal-center" 
        class="menu-item" 
        :class="{ disabled: !isLoggedIn }"
        @click.prevent="!isLoggedIn && goToLogin()"
      >
        <span class="menu-icon">👤</span>
        <span>个人中心</span>
      </router-link>
    </nav>

    <div class="bottom-btn">
      <button v-if="!isLoggedIn" class="login-reg-btn" @click="goToLogin">
        登录 / 注册
      </button>
      <button v-else class="logout-btn" @click="logout">
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup>
// ✅ 补全所有导入，解决报错！
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

// 检查登录状态
const checkLogin = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
}

// 页面加载时检查
onMounted(() => {
  checkLogin()
  // 监听 localStorage 变化，登录后实时刷新
  window.addEventListener('storage', checkLogin)
})

// ✅ 组件卸载时移除监听，避免内存泄漏（已补全导入）
onUnmounted(() => {
  window.removeEventListener('storage', checkLogin)
})

// 去登录页
const goToLogin = () => {
  router.push('/login')
}

// 退出登录
const logout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userRole')
  router.push('/login')
  // 强制刷新页面，确保状态同步
  setTimeout(() => window.location.reload(), 50)
}
</script>

<style scoped>
/* 侧边栏加宽到 250px */
.sidebar {
  width: 250px;
  height: 100vh;
  background: #f8fdf6;
  border-right: 1px solid #e6f4e6;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  margin-bottom: 30px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: #22c55e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #166534;
}

.menu {
  flex: 1;
  padding: 0 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 6px;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  font-size: 16px;
  transition: all 0.3s;
  cursor: pointer;
}

.menu-item:hover {
  background: #e6f4e6;
  color: #166534;
}

.menu-item.router-link-active {
  background: #22c55e;
  color: white;
}

/* 未登录禁用样式：变灰、不可点击 */
.menu-item.disabled {
  color: #c0c6cc;
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.bottom-btn {
  padding: 16px 20px;
  border-top: 1px solid #e6f4e6;
}

.login-reg-btn {
  width: 100%;
  padding: 12px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.login-reg-btn:hover {
  background: #16a34a;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: #fef2f2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn:hover {
  background: #fee2e2;
}
</style>