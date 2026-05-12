<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="main-content">

      <div class="page-header">
        <div>
          <h1 class="page-title">任务管理</h1>
          <p class="page-sub">发布、管理环保任务，激励用户参与环保行动</p>
        </div>
        <div class="flex gap8">
          <button class="btn btn-ghost" @click="exportData">📤 导出数据</button>
          <button class="btn btn-primary" @click="openTaskModal()">+ 发布新任务</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <input v-model="taskSearch" placeholder="搜索任务名称 / 编号..." class="search-input"/>
        <select v-model="taskStatusFilter" class="filter-select">
          <option value="all">全部状态</option>
          <option value="活跃">进行中</option>
          <option value="停用">已结束</option>
        </select>
        <select v-model="taskFreqFilter" class="filter-select">
          <option value="all">全部频率</option>
          <option value="每日">每日</option>
          <option value="每周">每周</option>
        </select>
      </div>

      <!-- Stats -->
      <div class="stat-grid4">
        <div class="stat-card"><div class="stat-label">总任务数</div><div class="stat-value">{{ tasks.length }}</div></div>
        <div class="stat-card"><div class="stat-label">进行中</div><div class="stat-value green">{{ tasks.filter(t=>t.status==='活跃').length }}</div></div>
        <div class="stat-card"><div class="stat-label">每日任务</div><div class="stat-value blue">{{ tasks.filter(t=>t.freq==='每日').length }}</div></div>
        <div class="stat-card"><div class="stat-label">每周任务</div><div class="stat-value purple">{{ tasks.filter(t=>t.freq==='每周').length }}</div></div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table">
          <thead><tr>
            <th>任务ID</th><th>任务名称</th><th>描述</th><th>奖励积分</th>
            <th>频率</th><th>参与人数</th><th>完成率</th><th>状态</th><th>操作</th>
          </tr></thead>
          <tbody>
            <tr v-for="t in filteredTasks" :key="t.id">
              <td class="gray fs13">#{{ t.id }}</td>
              <td class="fw500">{{ t.title }}</td>
              <td class="gray fs13" style="max-width:180px">{{ t.desc }}</td>
              <td><span class="green fw500">+{{ t.points }}</span></td>
              <td><span class="badge" :class="t.freq==='每日'?'badge-blue':'badge-purple'">{{ t.freq }}</span></td>
              <td>{{ t.participants.toLocaleString() }}</td>
              <td>
                <div class="progress-wrap">
                  <div class="progress-bar" :style="{width:t.completionRate+'%'}"></div>
                </div>
                <span class="fs12 gray">{{ t.completionRate }}%</span>
              </td>
              <td><span class="badge" :class="t.status==='活跃'?'badge-green':'badge-gray'">{{ t.status==='活跃'?'进行中':'已结束' }}</span></td>
              <td>
                <div class="flex gap8" style="flex-wrap:wrap">
                  <button class="btn btn-outline btn-sm" @click="openTaskStats(t)">统计</button>
                  <button class="btn btn-ghost btn-sm" @click="openTaskModal(t)">编辑</button>
                  <button class="btn btn-ghost btn-sm" @click="toggleTask(t.id)">{{ t.status==='活跃'?'下架':'上架' }}</button>
                  <button class="btn btn-danger btn-sm" @click="deleteTask(t.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>

    <!-- Modals -->
    <div v-if="modal.show" class="overlay" @click.self="closeModal">
      <div class="modal-box" :style="modal.wide?'max-width:680px':''">
        <div class="modal-header">
          <span class="modal-title">{{ modal.title }}</span>
          <button class="modal-close" @click="closeModal">×</button>
        </div>

        <!-- 发布/编辑任务 -->
        <div v-if="modal.type==='task'" class="modal-body">
          <div class="form-row2">
            <div class="form-group"><label>任务名称</label><input v-model="taskForm.title" class="modal-input" placeholder="输入任务名称"/></div>
            <div class="form-group"><label>频率</label>
              <select v-model="taskForm.freq" class="modal-input"><option value="每日">每日</option><option value="每周">每周</option></select>
            </div>
          </div>
          <div class="form-group"><label>任务描述</label><textarea v-model="taskForm.desc" rows="2" class="modal-textarea" placeholder="输入任务描述..."></textarea></div>
          <div class="form-group"><label>完成条件</label><textarea v-model="taskForm.condition" rows="2" class="modal-textarea" placeholder="输入完成条件..."></textarea></div>
          <div class="form-row2">
            <div class="form-group"><label>奖励积分</label><input v-model.number="taskForm.points" type="number" class="modal-input" placeholder="输入积分数值"/></div>
            <div class="form-group"><label>奖励勋章</label><input v-model="taskForm.medal" class="modal-input" placeholder="例：绿色先锋勋章"/></div>
          </div>
          <div class="form-row2">
            <div class="form-group"><label>发布时间</label><input v-model="taskForm.startDate" type="date" class="modal-input"/></div>
            <div class="form-group"><label>截止时间</label><input v-model="taskForm.endDate" type="date" class="modal-input"/></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-primary" @click="saveTask">保存发布</button>
          </div>
        </div>

        <!-- 任务统计 -->
        <div v-if="modal.type==='taskStats'" class="modal-body">
          <div class="stat-grid4" style="margin-bottom:16px">
            <div class="stat-card" v-for="s in modal.data.stats" :key="s.label">
              <div class="stat-label">{{ s.label }}</div>
              <div class="stat-value" :style="{color:s.color||'#111',fontSize:'22px'}">{{ s.value }}</div>
            </div>
          </div>
          <div style="font-weight:600;font-size:14px;margin-bottom:10px">参与用户 TOP5</div>
          <table class="data-table">
            <thead><tr><th>用户名</th><th>完成次数</th><th>获得积分</th></tr></thead>
            <tbody>
              <tr v-for="u in modal.data.topUsers" :key="u.name">
                <td class="fw500">{{ u.name }}</td><td>{{ u.count }}</td><td class="green fw500">+{{ u.pts }}</td>
              </tr>
            </tbody>
          </table>
          <div class="modal-footer"><button class="btn btn-ghost" @click="closeModal">关闭</button></div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const taskSearch       = ref('')
const taskStatusFilter = ref('all')
const taskFreqFilter   = ref('all')

const tasks = ref([
  { id:1, title:'每日环保打卡', freq:'每日', desc:'完成一次环保行为打卡',   condition:'完成1次打卡',     points:10,  medal:'绿色新星', startDate:'2026-01-01', endDate:'2026-12-31', status:'活跃', participants:3842, completionRate:88 },
  { id:2, title:'绿色出行',     freq:'每日', desc:'选择公共交通或骑行步行', condition:'选择绿色出行方式', points:50,  medal:'低碳达人', startDate:'2026-01-01', endDate:'2026-12-31', status:'活跃', participants:2156, completionRate:72 },
  { id:3, title:'垃圾分类',     freq:'每日', desc:'正确进行垃圾分类',       condition:'正确分类垃圾',     points:20,  medal:'分类高手', startDate:'2026-01-01', endDate:'2026-12-31', status:'活跃', participants:4521, completionRate:91 },
  { id:4, title:'周打卡达人',   freq:'每周', desc:'一周打卡5次以上',         condition:'本周打卡≥5次',     points:100, medal:'周冠军',   startDate:'2026-01-01', endDate:'2026-12-31', status:'活跃', participants:1893, completionRate:65 },
])

const filteredTasks = computed(() => tasks.value.filter(t =>
  t.title.includes(taskSearch.value) &&
  (taskStatusFilter.value==='all'||t.status===taskStatusFilter.value) &&
  (taskFreqFilter.value==='all'||t.freq===taskFreqFilter.value)
))

function toggleTask(id) { tasks.value = tasks.value.map(t=>t.id===id?{...t,status:t.status==='活跃'?'停用':'活跃'}:t) }
function deleteTask(id) { if(confirm('确认删除此任务？')) tasks.value=tasks.value.filter(t=>t.id!==id) }
function exportData() { alert('导出功能（对接后端接口后实现）') }

const modal    = ref({ show:false, type:'', title:'', data:{}, wide:false })
const taskForm = ref({ title:'', freq:'每日', desc:'', condition:'', points:10, medal:'', startDate:'', endDate:'' })
let editingTaskId = null

function closeModal() { modal.value.show = false }

function openTaskModal(task = null) {
  editingTaskId = task ? task.id : null
  taskForm.value = task
    ? { title:task.title, freq:task.freq, desc:task.desc, condition:task.condition, points:task.points, medal:task.medal, startDate:task.startDate, endDate:task.endDate }
    : { title:'', freq:'每日', desc:'', condition:'', points:10, medal:'', startDate:'', endDate:'' }
  modal.value = { show:true, type:'task', title:task?'编辑任务':'发布新任务', data:{}, wide:true }
}
function saveTask() {
  if (!taskForm.value.title) return
  if (editingTaskId) { tasks.value=tasks.value.map(t=>t.id===editingTaskId?{...t,...taskForm.value}:t) }
  else { tasks.value.push({ id:Date.now(), ...taskForm.value, status:'活跃', participants:0, completionRate:0 }) }
  closeModal()
}

function openTaskStats(task) {
  modal.value = { show:true, type:'taskStats', title:`任务统计 — ${task.title}`, wide:true,
    data: {
      stats: [
        { label:'参与人数', value:task.participants.toLocaleString(), color:'#3b82f6' },
        { label:'完成率',   value:`${task.completionRate}%`, color:'#22c55e' },
        { label:'奖励积分', value:`+${task.points}`, color:'#f59e0b' },
        { label:'碳减排',   value:'3.2 kg', color:'#16a34a' },
      ],
      topUsers: [
        {name:'环保先锋',count:28,pts:280},{name:'绿色使者',count:25,pts:250},
        {name:'低碳达人',count:22,pts:220},{name:'分类高手',count:20,pts:200},{name:'环保小将',count:18,pts:180},
      ]
    }
  }
}
</script>

<style scoped>
.admin-layout { display:flex; min-height:100vh; background:#f0fdf4; font-family:'PingFang SC','Microsoft YaHei',Helvetica,sans-serif; }
.main-content { flex:1; margin-left:240px; padding:36px 40px; min-width:0; }
.page-header  { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
.page-title   { font-size:26px; font-weight:700; color:#111; margin:0 0 6px; }
.page-sub     { font-size:14px; color:#6b7280; margin:0 0 28px; }
.filter-bar   { display:flex; gap:12px; margin-bottom:20px; align-items:center; }
.search-input { flex:1; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; font-family:inherit; }
.search-input:focus { border-color:#22c55e; }
.filter-select { border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; background:#fff; cursor:pointer; font-family:inherit; min-width:130px; }
.stat-grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
.stat-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:18px 20px; }
.stat-label { font-size:13px; color:#6b7280; margin-bottom:8px; }
.stat-value { font-size:28px; font-weight:700; color:#111; }
.stat-value.green  { color:#22c55e; } .stat-value.blue { color:#3b82f6; } .stat-value.purple { color:#a855f7; }
.table-card  { background:#fff; border-radius:14px; border:1px solid #e5e7eb; overflow:hidden; }
.data-table  { width:100%; border-collapse:collapse; font-size:14px; }
.data-table thead tr { background:#f0fdf4; }
.data-table th { padding:14px 16px; text-align:left; font-weight:600; font-size:13px; color:#374151; white-space:nowrap; }
.data-table td { padding:15px 16px; border-top:1px solid #f3f4f6; vertical-align:middle; }
.data-table tbody tr:hover { background:#fafafa; }
.progress-wrap { width:80px; height:6px; background:#e5e7eb; border-radius:99px; margin-bottom:4px; }
.progress-bar  { height:100%; background:#22c55e; border-radius:99px; }
.badge         { font-size:12px; padding:3px 10px; border-radius:99px; font-weight:500; display:inline-block; white-space:nowrap; }
.badge-green   { background:#dcfce7; color:#166534; } .badge-blue { background:#dbeafe; color:#1e40af; }
.badge-purple  { background:#f3e8ff; color:#6b21a8; } .badge-gray  { background:#f3f4f6; color:#374151; }
.btn          { padding:9px 18px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:opacity .15s; font-family:inherit; }
.btn:hover    { opacity:.85; }
.btn-primary  { background:#22c55e; color:#fff; } .btn-danger { background:#ef4444; color:#fff; }
.btn-outline  { background:#fff; color:#22c55e; border:1px solid #22c55e; }
.btn-ghost    { background:#fff; color:#6b7280; border:1px solid #e5e7eb; }
.btn-sm       { padding:5px 12px; font-size:13px; border-radius:8px; }
.fw500 { font-weight:500; } .green { color:#22c55e; } .gray { color:#6b7280; }
.fs12 { font-size:12px; } .fs13 { font-size:13px; } .flex { display:flex; } .gap8 { gap:8px; }
.overlay    { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:1000; display:flex; align-items:center; justify-content:center; }
.modal-box  { background:#fff; border-radius:18px; padding:32px; min-width:460px; max-width:560px; width:92vw; box-shadow:0 12px 40px rgba(0,0,0,.18); max-height:90vh; overflow-y:auto; }
.modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; }
.modal-title  { font-weight:700; font-size:20px; }
.modal-close  { border:none; background:none; font-size:26px; cursor:pointer; color:#6b7280; }
.modal-body   { display:flex; flex-direction:column; gap:14px; }
.modal-input  { width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; font-family:inherit; box-sizing:border-box; }
.modal-input:focus { border-color:#22c55e; }
.modal-textarea { width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; font-family:inherit; resize:vertical; box-sizing:border-box; }
.modal-footer { display:flex; justify-content:flex-end; gap:10px; margin-top:8px; }
.form-group       { display:flex; flex-direction:column; gap:6px; }
.form-group label { font-size:13px; color:#374151; font-weight:500; }
.form-row2        { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
</style>