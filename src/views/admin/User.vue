<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="main-content">

      <div class="page-header">
        <div>
          <h1 class="page-title">用户管理</h1>
          <p class="page-sub">管理平台所有用户账号、积分与权限</p>
        </div>
        <div class="flex gap8">
          <button class="btn btn-ghost" @click="exportData">📤 导出数据</button>
          <button class="btn btn-primary" @click="openUserModal()">+ 新增用户</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <input v-model="userSearch" placeholder="搜索用户名 / 手机号 / 邮箱..." class="search-input" style="flex:2"/>
        <select v-model="userStatusFilter" class="filter-select">
          <option value="all">所有状态</option>
          <option value="正常">正常</option>
          <option value="已封禁">已封禁</option>
        </select>
        <select v-model="userPointsFilter" class="filter-select">
          <option value="all">积分区间</option>
          <option value="0-1000">0 - 1000</option>
          <option value="1001-5000">1001 - 5000</option>
          <option value="5001+">5001+</option>
        </select>
      </div>

      <!-- Stats -->
      <div class="stat-grid4">
        <div class="stat-card"><div class="stat-label">总用户数</div><div class="stat-value">{{ users.length }}</div></div>
        <div class="stat-card"><div class="stat-label">活跃用户</div><div class="stat-value green">{{ users.filter(u=>u.status==='正常').length }}</div></div>
        <div class="stat-card"><div class="stat-label">已封禁</div><div class="stat-value red">{{ users.filter(u=>u.status==='已封禁').length }}</div></div>
        <div class="stat-card"><div class="stat-label">平均积分</div><div class="stat-value blue">{{ Math.round(users.reduce((a,u)=>a+u.points,0)/users.length).toLocaleString() }}</div></div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table">
          <thead><tr>
            <th>用户ID</th><th>用户名</th><th>手机号</th><th>注册时间</th>
            <th>碳积分</th><th>累计碳减排</th><th>状态</th><th>操作</th>
          </tr></thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td class="gray fs13">#{{ u.id }}</td>
              <td>
                <div class="fw500">{{ u.name }}</div>
                <div class="fs12 gray">{{ u.email }}</div>
              </td>
              <td class="fs13">{{ u.phone }}</td>
              <td class="gray fs13">{{ u.regDate }}</td>
              <td><span class="green fw500">{{ u.points.toLocaleString() }}</span></td>
              <td class="fs13">{{ u.carbon }} kg</td>
              <td><span class="badge" :class="u.status==='正常'?'badge-green':'badge-red'">{{ u.status }}</span></td>
              <td>
                <div class="flex gap8" style="flex-wrap:wrap">
                  <button class="btn btn-outline btn-sm" @click="openUserDetail(u)">详情</button>
                  <button class="btn btn-ghost btn-sm" @click="openUserModal(u)">编辑</button>
                  <button v-if="u.status==='正常'" class="btn btn-danger btn-sm" @click="toggleUser(u.id,'ban')">封禁</button>
                  <button v-else class="btn btn-primary btn-sm" @click="toggleUser(u.id,'unban')">解封</button>
                  <button class="btn btn-ghost btn-sm" @click="resetPassword(u)">重置密码</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>

    <!-- Modal -->
    <div v-if="modal.show" class="overlay" @click.self="closeModal">
      <div class="modal-box" :style="modal.wide?'max-width:680px':''">
        <div class="modal-header">
          <span class="modal-title">{{ modal.title }}</span>
          <button class="modal-close" @click="closeModal">×</button>
        </div>

        <!-- 新增/编辑用户 -->
        <div v-if="modal.type==='user'" class="modal-body">
          <div class="form-row2">
            <div class="form-group"><label>用户名</label><input v-model="userForm.name" class="modal-input" placeholder="输入用户名"/></div>
            <div class="form-group"><label>邮箱</label><input v-model="userForm.email" class="modal-input" placeholder="输入邮箱"/></div>
          </div>
          <div class="form-row2">
            <div class="form-group"><label>手机号</label><input v-model="userForm.phone" class="modal-input" placeholder="输入手机号"/></div>
            <div class="form-group"><label>初始积分</label><input v-model.number="userForm.points" type="number" class="modal-input" placeholder="0"/></div>
          </div>
          <div class="form-group"><label>管理员备注</label><textarea v-model="userForm.note" rows="2" class="modal-textarea" placeholder="填写备注..."></textarea></div>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-primary" @click="saveUser">保存</button>
          </div>
        </div>

        <!-- 用户详情 -->
        <div v-if="modal.type==='userDetail'" class="modal-body">
          <div class="user-detail-grid">
            <div class="detail-block">
              <div class="detail-block-title">基础信息</div>
              <div class="detail-row" v-for="row in modal.data.basic" :key="row[0]">
                <span class="detail-label">{{ row[0] }}：</span><span>{{ row[1] }}</span>
              </div>
            </div>
            <div class="detail-block">
              <div class="detail-block-title">积分 & 碳减排</div>
              <div class="detail-row" v-for="row in modal.data.stats" :key="row[0]">
                <span class="detail-label">{{ row[0] }}：</span><span class="green fw500">{{ row[1] }}</span>
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-top:16px">
            <label>管理员备注</label>
            <textarea rows="2" class="modal-textarea" :placeholder="modal.data.note||'暂无备注'"></textarea>
          </div>
          <div class="modal-footer"><button class="btn btn-ghost" @click="closeModal">关闭</button></div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const users = ref([
  { id:1, name:'环保先锋', email:'user1@example.com', phone:'138****0001', role:'普通用户', status:'正常',  level:8, points:12580, carbon:156.3, regDate:'2026-01-15', lastActive:'2026-04-09 10:30', note:'' },
  { id:2, name:'绿色使者', email:'user2@example.com', phone:'138****0002', role:'普通用户', status:'正常',  level:7, points:11340, carbon:134.2, regDate:'2026-01-20', lastActive:'2026-04-09 09:15', note:'' },
  { id:3, name:'低碳达人', email:'user3@example.com', phone:'138****0003', role:'普通用户', status:'正常',  level:6, points:9850,  carbon:112.8, regDate:'2026-02-05', lastActive:'2026-04-08 22:45', note:'' },
  { id:4, name:'违规用户', email:'bad@example.com',   phone:'138****0004', role:'普通用户', status:'已封禁',level:2, points:150,   carbon:2.1,   regDate:'2026-03-10', lastActive:'2026-04-01 15:20', note:'多次违规上报' },
])

const userSearch       = ref('')
const userStatusFilter = ref('all')
const userPointsFilter = ref('all')

const filteredUsers = computed(() => users.value.filter(u => {
  const q = userSearch.value
  const matchSearch = u.name.includes(q) || u.email.includes(q) || u.phone.includes(q)
  const matchStatus = userStatusFilter.value === 'all' || u.status === userStatusFilter.value
  const matchPoints =
    userPointsFilter.value === 'all'       ? true :
    userPointsFilter.value === '0-1000'    ? u.points <= 1000 :
    userPointsFilter.value === '1001-5000' ? u.points > 1000 && u.points <= 5000 :
    u.points > 5000
  return matchSearch && matchStatus && matchPoints
}))

function toggleUser(id, action) {
  users.value = users.value.map(u => u.id === id ? { ...u, status: action === 'ban' ? '已封禁' : '正常' } : u)
}
function resetPassword(u) { alert(`已为用户「${u.name}」重置密码，临时密码已发送至绑定手机`) }
function exportData() { alert('导出功能（对接后端接口后实现）') }

// Modal
const modal    = ref({ show:false, type:'', title:'', data:{}, wide:false })
const userForm = ref({ name:'', email:'', phone:'', points:0, note:'' })
let editingUserId = null

function closeModal() { modal.value.show = false }

function openUserModal(user = null) {
  editingUserId = user ? user.id : null
  userForm.value = user ? { name:user.name, email:user.email, phone:user.phone, points:user.points, note:user.note } : { name:'', email:'', phone:'', points:0, note:'' }
  modal.value = { show:true, type:'user', title: user ? '编辑用户' : '新增用户', data:{} }
}
function saveUser() {
  if (!userForm.value.name) return
  if (editingUserId) {
    users.value = users.value.map(u => u.id === editingUserId ? { ...u, ...userForm.value } : u)
  } else {
    users.value.push({ id:Date.now(), ...userForm.value, role:'普通用户', status:'正常', level:1, carbon:0, regDate:new Date().toISOString().slice(0,10), lastActive:'—' })
  }
  closeModal()
}

function openUserDetail(u) {
  modal.value = {
    show:true, type:'userDetail', title:`用户详情 — ${u.name}`, wide:true,
    data: {
      basic: [['用户ID',`#${u.id}`],['用户名',u.name],['邮箱',u.email],['手机号',u.phone],['注册时间',u.regDate],['最后活跃',u.lastActive],['账号状态',u.status]],
      stats: [['等级',`LV ${u.level}`],['碳积分',`${u.points.toLocaleString()} 分`],['累计碳减排',`${u.carbon} kg`]],
      note: u.note,
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
.stat-value.green { color:#22c55e; } .stat-value.blue { color:#3b82f6; } .stat-value.red { color:#ef4444; }
.table-card  { background:#fff; border-radius:14px; border:1px solid #e5e7eb; overflow:hidden; }
.data-table  { width:100%; border-collapse:collapse; font-size:14px; }
.data-table thead tr { background:#f0fdf4; }
.data-table th { padding:14px 16px; text-align:left; font-weight:600; font-size:13px; color:#374151; white-space:nowrap; }
.data-table td { padding:15px 16px; border-top:1px solid #f3f4f6; vertical-align:middle; }
.data-table tbody tr:hover { background:#fafafa; }
.badge        { font-size:12px; padding:3px 10px; border-radius:99px; font-weight:500; display:inline-block; }
.badge-green  { background:#dcfce7; color:#166534; }
.badge-red    { background:#fee2e2; color:#991b1b; }
.btn          { padding:9px 18px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:opacity .15s; font-family:inherit; }
.btn:hover    { opacity:.85; }
.btn-primary  { background:#22c55e; color:#fff; }
.btn-danger   { background:#ef4444; color:#fff; }
.btn-outline  { background:#fff; color:#22c55e; border:1px solid #22c55e; }
.btn-ghost    { background:#fff; color:#6b7280; border:1px solid #e5e7eb; }
.btn-sm       { padding:5px 12px; font-size:13px; border-radius:8px; }
.fw500 { font-weight:500; } .green { color:#22c55e; } .gray { color:#6b7280; } .fs12 { font-size:12px; } .fs13 { font-size:13px; }
.flex { display:flex; } .gap8 { gap:8px; }
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
.user-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.detail-block     { flex:1; }
.detail-block-title { font-weight:600; font-size:14px; margin-bottom:10px; color:#374151; }
.detail-row       { display:flex; gap:10px; font-size:14px; padding:5px 0; border-bottom:1px solid #f9fafb; }
.detail-label     { color:#6b7280; min-width:80px; flex-shrink:0; }
</style>