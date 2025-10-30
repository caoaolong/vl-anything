import { create as createNaive } from 'naive-ui'
import { createApp } from 'vue'
import App from '@/App.vue'

const naive = createNaive()

createApp(App).use(naive).mount('#app')
