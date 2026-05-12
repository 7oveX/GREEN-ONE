<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="main-content">

      <h1 class="page-title">事件审核管理</h1>
      <p class="page-sub">审核、派单、跟进环保事件全流程</p>

      <!-- Stats -->
      <div class="stat-grid6">
        <div class="stat-card" v-for="s in eventStatuses" :key="s">
          <div class="stat-label">{{ s }}</div>
          <div class="stat-value" :style="{color:evtStatusColor(s),fontSize:'24px'}">{{ events.filter(e=>e.status===s).length }}</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <input v-model="eventSearch" placeholder="搜索事件ID / 上报人 / 标题..." class="search-input"/>
        <select v-model="eventTypeFilter" class="filter-select">
          <option value="all">全部类型</option>
          <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- Tab pills -->
      <div class="tab-bar">
        <button v-for="t in ['全部',...eventStatuses]" :key="t"
          class="tab-btn" :class="{active: eventTabFilter===t}"
          @click="eventTabFilter=t">{{ t }}</button>
      </div>

      <!-- Event cards -->
      <div class="event-list">
        <div class="event-card" v-for="ev in filteredEvents" :key="ev.id">
          <div class="event-header">
            <div class="flex gap8" style="align-items:center;flex-wrap:wrap">
              <span class="event-title">{{ ev.title }}</span>
              <span class="badge" :style="evtBadgeStyle(ev.status)">{{ ev.status }}</span>
              <span class="badge badge-gray">{{ ev.type }}</span>
            </div>
            <span class="gray fs12">{{ ev.no }}</span>
          </div>
          <div class="event-meta">
            上报人：{{ ev.reporter }} &nbsp;|&nbsp; 联系：{{ ev.phone }}
            &nbsp;|&nbsp; 位置：{{ ev.location }}
          </div>
          <div class="event-desc">{{ ev.desc }}</div>

          <div class="event-imgs" v-if="ev.images && ev.images.length">
            <div class="event-img-placeholder" v-for="(img,i) in ev.images" :key="i">🖼 图片{{ i+1 }}</div>
          </div>

          <div class="event-progress" v-if="ev.handler">
            <span class="gray fs13">处理人：{{ ev.handler }}</span>
            <span class="gray fs13" v-if="ev.assignTime">派单时间：{{ ev.assignTime }}</span>
          </div>

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

    </main>

    <!-- Modals -->
    <div v-if="modal.show" class="overlay" @click.self="closeModal">
      <div class="modal-box" :style="modal.wide?'max-width:680px':''">
        <div class="modal-header">
          <span class="modal-title">{{ modal.title }}</span>
          <button class="modal-close" @click="closeModal">×</button>
        </div>

        <!-- 事件详情 -->
        <div v-if="modal.type==='eventDetail'" class="modal-body">
          <div class="detail-row" v-for="row in modal.data.rows" :key="row[0]">
            <span class="detail-label">{{ row[0] }}：</span><span>{{ row[1] }}</span>
          </div>
          <div class="form-group" style="margin-top:16px">
            <label>处理备注 / 审核意见</label>
            <textarea class="modal-textarea" rows="3" placeholder="填写审核意见或处理备注..."></textarea>
          </div>
          <div class="modal-footer"><button class="btn btn-ghost" @click="closeModal">关闭</button></div>
        </div>

        <!-- 驳回 -->
        <div v-if="modal.type==='reject'" class="modal-body">
          <p class="modal-desc">请填写驳回原因（将同步通知上报用户）：</p>
          <textarea v-model="rejectReason" rows="4" class="modal-textarea" placeholder="请输入驳回原因..."></textarea>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-danger" @click="confirmReject">确认驳回</button>
          </div>
        </div>

        <!-- 派单 -->
        <div v-if="modal.type==='assign'" class="modal-body">
          <p class="modal-desc">指派处理人员：</p>
          <input v-model="assignPerson" class="modal-input" placeholder="输入处理人员姓名或工号..."/>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-blue" @click="confirmAssign">确认派单</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const eventStatuses  = ['待审核','审核中','已派单','处理中','已完成','已驳回']
const eventTypes     = ['垃圾乱放','污水排放','噪音污染','其他']
const eventSearch    = ref('')
const eventTabFilter = ref('全部')
const eventTypeFilter = ref('all')

const events = ref([
  { id:1, no:'EP20260409001', title:'公园内垃圾桶满溢', type:'垃圾乱放', reporter:'环保达人', phone:'138****1001', location:'朝阳公园东门', desc:'公园东门附近的垃圾桶已经满溢，垃圾散落在地上，影响环境卫生。', time:'2026-04-09 08:30', status:'待审核', images:['img1','img2'], handler:null, assignTime:null },
  { id:2, no:'EP20260408002', title:'河道发现污水排放', type:'污水排放', reporter:'绿色使者',  phone:'138****1002', location:'清河北岸',     desc:'发现有工厂向河道排放黑色污水，水质明显变差。',                  time:'2026-04-08 15:20', status:'审核中', images:['img1'], handler:null, assignTime:null },
  { id:3, no:'EP20260407003', title:'夜间施工噪音扰民', type:'噪音污染', reporter:'低碳达人',  phone:'138****1003', location:'望京SOHO',     desc:'夜间10点后仍有施工噪音，严重影响周边居民休息。',               time:'2026-04-07 22:00', status:'已派单', images:[], handler:'张工', assignTime:'2026-04-08 09:00' },
  { id:4, no:'EP20260406004', title:'工地扬尘污染',     type:'其他',     reporter:'环保新星',  phone:'138****1004', location:'建国门外大街',  desc:'工地未采取防尘措施，扬尘严重影响空气质量。',                    time:'2026-04-06 11:20', status:'处理中', images:[], handler:'李工', assignTime:'2026-04-07 10:00' },
])

const filteredEvents = computed(() => events.value.filter(e => {
  const q = eventSearch.value
  return (e.no.includes(q)||e.reporter.includes(q)||e.title.includes(q)) &&
    (eventTabFilter.value==='全部'||e.status===eventTabFilter.value) &&
    (eventTypeFilter.value==='all'||e.type===eventTypeFilter.value)
}))

const evtStatusStyle = {
  '待审核':{ bg:'#fef9c3', color:'#854d0e' }, '审核中':{ bg:'#dbeafe', color:'#1e40af' },
  '已派单':{ bg:'#fde68a', color:'#92400e' }, '处理中':{ bg:'#fed7aa', color:'#9a3412' },
  '已完成':{ bg:'#dcfce7', color:'#166534' }, '已驳回':{ bg:'#fee2e2', color:'#991b1b' },
}
const evtColorMap = { '待审核':'#854d0e','审核中':'#1e40af','已派单':'#92400e','处理中':'#9a3412','已完成':'#166534','已驳回':'#991b1b' }
function evtBadgeStyle(s) { const c=evtStatusStyle[s]||{bg:'#f3f4f6',color:'#374151'}; return {background:c.bg,color:c.color} }
function evtStatusColor(s) { return evtColorMap[s]||'#374151' }
function updateEvent(id, status) { events.value = events.value.map(e=>e.id===id?{...e,status}:e) }

// Modal
const modal        = ref({ show:false, type:'', title:'', data:{}, wide:false })
const rejectReason = ref('')
const assignPerson = ref('')
let rejectTargetId = null
let assignTargetId = null

function closeModal() { modal.value.show = false }

function showEventDetail(ev) {
  modal.value = { show:true, type:'eventDetail', title:'事件详情', wide:true,
    data:{ rows:[['工单号',ev.no],['标题',ev.title],['类型',ev.type],['上报人',ev.reporter],['联系方式',ev.phone],['位置',ev.location],['状态',ev.status],['处理人',ev.handler||'未派单'],['上报时间',ev.time],['描述',ev.desc]] }
  }
}
function openRejectModal(ev) { rejectTargetId=ev.id; rejectReason.value=''; modal.value={show:true,type:'reject',title:'驳回事件',data:{}} }
function confirmReject() { updateEvent(rejectTargetId,'已驳回'); closeModal() }
function openAssignModal(ev) { assignTargetId=ev.id; assignPerson.value=''; modal.value={show:true,type:'assign',title:'派单',data:{}} }
function confirmAssign() {
  events.value = events.value.map(e=>e.id===assignTargetId?{...e,status:'已派单',handler:assignPerson.value||'待确认',assignTime:new Date().toLocaleString()}:e)
  closeModal()
}
</script>

<style scoped>
.admin-layout { display:flex; min-height:100vh; background:#f0fdf4; font-family:'PingFang SC','Microsoft YaHei',Helvetica,sans-serif; }
.main-content { flex:1; margin-left:240px; padding:36px 40px; min-width:0; }
.page-title   { font-size:26px; font-weight:700; color:#111; margin:0 0 6px; }
.page-sub     { font-size:14px; color:#6b7280; margin:0 0 28px; }
.stat-grid6   { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:24px; }
.stat-card    { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:16px 18px; }
.stat-label   { font-size:13px; color:#6b7280; margin-bottom:6px; }
.stat-value   { font-weight:700; }
.filter-bar   { display:flex; gap:12px; margin-bottom:20px; align-items:center; }
.search-input { flex:1; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; font-family:inherit; }
.search-input:focus { border-color:#22c55e; }
.filter-select { border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; background:#fff; cursor:pointer; font-family:inherit; min-width:130px; }
.tab-bar { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
.tab-btn { padding:8px 16px; border-radius:99px; border:1px solid #e5e7eb; font-size:13px; cursor:pointer; background:#fff; color:#374151; transition:all .15s; font-family:inherit; }
.tab-btn.active { background:#22c55e; color:#fff; border-color:#22c55e; }
.event-list   { display:flex; flex-direction:column; gap:14px; }
.event-card   { background:#fff; border-radius:14px; border:1px solid #e5e7eb; padding:22px 24px; }
.event-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px; }
.event-title  { font-weight:600; font-size:17px; }
.event-meta   { font-size:13px; color:#6b7280; margin-bottom:8px; }
.event-desc   { font-size:14px; color:#374151; margin-bottom:12px; line-height:1.7; }
.event-imgs   { display:flex; gap:10px; margin-bottom:12px; }
.event-img-placeholder { width:80px; height:60px; background:#f3f4f6; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px; color:#9ca3af; }
.event-progress { display:flex; gap:20px; margin-bottom:12px; flex-wrap:wrap; }
.event-footer { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
.event-time   { font-size:12px; color:#9ca3af; }
.event-actions { display:flex; gap:8px; flex-wrap:wrap; }
.badge        { font-size:12px; padding:3px 10px; border-radius:99px; font-weight:500; display:inline-block; white-space:nowrap; }
.badge-gray   { background:#f3f4f6; color:#374151; }
.btn          { padding:9px 18px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:opacity .15s; font-family:inherit; }
.btn:hover    { opacity:.85; }
.btn-primary  { background:#22c55e; color:#fff; }
.btn-danger   { background:#ef4444; color:#fff; }
.btn-blue     { background:#3b82f6; color:#fff; }
.btn-outline  { background:#fff; color:#22c55e; border:1px solid #22c55e; }
.btn-ghost    { background:#fff; color:#6b7280; border:1px solid #e5e7eb; }
.btn-sm       { padding:5px 12px; font-size:13px; border-radius:8px; }
.empty-state  { text-align:center; padding:48px; color:#9ca3af; font-size:15px; }
.gray { color:#6b7280; } .fs12 { font-size:12px; } .fs13 { font-size:13px; } .flex { display:flex; } .gap8 { gap:8px; }
.overlay    { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:1000; display:flex; align-items:center; justify-content:center; }
.modal-box  { background:#fff; border-radius:18px; padding:32px; min-width:460px; max-width:560px; width:92vw; box-shadow:0 12px 40px rgba(0,0,0,.18); max-height:90vh; overflow-y:auto; }
.modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; }
.modal-title  { font-weight:700; font-size:20px; }
.modal-close  { border:none; background:none; font-size:26px; cursor:pointer; color:#6b7280; }
.modal-body   { display:flex; flex-direction:column; gap:14px; }
.modal-desc   { font-size:14px; color:#374151; }
.modal-input  { width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; font-family:inherit; box-sizing:border-box; }
.modal-input:focus { border-color:#22c55e; }
.modal-textarea { width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; font-family:inherit; resize:vertical; box-sizing:border-box; }
.modal-footer { display:flex; justify-content:flex-end; gap:10px; margin-top:8px; }
.form-group       { display:flex; flex-direction:column; gap:6px; }
.form-group label { font-size:13px; color:#374151; font-weight:500; }
.detail-row   { display:flex; gap:10px; font-size:14px; padding:5px 0; border-bottom:1px solid #f9fafb; }
.detail-label { color:#6b7280; min-width:80px; flex-shrink:0; }
</style>