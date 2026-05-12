<template>
  <div class="center-container">
    <UserSidebar />
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar">
        <span class="avatar-icon">👤</span>
      </div>
      <div class="user-info">
        <div class="user-header">
          <span class="user-name">{{ userInfo.nickname }}</span>
          <span class="user-level">LV {{ userInfo.level }}</span>
        </div>
        <div class="user-join">加入时间: {{ userInfo.joinTime }}</div>
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-value" style="color: #22c55e">{{ userInfo.totalPoints.toLocaleString() }}</div>
            <div class="stat-label">总积分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color: #fbbf24">{{ userInfo.continuousCheckIn }}</div>
            <div class="stat-label">连续打卡</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color: #22c55e">{{ userInfo.totalCarbonReduction }} kg</div>
            <div class="stat-label">累计减排</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color: #f97316">{{ userInfo.rank }}</div>
            <div class="stat-label">当前排名</div>
          </div>
        </div>
      </div>
      <div class="user-actions">
        <span class="action-icon">⚙️</span>
        <span class="action-icon">🔔</span>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="action-row">
      <!-- 👇 环保事件上报：跳转到事件上报页 -->
      <div class="action-card primary" @click="goToReport">
        <span class="action-icon">📄</span>
        <div class="action-content">
          <div class="action-title">环保事件上报</div>
          <div class="action-desc">发现问题？立即上报</div>
        </div>
      </div>

      <!-- 👇 我的上报：跳转到我的上报页  -->
      <div class="action-card outline" @click="goToMyReport">
        <span class="action-icon">📃</span>
        <div class="action-content">
          <div class="action-title">我的上报</div>
          <div class="action-desc">查看处理进度</div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <!-- 升级进度 -->
      <div class="stat-card">
        <div class="stat-card-title">
          <span class="title-icon" style="color: #22c55e">↗️</span>
          升级进度
        </div>
        <div class="level-row">
          <span class="level-text">LV {{ stats.level }}</span>
          <span class="level-text">LV {{ stats.nextLevel }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${((stats.level * 1000 - stats.needPoints) / (stats.nextLevel * 1000)) * 100}%`, background: 'linear-gradient(90deg, #22c55e 0%, #fbbf24 100%)' }"
          ></div>
        </div>
        <div class="progress-desc">还需 {{ stats.needPoints }} 积分升级到下一级</div>
      </div>

      <!-- 本月目标 -->
      <div class="stat-card">
        <div class="stat-card-title">
          <span class="title-icon" style="color: #fbbf24">🗓️</span>
          本月目标
        </div>
        <div class="target-item">
          <div class="target-header">
            <span class="target-label">减排目标</span>
            <span class="target-value">{{ stats.monthTarget.carbonReduction.current }}/{{ stats.monthTarget.carbonReduction.target }} kg</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(stats.monthTarget.carbonReduction.current / stats.monthTarget.carbonReduction.target) * 100}%`, background: '#22c55e' }"
            ></div>
          </div>
        </div>
        <div class="target-item">
          <div class="target-header">
            <span class="target-label">打卡次数</span>
            <span class="target-value">{{ stats.monthTarget.checkInTimes.current }}/{{ stats.monthTarget.checkInTimes.target }} 次</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(stats.monthTarget.checkInTimes.current / stats.monthTarget.checkInTimes.target) * 100}%`, background: '#fbbf24' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 最爱行为 -->
      <div class="stat-card">
        <div class="stat-card-title">
          <span class="title-icon" style="color: #ef4444">❤️</span>
          最爱行为
        </div>
        <div class="action-list">
          <div v-for="(action, index) in stats.favoriteActions" :key="index" class="action-tag">
            <span class="action-name">{{ action.name }}</span>
            <span class="action-count">{{ action.count }}次</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的成就 -->
    <div class="achievement-card">
      <div class="achievement-title">
        <span class="title-icon" style="color: #fbbf24">🎖️</span>
        我的成就
      </div>
      <div class="achievement-grid">
        <div v-for="achievement in achievements" :key="achievement.id" class="achievement-item" :class="{ locked: !achievement.unlocked }">
          <span class="achievement-icon">{{ achievement.icon }}</span>
          <div class="achievement-name">{{ achievement.name }}</div>
          <div class="achievement-desc">{{ achievement.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-card">
      <div class="activity-title">最近活动</div>
      <div class="activity-list">
        <div v-for="(activity, index) in activities" :key="index" class="activity-item">
          <div class="activity-left">
            <span class="activity-icon">🏅</span>
            <div class="activity-info">
              <div class="activity-name">{{ activity.name }}</div>
              <div class="activity-date">{{ activity.date }}</div>
            </div>
          </div>
          <div class="activity-points">+{{ activity.points }}分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 🔴 必须导入路由
import axios from 'axios'
import UserSidebar from '../../components/UserSidebar.vue'

const router = useRouter() // 🔴 获取路由实例

// 🔄 修复后的跳转函数
const goToReport = () => {
  router.push('/incident-reporting') // 跳转到事件上报
}

// 🔄 我的上报跳转函数（关键！）
const goToMyReport = () => {
  router.push('/myreport') // 跳转到我的上报 (路由要对应)
}

// 数据定义
const userInfo = ref({
  nickname: '环保达人',
  level: 5,
  joinTime: '2026年1月15日',
  totalPoints: 1950,
  continuousCheckIn: 47,
  totalCarbonReduction: 15.6,
  rank: 4
})

const stats = ref({
  level: 5,
  nextLevel: 6,
  needPoints: 350,
  monthTarget: {
    carbonReduction: { current: 5.2, target: 10 },
    checkInTimes: { current: 18, target: 30 }
  },
  favoriteActions: [
    { name: '公共交通', count: 23 },
    { name: '垃圾分类', count: 18 },
    { name: '步行出行', count: 15 }
  ]
})

const achievements = ref([])
const activities = ref([])

const fetchData = async () => {
  try {
    const userRes = await axios.get('/api/user/info')
    if (userRes.data?.data) userInfo.value = userRes.data.data

    const statsRes = await axios.get('/api/user/stats')
    if (statsRes.data?.data) stats.value = statsRes.data.data

    const achRes = await axios.get('/api/user/achievements')
    if (achRes.data?.data) achievements.value = achRes.data.data

    const actRes = await axios.get('/api/user/activities')
    if (actRes.data?.data) activities.value = actRes.data.data
  } catch (err) {
    console.error('数据加载失败', err)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* ====================== 基础样式：左导航不动 + 右侧铺满 ====================== */
.center-container {
  margin-left: 220px;
  padding: 24px 32px;
  background: #f8fdf6;
  min-height: 100vh;
  width: calc(100vw - 220px);
  box-sizing: border-box;
}
  
  .page-title {
    font-size: 32px;
    font-weight: 600;
    color: #166534;
    margin: 0 0 32px 0;
  }
  
  /* 用户信息卡片 */
  .user-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    width: 100%;
    box-sizing: border-box;
  }
  
  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(180deg, #22c55e 0%, #fbbf24 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .avatar-icon {
    font-size: 48px;
    color: white;
  }
  
  .user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .user-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .user-name {
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .user-level {
    background: #22c55e;
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 18px;
    font-weight: 600;
  }
  
  .user-join {
    font-size: 18px;
    color: #6b7280;
  }
  
  .user-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 16px;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: 700;
  }
  
  .stat-label {
    font-size: 16px;
    color: #4b5563;
  }
  
  .user-actions {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }
  
  .action-icon {
    font-size: 28px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .action-icon:hover {
    color: #22c55e;
  }
  
  /* 快捷操作 */
  .action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .action-card {
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    box-sizing: border-box;
  }
  
  .action-card.primary {
    background: linear-gradient(90deg, #22c55e 0%, #ca8a04 100%);
    color: white;
  }
  
  .action-card.outline {
    background: white;
    border: 3px solid #22c55e;
    color: #1f2937;
  }
  
  .action-icon {
    font-size: 36px;
    flex-shrink: 0;
  }
  
  .action-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .action-title {
    font-size: 24px;
    font-weight: 600;
  }
  
  .action-desc {
    font-size: 16px;
    opacity: 0.9;
  }
  
  /* 统计卡片 */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .stat-card-title {
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .title-icon {
    font-size: 24px;
  }
  
  .level-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .level-text {
    font-size: 18px;
    font-weight: 500;
    color: #4b5563;
  }
  
  .progress-bar {
    width: 100%;
    height: 16px;
    background: #e6f4e6;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    border-radius: 8px;
    transition: width 0.5s ease;
  }
  
  .progress-desc {
    font-size: 16px;
    color: #4b5563;
    margin-top: 8px;
  }
  
  .target-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .target-header {
    display: flex;
    justify-content: space-between;
  }
  
  .target-label {
    font-size: 18px;
    color: #4b5563;
  }
  
  .target-value {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .action-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .action-tag {
    background: #f0fdf4;
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .action-name {
    font-size: 18px;
    color: #1f2937;
    font-weight: 500;
  }
  
  .action-count {
    font-size: 18px;
    font-weight: 600;
    color: #22c55e;
  }
  
  /* 成就卡片 */
  .achievement-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    margin-bottom: 32px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .achievement-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .achievement-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .achievement-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: 16px;
    border: 2px solid #22c55e;
    background: #f0fdf4;
    transition: all 0.3s;
    width: 100%;
    box-sizing: border-box;
  }
  
  .achievement-item.locked {
    border-color: #e6f4e6;
    background: #f8fdf6;
    opacity: 0.5;
  }
  
  .achievement-icon {
    font-size: 48px;
  }
  
  .achievement-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .achievement-desc {
    font-size: 14px;
    color: #6b7280;
    text-align: center;
  }
  
  /* 活动卡片 */
  .activity-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    width: 100%;
    box-sizing: border-box;
  }
  
  .activity-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 24px;
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .activity-item {
    background: #f0fdf4;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .activity-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .activity-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(180deg, #22c55e 0%, #fbbf24 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
  }
  
  .activity-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .activity-name {
    font-size: 20px;
    font-weight: 500;
    color: #1f2937;
  }
  
  .activity-date {
    font-size: 16px;
    color: #6b7280;
  }
  
  .activity-points {
    font-size: 22px;
    font-weight: 600;
    color: #22c55e;
  }
  
  /* ====================== 自适应 + 铺满优化 ====================== */
  /* 大屏铺满 */
  @media (min-width: 1440px) {
    .center-container {
      padding: 32px 48px;
    }
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  /* 中屏适配 */
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .achievement-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  /* 平板适配 */
  @media (max-width: 768px) {
    .center-container {
      margin-left: 0;
      padding: 16px;
      width: 100vw;
    }
    .user-card {
      flex-direction: column;
      text-align: center;
    }
    .user-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    .action-row {
      grid-template-columns: 1fr;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .achievement-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* 手机适配 */
  @media (max-width: 480px) {
    .achievement-grid {
      grid-template-columns: 1fr;
    }
    .user-stats {
      grid-template-columns: 1fr;
    }
  }
  </style>