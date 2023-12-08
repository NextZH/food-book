import App from './App'
import Vue from 'vue'
import api from '@/api/index.js'
import store from '@/store/index.js'

Vue.prototype.$api=api;

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()

