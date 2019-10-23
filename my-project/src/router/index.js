import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home.vue'
import TripManagement from '../views/tripManagement.vue'
import MistakeManagement from '../views/mistakeManagement.vue'
import OngoingTask from '../views/ongoingTask.vue'
import ArchivingTask from '../views/archivingTask.vue'
import RemoveTask from '../views/removeTask.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: '/home',
      component: Home,
      children: [{
        path: '/tripManagement',
        name: 'tripManagement',
        component: TripManagement,
      }, {
        path: '/mistakeManagement',
        name: 'mistakeManagement',
        component: MistakeManagement
      }, {
        path: '/ongoingTask',
        name: 'ongoingTask',
        component: OngoingTask,
      }, {
        path: '/archivingTask',
        name: 'archivingTask',
        component: ArchivingTask
      }, {
        path: '/removeTask',
        name: 'removeTask',
        component: RemoveTask
      }]
    }

  ]
})
