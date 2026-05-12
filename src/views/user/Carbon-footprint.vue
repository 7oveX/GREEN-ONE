<template>
    <div class="carbon-container">
      <UserSidebar />
      <h1 class="page-title">碳足迹计算</h1>
  
      <div class="main-content">
        <!-- 左侧：碳足迹计算表单 -->
        <div class="left-section">
          <div class="form-card">
            <h2 class="card-title">
              <span class="title-icon">🧾</span>
              计算您的月度碳足迹
            </h2>
  
            <div class="form-group">
              <label class="form-label">交通方式</label>
              <select v-model="formData.transport" class="form-select">
                <option value="">选择交通方式</option>
                <option v-for="item in transportOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
  
            <div class="form-group">
              <label class="form-label">每日通勤距离 (公里)</label>
              <input
                v-model.number="formData.distance"
                type="number"
                class="form-input"
                placeholder="例如: 10"
                min="0"
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">月用电量 (千瓦时)</label>
              <input
                v-model.number="formData.electricity"
                type="number"
                class="form-input"
                placeholder="例如: 150"
                min="0"
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">月燃气用量 (立方米)</label>
              <input
                v-model.number="formData.gas"
                type="number"
                class="form-input"
                placeholder="例如: 20"
                min="0"
              />
            </div>
  
            <div class="form-group">
              <label class="form-label">周均肉类消费 (公斤)</label>
              <input
                v-model.number="formData.meat"
                type="number"
                class="form-input"
                placeholder="例如: 2"
                min="0"
                step="0.1"
              />
            </div>
  
            <button class="submit-btn" @click="calculateCarbon">
              计算碳足迹
            </button>
          </div>
        </div>
  
        <!-- 右侧：碳足迹分析 -->
        <div class="right-section">
          <!-- 平均碳排放分布 -->
          <div class="chart-card">
            <h2 class="card-title">平均月度碳排放分布</h2>
            <div ref="pieChartRef" class="chart-container"></div>
            <div class="total-emission">
              <span class="total-label">平均总排放</span>
              <span class="total-value">{{ averageData.total.toFixed(1) }} kg CO₂/月</span>
            </div>
          </div>
  
          <!-- 减排小贴士 -->
          <div class="tips-card">
            <h2 class="card-title">
              <span class="title-icon">🌱</span>
              减排小贴士
            </h2>
            <div class="tips-list">
              <div v-for="tip in tips" :key="tip.id" class="tip-item">
                <div class="tip-icon" :style="{ backgroundColor: '#22c55e' }">
                  {{ tip.icon }}
                </div>
                <div class="tip-content">
                  <div class="tip-title">{{ tip.title }}</div>
                  <div class="tip-text">{{ tip.content }}</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 碳排放对比 -->
          <div class="compare-card" v-if="calculatedResult">
            <h2 class="card-title">碳排放对比</h2>
            <div class="compare-item">
              <div class="compare-label">您的排放</div>
              <div class="compare-value" style="color: #22c55e">
                {{ calculatedResult.total.toFixed(1) }} kg
              </div>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${(calculatedResult.total / averageData.nationalAverage) * 100}%` }"
              ></div>
            </div>
  
            <div class="compare-item">
              <div class="compare-label">全国平均</div>
              <div class="compare-value" style="color: #6b7280">
                {{ averageData.nationalAverage.toFixed(1) }} kg
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 100%; background: #e5e7eb"></div>
            </div>
  
            <div class="compare-result">
              您比平均水平少排放 {{ ((averageData.nationalAverage - calculatedResult.total) / averageData.nationalAverage * 100).toFixed(1) }}%！
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import axios from 'axios'
  import * as echarts from 'echarts'
  import UserSidebar from '../../components/UserSidebar.vue'
  
  
  // 数据定义
  const transportOptions = ref([])
  const averageData = ref({
    total: 125.0,
    distribution: [],
    nationalAverage: 200.0
  })
  const tips = ref([])
  const pieChartRef = ref(null)
  let pieChart = null
  
  // 表单数据
  const formData = ref({
    transport: '',
    distance: 0,
    electricity: 0,
    gas: 0,
    meat: 0
  })
  
  // 计算结果
  const calculatedResult = ref(null)
  
  // 碳排放系数
  const emissionFactors = {
    electricity: 0.785, // 每度电碳排放 kg
    gas: 2.1,          // 每立方米燃气碳排放 kg
    meat: 2.5 * 4      // 每公斤肉每周，月度碳排放 kg (4周)
  }
  
  // 获取数据
  const fetchData = async () => {
    // 交通方式
    const transportRes = await axios.get('/api/carbon/transport-options')
    transportOptions.value = transportRes.data.data
  
    // 平均碳排放
    const averageRes = await axios.get('/api/carbon/average')
    averageData.value = averageRes.data.data
  
    // 减排小贴士
    const tipsRes = await axios.get('/api/carbon/tips')
    tips.value = tipsRes.data.data
  
    // 初始化饼图
    await nextTick()
    initPieChart()
  }
  
  // 初始化饼图
  const initPieChart = () => {
    if (!pieChartRef.value) return
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      series: [{
        name: '碳排放分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true,
          formatter: '{b} {d}%',
          fontSize: 18,
          color: (params) => params.data.color
        },
        data: averageData.value.distribution.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        }))
      }]
    })
  }
  
  // 计算碳足迹
  const calculateCarbon = () => {
    const transport = transportOptions.value.find(item => item.id === Number(formData.value.transport))
    if (!transport) {
      alert('请选择交通方式')
      return
    }
  
    // 计算各部分碳排放
    const transportEmission = transport.factor * formData.value.distance * 30 // 月度
    const electricityEmission = formData.value.electricity * emissionFactors.electricity
    const gasEmission = formData.value.gas * emissionFactors.gas
    const meatEmission = formData.value.meat * emissionFactors.meat
  
    const total = transportEmission + electricityEmission + gasEmission + meatEmission
  
    calculatedResult.value = {
      total,
      transport: transportEmission,
      electricity: electricityEmission,
      gas: gasEmission,
      meat: meatEmission
    }
  }
  
  // 窗口大小变化时自适应图表
  const resizeChart = () => {
    pieChart?.resize()
  }
  
  onMounted(() => {
    fetchData()
    window.addEventListener('resize', resizeChart)
  })
  </script>
  
  <style scoped>
  .carbon-container {
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
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  
  /* 左侧表单 */
  .left-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .form-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .card-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 32px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .title-icon {
    font-size: 24px;
  }
  
  .form-group {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .form-label {
    font-size: 18px;
    font-weight: 500;
    color: #1f2937;
  }
  
  .form-select, .form-input {
    height: 56px;
    padding: 0 16px;
    border: 2px solid #e6f4e6;
    border-radius: 16px;
    font-size: 18px;
    outline: none;
    transition: all 0.3s;
    background: white;
  }
  
  .form-select:focus, .form-input:focus {
    border-color: #22c55e;
  }
  
  .submit-btn {
    width: 100%;
    height: 64px;
    background: linear-gradient(90deg, #22c55e 0%, #fbbf24 100%);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 22px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 16px;
  }
  
  .submit-btn:hover {
    opacity: 0.9;
  }
  
  /* 右侧分析 */
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .chart-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .chart-container {
    width: 100%;
    height: 300px;
    margin-bottom: 24px;
  }
  
  .total-emission {
    text-align: center;
  }
  
  .total-label {
    font-size: 18px;
    color: #6b7280;
    display: block;
    margin-bottom: 8px;
  }
  
  .total-value {
    font-size: 36px;
    font-weight: 600;
    color: #1f2937;
  }
  
  /* 减排小贴士 */
  .tips-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .tip-item {
    background: #f0fdf4;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .tip-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
  }
  
  .tip-content {
    flex: 1;
  }
  
  .tip-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }
  
  .tip-text {
    font-size: 16px;
    color: #4b5563;
  }
  
  /* 碳排放对比 */
  .compare-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .compare-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .compare-label {
    font-size: 20px;
    color: #4b5563;
  }
  
  .compare-value {
    font-size: 28px;
    font-weight: 600;
  }
  
  .progress-bar {
    width: 100%;
    height: 16px;
    background: #e6f4e6;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  
  .progress-fill {
    height: 100%;
    background: #22c55e;
    border-radius: 8px;
    transition: width 0.5s ease;
  }
  
  .compare-result {
    background: #f0fdf4;
    border-radius: 16px;
    padding: 16px 24px;
    font-size: 24px;
    font-weight: 600;
    color: #166534;
    text-align: center;
    margin-top: 16px;
  }
  </style>