<template>
    <div class="report-container">
      <UserSidebar />
      <h1 class="page-title">事件上报</h1>
  
      <div class="form-card">
        <!-- 事件标题 -->
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📋</span>
            事件标题
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="请简要描述环保问题"
            maxlength="50"
          />
        </div>
  
        <!-- 事件类型 -->
        <div class="form-group">
          <label class="form-label">事件类型</label>
          <div class="type-list">
            <div
              v-for="type in typeOptions"
              :key="type.id"
              class="type-item"
              :class="{ active: formData.typeId === type.id }"
              @click="formData.typeId = type.id"
            >
              {{ type.name }}
            </div>
          </div>
        </div>
  
        <!-- 事件描述 -->
        <div class="form-group">
          <label class="form-label">事件描述</label>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请详细描述您发现的环保问题..."
            rows="6"
            maxlength="500"
          ></textarea>
        </div>
  
        <!-- 事件位置 -->
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📍</span>
            事件位置
          </label>
          <input
            v-model="formData.location"
            type="text"
            class="form-input"
            placeholder="请输入详细地址或点击定位"
          />
          <div class="location-option" @click="getCurrentLocation">
            <span class="location-icon">📍</span>
            使用当前位置
          </div>
        </div>
  
        <!-- 现场照片 -->
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📷</span>
            现场照片（最多5张）
          </label>
          <div class="upload-area">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleFileChange"
              hidden
            />
            <div class="upload-box" @click="$refs.fileInput.click()">
              <span class="upload-icon">⮉</span>
              <span class="upload-text">上传照片</span>
            </div>
            <div class="preview-list">
              <div
                v-for="(file, index) in previewFiles"
                :key="index"
                class="preview-item"
              >
                <img :src="file.url" alt="预览图" />
                <span class="delete-btn" @click="deleteFile(index)">×</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 提交按钮 -->
        <button class="submit-btn" @click="handleSubmit" :disabled="!isFormValid">
          提交上报
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import UserSidebar from '../../components/UserSidebar.vue'
  
  // 数据定义
  const typeOptions = ref([])
  const formData = ref({
    title: '',
    typeId: 1, // 默认选中第一个
    description: '',
    location: ''
  })
  const previewFiles = ref([])
  const fileInput = ref(null)
  
  // 表单验证
  const isFormValid = computed(() => {
    return (
      formData.value.title.trim() !== '' &&
      formData.value.description.trim() !== '' &&
      formData.value.location.trim() !== ''
    )
  })
  
  // 获取事件类型
  const fetchTypeOptions = async () => {
    const res = await axios.get('/api/report/types')
    typeOptions.value = res.data.data
  }
  
  // 文件上传处理
  const handleFileChange = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
  
    // 限制最多5张
    const remaining = 5 - previewFiles.value.length
    if (remaining <= 0) {
      alert('最多只能上传5张照片')
      return
    }
  
    const addFiles = Array.from(files).slice(0, remaining)
    addFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        previewFiles.value.push({
          file,
          url: event.target.result
        })
      }
      reader.readAsDataURL(file)
    })
  
    // 清空input，避免重复选择同一文件不触发
    e.target.value = ''
  }
  
  // 删除文件
  const deleteFile = (index) => {
    previewFiles.value.splice(index, 1)
  }
  
  // 获取当前位置
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('您的浏览器不支持地理定位')
      return
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 模拟获取地址，实际项目可调用地图API逆编码
        formData.value.location = `当前位置（经度: ${position.coords.longitude.toFixed(4)}, 纬度: ${position.coords.latitude.toFixed(4)}）`
      },
      (error) => {
        alert('获取位置失败，请手动输入地址')
      }
    )
  }
  
  // 提交上报
  const handleSubmit = async () => {
    if (!isFormValid.value) {
      alert('请完善表单信息')
      return
    }
  
    const submitData = {
      ...formData.value,
      typeName: typeOptions.value.find(t => t.id === formData.value.typeId)?.name,
      images: previewFiles.value.map(f => f.url)
    }
  
    const res = await axios.post('/api/report/submit', submitData)
    if (res.data.data.success) {
      alert(res.data.data.message)
      // 重置表单
      formData.value = {
        title: '',
        typeId: 1,
        description: '',
        location: ''
      }
      previewFiles.value = []
    }
  }
  
  onMounted(() => {
    fetchTypeOptions()
  })
  </script>
  
  <style scoped>
  .report-container {
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
  
  .form-card {
    background: white;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    max-width: 1200px;
  }
  
  .form-group {
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .form-label {
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .label-icon {
    font-size: 24px;
    color: #22c55e;
  }
  
  .form-input {
    height: 64px;
    padding: 0 20px;
    border: 2px solid #e6f4e6;
    border-radius: 16px;
    font-size: 18px;
    outline: none;
    transition: all 0.3s;
    background: white;
  }
  
  .form-input:focus {
    border-color: #22c55e;
  }
  
  /* 事件类型选择 */
  .type-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  
  .type-item {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #dcfce7;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 500;
    color: #1f2937;
    cursor: pointer;
    transition: all 0.3s;
    background: white;
  }
  
  .type-item.active {
    border-color: #22c55e;
    background: #f0fdf4;
    color: #22c55e;
    font-weight: 600;
  }
  
  .type-item:hover:not(.active) {
    border-color: #22c55e;
    background: #f8fdf6;
  }
  
  /* 事件描述 */
  .form-textarea {
    padding: 20px;
    border: 2px solid #e6f4e6;
    border-radius: 16px;
    font-size: 18px;
    outline: none;
    transition: all 0.3s;
    background: white;
    resize: none;
  }
  
  .form-textarea:focus {
    border-color: #22c55e;
  }
  
  /* 位置选项 */
  .location-option {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: #22c55e;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .location-option:hover {
    color: #16a34a;
    text-decoration: underline;
  }
  
  .location-icon {
    font-size: 18px;
  }
  
  /* 上传区域 */
  .upload-area {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .upload-box {
    width: 180px;
    height: 180px;
    border: 2px dashed #a7f3d0;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s;
    background: #f8fdf6;
  }
  
  .upload-box:hover {
    border-color: #22c55e;
    background: #f0fdf4;
  }
  
  .upload-icon {
    font-size: 48px;
    color: #65a30d;
  }
  
  .upload-text {
    font-size: 16px;
    color: #4b5563;
  }
  
  .preview-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .preview-item {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid #e6f4e6;
  }
  
  .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    background: rgba(0,0,0,0.6);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .delete-btn:hover {
    background: rgba(0,0,0,0.8);
  }
  
  /* 提交按钮 */
  .submit-btn {
    width: 100%;
    height: 72px;
    background: linear-gradient(90deg, #22c55e 0%, #ca8a04 100%);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 24px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 16px;
  }
  
  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .submit-btn:hover:not(:disabled) {
    opacity: 0.9;
  }
  </style>