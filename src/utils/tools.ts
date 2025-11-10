import { h, ref } from "vue";
import type { Component } from "vue";
import { NIcon } from "naive-ui";
import { 
    AlignBottom16Filled, AlignTop16Filled, AlignLeft16Filled, AlignRight16Filled, AlignCenterVertical16Filled, AlignCenterHorizontal16Filled,
    RectangleLandscape16Filled, Circle16Filled, Shapes16Filled
} from "@vicons/fluent";

function renderIcon(icon: Component) {
    return h(NIcon, null, {
        default: () => h(icon)
    })
}

export const alignItems = ref([
    {
        key: "align-bottom",
        icon: () => renderIcon(AlignBottom16Filled)
    },
    {
        key: "align-top",
        icon: () => renderIcon(AlignTop16Filled)
    },
    {
        key: "align-left",
        icon: () => renderIcon(AlignLeft16Filled)
    },
    {
        key: "align-right",
        icon: () => renderIcon(AlignRight16Filled)
    },
    {
        key: "align-center-vertical",
        icon: () => renderIcon(AlignCenterVertical16Filled)
    },
    {
        key: "align-center-horizontal",
        icon: () => renderIcon(AlignCenterHorizontal16Filled)
    }
]);

export const shapeItems = ref([
    {
        key: "rect",
        icon: () => renderIcon(RectangleLandscape16Filled)
    },
    {
        key: "circle",
        icon: () => renderIcon(Circle16Filled)
    },
    {
        key: "group",
        icon: () => renderIcon(Shapes16Filled)
    }
])