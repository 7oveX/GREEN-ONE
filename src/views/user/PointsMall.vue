<template>
    <div class="mall-container">
      <UserSidebar />
      <h1 class="page-title">积分商城</h1>
      <p class="page-subtitle">用积分兑换虚拟奖励，展示你的环保成就</p>
  
      <!-- 积分卡片 -->
      <div class="points-card">
        <div class="points-info">
          <div class="points-label">我的积分</div>
          <div class="points-value">{{ userPoints.toLocaleString() }}</div>
          <div class="points-tips">
            <span v-for="(tip, index) in pointsTips" :key="index" class="tip-item">
              <span class="tip-icon">{{ tip.icon }}</span>
              <span class="tip-text">{{ tip.text }}</span>
            </span>
          </div>
        </div>
        <div class="points-icon">🎁</div>
      </div>
  
      <!-- 商品列表 -->
      <div class="goods-grid">
        <div v-for="goods in goodsList" :key="goods.id" class="goods-card">
          <div class="goods-header">
            <span class="goods-icon" :style="{ color: goods.color }">{{ goods.icon }}</span>
            <div class="goods-price">
              <span class="price-label">所需积分</span>
              <span class="price-value">{{ goods.price }}</span>
            </div>
          </div>
          <div class="goods-body">
            <div class="goods-name">{{ goods.name }}</div>
            <div class="goods-desc">{{ goods.desc }}</div>
          </div>
          <div class="goods-footer">
            <div class="goods-stock">库存: {{ goods.stock }}+</div>
            <div class="goods-status">可兑换</div>
          </div>
          <button
            class="exchange-btn"
            :disabled="userPoints < goods.price"
            @click="handleExchange(goods)"
          >
            立即兑换
          </button>
        </div>
      </div>
  
      <!-- 兑换规则 -->
      <div class="rules-card">
        <h2 class="rules-title">兑换规则</h2>
        <ul class="rules-list">
          <li v-for="(rule, index) in exchangeRules" :key="index" class="rule-item">
            {{ rule }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import UserSidebar from '../../components/UserSidebar.vue'
  
  // 数据定义
  const userPoints = ref(1950)
  const pointsTips = ref([])
  const goodsList = ref([])
  const exchangeRules = ref([])
  
  // 获取数据
  const fetchData = async () => {
    // 积分信息
    const pointsRes = await axios.get('/api/points/info')
    userPoints.value = pointsRes.data.data.points
    pointsTips.value = pointsRes.data.data.tips
  
    // 商品列表
    const goodsRes = await axios.get('/api/points/goods')
    goodsList.value = goodsRes.data.data
  
    // 兑换规则
    const rulesRes = await axios.get('/api/points/rules')
    exchangeRules.value = rulesRes.data.data
  }
  
  // 处理兑换
  const handleExchange = async (goods) => {
    if (userPoints.value < goods.price) {
      alert('积分不足，无法兑换')
      return
    }
  
    const confirm = window.confirm(`确认兑换「${goods.name}」，将扣除${goods.price}积分？`)
    if (!confirm) return
  
    const res = await axios.post('/api/points/exchange', {
      goodsId: goods.id,
      price: goods.price
    })
  
    if (res.data.data.success) {
      alert(res.data.data.message)
      userPoints.value = res.data.data.newPoints
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>
  
  <style scoped>
  .mall-container {
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
    margin: 0 0 8px 0;
  }
  
  .page-subtitle {
    font-size: 18px;
    color: #4b5563;
    margin: 0 0 32px 0;
  }
  
  /* 积分卡片 */
  .points-card {
    background: linear-gradient(90deg, #22c55e 0%, #ca8a04 100%);
    border-radius: 24px;
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  
  .points-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .points-label {
    font-size: 22px;
    color: white;
    font-weight: 500;
  }
  
  .points-value {
    font-size: 48px;
    font-weight: 700;
    color: white;
  }
  
  .points-tips {
    display: flex;
    gap: 16px;
    margin-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.3);
    padding-top: 16px;
  }
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 16px;
  }
  
  .tip-icon {
    font-size: 18px;
  }
  
  .points-icon {
    font-size: 64px;
    color: white;
  }
  
  /* 商品列表 */
  .goods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .goods-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .goods-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .goods-icon {
    font-size: 40px;
  }
  
  .goods-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  
  .price-label {
    font-size: 16px;
    color: #6b7280;
  }
  
  .price-value {
    font-size: 28px;
    font-weight: 600;
    color: #22c55e;
  }
  
  .goods-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .goods-name {
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .goods-desc {
    font-size: 16px;
    color: #4b5563;
    line-height: 1.5;
  }
  
  .goods-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }
  
  .goods-stock {
    font-size: 16px;
    color: #6b7280;
  }
  
  .goods-status {
    font-size: 16px;
    font-weight: 500;
    color: #22c55e;
  }
  
  .exchange-btn {
    width: 100%;
    height: 56px;
    background: linear-gradient(90deg, #22c55e 0%, #ca8a04 100%);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 8px;
  }
  
  .exchange-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .exchange-btn:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  /* 兑换规则 */
  .rules-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  .rules-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 20px 0;
  }
  
  .rules-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .rule-item {
    font-size: 18px;
    color: #4b5563;
    line-height: 1.6;
    padding-left: 16px;
    position: relative;
  }
  
  .rule-item::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #22c55e;
    font-weight: 700;
    font-size: 20px;
  }
  </style>