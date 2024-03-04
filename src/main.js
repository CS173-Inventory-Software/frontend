import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-purple/theme.css';

import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const router = createRouter({
  history: createWebHistory(),
  // You don't need to pass the routes anymore,
  // the plugin writes it for you 🤖
});

createApp(App)
  .use(router)
  .use(PrimeVue)
  .mount('#app');
