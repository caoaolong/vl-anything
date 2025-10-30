<template>
  <div class="settings-page">
    <n-card title="系统设置" size="large">
      <template #header-extra>
        <n-tag type="warning">配置管理</n-tag>
      </template>
      
      <n-space vertical :size="24">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="left"
          label-width="120"
          require-mark-placement="right-hanging"
        >
          <n-grid :cols="2" :x-gap="24" :y-gap="24">
            <n-gi>
              <n-card title="基本设置" size="small">
                <n-form-item label="系统名称" path="systemName">
                  <n-input v-model:value="formData.systemName" placeholder="请输入系统名称" />
                </n-form-item>
                
                <n-form-item label="系统描述" path="systemDesc">
                  <n-input
                    v-model:value="formData.systemDesc"
                    type="textarea"
                    placeholder="请输入系统描述"
                    :rows="3"
                  />
                </n-form-item>
                
                <n-form-item label="系统版本" path="version">
                  <n-input v-model:value="formData.version" placeholder="请输入版本号" />
                </n-form-item>
              </n-card>
            </n-gi>
            
            <n-gi>
              <n-card title="界面设置" size="small">
                <n-form-item label="主题模式" path="theme">
                  <n-select v-model:value="formData.theme" :options="themeOptions" />
                </n-form-item>
                
                <n-form-item label="语言设置" path="language">
                  <n-select v-model:value="formData.language" :options="languageOptions" />
                </n-form-item>
                
                <n-form-item label="侧边栏" path="sidebarCollapsed">
                  <n-switch v-model:value="formData.sidebarCollapsed" />
                  <span class="form-item-extra">默认折叠侧边栏</span>
                </n-form-item>
              </n-card>
            </n-gi>
          </n-grid>
          
          <n-divider />
          
          <n-grid :cols="2" :x-gap="24" :y-gap="24">
            <n-gi>
              <n-card title="功能设置" size="small">
                <n-form-item label="自动保存" path="autoSave">
                  <n-switch v-model:value="formData.autoSave" />
                  <span class="form-item-extra">启用自动保存功能</span>
                </n-form-item>
                
                <n-form-item label="消息通知" path="notifications">
                  <n-switch v-model:value="formData.notifications" />
                  <span class="form-item-extra">接收系统消息通知</span>
                </n-form-item>
                
                <n-form-item label="数据备份" path="backup">
                  <n-switch v-model:value="formData.backup" />
                  <span class="form-item-extra">定期备份数据</span>
                </n-form-item>
              </n-card>
            </n-gi>
            
            <n-gi>
              <n-card title="安全设置" size="small">
                <n-form-item label="登录超时" path="timeout">
                  <n-input-number
                    v-model:value="formData.timeout"
                    :min="5"
                    :max="120"
                    placeholder="分钟"
                  />
                  <span class="form-item-extra">分钟</span>
                </n-form-item>
                
                <n-form-item label="密码策略" path="passwordPolicy">
                  <n-checkbox-group v-model:value="formData.passwordPolicy">
                    <n-space vertical>
                      <n-checkbox value="uppercase">包含大写字母</n-checkbox>
                      <n-checkbox value="lowercase">包含小写字母</n-checkbox>
                      <n-checkbox value="numbers">包含数字</n-checkbox>
                      <n-checkbox value="symbols">包含特殊字符</n-checkbox>
                    </n-space>
                  </n-checkbox-group>
                </n-form-item>
              </n-card>
            </n-gi>
          </n-grid>
        </n-form>
        
        <n-divider />
        
        <div class="form-actions">
          <n-space>
            <n-button type="primary" @click="handleSave" :loading="saving">
              保存设置
            </n-button>
            <n-button @click="handleReset">
              重置
            </n-button>
            <n-button @click="handleCancel">
              取消
            </n-button>
          </n-space>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  NCard,
  NSpace,
  NTag,
  NDivider,
  NGrid,
  NGi,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSwitch,
  NInputNumber,
  NCheckboxGroup,
  NCheckbox,
  NButton
} from 'naive-ui'

const formRef = ref(null)
const saving = ref(false)

// 表单数据
const formData = reactive({
  systemName: 'VL-Anything',
  systemDesc: '基于 Vue 3 和 Naive UI 的现代化前端项目',
  version: '1.0.0',
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  autoSave: true,
  notifications: true,
  backup: false,
  timeout: 30,
  passwordPolicy: ['uppercase', 'lowercase', 'numbers']
})

// 表单验证规则
const rules = {
  systemName: {
    required: true,
    message: '请输入系统名称',
    trigger: 'blur'
  },
  version: {
    required: true,
    message: '请输入版本号',
    trigger: 'blur'
  }
}

// 主题选项
const themeOptions = [
  { label: '浅色模式', value: 'light' },
  { label: '深色模式', value: 'dark' },
  { label: '自动', value: 'auto' }
]

// 语言选项
const languageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' }
]

// 保存设置
const handleSave = async () => {
  try {
    await formRef.value?.validate()
    saving.value = true
    
    // 模拟保存请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    window.$message?.success('设置保存成功')
  } catch (error) {
    window.$message?.error('保存失败，请检查表单')
  } finally {
    saving.value = false
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.restoreValidation()
  Object.assign(formData, {
    systemName: 'VL-Anything',
    systemDesc: '基于 Vue 3 和 Naive UI 的现代化前端项目',
    version: '1.0.0',
    theme: 'light',
    language: 'zh-CN',
    sidebarCollapsed: false,
    autoSave: true,
    notifications: true,
    backup: false,
    timeout: 30,
    passwordPolicy: ['uppercase', 'lowercase', 'numbers']
  })
}

// 取消编辑
const handleCancel = () => {
  window.$message?.info('已取消编辑')
}
</script>

<style scoped>
.settings-page {
  padding: 0;
}

.form-item-extra {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e0e0e6;
}
</style>
