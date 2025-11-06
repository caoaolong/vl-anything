<template>
  <n-config-provider :theme="darkTheme">
    <n-form label-placement="left" label-width="120px" size="small" :model="currentModel">
      <n-collapse v-for="vgClass in currentView" :default-expanded-names="expandedNames">
        <n-collapse-item :title="vgClass.showName" :name="vgClass.className">
          <n-form-item v-for="field in vgClass.props" :label="field.showName"
            :path="vgClass.className + '__' + field.fieldName">
            <n-button quaternary size="small" circle
              @click="resetField(vgClass.className + '__' + field.fieldName)"
              :disabled="ConstantMapper[vgClass.className + '__' + field.fieldName] === currentModel[vgClass.className + '__' + field.fieldName]">
              <template #icon>
                <ArrowClockwise16Filled />
              </template>
            </n-button>
            <n-input-number v-if="field.type === 'number'"
              v-model:value="currentModel[vgClass.className + '__' + field.fieldName]" round />
            <n-input v-else v-model:value="currentModel[vgClass.className + '__' + field.fieldName]" round />
          </n-form-item>
        </n-collapse-item>
      </n-collapse>
    </n-form>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem, NButton, NConfigProvider, NForm, NFormItem, NInput, NInputNumber, darkTheme } from "naive-ui";
import { ref } from "vue";
import { VectorGraphics, EntityProps, CreateShapeProps, FormatLabel, ConstantMapper } from "@/entites/vg";
import { bus } from "@/utils/bus";
import type { Shape } from "@svgdotjs/svg.js";
import { ArrowClockwise16Filled } from "@vicons/fluent";

interface FieldProps {
  fieldName: string;
  showName: string;
  value: any;
  type: string;
}

interface ShapeProps {
  className: string;
  showName: string;
  props: Array<FieldProps>;
}

const shapes = ref<Record<string, VectorGraphics>>({});
const currentView = ref<Array<ShapeProps>>([]);
const currentModel = ref<Record<string, any>>({});
const expandedNames = ref<Array<string>>([]);

const resetField = (path: string) => {
  currentModel.value[path] = ConstantMapper[path];
}

const addShapeProps = (shape: Shape) => {
  var vg = CreateShapeProps(shape, shape.attr());
  if (!vg) return;
  shapes.value[shape.id()] = vg;
}

const showShapeProps = function (vg: VectorGraphics | undefined) {
  if (!vg) return;

  // set current model
  const model: Record<string, any> = {};
  Object.keys(vg).forEach(key => {
    model[key] = vg[key as keyof VectorGraphics];
  });
  currentModel.value = model;

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
    if (!props[className]) return;
    Object.keys(props[className]).forEach(field => {
      if (!props[className]) return;
      const value = props[className][field];
      entry.props.push({
        fieldName: field,
        type: typeof value,
        showName: FormatLabel(field),
        value: value
      });
    })
    showProps.push(entry);
  })
  console.log(showProps);
  currentView.value = showProps;
}

bus.on("select", (shape: Shape) => {
  const id = shape.id()
  if (!Object.keys(shapes.value).includes(id)) {
    addShapeProps(shape);
  }
  showShapeProps(shapes.value[id])
});
</script>

<style scoped>
:deep(.n-collapse-item__header-main) {
  height: 40px;
  font-weight: bolder;
  font-size: 16px;
  user-select: none;
  border: 1px solid rgb(34, 34, 34);
}
</style>