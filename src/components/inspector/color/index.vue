<template>
    <div class="vl-color-picker-wrapper">
        <n-color-picker v-model:value="colorValue" :show-alpha="true" @update:value="handleColorChange" />
        <div class="vl-color-alpha-slider">
            <span class="vl-color-label">Alpha</span>
            <n-slider v-model:value="alphaValue" :step="0.01" :min="0" :max="1" @update:value="handleAlphaChange" />
            <span class="vl-color-value">{{ (alphaValue * 100).toFixed(0) }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { NColorPicker, NSlider } from "naive-ui";

interface Props {
    modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

// 从颜色值中提取 RGB 和 Alpha
const parseColor = (color: string) => {
    if (!color) return { r: 0, g: 0, b: 0, a: 1 };

    // 处理 rgba 格式
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1] ?? "0"),
            g: parseInt(rgbaMatch[2] ?? "0"),
            b: parseInt(rgbaMatch[3] ?? "0"),
            a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1
        };
    }

    // 处理 hex 格式
    const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
    if (hexMatch) {
        return {
            r: parseInt(hexMatch[1] ?? "0", 16),
            g: parseInt(hexMatch[2] ?? "0", 16),
            b: parseInt(hexMatch[3] ?? "0", 16),
            a: hexMatch[4] !== undefined ? parseInt(hexMatch[4], 16) / 255 : 1
        };
    }

    return { r: 0, g: 0, b: 0, a: 1 };
};

// 将 RGB 和 Alpha 转换为 rgba 字符串
const toRgbaString = (r: number, g: number, b: number, a: number) => {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Alpha 值（用于 slider）
const alphaValue = ref(parseColor(props.modelValue).a);

// 颜色值（用于 color-picker），只读，通过事件更新
const colorValue = computed(() => {
    const { r, g, b } = parseColor(props.modelValue);
    return `rgb(${r}, ${g}, ${b})`;
});

// 监听外部值变化，更新 alpha
watch(() => props.modelValue, (newValue) => {
    const parsed = parseColor(newValue);
    alphaValue.value = parsed.a;
}, { immediate: true });

const handleColorChange = (value: string) => {
    const { r, g, b } = parseColor(value);
    const a = alphaValue.value;
    emit("update:modelValue", toRgbaString(r, g, b, a));
};

const handleAlphaChange = (value: number) => {
    alphaValue.value = value;
    const { r, g, b } = parseColor(props.modelValue);
    emit("update:modelValue", toRgbaString(r, g, b, value));
};
</script>

<style scoped>
.vl-color-picker-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.vl-color-alpha-slider {
    display: flex;
    align-items: center;
    gap: 12px;
}

.vl-color-label {
    font-size: 12px;
    color: var(--n-text-color);
    min-width: 40px;
}

.vl-color-value {
    font-size: 12px;
    color: var(--n-text-color);
    min-width: 40px;
    text-align: right;
}
</style>
