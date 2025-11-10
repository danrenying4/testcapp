import App from './App'
import i18n from '@/locale/index.js'
import cache from '@/common/js/cache.js'
import util from '@/common/js/util.js'
import request from '@/common/js/request'

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'

Vue.prototype.$cache = cache
Vue.prototype.$util = util
Vue.prototype.$http = request
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif