<template>
    <div class="checkin-container">
      <UserSidebar />
      <h1 class="page-title">环保打卡</h1>
  
      <div class="main-content">
        <!-- 左侧：今日打卡 -->
        <div class="left-section">
          <div class="checkin-card">
            <h2 class="card-title">
              <span class="title-icon">✅</span>
              今日打卡
            </h2>
  
            <div class="options-grid">
              <div
                v-for="item in checkinOptions"
                :key="item.id"
                class="option-item"
                :class="{ selected: selectedIds.has(item.id) }"
                @click="toggleSelect(item)"
              >
                <span class="option-icon" :style="{ color: item.color }">{{ item.icon }}</span>
                <div class="option-info">
                  <div class="option-name">{{ item.name }}</div>
                  <div class="option-score">+{{ item.score }}分</div>
                </div>
              </div>
            </div>
  
            <div class="score-summary">
              <div class="summary-label">今日可获得积分</div>
              <div class="summary-value">{{ totalScore }}</div>
            </div>
  
            <button class="submit-btn" @click="handleSubmit" :disabled="totalScore === 0">
              确认打卡
            </button>
          </div>
  
          <!-- 统计卡片 -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-value" style="color: #22c55e">{{ stats.continuousDays }}</div>
              <div class="stat-label">连续天数</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" style="color: #fbbf24">{{ stats.totalCheckIn }}</div>
              <div class="stat-label">总打卡</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" style="color: #22c55e">{{ stats.totalPoints.toLocaleString() }}</div>
              <div class="stat-label">累计积分</div>
            </div>
          </div>
  
          <!-- 最近打卡记录 -->
          <div class="records-card">
            <h3 class="card-title">最近打卡记录</h3>
            <div class="records-list">
              <div v-for="(record, index) in records" :key="index" class="record-item">
                <div class="record-date">{{ record.date }}</div>
                <div class="record-items">
                  <span v-for="item in record.items" :key="item" class="item-tag">{{ item }}</span>
                </div>
                <div class="record-score">+{{ record.score }}分</div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 右侧：打卡日历 & 本月成就 -->
        <div class="right-section">
          <div class="calendar-card">
            <h2 class="card-title">
              <span class="title-icon">📅</span>
              打卡日历
            </h2>
            <div class="calendar-header">{{ calendar.year }}年{{ calendar.month }}月</div>
            <div class="calendar-weekdays">
              <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
            </div>
            <div class="calendar-days">
              <!-- 空白占位 -->
              <div v-for="i in 2" :key="`empty-${i}`" class="calendar-day empty"></div>
              <!-- 日期 -->
              <div
                v-for="day in 30"
                :key="day"
                class="calendar-day"
                :class="{ checked: calendar.checkedDays.includes(day) }"
              >
                {{ day }}
              </div>
            </div>
  
            <!-- 本月成就 -->
            <div class="achievement-card">
              <div class="achievement-item">
                <span class="achievement-label">打卡天数</span>
                <span class="achievement-value" style="color: #22c55e">{{ stats.monthCheckInDays }}/30天</span>
              </div>
              <div class="achievement-item">
                <span class="achievement-label">最长连续</span>
                <span class="achievement-value" style="color: #fbbf24">{{ stats.maxContinuousDays }}天</span>
              </div>
              <div class="achievement-item">
                <span class="achievement-label">本月积分</span>
                <span class="achievement-value" style="color: #22c55e">{{ stats.monthPoints }}分</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import UserSidebar from '../../components/UserSidebar.vue'
  
  // 数据定义
  const checkinOptions = ref([])
  const selectedIds = ref(new Set())
  const calendar = ref({ year: 2026, month: 4, checkedDays: [] })
  const stats = ref({
    continuousDays: 0,
    totalCheckIn: 0,
    totalPoints: 0,
    monthCheckInDays: 0,
    maxContinuousDays: 0,
    monthPoints: 0
  })
  const records = ref([])
  
  // 计算总积分
  const totalScore = computed(() => {
    return checkinOptions.value
      .filter(item => selectedIds.value.has(item.id))
      .reduce((sum, item) => sum + item.score, 0)
  })
  
  // 切换选择
  const toggleSelect = (item) => {
    const newSet = new Set(selectedIds.value)
    if (newSet.has(item.id)) {
      newSet.delete(item.id)
    } else {
      newSet.add(item.id)
    }
    selectedIds.value = newSet
  }
  
  // 获取数据
  const fetchData = async () => {
    // 打卡选项
    const optionsRes = await axios.get('/api/checkin/options')
    checkinOptions.value = optionsRes.data.data
  
    // 日历数据
    const calendarRes = await axios.get('/api/checkin/calendar')
    calendar.value = calendarRes.data.data
  
    // 统计数据
    const statsRes = await axios.get('/api/checkin/stats')
    stats.value = statsRes.data.data
  
    // 打卡记录
    const recordsRes = await axios.get('/api/checkin/records')
    records.value = recordsRes.data.data
  }
  
  // 提交打卡
  const handleSubmit = async () => {
    const selectedItems = checkinOptions.value.filter(item => selectedIds.value.has(item.id))
    if (selectedItems.length === 0) return
  
    const res = await axios.post('/api/checkin/submit', { items: selectedItems })
    if (res.data.data.success) {
      alert(`打卡成功！获得${res.data.data.addScore}积分`)
      // 刷新数据
      fetchData()
      // 清空选择
      selectedIds.value = new Set()
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>
  
  <style scoped>
  .checkin-container {
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
  
  /* 左侧区域 */
  .left-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .checkin-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .card-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 24px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .title-icon {
    font-size: 24px;
  }
  
  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .option-item {
    background: white;
    border: 2px solid #e6f4e6;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .option-item.selected {
    border-color: #22c55e;
    background: #f0fdf4;
  }
  
  .option-item:hover {
    border-color: #22c55e;
  }
  
  .option-icon {
    font-size: 40px;
  }
  
  .option-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .option-name {
    font-size: 20px;
    font-weight: 500;
    color: #1f2937;
  }
  
  .option-score {
    font-size: 16px;
    color: #6b7280;
  }
  
  .score-summary {
    background: linear-gradient(90deg, #f0fdf4 0%, #fef9c3 100%);
    border-radius: 16px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .summary-label {
    font-size: 20px;
    font-weight: 500;
    color: #1f2937;
  }
  
  .summary-value {
    font-size: 28px;
    font-weight: 600;
    color: #22c55e;
  }
  
  .submit-btn {
    width: 100%;
    height: 56px;
    background: linear-gradient(90deg, #22c55e 0%, #fbbf24 100%);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .submit-btn:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  /* 统计行 */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: 600;
  }
  
  .stat-label {
    font-size: 16px;
    color: #4b5563;
  }
  
  /* 打卡记录 */
  .records-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .records-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .record-item {
    background: #f0fdf4;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .record-date {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    min-width: 120px;
  }
  
  .record-items {
    flex: 1;
    display: flex;
    gap: 12px;
    margin: 0 20px;
  }
  
  .item-tag {
    background: #dcfce7;
    color: #166534;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 16px;
  }
  
  .record-score {
    font-size: 20px;
    font-weight: 600;
    color: #22c55e;
    min-width: 80px;
    text-align: right;
  }
  
  /* 右侧区域 */
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .calendar-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .calendar-header {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .calendar-weekdays span {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #6b7280;
    padding: 8px 0;
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 32px;
  }
  
  .calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 500;
    color: #1f2937;
    background: #f0fdf4;
    border-radius: 12px;
    transition: all 0.3s;
  }
  
  .calendar-day.empty {
    background: transparent;
  }
  
  .calendar-day.checked {
    background: linear-gradient(180deg, #22c55e 0%, #fbbf24 100%);
    color: white;
  }
  
  /* 本月成就 */
  .achievement-card {
    background: #f0fdf4;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .achievement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .achievement-label {
    font-size: 18px;
    color: #4b5563;
  }
  
  .achievement-value {
    font-size: 20px;
    font-weight: 600;
  }
  </style>