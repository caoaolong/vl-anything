<template>
  <n-layout has-sider class="main-layout">
    <!-- 可伸缩侧边栏 -->
    <n-layout-sider
      :collapsed="collapsed"
      :collapsed-width="64"
      :width="240"
      show-trigger
      collapse-mode="width"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      class="sidebar"
    >
      <div class="sidebar-header">
        <n-space align="center" :size="collapsed ? 0 : 12">
          <n-icon size="24" color="#18a058">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </n-icon>
          <span v-if="!collapsed" class="logo-text">VL-Anything</span>
        </n-space>
      </div>
      
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="currentRoute"
        @update:value="handleMenuSelect"
        class="sidebar-menu"
      />
    </n-layout-sider>

    <!-- 主内容区域 -->
    <n-layout class="main-content">
      <!-- 顶部导航栏 -->
      <n-layout-header class="header" bordered>
        <div class="header-content">
          <!-- 面包屑导航 -->
          <n-breadcrumb class="breadcrumb">
            <n-breadcrumb-item
              v-for="(item, index) in breadcrumbItems"
              :key="index"
              :clickable="index < breadcrumbItems.length - 1"
              @click="handleBreadcrumbClick(item, index)"
            >
              <template #icon v-if="item.icon">
                <n-icon>
                  <component :is="item.icon" />
                </n-icon>
              </template>
              {{ item.label }}
            </n-breadcrumb-item>
          </n-breadcrumb>

          <!-- 右侧操作区域 -->
          <div class="header-actions">
            <n-space>
              <!-- GitHub 链接按钮 -->
              <n-button 
                quaternary 
                circle 
                @click="openGithub"
                title="查看 GitHub 仓库"
              >
                <template #icon>
                  <n-icon>
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </n-icon>
                </template>
              </n-button>

              <!-- 主题切换按钮 -->
              <n-button 
                quaternary 
                circle 
                @click="toggleTheme"
                :title="currentTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
              >
                <template #icon>
                  <n-icon>
                    <span>{{ currentTheme === 'dark' ? '🌙' : '☀️' }}</span>
                  </n-icon>
                </template>
              </n-button>
            </n-space>
          </div>
        </div>
      </n-layout-header>

      <!-- 主内容区域 -->
      <n-layout-content class="content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, computed, h, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NBreadcrumb,
  NBreadcrumbItem,
  NIcon,
  NSpace,
  NButton
} from 'naive-ui'
import { darkTheme } from 'naive-ui'

const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const collapsed = ref(false)

// 当前路由
const currentRoute = computed(() => route.path)

// 简单的主题状态
const currentTheme = ref('light')

// 主题选项（保留用于其他用途，如显示当前主题状态）
const themeOptions = [
  {
    label: '浅色模式',
    key: 'light',
    icon: '☀️'
  },
  {
    label: '深色模式',
    key: 'dark', 
    icon: '🌙'
  }
]

// 菜单选项
const menuOptions = [
  {
    label: '首页',
    key: '/',
    icon: () => h('svg', { viewBox: '0 0 24 24', style: 'width: 20px; height: 20px' }, [
      h('path', { fill: 'currentColor', d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' })
    ])
  },
  {
    label: '演示页面',
    key: '/demo',
    icon: () => h('svg', { viewBox: '0 0 24 24', style: 'width: 20px; height: 20px' }, [
      h('path', { fill: 'currentColor', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
    ])
  },
  {
    label: '设置',
    key: '/settings',
    icon: () => h('svg', { viewBox: '0 0 24 24', style: 'width: 20px; height: 20px' }, [
      h('path', { fill: 'currentColor', d: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' })
    ])
  }
]

// 面包屑导航项
const breadcrumbItems = computed(() => {
  const matched = route.matched
  const items = []
  
  // 添加首页
  if (route.path !== '/') {
    items.push({
      label: '首页',
      path: '/',
      icon: 'HomeIcon'
    })
  }
  
  // 添加当前路由的父级路由
  matched.forEach(match => {
    if (match.meta?.title && match.path !== route.path) {
      items.push({
        label: match.meta.title,
        path: match.path,
        icon: match.meta.icon
      })
    }
  })
  
  // 添加当前页面
  if (route.meta?.title) {
    items.push({
      label: route.meta.title,
      path: route.path,
      icon: route.meta.icon
    })
  }
  
  return items
})

// 处理菜单选择
const handleMenuSelect = (key) => {
  router.push(key)
}

// 处理面包屑点击
const handleBreadcrumbClick = (item, index) => {
  if (index < breadcrumbItems.value.length - 1) {
    router.push(item.path)
  }
}

// 打开 GitHub 仓库
const openGithub = () => {
  window.open('https://github.com/caoaolong/vl-anything', '_blank')
}

// 切换主题
const toggleTheme = () => {
  if (currentTheme.value === 'dark') {
    currentTheme.value = 'light'
    window.setTheme(null)
  } else {
    currentTheme.value = 'dark'
    window.setTheme(darkTheme)
  }
}

// 初始化主题状态
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  currentTheme.value = savedTheme === 'dark' ? 'dark' : 'light'
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #18a058;
}

.sidebar-menu {
  margin-top: 8px;
}

.header {
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.breadcrumb {
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.content {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

.content-wrapper {
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 64px - 48px);
}
</style>
