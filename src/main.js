// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'buefy/dist/buefy.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import Buefy from 'buefy';
import axios from 'axios'

axios.defaults.withCredentials = true
Vue.config.productionTip = false;
Vue.use(Buefy);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
