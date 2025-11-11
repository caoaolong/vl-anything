<template>
  <n-config-provider :theme="darkTheme">
    <n-form size="small" :model="currentModel">
      <n-collapse v-for="vgClass in currentView" :default-expanded-names="expandedNames">
        <n-collapse-item :title="vgClass.showName" :name="vgClass.className">
          <n-form-item v-for="field in vgClass.props" :path="vgClass.className + '__' + field.fieldName">
            <template #label>
              <div class="inspector-field-label">
                <span>{{ field.showName }}</span>
                <n-button v-if="field.fieldName !== 'id'" quaternary size="small" circle
                  @click="resetField(vgClass.className + '__' + field.fieldName)"
                  :disabled="ConstantMapper[vgClass.className + '__' + field.fieldName] === currentModel[vgClass.className + '__' + field.fieldName]">
                  <template #icon>
                    <ArrowClockwise16Filled />
                  </template>
                </n-button>
              </div>
            </template>
            <div v-if="['Point'].includes(field.type)">
              <n-grid :x-gap="12" :cols="2">
                <n-gi>
                  <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]['x']"
                    :format="formatFloatValue" round />
                </n-gi>
                <n-gi>
                  <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]['y']"
                    :format="formatFloatValue" round />
                </n-gi>
              </n-grid>
            </div>
            <Transform v-else-if="['Transform'].includes(field.type)"
              :model="currentModel[vgClass.className + '__' + field.fieldName]"
              :format-float-value="formatFloatValue" />
            <Color v-else-if="['Color'].includes(field.type)"
              v-model="currentModel[vgClass.className + '__' + field.fieldName]" />
            <div v-else-if="['Size'].includes(field.type)">
              <n-grid :x-gap="12" :cols="2">
                <n-gi>
                  <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]['width']"
                    :format="formatFloatValue" round />
                </n-gi>
                <n-gi>
                  <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]['height']"
                    :format="formatFloatValue" round />
                </n-gi>
              </n-grid>
            </div>
            <div v-else-if="['Radius'].includes(field.type)">
              <n-grid :x-gap="12" :cols="2">
                <n-gi>
                  <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]['rx']"
                    :format="formatFloatValue" round />
                </n-gi>
                <n-gi>
                  <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]['ry']"
                    :format="formatFloatValue" round />
                </n-gi>
              </n-grid>
            </div>
            <div v-else-if="['Number'].includes(field.type)">
              <n-input-number v-model:value="currentModel[vgClass.className + '__' + field.fieldName]"
                :format="formatFloatValue" round />
            </div>
            <n-input v-else v-model:value="currentModel[vgClass.className + '__' + field.fieldName]" round
              :readonly="field.readonly" :disabled="field.readonly" />
          </n-form-item>
        </n-collapse-item>
      </n-collapse>
    </n-form>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem, NButton, NConfigProvider, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, darkTheme } from "naive-ui";
import { ref, watch, reactive } from "vue";
import { VectorGraphics, EntityProps, CreateShapeProps, FormatLabel, ConstantMapper } from "@/entites/vg";
import { bus, ShapeEvent } from "@/utils/bus";
import type { Shape, Text } from "@svgdotjs/svg.js";
import { ArrowClockwise16Filled } from "@vicons/fluent";
import type { ShapeProps } from "@/props/inspector";
import Transform from "@/components/inspector/transform/index.vue";
import Color from "@/components/inspector/color/index.vue";

// ID <-> VectorGraphics
const shapes = ref<Record<string, VectorGraphics>>({});
const currentView = ref<Array<ShapeProps>>([]);
const currentModel = reactive<Record<string, any>>({});
const expandedNames = ref<Array<string>>([]);
// 标志位：用于区分是程序更新还是用户输入
const isUpdatingFromScene = ref(false);

const resetField = (path: string) => {
  currentModel[path] = ConstantMapper[path];
}

const formatFloatValue = (value: number | null): string => {
  if (!value) return "0";
  return value.toFixed(4);
}

const addShapeProps = (shape: Shape, label: Text) => {
  const args = shape.attr();
  args["id"] = shape.id();
  args["transform"] = shape.transform();
  args["label"] = label.text();
  console.log(args);
  var vg = CreateShapeProps(shape, args);
  if (!vg) return;
  shapes.value[shape.id()] = vg;
}

const editShapeProps = (id: string, attr: Record<string, any>) => {
  const shape = shapes.value[id];
  if (!shape) return;
  shape.update(attr);
  // set current model
  const model: Record<string, any> = {};
  Object.keys(shape).forEach(key => {
    model[key] = shape[key as keyof VectorGraphics];
    if ("Color" === model[key].constructor.name) {
      model[key] = model[key].toHex();
    }
  });
  // 标记这是从场景更新，不要触发 edit 事件
  isUpdatingFromScene.value = true;
  // 更新 reactive 对象的属性
  Object.keys(model).forEach(key => {
    currentModel[key] = model[key];
  });
  // 使用 setTimeout 确保响应式更新完成后再重置标志位
  setTimeout(() => {
    isUpdatingFromScene.value = false;
  }, 0);
}

const showShapeProps = function (vg: VectorGraphics | undefined) {
  if (!vg) return;
  // set current model
  const model: Record<string, any> = {};
  Object.keys(vg).forEach(key => {
    model[key] = vg[key as keyof VectorGraphics];
    if ("Color" === model[key].constructor.name) {
      model[key] = model[key].toHex();
    }
  });
  // 标记这是从场景更新（选择新图形），不要触发 edit 事件
  isUpdatingFromScene.value = true;
  // 更新 reactive 对象的属性
  Object.keys(model).forEach(key => {
    currentModel[key] = model[key];
  });
  setTimeout(() => {
    isUpdatingFromScene.value = false;
  }, 0);

  // set current view
  const props = EntityProps(vg);
  const showProps: Array<ShapeProps> = [];
  Object.keys(props).forEach(className => {
    if (!expandedNames.value.includes(className)) {
      expandedNames.value.push(className);
    }
    const entry: ShapeProps = {
      className: className,
      showName: FormatLabel(className),
      props: []
    }
    const classProps = props[className];
    if (!classProps) return;
    Object.keys(classProps).forEach(field => {
      const value = classProps[field];
      const item = {
        fieldName: field,
        type: value.constructor.name,
        showName: FormatLabel(field),
        value: value,
        readonly: false
      }
      if (item.fieldName === 'id') {
        item.readonly = true
      }
      entry.props.push(item);
    })
    showProps.push(entry);
  })
  currentView.value = showProps;
}

watch(currentModel, (newModel) => {
  // 只有在用户手动修改时才发送 edit 事件，程序更新时不发送
  if (!isUpdatingFromScene.value) {
    bus.emit("edit", newModel);
  }
}, { deep: true });

bus.on("select", (event: ShapeEvent) => {
  const { shape, label } = event;
  const id = shape.id()
  if (!Object.keys(shapes.value).includes(id)) {
    addShapeProps(shape, label);
  }
  showShapeProps(shapes.value[id])
});

bus.on("update", (event: ShapeEvent) => {
  const { shape } = event;
  const args = shape.attr();
  args["id"] = shape.id();
  args["transform"] = shape.transform();
  editShapeProps(shape.id(), args);
});
</script>

<style scoped>
:deep(.n-collapse-item__header-main) {
  height: 30px;
  font-weight: bolder;
  font-size: 16px;
  user-select: none;
  background-color: #001322;
}

:deep(.n-form-item-blank) {
  max-width: 300px;
}

:deep(.n-collapse-item__content-wrapper) {
  border: 6px solid #001322;
  padding-left: 20px;
}

:deep(.n-form-item-label__text) {
  width: 100%;
}

.inspector-field-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  font-size: 14px;
  font-weight: bold;
  gap: 10px;
}

.vl-inspector-subtitle {
  text-align: left;
}
</style>