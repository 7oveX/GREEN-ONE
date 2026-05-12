<template>
    <div class="report-list-container">
      <UserSidebar />
      <div class="page-header">
        <h1 class="page-title">我的上报</h1>
        <p class="page-subtitle">查看您上报的环保事件处理进度</p>
      </div>
  
      <!-- 统计概览卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <p class="stat-label">总上报数</p>
          <p class="stat-value">{{ stats.total }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">处理中</p>
          <p class="stat-value" style="color: #ef4444">{{ stats.processing }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">已完成</p>
          <p class="stat-value" style="color: #22c55e">{{ stats.completed }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">已驳回</p>
          <p class="stat-value" style="color: #ef4444">{{ stats.rejected }}</p>
        </div>
      </div>
  
      <!-- 上报记录列表 -->
      <div class="report-list-card">
        <h3 class="card-title">上报记录</h3>
        <div class="report-list">
          <div v-for="item in reportList" :key="item.id" class="report-item">
            <div class="item-header">
              <div class="item-title">
                <span class="item-name">{{ item.title }}</span>
                <span class="status-tag" :class="getStatusClass(item.status)">
                  {{ item.statusText }}
                </span>
              </div>
              <button class="detail-btn">👁 查看详情</button>
            </div>
  
            <div class="item-info">
              <span class="info-item">工单号：{{ item.orderNo }}</span>
              <span class="info-item">类型：{{ item.type }}</span>
              <span class="info-item">位置：{{ item.location }}</span>
            </div>
  
            <div class="item-time">
              <span class="time-item">上报时间：{{ item.createTime }}</span>
              <span class="time-item">更新时间：{{ item.updateTime }}</span>
            </div>
  
            <!-- 处理结果/驳回原因 -->
            <div v-if="item.result" class="result-box" :class="getResultClass(item.status)">
              {{ item.result }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import UserSidebar from '../../components/UserSidebar.vue'
  
  // 模拟数据（和你截图完全一致）
  const stats = ref({
    total: 5,
    processing: 2,
    completed: 1,
    rejected: 1
  })
  
  const reportList = ref([
    {
      id: 1,
      title: '公园内垃圾桶满溢',
      status: 'completed',
      statusText: '已完成',
      orderNo: 'EP20260409001',
      type: '垃圾乱放',
      location: '朝阳公园东门',
      createTime: '2026-04-08 10:30',
      updateTime: '2026-04-09 14:20',
      result: '处理结果：已清理垃圾桶并增加清理频次'
    },
    {
      id: 2,
      title: '河道发现污水排放',
      status: 'processing',
      statusText: '处理中',
      orderNo: 'EP20260408002',
      type: '水污染',
      location: '清河河道',
      createTime: '2026-04-07 15:20',
      updateTime: '2026-04-08 09:15',
      result: ''
    },
    {
      id: 3,
      title: '夜间施工噪音扰民',
      status: 'assigned',
      statusText: '已派单',
      orderNo: 'EP20260407003',
      type: '噪音污染',
      location: '望京SOHO',
      createTime: '2026-04-06 22:00',
      updateTime: '2026-04-07 08:30',
      result: ''
    },
    {
      id: 4,
      title: '小区垃圾分类不规范',
      status: 'rejected',
      statusText: '已驳回',
      orderNo: 'EP20260406004',
      type: '垃圾乱放',
      location: '阳光小区',
      createTime: '2026-04-05 18:40',
      updateTime: '2026-04-06 10:00',
      result: '驳回原因：照片不清晰，无法判断具体问题，请重新上报'
    },
    {
      id: 5,
      title: '工地扬尘污染',
      status: 'auditing',
      statusText: '审核中',
      orderNo: 'EP20260405005',
      type: '其他',
      location: '建国门外大街',
      createTime: '2026-04-04 11:20',
      updateTime: '2026-04-04 16:30',
      result: ''
    }
  ])
  
  // 状态样式映射
  const getStatusClass = (status) => {
    const statusMap = {
      completed: 'status-completed',
      processing: 'status-processing',
      assigned: 'status-assigned',
      rejected: 'status-rejected',
      auditing: 'status-auditing'
    }
    return statusMap[status] || 'status-processing'
  }
  
  // 结果框样式映射
  const getResultClass = (status) => {
    return status === 'rejected' ? 'result-rejected' : 'result-completed'
  }
  </script>
  
  <style scoped>
  /* ====================== 主容器：左导航不动 + 右侧铺满 ====================== */
  .report-list-container {
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
    font-size: 32px;
    font-weight: 600;
    color: #166534;
    margin: 0 0 8px 0;
  }
  
  .page-subtitle {
    font-size: 16px;
    color: #65a30d;
    margin: 0;
  }
  
  /* ====================== 统计卡片 ====================== */
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #dcfce7;
  }
  
  .stat-label {
    font-size: 16px;
    color: #6b7280;
    margin: 0 0 8px 0;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  /* ====================== 上报列表卡片 ====================== */
  .report-list-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
  }
  
  .card-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 24px 0;
  }
  
  .report-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
  
  .report-item {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #dcfce7;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .item-title {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .item-name {
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
  }
  
  /* 状态标签样式 */
  .status-tag {
    padding: 6px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }
  
  .status-completed {
    background: #22c55e;
  }
  
  .status-processing {
    background: #f97316;
  }
  
  .status-assigned {
    background: #fbbf24;
  }
  
  .status-rejected {
    background: #ef4444;
  }
  
  .status-auditing {
    background: #3b82f6;
  }
  
  .detail-btn {
    background: transparent;
    border: none;
    font-size: 18px;
    color: #22c55e;
    font-weight: 500;
    cursor: pointer;
  }
  
  /* 信息行 */
  .item-info, .item-time {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }
  
  .info-item, .time-item {
    font-size: 16px;
    color: #4b5563;
  }
  
  /* 处理结果/驳回原因 */
  .result-box {
    border-radius: 12px;
    padding: 16px;
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    box-sizing: border-box;
  }
  
  .result-completed {
    background: #f0fdf4;
    color: #166534;
  }
  
  .result-rejected {
    background: #fef2f2;
    color: #b91c1c;
  }
  
  /* ====================== 自适应布局 ====================== */
  @media (max-width: 1200px) {
    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .report-list-container {
      margin-left: 0;
      padding: 16px;
      width: 100vw;
    }
    .stats-cards {
      grid-template-columns: 1fr;
    }
    .item-info, .item-time {
      flex-direction: column;
      gap: 8px;
    }
  }
  </style>