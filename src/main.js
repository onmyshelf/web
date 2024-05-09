import { createApp } from "vue"
// import { createPinia } from 'pinia'

import App from "./App.vue"
import router from "./router"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import api from "./plugins/api.js"
import globalvars from "./plugins/global.js"
import i18n from "./plugins/i18n.js"

import "./assets/main.css"

const app = createApp(App)

// app.use(createPinia())
app.use(api)
app.use(globalvars)
app.use(i18n)
app.use(router)

app.mount("#app")
