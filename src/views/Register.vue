<template>
    <div class="register-page">
      <!-- 返回首页按钮 -->
      <button class="back-home-btn" @click="goToHome">
        <span class="back-icon">←</span>
        <span>返回首页</span>
      </button>
  
      <div class="register-container">
        <!-- 左侧宣传区（和登录页一样） -->
        <div class="register-banner">
          <div class="banner-content">
            <h1 class="banner-title">
              <span class="leaf-icon">🍃</span>
              绿芽
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
  
        <!-- 右侧注册表单 -->
        <div class="register-form">
          <div class="form-header">
            <h2>注册账号</h2>
            <p>创建你的绿芽环保账号</p>
          </div>
  
          <!-- 身份选择 → 已修复：二选一 -->
          <div class="role-select">
            <label class="role-label">选择注册身份</label>
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
  
          <!-- 邮箱 -->
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input type="email" v-model="form.email" placeholder="请输入邮箱" class="form-input" />
            </div>
          </div>
  
          <!-- 密码 -->
          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input :type="showPwd ? 'text' : 'password'" v-model="form.pwd" placeholder="请输入密码" class="form-input" />
              <span class="pwd-toggle" @click="showPwd = !showPwd">
                {{ showPwd ? '🙈' : '👁️' }}
              </span>
            </div>
          </div>
  
          <!-- 确认密码 -->
          <div class="form-group">
            <label class="form-label">确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔏</span>
              <input :type="showPwd2 ? 'text' : 'password'" v-model="form.pwd2" placeholder="请再次输入密码" class="form-input" />
              <span class="pwd-toggle" @click="showPwd2 = !showPwd2">
                {{ showPwd2 ? '🙈' : '👁️' }}
              </span>
            </div>
          </div>
  
          <!-- 注册按钮 -->
          <button class="register-btn" @click="doRegister">
            注册
          </button>
  
          <!-- 去登录 -->
          <div class="login-entry">
            <span>已有账号？</span>
            <a class="login-link" @click="goToLogin">立即登录</a>
          </div>
  
          <!-- 协议 -->
          <div class="terms">
            注册即表示您同意我们的
            <a class="link">服务条款</a>
            和
            <a class="link">隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // 表单
  const form = ref({
    email: '',
    pwd: '',
    pwd2: ''
  })
  
  // 身份二选一（默认普通用户，永远只选一个）
  const selectedRole = ref('user')
  
  // 密码显示
  const showPwd = ref(false)
  const showPwd2 = ref(false)
  
  // 返回首页
  const goToHome = () => {
    router.push('/')
  }
  
  // 去登录
  const goToLogin = () => {
    router.push('/login')
  }
  
  // 注册
  const doRegister = () => {
    if (!form.value.email) return alert('请输入邮箱')
    if (!form.value.pwd) return alert('请输入密码')
    if (form.value.pwd !== form.value.pwd2) return alert('两次密码不一致')
  
    alert('注册成功！请登录')
    router.push('/login')
  }
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
  
  .register-page {
    width: 100vw;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
    padding: 20px;
    position: relative;
  }
  
  /* 返回首页 */
  .back-home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #fff;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    color: #166534;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .back-home-btn:hover {
    background: #f0fdf4;
  }
  
  /* 布局 */
  .register-container {
    display: flex;
    max-width: 1400px;
    margin: 60px auto;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
  
  /* 左侧 */
  .register-banner {
    flex: 1;
    background: linear-gradient(135deg, #22c55e 0%, #fbbf24 100%);
    padding: 60px 40px;
    color: #fff;
  }
  .banner-title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .leaf-icon { font-size: 56px; }
  .banner-subtitle { font-size: 36px; margin-bottom: 20px; }
  .banner-desc { font-size: 20px; line-height: 1.6; margin-bottom: 40px; opacity: 0.95; }
  
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
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  
  /* 右侧表单 */
  .register-form {
    flex: 1;
    background: #fff;
    padding: 60px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .form-header { margin-bottom: 30px; }
  .form-header h2 { font-size: 36px; font-weight: 700; color: #1f2937; margin-bottom: 8px; }
  .form-header p { font-size: 18px; color: #4b5563; }
  
  /* 身份选择 */
  .role-select { margin-bottom: 24px; }
  .role-label { font-size: 16px; font-weight: 500; margin-bottom: 12px; display: block; }
  .role-options { display: flex; gap: 16px; }
  .role-option {
    flex: 1;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
  }
  .role-option.active {
    border-color: #22c55e;
    background: #f0fdf4;
    color: #166534;
  }
  
  /* 输入框 */
  .form-group { margin-bottom: 20px; }
  .form-label { font-size: 16px; font-weight: 500; margin-bottom: 8px; display: block; }
  .input-wrapper { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 16px; font-size: 20px; color: #9ca3af; }
  .form-input {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    font-size: 16px;
    outline: none;
  }
  .form-input:focus { border-color: #22c55e; }
  .pwd-toggle { position: absolute; right: 16px; cursor: pointer; font-size: 20px; color: #9ca3af; }
  
  /* 注册按钮 */
  .register-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(90deg, #22c55e 0%, #fbbf24 100%);
    color: #fff;
    border: none;
    border-radius: 16px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
  }
  
  /* 去登录 */
  .login-entry {
    text-align: center;
    margin-top: 24px;
    font-size: 18px;
    color: #4b5563;
  }
  .login-link {
    color: #16a34a;
    font-weight: 600;
    cursor: pointer;
    margin-left: 6px;
  }
  
  /* 协议 */
  .terms {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #6b7280;
  }
  .link { color: #16a34a; cursor: pointer; }
  
  @media (max-width: 1024px) {
    .register-container { flex-direction: column; }
    .register-form { padding: 40px 30px; }
  }
  </style>