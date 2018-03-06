import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import store from './store';
import 'vue-layer-mobile/need/layer.css';
import layer from 'vue-layer-mobile';
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

fastclick.attach(document.body);

Vue.use(VueLazyload, {
  loading: require('common/img/default.png'),
  error: require('common/img/error.png')
});

Vue.use(layer);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
