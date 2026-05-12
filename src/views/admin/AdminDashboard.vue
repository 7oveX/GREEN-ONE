<template>
  <div class="admin-wrap">
    <!-- ═══ SIDEBAR ═══ -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🛡</div>
        <div>
          <div class="logo-title">管理后台</div>
          <div class="logo-sub">绿芽环保</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: currentPage === item.id }"
          @click="currentPage = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-avatar">管</div>
        <div>
          <div class="admin-name">管理员</div>
          <div class="admin-sub">admin</div>
        </div>
        <span class="logout-btn" @click="$router.push('/login')">↪</span>
      </div>
    </aside>

    <!-- ═══ MAIN CONTENT ═══ -->
    <main class="main-content">

      <!-- ══ 数据大屏 ══ -->
      <section v-if="currentPage === 'dashboard'">
        <div class="page-header">
          <div>
            <h1 class="page-title">环保数据大屏</h1>
            <p class="page-sub">↻ 最后更新：{{ lastUpdateTime }}</p>
          </div>
          <div class="time-btns">
            <button
              v-for="t in ['今日','本周','本月','自定义']"
              :key="t"
              class="time-btn"
              :class="{ active: timeRange === t }"
              @click="handleTimeClick(t)"
            >{{ t }}</button>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card" v-for="k in kpiCards" :key="k.label">
            <div class="kpi-inner">
              <div>
                <div class="kpi-label">{{ k.label }}</div>
                <div class="kpi-value" :style="{ color: k.color }">{{ k.value }}</div>
                <div class="kpi-sub">{{ k.sub }}</div>
              </div>
              <span class="kpi-icon">{{ k.icon }}</span>
            </div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="chart-row2">
          <div class="chart-card">
            <div class="chart-title">👥 用户增长趋势</div>
            <div class="chart-legend">
              <span class="legend-dot" style="background:#22c55e"></span>总用户
              <span class="legend-dot" style="background:#fbbf24;margin-left:12px"></span>活跃用户
            </div>
            <div class="chart-wrap"><canvas id="lineChart"></canvas></div>
          </div>
          <div class="chart-card">
            <div class="chart-title">📋 事件处理状态分布</div>
            <div class="chart-legend">
              <span v-for="l in pieLegend" :key="l.label">
                <span class="legend-dot" :style="{ background: l.color }"></span>{{ l.label }}
              </span>
            </div>
            <div class="chart-wrap"><canvas id="pieChart"></canvas></div>
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="chart-row2">
          <div class="chart-card">
            <div class="chart-title">各区域事件上报量</div>
            <div class="chart-wrap"><canvas id="barChart"></canvas></div>
          </div>
          <div class="chart-card">
            <div class="chart-title">垃圾分类查询频次</div>
            <div class="word-cloud">
              <span v-for="w in wordCloud" :key="w.word"
                :style="{ fontSize: w.size + 'px', color: w.color, fontWeight: w.size > 22 ? 700 : 500 }">
                {{ w.word }}
              </span>
            </div>
          </div>
        </div>

        <!-- Charts Row 3 -->
        <div class="chart-row2">
          <div class="chart-card" style="align-items:center">
            <div class="chart-title" style="align-self:flex-start">碳减排累计量</div>
            <svg viewBox="0 0 200 200" width="200" height="200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="16"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#22c55e" stroke-width="16"
                stroke-dasharray="502.65" stroke-dashoffset="180" stroke-linecap="round"
                transform="rotate(-90 100 100)"/>
              <text x="100" y="95" text-anchor="middle" font-size="30" font-weight="700" fill="#22c55e">12.8</text>
              <text x="100" y="118" text-anchor="middle" font-size="13" fill="#6b7280">吨 CO₂</text>
              <text x="100" y="136" text-anchor="middle" font-size="12" fill="#9ca3af">目标: 20吨</text>
            </svg>
          </div>
          <div class="chart-card">
            <div class="chart-title">积分排行 TOP 10</div>
            <div class="chart-wrap-tall"><canvas id="hbarChart"></canvas></div>
          </div>
        </div>
      </section>

      <!-- ══ 用户管理 ══ -->
      <section v-if="currentPage === 'users'">
        <h1 class="page-title">用户管理</h1>
        <p class="page-sub">管理用户账号信息和权限配置</p>

        <div class="filter-bar">
          <input v-model="userSearch" placeholder="搜索用户名或邮箱..." class="search-input" />
          <select v-model="userRoleFilter" class="filter-select">
            <option value="all">所有角色</option>
            <option value="普通用户">普通用户</option>
            <option value="管理员">管理员</option>
          </select>
          <select v-model="userStatusFilter" class="filter-select">
            <option value="all">所有状态</option>
            <option value="正常">正常</option>
            <option value="已封禁">已封禁</option>
          </select>
        </div>

        <div class="stat-grid4">
          <div class="stat-card">
            <div class="stat-label">总用户数</div>
            <div class="stat-value">{{ users.length }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">活跃用户</div>
            <div class="stat-value green">{{ users.filter(u=>u.status==='正常').length }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">管理员</div>
            <div class="stat-value blue">{{ users.filter(u=>u.role==='管理员').length }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">封禁用户</div>
            <div class="stat-value red">{{ users.filter(u=>u.status==='已封禁').length }}</div>
          </div>
        </div>

        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>用户信息</th><th>角色</th><th>状态</th>
                <th>等级/积分</th><th>注册时间</th><th>最后活跃</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredUsers" :key="u.id">
                <td>
                  <div class="user-name">{{ u.name }}</div>
                  <div class="user-email">{{ u.email }}</div>
                </td>
                <td><span class="badge badge-green">{{ u.role }}</span></td>
                <td>
                  <span class="badge" :class="u.status==='正常' ? 'badge-green' : 'badge-red'">
                    {{ u.status }}
                  </span>
                </td>
                <td>
                  <div class="fw500">LV {{ u.level }}</div>
                  <div class="green fs12">{{ u.points.toLocaleString() }} 分</div>
                </td>
                <td class="gray fs13">{{ u.regDate }}</td>
                <td class="gray fs13">{{ u.lastActive }}</td>
                <td>
                  <button v-if="u.status==='正常'" class="btn btn-danger btn-sm" @click="toggleUser(u.id,'ban')">封禁</button>
                  <button v-else class="btn btn-primary btn-sm" @click="toggleUser(u.id,'unban')">解封</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ══ 事件审核 ══ -->
      <section v-if="currentPage === 'events'">
        <h1 class="page-title">事件审核管理</h1>
        <p class="page-sub">审核、派单、处理环保事件上报</p>

        <div class="stat-grid6">
          <div class="stat-card" v-for="s in eventStatuses" :key="s">
            <div class="stat-label">{{ s }}</div>
            <div class="stat-value">{{ events.filter(e=>e.status===s).length }}</div>
          </div>
        </div>

        <div class="tab-bar">
          <button
            v-for="t in ['全部',...eventStatuses]" :key="t"
            class="tab-btn" :class="{ active: eventTab === t }"
            @click="eventTab = t"
          >{{ t }}</button>
        </div>

        <div class="event-list">
          <div class="event-card" v-for="ev in filteredEvents" :key="ev.id">
            <div class="event-header">
              <span class="event-title">{{ ev.title }}</span>
              <span class="badge" :style="eventBadgeStyle(ev.status)">{{ ev.status }}</span>
            </div>
            <div class="event-meta">
              工单号：{{ ev.no }} &nbsp;类型：{{ ev.type }} &nbsp;上报人：{{ ev.reporter }} &nbsp;位置：{{ ev.location }}
            </div>
            <div class="event-desc">{{ ev.desc }}</div>
            <div class="event-footer">
              <span class="event-time">上报时间：{{ ev.time }}</span>
              <div class="event-actions">
                <button class="btn btn-outline btn-sm" @click="showEventDetail(ev)">查看详情</button>
                <button v-if="ev.status==='待审核'" class="btn btn-primary btn-sm" @click="updateEvent(ev.id,'审核中')">通过审核</button>
                <button v-if="ev.status==='待审核'" class="btn btn-danger btn-sm" @click="openRejectModal(ev)">驳回</button>
                <button v-if="ev.status==='审核中'" class="btn btn-blue btn-sm" @click="openAssignModal(ev)">派单</button>
                <button v-if="ev.status==='已派单'||ev.status==='处理中'" class="btn btn-primary btn-sm" @click="updateEvent(ev.id,'已完成')">完成处理</button>
              </div>
            </div>
          </div>
          <div v-if="filteredEvents.length===0" class="empty-state">暂无相关事件</div>
        </div>
      </section>

      <!-- ══ 任务管理 ══ -->
      <section v-if="currentPage === 'tasks'">
        <div class="page-header">
          <div>
            <h1 class="page-title">打卡任务管理</h1>
            <p class="page-sub">发布和管理每日/每周环保任务</p>
          </div>
          <button class="btn btn-primary" @click="openTaskModal()">+ 创建任务</button>
        </div>

        <div class="stat-grid4">
          <div class="stat-card"><div class="stat-label">总任务数</div><div class="stat-value">{{ tasks.length }}</div></div>
          <div class="stat-card"><div class="stat-label">活跃任务</div><div class="stat-value green">{{ tasks.filter(t=>t.status==='活跃').length }}</div></div>
          <div class="stat-card"><div class="stat-label">每日任务</div><div class="stat-value blue">{{ tasks.filter(t=>t.freq==='每日').length }}</div></div>
          <div class="stat-card"><div class="stat-label">每周任务</div><div class="stat-value purple">{{ tasks.filter(t=>t.freq==='每周').length }}</div></div>
        </div>

        <div class="task-grid">
          <div class="task-card" v-for="t in tasks" :key="t.id" :class="{ inactive: t.status !== '活跃' }">
            <div class="task-header">
              <span class="task-name">{{ t.title }}</span>
              <span class="badge" :class="t.freq==='每日' ? 'badge-blue' : 'badge-purple'">{{ t.freq }}</span>
            </div>
            <p class="task-desc">{{ t.desc }}</p>
            <div class="task-info">
              <div class="task-row"><span class="gray">完成条件</span><span>{{ t.condition }}</span></div>
              <div class="task-row"><span class="gray">奖励积分</span><span class="green fw500">+{{ t.points }} 分</span></div>
              <div class="task-row">
                <span class="gray">状态</span>
                <span :style="{ color: t.status==='活跃' ? '#22c55e' : '#9ca3af' }">{{ t.status }}</span>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn btn-outline btn-sm" @click="openTaskModal(t)">编辑</button>
              <button class="btn btn-ghost btn-sm" @click="toggleTask(t.id)">{{ t.status==='活跃' ? '停用' : '启用' }}</button>
              <button class="btn-icon-del" @click="deleteTask(t.id)">🗑</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 知识库 ══ -->
      <section v-if="currentPage === 'knowledge'">
        <div class="page-header">
          <div>
            <h1 class="page-title">知识库管理</h1>
            <p class="page-sub">维护垃圾分类知识库，支持增删改查和批量导入</p>
          </div>
          <div class="flex gap8">
            <button class="btn btn-ghost" @click="openCsvModal">📤 批量导入</button>
            <button class="btn btn-primary" @click="openKnowModal()">+ 添加词条</button>
          </div>
        </div>

        <div class="stat-grid5">
          <div class="stat-card"><div class="stat-label">总词条数</div><div class="stat-value">{{ knowledge.length }}</div></div>
          <div class="stat-card" v-for="c in catList" :key="c.name">
            <div class="stat-label">{{ c.name }}</div>
            <div class="stat-value" :style="{ color: c.color }">{{ knowledge.filter(i=>i.category===c.name).length }}</div>
          </div>
        </div>

        <div class="filter-bar">
          <input v-model="knowSearch" placeholder="搜索垃圾名称..." class="search-input" />
          <select v-model="knowCatFilter" class="filter-select">
            <option value="all">所有分类</option>
            <option v-for="c in catList" :key="c.name" :value="c.name">{{ c.name }}</option>
          </select>
        </div>

        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr><th>垃圾名称</th><th>分类</th><th>子分类</th><th>创建时间</th><th>更新时间</th><th>操作</th></tr>
            </thead>
            <tbody>
              <tr v-for="it in filteredKnowledge" :key="it.id">
                <td class="fw500">{{ it.name }}</td>
                <td>
                  <span class="badge" :style="catBadgeStyle(it.category)">{{ it.category }}</span>
                </td>
                <td>{{ it.sub }}</td>
                <td class="gray fs13">{{ it.created }}</td>
                <td class="gray fs13">{{ it.updated }}</td>
                <td>
                  <button class="btn-icon-edit" @click="openKnowModal(it)">✏</button>
                  <button class="btn-icon-del" @click="deleteKnow(it.id)">🗑</button>
                </td>
              </tr>
              <tr v-if="filteredKnowledge.length===0">
                <td colspan="6" class="empty-state">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>

    <!-- ═══ MODALS ═══ -->
    <div v-if="modal.show" class="overlay" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <span class="modal-title">{{ modal.title }}</span>
          <button class="modal-close" @click="closeModal">×</button>
        </div>

        <div v-if="modal.type === 'customTime'" class="modal-body">
          <div class="form-group">
            <label>开始日期</label>
            <input type="date" class="modal-input" v-model="modal.data.start" />
          </div>
          <div class="form-group" style="margin-top: 15px;">
            <label>结束日期</label>
            <input type="date" class="modal-input" v-model="modal.data.end" />
          </div>
          <div class="modal-footer" style="margin-top: 20px;">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-primary" @click="confirmCustomTime">确定查询</button>
          </div>
        </div>

        <div v-if="modal.type === 'eventDetail'" class="modal-body">
          <div class="detail-grid" v-for="row in modal.data.rows" :key="row[0]">
            <span class="detail-label">{{ row[0] }}：</span>
            <span>{{ row[1] }}</span>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">关闭</button>
          </div>
        </div>

        <div v-if="modal.type === 'reject'" class="modal-body">
          <p class="modal-desc">请填写驳回原因：</p>
          <textarea v-model="rejectReason" rows="4" class="modal-textarea" placeholder="请输入驳回原因..."></textarea>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-danger" @click="confirmReject">确认驳回</button>
          </div>
        </div>

        <div v-if="modal.type === 'assign'" class="modal-body">
          <p class="modal-desc">指派处理人员：</p>
          <input v-model="assignPerson" class="modal-input" placeholder="输入处理人员姓名..." />
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-blue" @click="confirmAssign">确认派单</button>
          </div>
        </div>

        <!-- Task Form -->
        <div v-if="modal.type === 'task'" class="modal-body">
          <div class="form-group">
            <label>任务名称</label>
            <input v-model="taskForm.title" class="modal-input" placeholder="输入任务名称" />
          </div>
          <div class="form-group">
            <label>任务描述</label>
            <input v-model="taskForm.desc" class="modal-input" placeholder="输入任务描述" />
          </div>
          <div class="form-group">
            <label>完成条件</label>
            <input v-model="taskForm.condition" class="modal-input" placeholder="输入完成条件" />
          </div>
          <div class="form-group">
            <label>积分奖励</label>
            <input v-model.number="taskForm.points" type="number" class="modal-input" placeholder="输入积分数值" />
          </div>
          <div class="form-group">
            <label>频率</label>
            <select v-model="taskForm.freq" class="modal-input">
              <option value="每日">每日</option>
              <option value="每周">每周</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-primary" @click="saveTask">保存</button>
          </div>
        </div>

        <!-- Knowledge Form -->
        <div v-if="modal.type === 'know'" class="modal-body">
          <div class="form-group">
            <label>垃圾名称</label>
            <input v-model="knowForm.name" class="modal-input" placeholder="输入垃圾名称" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="knowForm.category" class="modal-input">
              <option v-for="c in catList" :key="c.name" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>子分类</label>
            <input v-model="knowForm.sub" class="modal-input" placeholder="输入子分类" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-primary" @click="saveKnow">保存</button>
          </div>
        </div>

        <!-- CSV Import -->
        <div v-if="modal.type === 'csv'" class="modal-body">
          <p class="modal-desc">
            请上传 CSV 文件，格式：<code class="code-tag">名称,分类,子分类</code>
          </p>
          <input type="file" accept=".csv" @change="handleCsvUpload" class="modal-input" />
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

// ── 导航与基础配置 ──
const currentPage = ref('dashboard')
const navItems = [
  { id: 'dashboard', icon: '⊞', label: '数据大屏' },
  { id: 'users',     icon: '👤', label: '用户管理' },
  { id: 'events',    icon: '📋', label: '事件审核' },
  { id: 'tasks',     icon: '📅', label: '任务管理' },
  { id: 'knowledge', icon: '📖', label: '知识库' },
]

// ── 时间联动逻辑：定义不同时间段的模拟数据 ──
const mockDataMap = {
  '今日': {
    kpis: ['125', '680', '15', '0.2 吨'],
    lineLabels: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    lineTotal: [100, 150, 280, 400, 550, 680],
    lineActive: [50, 80, 120, 200, 300, 450],
    barData: [12, 8, 15, 20, 10, 30]
  },
  '本周': {
    kpis: ['9,950', '7,200', '1,263', '12.8 吨'],
    lineLabels: ['04-14', '04-15', '04-16', '04-17', '04-18', '04-19', '04-20'],
    lineTotal: [8500, 8700, 8900, 9100, 9400, 9700, 10050],
    lineActive: [6200, 6400, 6500, 6700, 6900, 7100, 7200],
    barData: [245, 198, 163, 141, 128, 397]
  },
  '本月': {
    kpis: ['42,100', '31,500', '5,800', '45.2 吨'],
    lineLabels: ['第一周', '第二周', '第三周', '第四周'],
    lineTotal: [15000, 22000, 35000, 42100],
    lineActive: [10000, 18000, 25000, 31500],
    barData: [1200, 950, 880, 720, 650, 1400]
  }
}

const timeRange = ref('今日')
const lastUpdateTime = ref(new Date().toLocaleTimeString())

// ── 修正后的时间点击逻辑 ──
function handleTimeClick(t) {
  if (t === '自定义') {
    modal.value = {
      show: true,
      type: 'customTime',
      title: '选择自定义时间段',
      data: { start: '', end: '' } // 确保初始化了 data 对象
    }
  } else {
    timeRange.value = t
  }
}

// ── 修正后的确认日期逻辑 ──
function confirmCustomTime() {
  if (!modal.value.data || !modal.value.data.start || !modal.value.data.end) {
    alert('请选择完整的开始和结束日期');
    return;
  }
  timeRange.value = '自定义';
  // 模拟联动图表
  if (chartInstances.line) {
    chartInstances.line.data.labels = [modal.value.data.start, '至', modal.value.data.end];
    chartInstances.line.data.datasets[0].data = [4000, 7000, 9000]; 
    chartInstances.line.update();
  }
  closeModal();
}
const kpiCards = ref([
  { label: '注册用户总量', value: '125', sub: '+12% 较昨日', icon: '👥', color: '#3b82f6' },
  { label: '活跃用户',     value: '680', sub: '72.4% 活跃率', icon: '👥', color: '#22c55e' },
  { label: '事件上报总量', value: '15', sub: '+2 较昨日', icon: '📋', color: '#f59e0b' },
  { label: '累计碳减排',   value: '0.2 吨', sub: '+0.01 较昨日', icon: '🏅', color: '#a855f7' },
])

// ── 核心：监听 timeRange 变化来刷新图表和 KPI ──
const chartInstances = {} 

watch(timeRange, (newRange) => {
  if (newRange === '自定义') return 
  const data = mockDataMap[newRange]
  if (!data) return

  // 更新 KPI 卡片的数字
  kpiCards.value.forEach((card, i) => {
    card.value = data.kpis[i]
  })

  // 刷新折线图数据
  if (chartInstances.line) {
    chartInstances.line.data.labels = data.lineLabels
    chartInstances.line.data.datasets[0].data = data.lineTotal
    chartInstances.line.data.datasets[1].data = data.lineActive
    chartInstances.line.update() 
  }

  // 刷新柱状图数据
  if (chartInstances.bar) {
    chartInstances.bar.data.datasets[0].data = data.barData
    chartInstances.bar.update()
  }
})

// ── 图表初始化逻辑 ──
let chartsLoaded = false
function loadCharts() {
  if (chartsLoaded) return
  chartsLoaded = true
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
  script.onload = initCharts
  document.head.appendChild(script)
}

function initCharts() {
  nextTick(() => {
    const initial = mockDataMap[timeRange.value]
    
    chartInstances.line = new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: initial.lineLabels,
        datasets: [
          { label: '总用户', data: initial.lineTotal, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.1)', tension: .4, fill: true },
          { label: '活跃用户', data: initial.lineActive, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,.08)', tension: .4, fill: true }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    })

    chartInstances.bar = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: ['朝阳区','东城区','丰台区','海淀区','西城区','其他'],
        datasets: [{ data: initial.barData, backgroundColor: '#22c55e', borderRadius: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    })

    chartInstances.pie = new Chart(document.getElementById('pieChart'), {
      type: 'pie',
      data: {
        labels: ['已完成','处理中','待审核','已驳回'],
        datasets: [{ data: [68, 19, 10, 3], backgroundColor: ['#22c55e','#fbbf24','#3b82f6','#ef4444'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    })
  })
}

onMounted(() => {
  loadCharts()
  setInterval(() => { lastUpdateTime.value = new Date().toLocaleTimeString() }, 1000)
  // ── 处理时间按钮点击 ──
function handleTimeClick(t) {
  if (t === '自定义') {
    modal.value = {
      show: true,
      type: 'customTime',
      title: '选择自定义时间段',
      data: { start: '', end: '' }
    }
  } else {
    timeRange.value = t
  }
}

// ── 确认自定义日期逻辑 ──
function confirmCustomTime() {
  if (!modal.value.data.start || !modal.value.data.end) {
    alert('请选择完整的开始和结束日期');
    return;
  }
  timeRange.value = '自定义';
  // 模拟图表联动
  if (chartInstances.line) {
    chartInstances.line.data.labels = [modal.value.data.start, '至', modal.value.data.end];
    chartInstances.line.data.datasets[0].data = [4500, 7200, 9500]; // 模拟数据
    chartInstances.line.update();
  }
  closeModal();
}
})

// ── Users ─────────────────────────────────────────────────
const users = ref([
  { id:1, name:'环保先锋', email:'user1@example.com', role:'普通用户', status:'正常',  level:8, points:12580, regDate:'2026-01-15', lastActive:'2026-04-09 10:30' },
  { id:2, name:'绿色使者', email:'user2@example.com', role:'普通用户', status:'正常',  level:7, points:11340, regDate:'2026-01-20', lastActive:'2026-04-09 09:15' },
  { id:3, name:'低碳达人', email:'user3@example.com', role:'普通用户', status:'正常',  level:6, points:9850,  regDate:'2026-02-05', lastActive:'2026-04-08 22:45' },
  { id:4, name:'违规用户', email:'bad@example.com',   role:'普通用户', status:'已封禁',level:2, points:150,   regDate:'2026-03-10', lastActive:'2026-04-01 15:20' },
])
const userSearch       = ref('')
const userRoleFilter   = ref('all')
const userStatusFilter = ref('all')

const filteredUsers = computed(() =>
  users.value.filter(u =>
    (u.name.includes(userSearch.value) || u.email.includes(userSearch.value)) &&
    (userRoleFilter.value === 'all' || u.role === userRoleFilter.value) &&
    (userStatusFilter.value === 'all' || u.status === userStatusFilter.value)
  )
)

function toggleUser(id, action) {
  users.value = users.value.map(u =>
    u.id === id ? { ...u, status: action === 'ban' ? '已封禁' : '正常' } : u
  )
}

// ── Events ────────────────────────────────────────────────
const eventStatuses = ['待审核','审核中','已派单','处理中','已完成','已驳回']
const eventTab = ref('全部')
const events = ref([
  { id:1, no:'EP20260409001', title:'公园内垃圾桶满溢', type:'垃圾乱放', reporter:'环保达人', location:'朝阳公园东门', desc:'公园东门附近的垃圾桶已经满溢，垃圾散落在地上，影响环境卫生。', time:'2026-04-09 08:30', status:'待审核' },
  { id:2, no:'EP20260408002', title:'河道发现污水排放', type:'污水排放', reporter:'绿色使者',  location:'清河北岸',    desc:'发现有工厂向河道排放黑色污水，水质明显变差。',                   time:'2026-04-08 15:20', status:'审核中' },
  { id:3, no:'EP20260407003', title:'夜间施工噪音扰民', type:'噪音污染', reporter:'低碳达人',  location:'望京SOHO',    desc:'夜间10点后仍有施工噪音，严重影响周边居民休息。',               time:'2026-04-07 22:00', status:'已派单' },
  { id:4, no:'EP20260406004', title:'工地扬尘污染',     type:'其他',     reporter:'环保新星',  location:'建国门外大街', desc:'工地未采取防尘措施，扬尘严重影响空气质量。',                   time:'2026-04-06 11:20', status:'处理中' },
])

const filteredEvents = computed(() =>
  eventTab.value === '全部' ? events.value : events.value.filter(e => e.status === eventTab.value)
)

const evtStatusStyle = {
  '待审核': { bg: '#fef9c3', color: '#854d0e' },
  '审核中': { bg: '#dbeafe', color: '#1e40af' },
  '已派单': { bg: '#fde68a', color: '#92400e' },
  '处理中': { bg: '#fed7aa', color: '#9a3412' },
  '已完成': { bg: '#dcfce7', color: '#166534' },
  '已驳回': { bg: '#fee2e2', color: '#991b1b' },
}
function eventBadgeStyle(s) {
  const c = evtStatusStyle[s] || { bg: '#f3f4f6', color: '#374151' }
  return { background: c.bg, color: c.color }
}

function updateEvent(id, status) {
  events.value = events.value.map(e => e.id === id ? { ...e, status } : e)
}

// ── Tasks ─────────────────────────────────────────────────
const tasks = ref([
  { id:1, title:'每日环保打卡', freq:'每日', desc:'完成一次环保行为打卡',     condition:'完成1次打卡',     points:10,  status:'活跃' },
  { id:2, title:'绿色出行',     freq:'每日', desc:'选择公共交通或骑行步行',   condition:'选择绿色出行方式', points:50,  status:'活跃' },
  { id:3, title:'垃圾分类',     freq:'每日', desc:'正确进行垃圾分类',         condition:'正确分类垃圾',     points:20,  status:'活跃' },
  { id:4, title:'周打卡达人',   freq:'每周', desc:'一周打卡5次以上',           condition:'本周打卡≥5次',     points:100, status:'活跃' },
])

function toggleTask(id) {
  tasks.value = tasks.value.map(t => t.id === id ? { ...t, status: t.status === '活跃' ? '停用' : '活跃' } : t)
}
function deleteTask(id) {
  if (confirm('确认删除此任务？')) tasks.value = tasks.value.filter(t => t.id !== id)
}

// ── Knowledge ─────────────────────────────────────────────
const catList = [
  { name: '可回收物', color: '#1e40af' },
  { name: '有害垃圾', color: '#991b1b' },
  { name: '厨余垃圾', color: '#166534' },
  { name: '其他垃圾', color: '#374151' },
]
const catBadgeMap = {
  '可回收物': { background: '#dbeafe', color: '#1e40af' },
  '有害垃圾': { background: '#fee2e2', color: '#991b1b' },
  '厨余垃圾': { background: '#dcfce7', color: '#166534' },
  '其他垃圾': { background: '#f3f4f6', color: '#374151' },
}
function catBadgeStyle(cat) { return catBadgeMap[cat] || {} }

const knowledge = ref([
  { id:1, name:'塑料瓶',  category:'可回收物', sub:'塑料',    created:'2026-01-01', updated:'2026-01-01' },
  { id:2, name:'纸箱',    category:'可回收物', sub:'纸类',    created:'2026-01-01', updated:'2026-01-01' },
  { id:3, name:'电池',    category:'有害垃圾', sub:'电池',    created:'2026-01-01', updated:'2026-01-01' },
  { id:4, name:'剩菜剩饭',category:'厨余垃圾', sub:'食物残渣',created:'2026-01-01', updated:'2026-01-01' },
  { id:5, name:'烟头',    category:'其他垃圾', sub:'一般废弃物',created:'2026-01-01', updated:'2026-01-01' },
])
const knowSearch    = ref('')
const knowCatFilter = ref('all')

const filteredKnowledge = computed(() =>
  knowledge.value.filter(i =>
    i.name.includes(knowSearch.value) &&
    (knowCatFilter.value === 'all' || i.category === knowCatFilter.value)
  )
)

function deleteKnow(id) {
  if (confirm('确认删除此词条？')) knowledge.value = knowledge.value.filter(i => i.id !== id)
}

// ── Modal system ──────────────────────────────────────────
const modal = ref({ show: false, type: '', title: '', data: {} })
const rejectReason  = ref('')
const assignPerson  = ref('')
const taskForm      = ref({ title:'', desc:'', condition:'', points:0, freq:'每日' })
const knowForm      = ref({ name:'', category:'可回收物', sub:'' })
let editingTaskId   = null
let editingKnowId   = null
let rejectTargetId  = null
let assignTargetId  = null

function closeModal() { modal.value.show = false }

function showEventDetail(ev) {
  modal.value = {
    show: true, type: 'eventDetail', title: '事件详情',
    data: {
      rows: [
        ['工单号', ev.no], ['标题', ev.title], ['类型', ev.type],
        ['上报人', ev.reporter], ['位置', ev.location],
        ['状态', ev.status], ['上报时间', ev.time], ['描述', ev.desc],
      ]
    }
  }
}

function openRejectModal(ev) {
  rejectTargetId = ev.id
  rejectReason.value = ''
  modal.value = { show: true, type: 'reject', title: '驳回事件', data: {} }
}
function confirmReject() {
  updateEvent(rejectTargetId, '已驳回')
  closeModal()
}

function openAssignModal(ev) {
  assignTargetId = ev.id
  assignPerson.value = ''
  modal.value = { show: true, type: 'assign', title: '派单', data: {} }
}
function confirmAssign() {
  updateEvent(assignTargetId, '已派单')
  closeModal()
}

function openTaskModal(task = null) {
  editingTaskId = task ? task.id : null
  taskForm.value = task
    ? { title: task.title, desc: task.desc, condition: task.condition, points: task.points, freq: task.freq }
    : { title: '', desc: '', condition: '', points: 10, freq: '每日' }
  modal.value = { show: true, type: 'task', title: task ? '编辑任务' : '创建任务', data: {} }
}
function saveTask() {
  if (!taskForm.value.title) return
  if (editingTaskId) {
    tasks.value = tasks.value.map(t => t.id === editingTaskId ? { ...t, ...taskForm.value } : t)
  } else {
    tasks.value.push({ id: Date.now(), ...taskForm.value, status: '活跃' })
  }
  closeModal()
}

function openKnowModal(item = null) {
  editingKnowId = item ? item.id : null
  knowForm.value = item
    ? { name: item.name, category: item.category, sub: item.sub }
    : { name: '', category: '可回收物', sub: '' }
  modal.value = { show: true, type: 'know', title: item ? '编辑词条' : '添加词条', data: {} }
}
function saveKnow() {
  if (!knowForm.value.name) return
  const today = new Date().toISOString().slice(0, 10)
  if (editingKnowId) {
    knowledge.value = knowledge.value.map(i =>
      i.id === editingKnowId ? { ...i, ...knowForm.value, updated: today } : i
    )
  } else {
    knowledge.value.push({ id: Date.now(), ...knowForm.value, created: today, updated: today })
  }
  closeModal()
}

function openCsvModal() {
  modal.value = { show: true, type: 'csv', title: '批量导入 CSV', data: {} }
}
function handleCsvUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    const today = new Date().toISOString().slice(0, 10)
    const lines = ev.target.result.split('\n').filter(Boolean)
    const newItems = lines.map((l, i) => {
      const [name, category, sub] = l.split(',').map(s => s.trim())
      return { id: Date.now() + i, name, category: category || '其他垃圾', sub: sub || '', created: today, updated: today }
    }).filter(it => it.name)
    knowledge.value.push(...newItems)
    closeModal()
  }
  reader.readAsText(file)
}

</script>

<style scoped>
/* ── Layout ── */
.admin-wrap {
  display: flex;
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', Helvetica, sans-serif;
  background: #f0fdf4;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid #f0fdf4;
}
.logo-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: #22c55e; color: #fff; font-size: 20px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.logo-title { font-weight: 700; font-size: 16px; color: #111; }
.logo-sub   { font-size: 12px; color: #6b7280; }

.sidebar-nav { flex: 1; padding: 16px 12px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px; margin-bottom: 4px;
  cursor: pointer; font-size: 15px; color: #374151;
  transition: all 0.15s;
}
.nav-item:hover { background: #f0fdf4; }
.nav-item.active { background: #22c55e; color: #fff; font-weight: 600; }
.nav-icon { font-size: 18px; }

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex; align-items: center; gap: 10px;
}
.admin-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: #fbbf24; color: #92400e; font-weight: 700; font-size: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.admin-name { font-size: 14px; font-weight: 600; }
.admin-sub  { font-size: 12px; color: #6b7280; }
.logout-btn { margin-left: auto; cursor: pointer; font-size: 18px; color: #6b7280; }

/* ── Main ── */
.main-content { flex: 1; padding: 36px 40px; min-width: 0; }

/* ── Page headers ── */
.page-header {
  display: flex; justify-content: space-between;
  align-items: flex-start; margin-bottom: 28px;
}
.page-title { font-size: 26px; font-weight: 700; color: #111; margin: 0 0 6px; }
.page-sub   { font-size: 14px; color: #6b7280; margin: 0 0 28px; }

/* ── Time range buttons ── */
.time-btns { display: flex; gap: 8px; }
.time-btn {
  padding: 8px 18px; border-radius: 10px; border: 1px solid #e5e7eb;
  background: #fff; font-size: 14px; cursor: pointer; transition: all 0.15s;
}
.time-btn.active { background: #22c55e; color: #fff; border-color: #22c55e; }

/* ── KPI grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.kpi-card {
  background: #fff; border-radius: 14px;
  border: 1px solid #e5e7eb; padding: 22px 24px;
}
.kpi-inner { display: flex; justify-content: space-between; align-items: flex-start; }
.kpi-label { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
.kpi-value { font-size: 28px; font-weight: 700; }
.kpi-sub   { font-size: 12px; color: #9ca3af; margin-top: 4px; }
.kpi-icon  { font-size: 26px; }

/* ── Charts ── */
.chart-row2 {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; margin-bottom: 20px;
}
.chart-card {
  background: #fff; border-radius: 14px;
  border: 1px solid #e5e7eb; padding: 24px;
  display: flex; flex-direction: column;
}
.chart-title { font-weight: 600; font-size: 16px; margin-bottom: 14px; }
.chart-legend { display: flex; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #6b7280; flex-wrap: wrap; }
.legend-dot  { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 5px; vertical-align: middle; }
.chart-wrap  { height: 250px; position: relative; flex: 1; }
.chart-wrap-tall { height: 300px; position: relative; }

/* ── Word cloud ── */
.word-cloud {
  display: flex; flex-wrap: wrap; gap: 14px;
  align-items: center; padding: 12px 0; flex: 1;
}

/* ── Stat grids ── */
.stat-grid4 {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 24px;
}
.stat-grid5 {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 14px; margin-bottom: 24px;
}
.stat-grid6 {
  display: grid; grid-template-columns: repeat(6, 1fr);
  gap: 14px; margin-bottom: 24px;
}
.stat-card {
  background: #fff; border-radius: 12px;
  border: 1px solid #e5e7eb; padding: 18px 20px;
}
.stat-label { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: 700; color: #111; }
.stat-value.green  { color: #22c55e; }
.stat-value.blue   { color: #3b82f6; }
.stat-value.red    { color: #ef4444; }
.stat-value.purple { color: #a855f7; }

/* ── Filter bar ── */
.filter-bar {
  display: flex; gap: 12px;
  margin-bottom: 20px; align-items: center;
}
.search-input {
  flex: 1; border: 1px solid #e5e7eb; border-radius: 10px;
  padding: 10px 14px; font-size: 14px; outline: none;
  font-family: inherit;
}
.search-input:focus { border-color: #22c55e; }
.filter-select {
  border: 1px solid #e5e7eb; border-radius: 10px;
  padding: 10px 14px; font-size: 14px; outline: none;
  background: #fff; cursor: pointer;
  font-family: inherit; min-width: 130px;
}

/* ── Table ── */
.table-card {
  background: #fff; border-radius: 14px;
  border: 1px solid #e5e7eb; overflow: hidden;
}
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table thead tr { background: #f0fdf4; }
.data-table th { padding: 14px 18px; text-align: left; font-weight: 600; font-size: 13px; color: #374151; }
.data-table td { padding: 16px 18px; border-top: 1px solid #f3f4f6; }
.data-table tbody tr:hover { background: #fafafa; }

/* ── Event list ── */
.event-list { display: flex; flex-direction: column; gap: 14px; }
.event-card {
  background: #fff; border-radius: 14px;
  border: 1px solid #e5e7eb; padding: 22px 24px;
}
.event-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.event-title  { font-weight: 600; font-size: 17px; }
.event-meta   { font-size: 13px; color: #6b7280; margin-bottom: 10px; }
.event-desc   { font-size: 14px; color: #374151; margin-bottom: 14px; }
.event-footer { display: flex; justify-content: space-between; align-items: center; }
.event-time   { font-size: 12px; color: #9ca3af; }
.event-actions { display: flex; gap: 8px; }

/* ── Task grid ── */
.task-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.task-card {
  background: #fff; border-radius: 14px;
  border: 2px solid #22c55e; padding: 22px;
}
.task-card.inactive { border-color: #e5e7eb; }
.task-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.task-name   { font-weight: 700; font-size: 17px; }
.task-desc   { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
.task-info   { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
.task-row    { display: flex; justify-content: space-between; }
.task-actions {
  margin-top: 18px; padding-top: 14px;
  border-top: 1px solid #f3f4f6;
  display: flex; gap: 10px; align-items: center;
}

/* ── Tab bar ── */
.tab-bar { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.tab-btn {
  padding: 9px 18px; border-radius: 99px;
  border: 1px solid #e5e7eb; font-size: 13px;
  cursor: pointer; background: #fff; color: #374151;
  transition: all 0.15s; font-family: inherit;
}
.tab-btn.active { background: #22c55e; color: #fff; border-color: #22c55e; }

/* ── Badges ── */
.badge {
  font-size: 12px; padding: 3px 10px;
  border-radius: 99px; font-weight: 500;
  display: inline-block; white-space: nowrap;
}
.badge-green  { background: #dcfce7; color: #166534; }
.badge-red    { background: #fee2e2; color: #991b1b; }
.badge-blue   { background: #dbeafe; color: #1e40af; }
.badge-purple { background: #f3e8ff; color: #6b21a8; }

/* ── Buttons ── */
.btn {
  padding: 9px 18px; border-radius: 10px;
  font-size: 14px; font-weight: 500; cursor: pointer;
  border: none; transition: opacity 0.15s; font-family: inherit;
}
.btn:hover { opacity: .85; }
.btn-primary { background: #22c55e; color: #fff; }
.btn-danger  { background: #ef4444; color: #fff; }
.btn-blue    { background: #3b82f6; color: #fff; }
.btn-outline { background: #fff; color: #22c55e; border: 1px solid #22c55e; }
.btn-ghost   { background: #fff; color: #6b7280; border: 1px solid #e5e7eb; }
.btn-sm      { padding: 5px 14px; font-size: 13px; border-radius: 8px; }
.btn-icon-edit { border: none; background: none; cursor: pointer; color: #3b82f6; font-size: 18px; padding: 2px 6px; }
.btn-icon-del  { border: none; background: none; cursor: pointer; color: #ef4444; font-size: 18px; padding: 2px 6px; }

/* ── Utilities ── */
.fw500 { font-weight: 500; }
.green  { color: #22c55e; }
.blue   { color: #3b82f6; }
.gray   { color: #6b7280; }
.fs12   { font-size: 12px; }
.fs13   { font-size: 13px; }
.flex   { display: flex; }
.gap8   { gap: 8px; }
.user-name  { font-weight: 500; }
.user-email { font-size: 12px; color: #6b7280; }
.empty-state { text-align: center; padding: 48px; color: #9ca3af; font-size: 15px; }

/* ── Modal ── */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.modal-box {
  background: #fff; border-radius: 18px;
  padding: 32px; min-width: 460px; max-width: 560px;
  width: 90vw; box-shadow: 0 12px 40px rgba(0,0,0,0.18);
}
.modal-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 22px;
}
.modal-title { font-weight: 700; font-size: 20px; }
.modal-close {
  border: none; background: none; font-size: 26px;
  cursor: pointer; color: #6b7280; line-height: 1;
}
.modal-body { display: flex; flex-direction: column; gap: 14px; }
.modal-desc { font-size: 14px; color: #374151; }
.modal-input {
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px;
  padding: 10px 14px; font-size: 14px; outline: none;
  font-family: inherit; box-sizing: border-box;
}
.modal-input:focus { border-color: #22c55e; }
.modal-textarea {
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px;
  padding: 10px 14px; font-size: 14px; outline: none;
  font-family: inherit; resize: vertical; box-sizing: border-box;
}
.modal-textarea:focus { border-color: #22c55e; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;
}
.detail-grid { display: flex; gap: 10px; font-size: 14px; }
.detail-label { color: #6b7280; min-width: 70px; flex-shrink: 0; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; color: #374151; font-weight: 500; }
.code-tag {
  background: #f3f4f6; padding: 2px 8px;
  border-radius: 4px; font-size: 13px; font-family: monospace;
}
</style>