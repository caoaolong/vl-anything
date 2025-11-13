import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'dockview-vue/dist/styles/dockview.css';
import Inspector from '@/panels/inspector/index.vue';
import Scene from '@/panels/scene/index.vue';
import Operator from '@/panels/operator/index.vue';
import Outline from '@/panels/outline/index.vue';

const app = createApp(App)

app.component('InspectorPanel', Inspector);
app.component('ScenePanel', Scene);
app.component('OperatorPanel', Operator);
app.component('OutlinePanel', Outline);

app.mount('#app')
