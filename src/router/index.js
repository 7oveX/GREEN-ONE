import { createRouter, createWebHistory } from 'vue-router'

// 公共页面
import HomePage from '../views/HomePage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// 普通用户页面（views/user/ 下）
import userDashboard from '../views/user/userDashboard.vue'
import GarbageClassification from '../views/user/Garbage-classification.vue'
import EnvironmentalCheckIn from '../views/user/Environmental-check-in.vue'
import CarbonFootprint from '../views/user/Carbon-footprint.vue'
import IncidentReporting from '../views/user/Incident-Reporting.vue'
import MyReport from '../views/user/MyReport.vue'
import PointsMall from '../views/user/PointsMall.vue'
import PersonalCenter from '../views/user/PersonalCenter.vue'

// 管理员页面（views/admin/ 下）
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import User from '../views/admin/User.vue'
import Review from '../views/admin/Review.vue'
import Task from '../views/admin/Task.vue'
import Knowledge from '../views/admin/Knowledge.vue'

const routes = [
  // 公共路由
  { path: '/', component: HomePage,meta: { hideSidebar: true } },
  { path: '/login', component: Login,meta: { hideSidebar: true } },
  { path: '/register', component: Register,meta: { hideSidebar: true } },

  // 普通用户路由
  { path: '/dashboard', component: userDashboard },
  { path: '/garbage-classification', component: GarbageClassification },
  { path: '/environmental-check-in', component: EnvironmentalCheckIn },
  { path: '/carbon-footprint', component: CarbonFootprint },
  { path: '/incident-reporting', component: IncidentReporting },
  { path: '/myreport', component: MyReport },
  { path: '/points-mall', component: PointsMall },
  { path: '/personal-center', component: PersonalCenter },

  // 管理员路由
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/user', component: User },
  { path: '/admin/review', component: Review },
  { path: '/admin/task', component: Task },
  { path: '/admin/knowledge', component: Knowledge }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router