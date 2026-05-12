<template>
  <div class="app-container">
    <!-- 用户侧边栏：非管理员 + 不隐藏 -->
    <UserSidebar
      v-if="!$route.meta.hideSidebar && userRole !== 'admin'"
    />

    <!-- 管理员侧边栏：是管理员 + 不隐藏 -->
    <AdminSidebar
      v-if="!$route.meta.hideSidebar && userRole === 'admin'"
    />

    <main class="main-content" :class="{ 'no-sidebar': $route.meta.hideSidebar }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserSidebar from './components/UserSidebar.vue'
import AdminSidebar from './components/AdminSidebar.vue'

const route = useRoute()
const userRole = ref(localStorage.getItem('userRole'))

// 监听路由变化，实时更新角色
watch(
  () => route.fullPath,
  () => {
    userRole.value = localStorage.getItem('userRole')
  },
  { immediate: true, flush: 'post' }
)

// 监听localStorage变化，角色切换时实时更新
window.addEventListener('storage', () => {
  userRole.value = localStorage.getItem('userRole')
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-container {
  min-height: 100vh;
  position: relative;
}

/* 主内容区：默认全屏，有侧边栏时自动留边距 */
.main-content {
  width: 100%;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

/* 有用户/管理员侧边栏时，给内容区加250px左边距 */
.main-content:has(~ .sidebar, ~ .admin-sidebar) {
  margin-left: 250px;
}

/* 隐藏侧边栏的页面（登录/首页/注册），取消边距 */
.main-content.no-sidebar {
  margin-left: 0 !important;
}
</style>