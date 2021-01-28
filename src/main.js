// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import '../theme/index.css'               //element 自定义皮肤
import axios from './assets/js/axios'   //已封装axios
import router from './router'
import 'lib-flexible'                //适配
import axi from 'axios'               //未封装axios
import './assets/icon/iconfont.css'  //阿里字体图标
import store from '@/store'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.prototype.$https=axi




//判断token是否存在
router.beforeEach((to, from, next) => {
  Vue.prototype.title = to.name
  // console.log(to.name)
  next();

})


/* eslint-disable no-new */



new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
