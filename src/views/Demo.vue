<template>
  <div class="demo-page">
    <n-card title="演示页面" size="large">
      <template #header-extra>
        <n-tag type="info">交互式演示</n-tag>
      </template>

      <n-space vertical :size="24">
        <div class="demo-section">
          <h3>SVG 交互演示</h3>
          <p>这里展示使用 draw.io 导出的 SVG 制作的交互式课件。</p>

          <n-divider />
          <svg-viewer src="/demo.drawio.svg" width="100%" height="400px" />
          <div class="box green"></div>
        </div>

        <n-divider />

        <div class="demo-section">
          <h3>组件演示</h3>
          <p>展示 Naive UI 组件的使用效果。</p>

          <n-grid :cols="2" :x-gap="16" :y-gap="16">
            <n-gi>
              <n-card title="按钮组件" size="small">
                <n-space>
                  <n-button type="primary">主要按钮</n-button>
                  <n-button type="info">信息按钮</n-button>
                  <n-button type="success">成功按钮</n-button>
                  <n-button type="warning">警告按钮</n-button>
                  <n-button type="error">错误按钮</n-button>
                </n-space>
              </n-card>
            </n-gi>

            <n-gi>
              <n-card title="输入组件" size="small">
                <n-space vertical>
                  <n-input placeholder="请输入内容" />
                  <n-select placeholder="请选择" :options="selectOptions" />
                  <n-date-picker placeholder="选择日期" />
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </div>

        <n-divider />

        <div class="demo-section">
          <h3>数据展示</h3>
          <n-data-table
            :columns="tableColumns"
            :data="tableData"
            :pagination="pagination"
          />
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { gsap } from "gsap";
import {
  NCard,
  NSpace,
  NTag,
  NDivider,
  NGrid,
  NGi,
  NButton,
  NInput,
  NSelect,
  NDatePicker,
  NDataTable,
} from "naive-ui";
import SvgViewer from "@/components/SvgViewer.vue";
import { drawio_svg_load, drawio_svg_initialize } from "@/utils/loader.js";

const svgContainer = ref(null);

// 选择器选项
const selectOptions = [
  { label: "选项1", value: "option1" },
  { label: "选项2", value: "option2" },
  { label: "选项3", value: "option3" },
];

// 表格列配置
const tableColumns = [
  {
    title: "名称",
    key: "name",
  },
  {
    title: "年龄",
    key: "age",
  },
  {
    title: "地址",
    key: "address",
  },
  {
    title: "操作",
    key: "actions",
    render: (row) => {
      return h(NButton, { size: "small" }, { default: () => "编辑" });
    },
  },
];

// 表格数据
const tableData = ref([
  {
    key: 0,
    name: "张三",
    age: 32,
    address: "北京市朝阳区",
  },
  {
    key: 1,
    name: "李四",
    age: 42,
    address: "上海市浦东新区",
  },
  {
    key: 2,
    name: "王五",
    age: 32,
    address: "广州市天河区",
  },
]);

// 分页配置
const pagination = {
  pageSize: 10,
};

const move = () => {
  // 使用 gsap 动画
  gsap.to(".box", { x: 200, duration: 1 });
};

// 加载 SVG 并设置交互
onMounted(async () => {
  try {
    const draw = await drawio_svg_load(svgContainer, "/demo.drawio.svg");
    if (draw) {
      drawio_svg_initialize(draw);
    }
  } catch (e) {
    console.error("加载 SVG 失败", e);
  }
});
</script>

<style scoped>
.demo-page {
  padding: 0;
}

.demo-section h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.demo-section p {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.6;
}

.svg-container {
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.svg-wrapper {
  min-height: 240px;
  margin-bottom: 16px;
}

.box {
  width: 75px;
  height: 75px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #0ae448, #abff84);
}
</style>
