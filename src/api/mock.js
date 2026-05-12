import Mock from 'mockjs'

Mock.mock('/api/dashboard/overview', 'get', () => {
  return {
    code: 200,
    data: {
      carbonReduction: 2.8,
      waterSaving: 135,
      powerSaving: 8.5,
      points: 1950
    }
  }
})

Mock.mock('/api/dashboard/carbonTrend', 'get', () => {
  return {
    code: 200,
    data: {
      dates: ['04-01', '04-02', '04-03', '04-04', '04-05', '04-06', '04-07'],
      values: [320, 280, 360, 240, 300, 220, 260]
    }
  }
})

Mock.mock('/api/dashboard/behaviorDistribution', 'get', () => {
  return {
    code: 200,
    data: [
      { name: '公共交通', value: 45, color: '#22c55e' },
      { name: '步行骑行', value: 30, color: '#fbbf24' },
      { name: '垃圾分类', value: 15, color: '#10b981' },
      { name: '节能减排', value: 10, color: '#84cc16' }
    ]
  }
})

Mock.mock('/api/dashboard/rankList', 'get', () => {
  return {
    code: 200,
    data: [
      { rank: 1, name: '环保先锋', score: 2580, level: '环保达人' },
      { rank: 2, name: '绿色卫士', score: 2420, level: '环保达人' },
      { rank: 3, name: '低碳使者', score: 2350, level: '环保达人' },
      { rank: 4, name: '生态卫士', score: 2210, level: '环保精英' },
      { rank: 5, name: '绿色使者', score: 2150, level: '环保精英' }
    ]
  }
})

Mock.mock('/api/dashboard/stepCount', 'get', () => {
  return {
    code: 200,
    data: {
      dates: ['04-01', '04-02', '04-03', '04-04', '04-05', '04-06', '04-07'],
      values: [8500, 9200, 10500, 8800, 11200, 9500, 8900]
    }
  }
})

// 垃圾分类数据
const garbageData = {
  '塑料瓶': {
    name: '塑料瓶',
    type: '可回收物',
    typeColor: '#3b82f6',
    icon: '♻️',
    tip: '清空内容物，清洗干净后投放'
  },
  '苹果核': {
    name: '苹果核',
    type: '厨余垃圾',
    typeColor: '#22c55e',
    icon: '🍎',
    tip: '沥干水分后投放'
  },
  '电池': {
    name: '电池',
    type: '有害垃圾',
    typeColor: '#ef4444',
    icon: '⚠️',
    tip: '密封后投放至有害垃圾收集容器'
  },
  '纸巾': {
    name: '纸巾',
    type: '其他垃圾',
    typeColor: '#6b7280',
    icon: '🗑️',
    tip: '直接投放至其他垃圾收集容器'
  },
  '纸箱': {
    name: '纸箱',
    type: '可回收物',
    typeColor: '#3b82f6',
    icon: '♻️',
    tip: '压扁后投放'
  },
  '易拉罐': {
    name: '易拉罐',
    type: '可回收物',
    typeColor: '#3b82f6',
    icon: '♻️',
    tip: '清空内容物，压扁后投放'
  },
  '玻璃瓶': {
    name: '玻璃瓶',
    type: '可回收物',
    typeColor: '#3b82f6',
    icon: '♻️',
    tip: '清空内容物，清洗干净后投放'
  },
  '剩菜剩饭': {
    name: '剩菜剩饭',
    type: '厨余垃圾',
    typeColor: '#22c55e',
    icon: '🍎',
    tip: '沥干水分后投放'
  },
  '果皮': {
    name: '果皮',
    type: '厨余垃圾',
    typeColor: '#22c55e',
    icon: '🍎',
    tip: '沥干水分后投放'
  },
  '菜叶': {
    name: '菜叶',
    type: '厨余垃圾',
    typeColor: '#22c55e',
    icon: '🍎',
    tip: '沥干水分后投放'
  },
  '茶叶渣': {
    name: '茶叶渣',
    type: '厨余垃圾',
    typeColor: '#22c55e',
    icon: '🍎',
    tip: '沥干水分后投放'
  },
  '药品': {
    name: '药品',
    type: '有害垃圾',
    typeColor: '#ef4444',
    icon: '⚠️',
    tip: '连同包装一起投放至有害垃圾收集容器'
  },
  '油漆': {
    name: '油漆',
    type: '有害垃圾',
    typeColor: '#ef4444',
    icon: '⚠️',
    tip: '密封后投放至有害垃圾收集容器'
  },
  '杀虫剂': {
    name: '杀虫剂',
    type: '有害垃圾',
    typeColor: '#ef4444',
    icon: '⚠️',
    tip: '密封后投放至有害垃圾收集容器'
  },
  '烟蒂': {
    name: '烟蒂',
    type: '其他垃圾',
    typeColor: '#6b7280',
    icon: '🗑️',
    tip: '熄灭后投放'
  },
  '陶瓷': {
    name: '陶瓷',
    type: '其他垃圾',
    typeColor: '#6b7280',
    icon: '🗑️',
    tip: '直接投放至其他垃圾收集容器'
  },
  '猫砂': {
    name: '猫砂',
    type: '其他垃圾',
    typeColor: '#6b7280',
    icon: '🗑️',
    tip: '直接投放至其他垃圾收集容器'
  }
}

// 分类指南数据
Mock.mock('/api/garbage/guide', 'get', () => {
  return {
    code: 200,
    data: {
      categories: [
        {
          name: '可回收物',
          color: '#3b82f6',
          icon: '♻️',
          items: ['塑料瓶', '纸箱', '易拉罐', '玻璃瓶']
        },
        {
          name: '厨余垃圾',
          color: '#22c55e',
          icon: '🍎',
          items: ['剩菜剩饭', '果皮', '菜叶', '茶叶渣']
        },
        {
          name: '有害垃圾',
          color: '#ef4444',
          icon: '⚠️',
          items: ['电池', '药品', '油漆', '杀虫剂']
        },
        {
          name: '其他垃圾',
          color: '#6b7280',
          icon: '🗑️',
          items: ['纸巾', '烟蒂', '陶瓷', '猫砂']
        }
      ],
      tips: [
        {
          title: '分类前处理',
          icon: '🗑️',
          color: '#e0e7ff',
          content: '清洗、沥水、压扁，让垃圾更易分类和处理'
        },
        {
          title: '减少浪费',
          icon: '🌱',
          color: '#dcfce7',
          content: '从源头减少垃圾产生，养成环保生活习惯'
        },
        {
          title: '正确投放',
          icon: '⚡',
          color: '#fef3c7',
          content: '根据分类标识正确投放，提高回收利用率'
        }
      ]
    }
  }
})

// 垃圾分类查询接口
Mock.mock(/\/api\/garbage\/query\?name=.*/, 'get', (options) => {
  const name = decodeURIComponent(options.url.split('name=')[1])
  const data = garbageData[name] || {
    name: name,
    type: '未知',
    typeColor: '#9ca3af',
    icon: '❓',
    tip: '请确认垃圾名称是否正确'
  }
  return {
    code: 200,
    data
  }
})

// 最近查询数据
Mock.mock('/api/garbage/history', 'get', () => {
  return {
    code: 200,
    data: ['塑料瓶', '苹果核', '电池', '纸巾']
  }
})
// 打卡选项数据
Mock.mock('/api/checkin/options', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '骑行出行', score: 40, icon: '🚲', color: '#22c55e' },
      { id: 2, name: '公共交通', score: 50, icon: '🚌', color: '#2563eb' },
      { id: 3, name: '步行出行', score: 30, icon: '👟', color: '#f97316' },
      { id: 4, name: '使用环保袋', score: 10, icon: '🛍️', color: '#16a34a' },
      { id: 5, name: '节约用电', score: 20, icon: '💡', color: '#d97706' },
      { id: 6, name: '节约用水', score: 20, icon: '💧', color: '#3b82f6' }
    ]
  }
})

// 打卡日历数据
Mock.mock('/api/checkin/calendar', 'get', () => {
  return {
    code: 200,
    data: {
      year: 2026,
      month: 4,
      checkedDays: [1, 2, 3, 4, 5, 6, 7] // 已打卡日期
    }
  }
})

// 打卡统计数据
Mock.mock('/api/checkin/stats', 'get', () => {
  return {
    code: 200,
    data: {
      continuousDays: 47,
      totalCheckIn: 83,
      totalPoints: 1950,
      monthCheckInDays: 7,
      maxContinuousDays: 47,
      monthPoints: 420
    }
  }
})

// 最近打卡记录
Mock.mock('/api/checkin/records', 'get', () => {
  return {
    code: 200,
    data: [
      {
        date: '2026-04-07',
        items: ['骑行出行', '使用环保袋'],
        score: 50
      },
      {
        date: '2026-04-06',
        items: ['公共交通', '节约用电'],
        score: 70
      },
      {
        date: '2026-04-05',
        items: ['步行出行', '节约用水'],
        score: 50
      }
    ]
  }
})

// 提交打卡接口
Mock.mock('/api/checkin/submit', 'post', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    data: {
      success: true,
      message: '打卡成功',
      addScore: body.items.reduce((sum, item) => sum + item.score, 0)
    }
  }
})
Mock.mock('/api/carbon/transport-options', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '私家车', factor: 0.23 }, // 每公里碳排放 kg
      { id: 2, name: '公共交通', factor: 0.05 },
      { id: 3, name: '骑行/步行', factor: 0 },
      { id: 4, name: '网约车', factor: 0.18 }
    ]
  }
})

// 平均碳排放数据
Mock.mock('/api/carbon/average', 'get', () => {
  return {
    code: 200,
    data: {
      total: 125.0,
      distribution: [
        { name: '交通出行', value: 36, color: '#ef4444' },
        { name: '家庭用电', value: 26, color: '#f59e0b' },
        { name: '燃气使用', value: 15, color: '#fbbf24' },
        { name: '饮食消费', value: 23, color: '#22c55e' }
      ],
      nationalAverage: 200.0
    }
  }
})

// 减排小贴士
Mock.mock('/api/carbon/tips', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, title: '绿色出行', icon: '🚗', content: '优先选择公共交通、骑行或步行' },
      { id: 2, title: '节约用电', icon: '⚡', content: '关闭不必要的电器，使用节能灯具' },
      { id: 3, title: '智能控温', icon: '🏠', content: '合理设置空调温度，减少能源消耗' },
      { id: 4, title: '低碳饮食', icon: '🍴', content: '减少肉类摄入，多食用本地时令蔬菜' }
    ]
  }
})
// 事件类型选项
Mock.mock('/api/report/types', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '垃圾乱放' },
      { id: 2, name: '污水排放' },
      { id: 3, name: '噪音污染' },
      { id: 4, name: '其他' }
    ]
  }
})

// 提交事件上报
Mock.mock('/api/report/submit', 'post', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    data: {
      success: true,
      message: '上报成功，感谢您的环保贡献！',
      reportId: Mock.Random.id()
    }
  }
})
// 用户积分信息
Mock.mock('/api/points/info', 'get', () => {
  return {
    code: 200,
    data: {
      points: 1950,
      tips: [
        { icon: '🌟', text: '每日打卡可获得积分' },
        { icon: '💡', text: '积分仅可兑换虚拟奖励' },
        { icon: '🚫', text: '不可提现' }
      ]
    }
  }
})

// 兑换商品列表
Mock.mock('/api/points/goods', 'get', () => {
  return {
    code: 200,
    data: [
      {
        id: 1,
        name: '环保先锋勋章',
        desc: '专属虚拟勋章，彰显你的环保实力',
        price: 500,
        stock: 999,
        icon: '🎖️',
        color: '#d97706'
      },
      {
        id: 2,
        name: '绿色之星称号',
        desc: '限时称号，为期30天',
        price: 800,
        stock: 999,
        icon: '⭐',
        color: '#22c55e'
      },
      {
        id: 3,
        name: '碳减排达人头衔',
        desc: '个人主页专属头衔显示',
        price: 1000,
        stock: 999,
        icon: '👑',
        color: '#f97316'
      },
      {
        id: 4,
        name: '环保爱心徽章',
        desc: '爱心徽章，可在个人主页展示',
        price: 300,
        stock: 999,
        icon: '❤️',
        color: '#ef4444'
      },
      {
        id: 5,
        name: '能量加速卡',
        desc: '打卡积分翻倍，持续7天',
        price: 600,
        stock: 999,
        icon: '⚡',
        color: '#2563eb'
      },
      {
        id: 6,
        name: '专属边框',
        desc: '个人头像专属发光边框',
        price: 1200,
        stock: 999,
        icon: '🎁',
        color: '#9333ea'
      }
    ]
  }
})

// 兑换商品接口
Mock.mock('/api/points/exchange', 'post', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    data: {
      success: true,
      message: `兑换成功！已扣除${body.price}积分`,
      newPoints: 1950 - body.price
    }
  }
})

// 兑换规则
Mock.mock('/api/points/rules', 'get', () => {
  return {
    code: 200,
    data: [
      '积分可通过每日环保打卡、完成任务、参与活动等方式获得',
      '所有奖励均为虚拟奖励，用于个人主页展示或游戏化体验',
      '积分不可提现，不可转让，仅可在积分商城兑换虚拟奖励',
      '部分奖励有时效性，请注意查看兑换说明',
      '兑换后不支持退款，请谨慎兑换',
      '平台保留最终解释权'
    ]
  }
})
// 用户基础信息
Mock.mock('/api/user/info', 'get', () => {
  return {
    code: 200,
    data: {
      nickname: '环保达人',
      level: 5,
      joinTime: '2026年1月15日',
      totalPoints: 1950,
      continuousCheckIn: 47,
      totalCarbonReduction: 15.6,
      rank: 4
    }
  }
})

// 用户统计数据
Mock.mock('/api/user/stats', 'get', () => {
  return {
    code: 200,
    data: {
      level: 5,
      nextLevel: 6,
      needPoints: 350,
      monthTarget: {
        carbonReduction: { current: 5.2, target: 10 },
        checkInTimes: { current: 18, target: 30 }
      },
      favoriteActions: [
        { name: '公共交通', count: 23 },
        { name: '垃圾分类', count: 18 },
        { name: '步行出行', count: 15 }
      ]
    }
  }
})

// 用户成就
Mock.mock('/api/user/achievements', 'get', () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '环保新手', desc: '完成首次打卡', icon: '🌱', unlocked: true },
      { id: 2, name: '绿色出行', desc: '骑行累计50km', icon: '🚴', unlocked: true },
      { id: 3, name: '分类达人', desc: '正确分类100次', icon: '♻️', unlocked: true },
      { id: 4, name: '连续打卡', desc: '连续打卡7天', icon: '⭐', unlocked: true },
      { id: 5, name: '环保先锋', desc: '进入排行榜前10', icon: '🏆', unlocked: false },
      { id: 6, name: '绿色使者', desc: '累计减排100kg', icon: '💚', unlocked: false }
    ]
  }
})

// 最近活动记录
Mock.mock('/api/user/activities', 'get', () => {
  return {
    code: 200,
    data: [
      { name: '公共交通出行', date: '2026-04-07', points: 50 },
      { name: '正确垃圾分类', date: '2026-04-07', points: 20 },
      { name: '步行3公里', date: '2026-04-06', points: 30 },
      { name: '使用环保袋', date: '2026-04-06', points: 10 },
      { name: '骑行上班', date: '2026-04-05', points: 40 }
    ]
  }
})
//我的上报
Mock.mock('/api/my-report/list', 'get', () => {
  return {
    code: 200,
    data: {
      stats: {
        total: 8,
        processing: 3,
        completed: 3,
        rejected: 2
      },
      list: [
        {
          id: 1,
          title: '小区垃圾未及时清理',
          status: 'completed',
          statusText: '已完成',
          orderNo: 'REP20260410001',
          type: '垃圾污染',
          location: '阳光花园小区 12 号楼旁',
          createTime: '2026-04-09 08:25',
          updateTime: '2026-04-09 16:40',
          result: '处理结果：物业已完成垃圾清运，并增加每日清运频次。'
        },
        {
          id: 2,
          title: '河道存在污水直排',
          status: 'processing',
          statusText: '处理中',
          orderNo: 'REP20260409002',
          type: '水体污染',
          location: '环城河上游段',
          createTime: '2026-04-08 15:12',
          updateTime: '2026-04-09 09:30',
          result: ''
        },
        {
          id: 3,
          title: '施工扬尘严重影响居民',
          status: 'assigned',
          statusText: '已派单',
          orderNo: 'REP20260408003',
          type: '大气污染',
          location: '城南路建筑工地',
          createTime: '2026-04-07 10:15',
          updateTime: '2026-04-07 14:20',
          result: ''
        },
        {
          id: 4,
          title: '绿化带内垃圾堆积',
          status: 'completed',
          statusText: '已完成',
          orderNo: 'REP20260407004',
          type: '垃圾污染',
          location: '中央公园西北角',
          createTime: '2026-04-06 16:30',
          updateTime: '2026-04-07 11:10',
          result: '处理结果：已安排保洁人员清理完毕。'
        },
        {
          id: 5,
          title: '商铺油烟直排小区',
          status: 'rejected',
          statusText: '已驳回',
          orderNo: 'REP20260406005',
          type: '大气污染',
          location: '幸福路美食街',
          createTime: '2026-04-05 19:20',
          updateTime: '2026-04-06 08:15',
          result: '驳回原因：上报信息不全，缺少现场照片与具体门牌号，请补充后重新上报。'
        },
        {
          id: 6,
          title: '夜间施工噪音扰民',
          status: 'auditing',
          statusText: '审核中',
          orderNo: 'REP20260405006',
          type: '噪音污染',
          location: '未来城项目工地',
          createTime: '2026-04-04 22:10',
          updateTime: '2026-04-05 09:05',
          result: ''
        },
        {
          id: 7,
          title: '公共设施损坏未修复',
          status: 'processing',
          statusText: '处理中',
          orderNo: 'REP20260404007',
          type: '其他问题',
          location: '文化广场休闲区',
          createTime: '2026-04-03 14:30',
          updateTime: '2026-04-04 10:20',
          result: ''
        },
        {
          id: 8,
          title: '宠物粪便未清理影响环境',
          status: 'rejected',
          statusText: '已驳回',
          orderNo: 'REP20260402008',
          type: '其他问题',
          location: '滨河公园步道',
          createTime: '2026-04-02 09:15',
          updateTime: '2026-04-02 15:40',
          result: '驳回原因：问题描述模糊，无法定位具体区域，请重新上传清晰照片。'
        }
      ]
    }
  }
})
export default Mock