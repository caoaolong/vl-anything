<template>
  <n-config-provider :theme="theme">
    <div id="app">
      <router-view />
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'

// 简单的主题状态
const theme = ref(null)

// 提供主题切换方法给子组件
const setTheme = (newTheme) => {
  theme.value = newTheme
  // 保存到本地存储
  localStorage.setItem('theme', newTheme === darkTheme ? 'dark' : 'light')
}

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    theme.value = darkTheme
  } else {
    theme.value = null
  }
}

// 初始化
initTheme()

// 提供全局方法
window.setTheme = setTheme
</script>

<style>
/* 定义自定义字体 */
@font-face {
  font-family: 'MapleMono';
  src: url('/MapleMono-NF-CN-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* 为 SVG 中的字体名称添加别名 */
@font-face {
  font-family: 'Maple Mono NF CN';
  src: url('/MapleMono-NF-CN-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: 'MapleMono', 'Courier New', monospace;
}

#app {
  background: #f5f5f5;
}
</style>
