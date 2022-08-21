import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './plugins/api.js'
import globalvars from './plugins/global.js'
import i18n from './plugins/i18n.js'

const app = createApp(App)

// app.use(createPinia())
app.use(api)
app.use(globalvars)
app.use(i18n)
app.use(router)

app.mount('#app')
