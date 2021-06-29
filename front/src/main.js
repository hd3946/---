import Vue from 'vue';
import App from './App.vue';
import feather from 'vue-icon'
import store from './store'
import './assets/css/tailwind.css'
//import './service-worker.setting'

Vue.config.productionTip = false
Vue.use(feather, 'v-icon')

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')