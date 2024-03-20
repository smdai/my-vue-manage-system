import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import './assets/css/icon.css'
import BztcDictSelect from './views/customcomponent/bztcdictselect.vue'
import BztcDictRadio from './views/customcomponent/bztcdictradio.vue'
import BztcDictColumn from './views/customcomponent/bztcdictcolumn.vue'
import BztcButton from './views/customcomponent/bztcbutton.vue';
import BztcQrCode from './views/customcomponent/qrcode.vue';
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 注册全局组件
app.component('BztcDictSelect', BztcDictSelect);
app.component('BztcDictRadio', BztcDictRadio);
app.component('BztcDictColumn', BztcDictColumn);
app.component('BztcButton', BztcButton);
app.component('BztcQrCode',BztcQrCode);

app.mount('#app')