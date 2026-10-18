import './assets/main.css'
import '@/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconVue from '@element-plus/icons-vue'
const app = createApp(App)

// 添加icon
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
