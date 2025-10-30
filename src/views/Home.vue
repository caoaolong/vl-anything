<template>
  <div class="home-page">
    <n-card title="欢迎使用 VL-Anything" size="large">
      <template #header-extra>
        <n-tag type="success">Vue 3 + Naive UI</n-tag>
      </template>
      
      <n-space vertical :size="24">
        <div class="welcome-content">
          <h2>项目介绍</h2>
          <p>VL-Anything 是一个基于 Vue 3 和 Naive UI 的现代化前端项目，使用 draw.io 导出的 SVG 来制作交互式课件。</p>
          
          <n-divider />
          
          <h3>技术栈</h3>
          <n-space>
            <n-tag type="info">Vue 3</n-tag>
            <n-tag type="success">Naive UI</n-tag>
            <n-tag type="warning">Vue Router</n-tag>
            <n-tag type="error">Vite</n-tag>
          </n-space>
        </div>
        
        <n-grid :cols="3" :x-gap="16" :y-gap="16">
          <n-gi>
            <n-card title="快速开始" hoverable>
              <n-space vertical>
                <n-icon size="32" color="#18a058">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </n-icon>
                <p>查看演示页面了解项目功能</p>
                <n-button type="primary" @click="$router.push('/demo')">
                  查看演示
                </n-button>
              </n-space>
            </n-card>
          </n-gi>
          
          <n-gi>
            <n-card title="配置管理" hoverable>
              <n-space vertical>
                <n-icon size="32" color="#2080f0">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                  </svg>
                </n-icon>
                <p>管理系统配置和参数</p>
                <n-button type="info" @click="$router.push('/settings')">
                  进入设置
                </n-button>
              </n-space>
            </n-card>
          </n-gi>
          
          <n-gi>
            <n-card title="帮助文档" hoverable>
              <n-space vertical>
                <n-icon size="32" color="#f0a020">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45,12.9 13,13.5 13,15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2,.9-2,2H8c0-2.21 1.79-4 4-4s4,1.79 4,4c0,.88-.36,1.68-.93,2.25z"/>
                  </svg>
                </n-icon>
                <p>查看详细的使用说明</p>
                <n-button type="warning">
                  查看文档
                </n-button>
              </n-space>
            </n-card>
          </n-gi>
        </n-grid>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { NCard, NSpace, NTag, NDivider, NGrid, NGi, NButton, NIcon } from 'naive-ui'
</script>

<style scoped>
.home-page {
  padding: 0;
}

.welcome-content h2 {
  margin: 0 0 16px 0;
  color: #333;
}

.welcome-content h3 {
  margin: 24px 0 16px 0;
  color: #666;
}

.welcome-content p {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.6;
}
</style>
