import Vue from 'vue'
import Router from 'vue-router'
import Scheduler from '@/components/Scheduler'
import PrivacyPolicy from '@/components/PrivacyPolicy'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/id/:id',
      name: 'Scheduler',
      component: Scheduler
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy
    }
  ]
})
