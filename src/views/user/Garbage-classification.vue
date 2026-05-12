<template>
    <div class="garbage-query-container">
      <UserSidebar />
      <!-- 搜索区域 -->
      <div class="search-card">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchName"
            type="text"
            placeholder="输入垃圾名称，如：塑料瓶、电池、苹果核..."
            class="search-input"
            @keyup.enter="handleQuery"
          />
        </div>
        <div class="search-buttons">
          <button class="btn-query" @click="handleQuery">查询</button>
          <button class="btn-voice">🎤</button>
        </div>
      </div>
  
      <!-- 最近查询 -->
      <div class="history-section">
        <span class="history-label">最近查询</span>
        <div class="history-tags">
          <span
            v-for="item in historyList"
            :key="item"
            class="history-tag"
            @click="handleHistoryClick(item)"
          >
            {{ item }}
          </span>
        </div>
      </div>
  
      <!-- 查询结果 -->
      <div v-if="queryResult" class="result-card">
        <div class="result-icon">{{ queryResult.icon }}</div>
        <div class="result-name">{{ queryResult.name }}</div>
        <div
          class="result-type"
          :style="{ backgroundColor: queryResult.typeColor }"
        >
          {{ queryResult.type }}
        </div>
        <div class="result-tip">
          <span class="tip-icon">🌱</span>
          <div class="tip-content">
            <div class="tip-title">投放提示</div>
            <div class="tip-text">{{ queryResult.tip }}</div>
          </div>
        </div>
      </div>
  
      <!-- 分类指南 -->
      <div class="guide-card">
        <h3 class="guide-title">分类指南</h3>
        <div class="category-list">
          <div
            v-for="item in guideData.categories"
            :key="item.name"
            class="category-item"
          >
            <div class="category-icon" :style="{ backgroundColor: item.color }">
              {{ item.icon }}
            </div>
            <div class="category-name">{{ item.name }}</div>
            <div class="category-items">
              <span v-for="subItem in item.items" :key="subItem" class="item-tag">
                {{ subItem }}
              </span>
            </div>
          </div>
        </div>
  
        <div class="tip-list">
          <div
            v-for="tip in guideData.tips"
            :key="tip.title"
            class="tip-card"
          >
            <div class="tip-card-icon" :style="{ backgroundColor: tip.color }">
              {{ tip.icon }}
            </div>
            <div class="tip-card-content">
              <div class="tip-card-title">{{ tip.title }}</div>
              <div class="tip-card-text">{{ tip.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import UserSidebar from '../../components/UserSidebar.vue'
  
  const searchName = ref('')
  const historyList = ref([])
  const guideData = ref({
    categories: [],
    tips: []
  })
  const queryResult = ref(null)
  
  // 获取分类指南数据
  const fetchGuideData = async () => {
    const res = await axios.get('/api/garbage/guide')
    guideData.value = res.data.data
  }
  
  // 获取最近查询
  const fetchHistory = async () => {
    const res = await axios.get('/api/garbage/history')
    historyList.value = res.data.data
  }
  
  // 处理查询
  const handleQuery = async () => {
    if (!searchName.value.trim()) return
    const res = await axios.get(`/api/garbage/query?name=${searchName.value}`)
    queryResult.value = res.data.data
    // 更新最近查询
    if (!historyList.value.includes(searchName.value)) {
      historyList.value.unshift(searchName.value)
      if (historyList.value.length > 4) {
        historyList.value.pop()
      }
    }
  }
  
  // 点击历史记录
  const handleHistoryClick = (name) => {
    searchName.value = name
    handleQuery()
  }
  
  onMounted(() => {
    fetchGuideData()
    fetchHistory()
  })
  </script>
  
  <style scoped>
  .garbage-query-container {
    margin-left: 220px;
    padding: 24px 32px;
    background: #f8fdf6;
    min-height: 100vh;
  }
  
  /* 搜索区域 */
  .search-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .search-input-wrapper {
    flex: 1;
    position: relative;
  }
  
  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #6b7280;
  }
  
  .search-input {
    width: 100%;
    height: 56px;
    padding: 0 16px 0 48px;
    border: 2px solid #e6f4e6;
    border-radius: 16px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s;
  }
  
  .search-input:focus {
    border-color: #22c55e;
  }
  
  .search-buttons {
    display: flex;
    gap: 12px;
  }
  
  .btn-query {
    width: 100px;
    height: 56px;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-query:hover {
    background: #16a34a;
  }
  
  .btn-voice {
    width: 80px;
    height: 56px;
    background: #fbbf24;
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-voice:hover {
    background: #f59e0b;
  }
  
  /* 最近查询 */
  .history-section {
    margin-bottom: 24px;
  }
  
  .history-label {
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 12px;
    display: block;
  }
  
  .history-tags {
    display: flex;
    gap: 12px;
  }
  
  .history-tag {
    padding: 8px 20px;
    background: #e6f4e6;
    color: #166534;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .history-tag:hover {
    background: #22c55e;
    color: white;
  }
  
  /* 查询结果 */
  .result-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .result-icon {
    font-size: 80px;
  }
  
  .result-name {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .result-type {
    padding: 12px 40px;
    border-radius: 30px;
    font-size: 20px;
    font-weight: 600;
    color: white;
  }
  
  .result-tip {
    width: 100%;
    background: #f0fdf4;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 16px;
  }
  
  .tip-icon {
    font-size: 24px;
    color: #22c55e;
    margin-top: 4px;
  }
  
  .tip-content {
    flex: 1;
  }
  
  .tip-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }
  
  .tip-text {
    font-size: 16px;
    color: #4b5563;
  }
  
  /* 分类指南 */
  .guide-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .guide-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 24px 0;
  }
  
  .category-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .category-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: white;
  }
  
  .category-name {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .category-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .item-tag {
    font-size: 16px;
    color: #4b5563;
  }
  
  .tip-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .tip-card {
    background: #f8fdf6;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  
  .tip-card-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #166534;
    flex-shrink: 0;
  }
  
  .tip-card-content {
    flex: 1;
  }
  
  .tip-card-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }
  
  .tip-card-text {
    font-size: 16px;
    color: #4b5563;
    line-height: 1.6;
  }
  </style>