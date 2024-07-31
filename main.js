import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faClock);

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(store)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
