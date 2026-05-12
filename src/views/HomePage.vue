<template>
    <!-- 🔥 关键：外层容器，无侧边栏，全屏 -->
    <div class="home-container no-sidebar">
      <!-- 顶部欢迎区 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="logo">
            <span class="logo-icon">🍃</span>
            <h1 class="logo-text">绿芽</h1>
          </div>
          <p class="slogan">让环保成为一种生活方式</p>
          <p class="sub-slogan">记录环保行为 · 计算碳足迹 · 学习垃圾分类 · 共建绿色地球</p>
          <button class="start-btn" @click="goToDashboard">立即开始环保之旅</button>
        </div>
  
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">50万+</div>
            <div class="stat-label">用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1000万+</div>
            <div class="stat-label">环保打卡次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">5000吨</div>
            <div class="stat-label">减少碳排放</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">100万+</div>
            <div class="stat-label">垃圾分类查询</div>
          </div>
        </div>
      </section>
  
      <!-- 核心功能区 -->
      <section class="feature-section">
        <h2 class="section-title">核心功能</h2>
        <p class="section-subtitle">一站式环保生活助手</p>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🍃</div>
            <h3 class="feature-title">环保打卡</h3>
            <p class="feature-desc">记录每一次绿色行动，养成环保好习惯</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💧</div>
            <h3 class="feature-title">碳足迹追踪</h3>
            <p class="feature-desc">精准计算个人碳排放，助力低碳生活</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">♻️</div>
            <h3 class="feature-title">垃圾分类</h3>
            <p class="feature-desc">智能查询垃圾分类，让环保更简单</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌲</div>
            <h3 class="feature-title">数据可视化</h3>
            <p class="feature-desc">直观展示环保成果，见证绿色力量</p>
          </div>
        </div>
      </section>
  
      <!-- 环保小课堂 -->
      <section class="knowledge-section">
        <h2 class="section-title">环保小课堂</h2>
        <p class="section-subtitle">学习环保知识，从我做起</p>
        
        <div class="knowledge-grid">
          <div class="knowledge-card">
            <div class="knowledge-icon">🌍</div>
            <h3 class="knowledge-title">什么是碳足迹？</h3>
            <p class="knowledge-desc">
              碳足迹是指个人、组织或产品在其整个生命周期中直接或间接产生的温室气体排放总量。
              通过计算碳足迹，我们可以了解自己对环境的影响，从而采取更环保的生活方式。
            </p>
          </div>
          <div class="knowledge-card">
            <div class="knowledge-icon">♻️</div>
            <h3 class="knowledge-title">垃圾分类的重要性</h3>
            <p class="knowledge-desc">
              正确的垃圾分类可以提高资源回收利用率，减少环境污染，降低垃圾处理成本。
              每个人都应该掌握基本的垃圾分类知识，从源头做好分类。
            </p>
          </div>
          <div class="knowledge-card">
            <div class="knowledge-icon">💚</div>
            <h3 class="knowledge-title">日常环保小贴士</h3>
            <p class="knowledge-desc">
              使用可重复利用的购物袋、减少一次性用品使用、节约用水用电、选择公共交通或骑行出行，
              这些小习惯都能为环保做出贡献，让地球更美好。
            </p>
          </div>
        </div>
      </section>
  
      <!-- 底部行动区 -->
      <section class="action-section">
        <div class="action-content">
          <span class="action-icon">💚</span>
          <h2 class="action-title">加入我们，共建绿色未来</h2>
          <p class="action-desc">每一个小小的环保行动，都是对地球的一份爱</p>
          <button class="action-btn" @click="goToDashboard">开始使用绿芽</button>
        </div>
        
        <footer class="footer">
          <div class="footer-logo">
            <span class="logo-icon">🍃</span>
            <span class="logo-text">绿芽</span>
          </div>
          <p class="footer-slogan">让环保成为习惯，让地球更加美好</p>
        </footer>
      </section>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goToDashboard = () => {
    router.push('/dashboard')
  }
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
  
  .home-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
    margin-left: 0 !important;
    padding: 0 !important;
  }
  
  .no-sidebar {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  
  .hero-section {
    padding: 60px 20px 80px;
    text-align: center;
    background: linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%);
  }
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .logo-icon {
    font-size: 64px;
    color: #16a34a;
  }
  
  .logo-text {
    font-size: 64px;
    font-weight: 700;
    color: #166534;
  }
  
  .slogan {
    font-size: 32px;
    color: #16a34a;
    margin-bottom: 24px;
    font-weight: 500;
  }
  
  .sub-slogan {
    font-size: 24px;
    color: #475569;
    margin-bottom: 40px;
  }
  
  .start-btn {
    padding: 20px 48px;
    font-size: 24px;
    font-weight: 600;
    color: white;
    background: #16a34a;
    border: none;
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }
  
  .start-btn:hover {
    background: #15803d;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
  }
  
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    max-width: 1200px;
    margin: 60px auto 0;
    padding: 0 20px;
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    padding: 32px 20px;
    backdrop-filter: blur(8px);
  }
  
  .stat-value {
    font-size: 40px;
    font-weight: 700;
    color: #16a34a;
    margin-bottom: 12px;
  }
  
  .stat-label {
    font-size: 20px;
    color: #475569;
    font-weight: 500;
  }
  
  .feature-section {
    padding: 80px 20px;
    text-align: center;
    background: #f8fdf6;
  }
  
  .section-title {
    font-size: 48px;
    font-weight: 700;
    color: #166534;
    margin-bottom: 16px;
  }
  
  .section-subtitle {
    font-size: 24px;
    color: #475569;
    margin-bottom: 60px;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .feature-card {
    background: white;
    border-radius: 24px;
    padding: 40px 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    text-align: left;
  }
  
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .feature-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: linear-gradient(135deg, #22c55e 0%, #fbbf24 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    margin-bottom: 24px;
  }
  
  .feature-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }
  
  .feature-desc {
    font-size: 20px;
    color: #475569;
    line-height: 1.6;
  }
  
  .knowledge-section {
    padding: 80px 20px;
    text-align: center;
    background: linear-gradient(135deg, #fefce8 0%, #dcfce7 100%);
  }
  
  .knowledge-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .knowledge-card {
    background: white;
    border-radius: 24px;
    padding: 40px 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    text-align: left;
  }
  
  .knowledge-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }
  
  .knowledge-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }
  
  .knowledge-desc {
    font-size: 20px;
    color: #475569;
    line-height: 1.7;
  }
  
  .action-section {
    background: linear-gradient(135deg, #16a34a 0%, #f59e0b 100%);
    text-align: center;
    padding: 80px 20px 0;
  }
  
  .action-content {
    max-width: 800px;
    margin: 0 auto 60px;
  }
  
  .action-icon {
    font-size: 64px;
    color: white;
    margin-bottom: 24px;
  }
  
  .action-title {
    font-size: 48px;
    font-weight: 700;
    color: white;
    margin-bottom: 20px;
  }
  
  .action-desc {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 40px;
  }
  
  .action-btn {
    padding: 20px 48px;
    font-size: 24px;
    font-weight: 600;
    color: #16a34a;
    background: white;
    border: none;
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
  
  .footer {
    background: #065f46;
    padding: 40px 20px;
    margin-top: 60px;
  }
  
  .footer-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .footer-logo .logo-icon {
    font-size: 32px;
    color: #a7f3d0;
  }
  
  .footer-logo .logo-text {
    font-size: 32px;
    font-weight: 700;
    color: white;
  }
  
  .footer-slogan {
    font-size: 24px;
    color: #a7f3d0;
  }
  
  @media (max-width: 1200px) {
    .feature-grid { grid-template-columns: repeat(2, 1fr); }
    .knowledge-grid { grid-template-columns: repeat(2, 1fr); }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
  }
  
  @media (max-width: 768px) {
    .logo-text { font-size: 40px; }
    .slogan { font-size: 24px; }
    .sub-slogan { font-size: 18px; }
    .feature-grid, .knowledge-grid, .stats-row { grid-template-columns: 1fr; }
    .section-title, .action-title { font-size: 32px; }
  }
  </style>