import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './plugins/api.js'
import i18n from './plugins/i18n.js'

const app = createApp(App)

app.use(api)
app.use(i18n)
app.use(router)

app.mount('#app')
