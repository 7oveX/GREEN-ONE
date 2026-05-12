<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="main-content">

      <div class="page-header">
        <div>
          <h1 class="page-title">知识库管理</h1>
          <p class="page-sub">维护垃圾分类与环保知识内容</p>
        </div>
        <div class="flex gap8">
          <button class="btn btn-ghost" @click="openCsvModal">📤 批量导入</button>
          <button class="btn btn-ghost" @click="exportData">📥 导出数据</button>
          <button class="btn btn-primary" @click="openKnowModal()">+ 新增知识</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <input v-model="knowSearch" placeholder="搜索知识名称 / 关键词 / 标签..." class="search-input"/>
        <select v-model="knowCatFilter" class="filter-select">
          <option value="all">全部分类</option>
          <option v-for="c in catList" :key="c.name" :value="c.name">{{ c.name }}</option>
        </select>
      </div>

      <!-- Stats -->
      <div class="stat-grid5">
        <div class="stat-card"><div class="stat-label">总词条数</div><div class="stat-value">{{ knowledge.length }}</div></div>
        <div class="stat-card" v-for="c in catList" :key="c.name">
          <div class="stat-label">{{ c.name }}</div>
          <div class="stat-value" :style="{color:c.color}">{{ knowledge.filter(i=>i.category===c.name).length }}</div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table">
          <thead><tr>
            <th>ID</th><th>知识名称</th><th>分类</th><th>标签</th>
            <th>浏览量</th><th>发布时间</th><th>操作</th>
          </tr></thead>
          <tbody>
            <tr v-for="it in filteredKnowledge" :key="it.id">
              <td class="gray fs13">#{{ it.id }}</td>
              <td>
                <div class="fw500">{{ it.name }}</div>
                <div v-if="it.top" style="font-size:11px;color:#f59e0b;margin-top:2px">📌 已置顶</div>
              </td>
              <td><span class="badge" :style="catBadgeStyle(it.category)">{{ it.category }}</span></td>
              <td>
                <span v-for="tag in it.tags.slice(0,3)" :key="tag" class="tag">{{ tag }}</span>
              </td>
              <td class="gray fs13">{{ it.views.toLocaleString() }}</td>
              <td class="gray fs13">{{ it.created }}</td>
              <td>
                <div class="flex gap8" style="flex-wrap:wrap">
                  <button class="btn btn-outline btn-sm" @click="openKnowDetail(it)">详情</button>
                  <button class="btn btn-ghost btn-sm" @click="openKnowModal(it)">编辑</button>
                  <button class="btn btn-ghost btn-sm" @click="toggleTop(it.id)">{{ it.top?'取消置顶':'置顶' }}</button>
                  <button class="btn btn-danger btn-sm" @click="deleteKnow(it.id)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredKnowledge.length===0">
              <td colspan="7" class="empty-state">暂无数据</td>
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

        <!-- 新增/编辑 -->
        <div v-if="modal.type==='know'" class="modal-body">
          <div class="form-row2">
            <div class="form-group"><label>知识名称</label><input v-model="knowForm.name" class="modal-input" placeholder="输入知识名称"/></div>
            <div class="form-group"><label>分类</label>
              <select v-model="knowForm.category" class="modal-input">
                <option v-for="c in catList" :key="c.name" :value="c.name">{{ c.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>子分类</label><input v-model="knowForm.sub" class="modal-input" placeholder="例：塑料类、纸类..."/></div>
          <div class="form-group"><label>完整内容</label><textarea v-model="knowForm.content" rows="4" class="modal-textarea" placeholder="填写知识详细内容..."></textarea></div>
          <div class="form-group"><label>知识标签（逗号分隔）</label><input v-model="knowForm.tagsRaw" class="modal-input" placeholder="例：快递盒,纸盒,包装盒"/></div>
          <div class="modal-footer">
            <button class="btn btn-ghost" @click="closeModal">取消</button>
            <button class="btn btn-primary" @click="saveKnow">保存发布</button>
          </div>
        </div>

        <!-- 知识详情 -->
        <div v-if="modal.type==='knowDetail'" class="modal-body">
          <div class="detail-row" v-for="row in modal.data.rows" :key="row[0]">
            <span class="detail-label">{{ row[0] }}：</span><span>{{ row[1] }}</span>
          </div>
          <div style="margin-top:14px">
            <div class="detail-label" style="display:block;margin-bottom:8px;font-weight:500">内容：</div>
            <div style="font-size:14px;line-height:1.9;color:#374151;background:#f9fafb;padding:14px 16px;border-radius:10px">{{ modal.data.content }}</div>
          </div>
          <div style="margin-top:12px" v-if="modal.data.tags&&modal.data.tags.length">
            <div class="detail-label" style="display:block;margin-bottom:6px;font-weight:500">标签：</div>
            <span v-for="tag in modal.data.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="modal-footer"><button class="btn btn-ghost" @click="closeModal">关闭</button></div>
        </div>

        <!-- CSV 导入 -->
        <div v-if="modal.type==='csv'" class="modal-body">
          <p class="modal-desc">上传 CSV，格式：<code class="code-tag">名称,分类,子分类,内容,标签1|标签2</code></p>
          <input type="file" accept=".csv" @change="handleCsvUpload" class="modal-input"/>
          <div class="modal-footer"><button class="btn btn-ghost" @click="closeModal">取消</button></div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const catList = [
  { name:'可回收物', color:'#1e40af' },
  { name:'有害垃圾', color:'#991b1b' },
  { name:'厨余垃圾', color:'#166534' },
  { name:'其他垃圾', color:'#374151' },
  { name:'环保常识', color:'#6b21a8' },
]
const catBadgeMap = {
  '可回收物':{ background:'#dbeafe', color:'#1e40af' },
  '有害垃圾':{ background:'#fee2e2', color:'#991b1b' },
  '厨余垃圾':{ background:'#dcfce7', color:'#166534' },
  '其他垃圾':{ background:'#f3f4f6', color:'#374151' },
  '环保常识':{ background:'#f3e8ff', color:'#6b21a8' },
}
function catBadgeStyle(cat) { return catBadgeMap[cat] || {} }

const knowledge = ref([
  { id:1, name:'塑料瓶',   category:'可回收物', sub:'塑料',      content:'常见的塑料瓶属于可回收物，投放前请清空瓶内液体并压扁。', tags:['矿泉水瓶','饮料瓶','PET'], views:5823, created:'2026-01-01', updated:'2026-01-01', top:true  },
  { id:2, name:'纸箱',     category:'可回收物', sub:'纸类',      content:'纸箱属于可回收物，折叠后投入可回收垃圾桶。',             tags:['快递盒','包装盒'],         views:4291, created:'2026-01-01', updated:'2026-01-01', top:false },
  { id:3, name:'电池',     category:'有害垃圾', sub:'电池类',    content:'废旧电池含有重金属，属于有害垃圾，请投入专用回收桶。',    tags:['干电池','充电电池'],       views:3654, created:'2026-01-01', updated:'2026-01-01', top:false },
  { id:4, name:'剩菜剩饭', category:'厨余垃圾', sub:'食物残渣',  content:'剩菜剩饭属于厨余垃圾，沥干水分后投放。',                 tags:['剩饭','厨余','湿垃圾'],    views:2198, created:'2026-01-01', updated:'2026-01-01', top:false },
  { id:5, name:'烟头',     category:'其他垃圾', sub:'一般废弃物',content:'烟头属于其他垃圾，不可回收，不属于有害垃圾。',            tags:['香烟','废弃物'],           views:1876, created:'2026-01-01', updated:'2026-01-01', top:false },
])

const knowSearch    = ref('')
const knowCatFilter = ref('all')

const filteredKnowledge = computed(() => knowledge.value.filter(i =>
  (i.name.includes(knowSearch.value) || i.tags.some(t=>t.includes(knowSearch.value))) &&
  (knowCatFilter.value==='all' || i.category===knowCatFilter.value)
))

function deleteKnow(id) { if(confirm('确认删除？')) knowledge.value=knowledge.value.filter(i=>i.id!==id) }
function toggleTop(id)  { knowledge.value=knowledge.value.map(i=>i.id===id?{...i,top:!i.top}:i) }
function exportData()   { alert('导出功能（对接后端接口后实现）') }

const modal    = ref({ show:false, type:'', title:'', data:{}, wide:false })
const knowForm = ref({ name:'', category:'可回收物', sub:'', content:'', tagsRaw:'' })
let editingKnowId = null

function closeModal() { modal.value.show = false }

function openKnowModal(item = null) {
  editingKnowId = item ? item.id : null
  knowForm.value = item
    ? { name:item.name, category:item.category, sub:item.sub, content:item.content, tagsRaw:item.tags.join(',') }
    : { name:'', category:'可回收物', sub:'', content:'', tagsRaw:'' }
  modal.value = { show:true, type:'know', title:item?'编辑知识':'新增知识', data:{}, wide:true }
}
function saveKnow() {
  if (!knowForm.value.name) return
  const today = new Date().toISOString().slice(0,10)
  const tags  = knowForm.value.tagsRaw.split(',').map(s=>s.trim()).filter(Boolean)
  if (editingKnowId) {
    knowledge.value = knowledge.value.map(i=>i.id===editingKnowId?{...i,...knowForm.value,tags,updated:today}:i)
  } else {
    knowledge.value.push({ id:Date.now(), ...knowForm.value, tags, views:0, created:today, updated:today, top:false })
  }
  closeModal()
}

function openKnowDetail(it) {
  modal.value = { show:true, type:'knowDetail', title:it.name, wide:true,
    data: { rows:[['ID',`#${it.id}`],['分类',it.category],['子分类',it.sub],['浏览量',it.views.toLocaleString()],['发布时间',it.created],['更新时间',it.updated]], content:it.content, tags:it.tags }
  }
}

function openCsvModal() { modal.value={ show:true, type:'csv', title:'批量导入 CSV', data:{} } }
function handleCsvUpload(e) {
  const file=e.target.files[0]; if(!file) return
  const reader=new FileReader()
  reader.onload=ev=>{
    const today=new Date().toISOString().slice(0,10)
    const newItems=ev.target.result.split('\n').filter(Boolean).map((l,i)=>{
      const [name,category,sub,content,tagsRaw]=l.split(',').map(s=>s.trim())
      return { id:Date.now()+i, name, category:category||'其他垃圾', sub:sub||'', content:content||'',
        tags:tagsRaw?tagsRaw.split('|').map(s=>s.trim()):[], views:0, created:today, updated:today, top:false }
    }).filter(it=>it.name)
    knowledge.value.push(...newItems)
    closeModal()
  }
  reader.readAsText(file)
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
.stat-grid5 { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:24px; }
.stat-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:18px 20px; }
.stat-label { font-size:13px; color:#6b7280; margin-bottom:8px; }
.stat-value { font-size:28px; font-weight:700; color:#111; }
.table-card  { background:#fff; border-radius:14px; border:1px solid #e5e7eb; overflow:hidden; }
.data-table  { width:100%; border-collapse:collapse; font-size:14px; }
.data-table thead tr { background:#f0fdf4; }
.data-table th { padding:14px 16px; text-align:left; font-weight:600; font-size:13px; color:#374151; white-space:nowrap; }
.data-table td { padding:15px 16px; border-top:1px solid #f3f4f6; vertical-align:middle; }
.data-table tbody tr:hover { background:#fafafa; }
.badge        { font-size:12px; padding:3px 10px; border-radius:99px; font-weight:500; display:inline-block; white-space:nowrap; }
.tag          { display:inline-block; background:#f0fdf4; color:#16a34a; font-size:12px; padding:2px 8px; border-radius:6px; margin-right:4px; margin-bottom:2px; border:1px solid #bbf7d0; }
.btn          { padding:9px 18px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:opacity .15s; font-family:inherit; }
.btn:hover    { opacity:.85; }
.btn-primary  { background:#22c55e; color:#fff; }
.btn-danger   { background:#ef4444; color:#fff; }
.btn-outline  { background:#fff; color:#22c55e; border:1px solid #22c55e; }
.btn-ghost    { background:#fff; color:#6b7280; border:1px solid #e5e7eb; }
.btn-sm       { padding:5px 12px; font-size:13px; border-radius:8px; }
.empty-state  { text-align:center; padding:48px; color:#9ca3af; font-size:15px; }
.fw500 { font-weight:500; } .gray { color:#6b7280; } .fs12 { font-size:12px; } .fs13 { font-size:13px; } .flex { display:flex; } .gap8 { gap:8px; }
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
.form-row2        { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.detail-row   { display:flex; gap:10px; font-size:14px; padding:5px 0; border-bottom:1px solid #f9fafb; }
.detail-label { color:#6b7280; min-width:80px; flex-shrink:0; }
.code-tag     { background:#f3f4f6; padding:2px 8px; border-radius:4px; font-size:13px; font-family:monospace; }
</style>