import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/index.js';

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore();
authStore.initializeToken();

/*if (!authStore.checkTokenExpiration()) {
    authStore.clearToken();
}*/
app.mount('#app')
