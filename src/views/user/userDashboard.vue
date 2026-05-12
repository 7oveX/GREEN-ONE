<template>
  <div class="dashboard-container">
    <UserSidebar />
    <div class="page-header">
      <h1 class="page-title">环保数据大屏</h1>
      <p class="page-subtitle">实时监控您的环保行为和贡献</p>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="overview-card card-green">
        <div class="card-icon icon-green">🌱</div>
        <div class="card-content">
          <p class="card-label">本周碳减排</p>
          <p class="card-value">{{ overview.carbonReduction }} kg</p>
        </div>
        <span class="card-trend">↗</span>
      </div>
      <div class="overview-card card-yellow">
        <div class="card-icon icon-yellow">💧</div>
        <div class="card-content">
          <p class="card-label">节约用水</p>
          <p class="card-value">{{ overview.waterSaving }} L</p>
        </div>
        <span class="card-trend trend-yellow">↗</span>
      </div>
      <div class="overview-card card-green">
        <div class="card-icon icon-green">⚡</div>
        <div class="card-content">
          <p class="card-label">节约电量</p>
          <p class="card-value">{{ overview.powerSaving }} kWh</p>
        </div>
        <span class="card-trend">↗</span>
      </div>
      <div class="overview-card card-orange">
        <div class="card-icon icon-orange">🍃</div>
        <div class="card-content">
          <p class="card-label">环保积分</p>
          <p class="card-value">{{ overview.points }}</p>
        </div>
        <span class="card-trend trend-orange">↗</span>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <div class="chart-card">
        <h3 class="chart-title">碳足迹趋势</h3>
        <div ref="carbonChartRef" class="chart-container"></div>
      </div>
      <div class="chart-card">
        <h3 class="chart-title">环保行为分布</h3>
        <div ref="behaviorChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 排行榜 & 步数统计 -->
    <div class="bottom-section">
      <div class="rank-card">
        <h3 class="card-title">用户排行榜</h3>
        <div class="rank-list">
          <div v-for="item in rankList" :key="item.rank" class="rank-item" :class="{ 'rank-first': item.rank === 1 }">
            <div class="rank-number">{{ item.rank }}</div>
            <div class="rank-info">
              <span class="rank-name">{{ item.name }}</span>
              <span class="rank-level">{{ item.level }}</span>
            </div>
            <span class="rank-score">{{ item.score }}分</span>
          </div>
        </div>
      </div>
      <div class="step-card">
        <h3 class="card-title">每日步数统计</h3>
        <div ref="stepChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import UserSidebar from '../../components/UserSidebar.vue'

// 数据定义
const overview = ref({
  carbonReduction: 0,
  waterSaving: 0,
  powerSaving: 0,
  points: 0
})
const carbonTrend = ref({ dates: [], values: [] })
const behaviorData = ref([])
const rankList = ref([])
const stepData = ref({ dates: [], values: [] })

// 图表实例
const carbonChartRef = ref(null)
const behaviorChartRef = ref(null)
const stepChartRef = ref(null)
let carbonChart = null
let behaviorChart = null
let stepChart = null

// 获取数据
const fetchData = async () => {
  // 概览数据
  const overviewRes = await axios.get('/api/dashboard/overview')
  overview.value = overviewRes.data.data

  // 碳足迹趋势
  const carbonRes = await axios.get('/api/dashboard/carbonTrend')
  carbonTrend.value = carbonRes.data.data

  // 环保行为分布
  const behaviorRes = await axios.get('/api/dashboard/behaviorDistribution')
  behaviorData.value = behaviorRes.data.data

  // 排行榜
  const rankRes = await axios.get('/api/dashboard/rankList')
  rankList.value = rankRes.data.data

  // 步数统计
  const stepRes = await axios.get('/api/dashboard/stepCount')
  stepData.value = stepRes.data.data

  // 初始化图表
  initCharts()
}

// 初始化图表
const initCharts = () => {
  // 碳足迹趋势图
  carbonChart = echarts.init(carbonChartRef.value)
  carbonChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '10%', right: '5%', bottom: '10%', top: '10%' },
    xAxis: {
      type: 'category',
      data: carbonTrend.value.dates,
      axisLine: { lineStyle: { color: '#94a3b8' } }
    },
    yAxis: {
      type: 'value',
      max: 360,
      min: 0,
      axisLine: { lineStyle: { color: '#94a3b8' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }
    },
    series: [{
      name: '碳排放(kg)',
      type: 'line',
      data: carbonTrend.value.values,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#22c55e' },
      lineStyle: { color: '#22c55e', width: 3 }
    }]
  })

  // 环保行为分布饼图
  behaviorChart = echarts.init(behaviorChartRef.value)
  behaviorChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: { color: '#374151' }
    },
    series: [{
      name: '环保行为',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: {
        show: true,
        formatter: '{b} {d}%',
        fontSize: 14,
        color: '#374151'
      },
      data: behaviorData.value.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: item.color }
      }))
    }]
  })

  // 每日步数柱状图
  stepChart = echarts.init(stepChartRef.value)
  stepChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '10%', right: '5%', bottom: '10%', top: '10%' },
    xAxis: {
      type: 'category',
      data: stepData.value.dates,
      axisLine: { lineStyle: { color: '#94a3b8' } }
    },
    yAxis: {
      type: 'value',
      max: 12000,
      min: 0,
      axisLine: { lineStyle: { color: '#94a3b8' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }
    },
    series: [{
      name: '步数',
      type: 'bar',
      data: stepData.value.values,
      itemStyle: { color: '#fbbf24', borderRadius: [4, 4, 0, 0] },
      barWidth: '40%'
    }]
  })
}

// 窗口大小变化时自适应图表
const resizeCharts = () => {
  carbonChart?.resize()
  behaviorChart?.resize()
  stepChart?.resize()
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', resizeCharts)
})
</script>

<style scoped>
/* ====================== 关键：铺满屏幕 ====================== */
.dashboard-container {
  margin-left: 220px;
    padding: 24px 32px;
    background: #f8fdf6;
    min-height: 100vh;
    width: calc(100vw - 220px); 
    box-sizing: border-box; 
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #166534;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #65a30d;
  margin: 0;
}

/* 概览卡片 - 铺满版 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: 100%;
  box-sizing: border-box;
}

.card-green {
  border-left: 4px solid #22c55e;
}

.card-yellow {
  border-left: 4px solid #fbbf24;
}

.card-orange {
  border-left: 4px solid #f97316;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.icon-green {
  background: #dcfce7;
  color: #22c55e;
}

.icon-yellow {
  background: #fef3c7;
  color: #fbbf24;
}

.icon-orange {
  background: #fef3c7;
  color: #f97316;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-trend {
  font-size: 20px;
  color: #22c55e;
}

.trend-yellow {
  color: #fbbf24;
}

.trend-orange {
  color: #f97316;
}

/* 图表区域 */
.chart-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: 100%;
  box-sizing: border-box;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.chart-container {
  width: 100%;
  height: 300px;
}

/* 底部区域 */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
}

.rank-card, .step-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: 100%;
  box-sizing: border-box;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
}

.rank-item.rank-first {
  background: #e6f4e6;
}

.rank-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #94a3b8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.rank-item.rank-first .rank-number {
  background: #fbbf24;
}

.rank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rank-name {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.rank-level {
  font-size: 13px;
  color: #6b7280;
}

.rank-score {
  font-size: 16px;
  font-weight: 600;
  color: #22c55e;
}

/* ====================== 自适应：平板/手机 ====================== */
@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  .overview-cards {
    grid-template-columns: 1fr;
  }
  .chart-section {
    grid-template-columns: 1fr;
  }
  .bottom-section {
    grid-template-columns: 1fr;
  }
}
</style>