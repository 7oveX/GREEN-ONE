<template>
  <div class="login-page">
    <button class="back-home-btn" @click="goToHome">
      <span class="back-icon">←</span>
      <span>返回首页</span>
    </button>

    <div class="login-container">
      <div class="login-banner">
        <div class="banner-content">
          <h1 class="banner-title">
            <span class="leaf-icon">🍃</span>
            <span>绿芽</span>
          </h1>
          <h2 class="banner-subtitle">让环保成为生活方式</h2>
          <p class="banner-desc">
            记录每一次绿色行动，计算碳足迹，学习垃圾分类知识，
            <br>与千万用户一起共建绿色地球。
          </p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <div class="feature-text">
                <h3>环保打卡系统</h3>
                <p>记录日常环保行为，养成绿色习惯</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <div class="feature-text">
                <h3>碳足迹计算</h3>
                <p>精准计算个人碳排放，助力低碳生活</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <div class="feature-text">
                <h3>智能垃圾分类</h3>
                <p>AI语音查询，轻松掌握分类知识</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="login-form">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>登录继续你的环保之旅</p>
        </div>

        <div class="role-select">
          <label class="role-label">选择登录身份</label>
          <div class="role-options">
            <div
              class="role-option"
              :class="{ active: selectedRole === 'user' }"
              @click="selectedRole = 'user'"
            >
              <span class="role-icon">👤</span>
              <span>普通用户</span>
            </div>
            <div
              class="role-option"
              :class="{ active: selectedRole === 'admin' }"
              @click="selectedRole = 'admin'"
            >
              <span class="role-icon">🛡️</span>
              <span>管理员</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">邮箱</label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input
              type="email"
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="loginForm.password"
              placeholder="请输入密码"
              class="form-input"
            />
            <span
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </div>

        <div class="form-extra">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            <span>记住我</span>
          </label>
          <a href="javascript:;" class="forgot-link">忘记密码?</a>
        </div>

        <button class="login-btn" @click="handleLogin">
          登录
        </button>

        <div class="register-entry">
          <span>还没有账户?</span>
          <a class="register-link" @click="goToRegister">立即注册</a>
        </div>

        <div class="terms">
          登录即表示您同意我们的
          <a href="javascript:;" class="terms-link">服务条款</a>
          和
          <a href="javascript:;" class="terms-link">隐私政策</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const selectedRole = ref('user')
const showPassword = ref(false)

const goToHome = () => {
  router.push('/')
}

const goToRegister = () => {
  router.push('/register')
}

// ==============================================
// ✅ 正确登录逻辑：按角色判断账号密码
// ==============================================
const handleLogin = () => {
  const { email, password } = loginForm.value
  const role = selectedRole.value

  // 1. 普通用户登录
  if (role === 'user') {
    // 用户固定账号
    if (email === '123@qq.com' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'user')
      router.push('/dashboard') 
      return
    } else {
      alert('普通用户账号或密码错误！\n正确：123@qq.com / 123')
      return
    }
  }

  // 2. 管理员登录
  if (role === 'admin') {
    // 管理员固定账号
    if (email === '456@qq.com' && password === '456') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'admin')
      router.push('/admin/dashboard')
      return
    } else {
      alert('管理员账号或密码错误！\n正确：456@qq.com / 456')
      return
    }
  }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
  padding: 20px;
  position: relative;
}

.back-home-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #166534;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}
.back-home-btn:hover {
  background: #f0fdf4;
  transform: translateX(-2px);
}
.back-icon {
  font-size: 20px;
}

.login-container {
  display: flex;
  max-width: 1400px;
  margin: 60px auto 0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.login-banner {
  flex: 1;
  background: linear-gradient(135deg, #22c55e 0%, #fbbf24 100%);
  padding: 60px 40px;
  color: white;
  display: flex;
  align-items: center;
}
.banner-content {
  width: 100%;
}
.banner-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.leaf-icon {
  font-size: 56px;
}
.banner-subtitle {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
}
.banner-desc {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.95;
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
}
.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.feature-text h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
}
.feature-text p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}

.login-form {
  flex: 1;
  background: white;
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.form-header {
  margin-bottom: 40px;
}
.form-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}
.form-header p {
  font-size: 18px;
  color: #4b5563;
}

.role-select {
  margin-bottom: 32px;
}
.role-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 12px;
}
.role-options {
  display: flex;
  gap: 16px;
}
.role-option {
  flex: 1;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #4b5563;
}
.role-option.active {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #166534;
}
.role-icon {
  font-size: 28px;
}
.role-option span:last-child {
  font-size: 16px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 24px;
}
.form-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 8px;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  color: #9ca3af;
}
.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s;
  outline: none;
}
.form-input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}
.password-toggle {
  position: absolute;
  right: 16px;
  font-size: 20px;
  cursor: pointer;
  color: #9ca3af;
}

.form-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}
.forgot-link {
  font-size: 14px;
  color: #16a34a;
  text-decoration: none;
  font-weight: 500;
}
.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #22c55e 0%, #fbbf24 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  transition: all 0.3s;
  margin-bottom: 24px;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.register-entry {
  text-align: center;
  font-size: 18px;
  color: #4b5563;
  margin-bottom: 32px;
}
.register-link {
  color: #16a34a;
  text-decoration: none;
  font-weight: 600;
  margin-left: 8px;
  cursor: pointer;
}
.register-link:hover {
  text-decoration: underline;
}

.terms {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}
.terms-link {
  color: #16a34a;
  text-decoration: none;
  font-weight: 500;
}
.terms-link:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
    margin: 80px auto 0;
  }
  .login-banner {
    padding: 40px 30px;
  }
  .login-form {
    padding: 40px 30px;
  }
}
</style>