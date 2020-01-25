import 'font-awesome/css/font-awesome.min.css'
import Vue from 'vue'
import App from './App'

import './config/msgs';
import './config/bootstrap';
import store from './config/store';
import router from './config/router';

Vue.config.productionTip = false;

require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTcsIm5hbWUiOiJKZWFuIGRvcyBTYW50b3MiLCJlbWFpbCI6InR4dGRickBob3RtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE1Nzk3MjkyNTMsImV4cCI6MTU3OTk4ODQ1M30.r_EWc9xRLlB98fRfpYdUMSIpuwV4JjOplnSId5tEYQk'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')