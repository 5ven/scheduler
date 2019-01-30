// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
/* eslint-disable */
import { sync } from 'vuex-router-sync'
/* eslint-enable */
import router from './router'
import VueResource from 'vue-resource'
import moment from 'moment-timezone'
import BootstrapVue from 'bootstrap-vue'
import VueWow from 'vue-wow'
import {settings} from '../config/settings'
import store from '@/store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/animate.css'
import './assets/css/responsive.css'
import './assets/css/main.css'
import './assets/css/line-icons.css'
import './assets/css/datepicker.css'

sync(store, router) // done. Returns an unsync callback fn

moment.tz.setDefault(settings.companyTimezone)

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueResource)
Vue.use(VueWow)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
