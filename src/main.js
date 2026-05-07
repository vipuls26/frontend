import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'
import 'primeicons/primeicons.css'
import 'vue-sonner/style.css'

import App from './App.vue'
import { setUnauthorizedHandler } from './api/axios'
import router from './router'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

setUnauthorizedHandler(async () => {
  await authStore.logout({ callApi: false })

  if (router.currentRoute.value.name !== 'login') {
    router.push({
      name: 'login',
    })
  }
})

app.mount('#app')
