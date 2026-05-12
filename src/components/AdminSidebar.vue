<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">🛡</div>
      <div>
        <div class="logo-title">管理后台</div>
        <div class="logo-sub">绿芽环保</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="active"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="admin-avatar">管</div>
      <div style="flex:1">
        <div class="admin-name">管理员</div>
        <div class="admin-sub">admin@test.com</div>
      </div>
      <span class="logout-btn" title="退出登录" @click="$router.push('/login')">↪</span>
    </div>
  </aside>
</template>

<script setup>
const navItems = [
  { path: '/admin/dashboard', icon: '⊞', label: '数据大屏' },
  { path: '/admin/user',      icon: '👤', label: '用户管理' },
  { path: '/admin/review',    icon: '📋', label: '事件审核' },
  { path: '/admin/task',      icon: '📅', label: '任务管理' },
  { path: '/admin/knowledge', icon: '📖', label: '知识库'   },
]
</script>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0; top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid #f0fdf4;
}
.logo-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: #22c55e; color: #fff; font-size: 20px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.logo-title { font-weight: 700; font-size: 16px; color: #111; }
.logo-sub   { font-size: 12px; color: #6b7280; }

.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px; margin-bottom: 4px;
  cursor: pointer; font-size: 15px; color: #374151;
  text-decoration: none; transition: all .15s;
}
.nav-item:hover  { background: #f0fdf4; }
.nav-item.active { background: #22c55e; color: #fff; font-weight: 600; }
.nav-icon { font-size: 18px; }

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex; align-items: center; gap: 10px;
}
.admin-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: #fbbf24; color: #92400e;
  font-weight: 700; font-size: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.admin-name { font-size: 14px; font-weight: 600; }
.admin-sub  { font-size: 11px; color: #6b7280; }
.logout-btn { margin-left: auto; cursor: pointer; font-size: 18px; color: #6b7280; }
</style>
