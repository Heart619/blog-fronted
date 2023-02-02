import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import marked from 'marked'
import axios from 'axios'
import NProgress from 'nprogress'
import './assets/fonts/iconfont.css'
import '@/assets/css/typo.css'
import 'mavon-editor/dist/css/index.css'
import '@/assets/css/global.css'
import waterfall from 'vue-waterfall2'
import vcolorpicker from 'vcolorpicker'
import md5 from 'js-md5'
import {JSEncrypt} from "jsencrypt";

Vue.prototype.$md5 = md5;
Vue.prototype.$marked = marked
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts

const blog = axios.create({ // 博客后台api地址
  baseURL: '/api',
})

const rsa = new JSEncrypt();
rsa.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAogfO/bveLnn0Tb7dnxIVXj25KjTmVFBllP0zqYY3FwNVKQ03iKI7kYd01sbnlRHLVcu74nmk41Ux7mHPQx5nghyktLiyovsbwBkqpWNnfmT9DNq89R6Lw9Mrw/L0pJDc9ACGkksGDyFvQjEt/3+h/phMjEkgHU2kA+F0ZCCgZgVOsKQXwL452+NpLH4rekwfXRJw0GCaZeyMPkNYbItsHvCD1CCPYeCJQw9sfYX/TKeDO2LGZKH5xCi672SqAeu36fpUsw4LXAosTln9Xwpvd2+JT3+GOzKhv05j45YtY96L4/zho0FGn7YSPAd+o3JGMg6B0Cb1unnp6PMKwEBMewIDAQAB")

blog.interceptors.request.use(config => {
  NProgress.start()
  config.headers.token = window.localStorage.getItem('token')
  return config
})

blog.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$blog = blog
Vue.prototype.$rsa = rsa
// Vue.prototype.$picture = picture

Vue.config.productionTip = false
Vue.use(mavonEditor)
Vue.use(vcolorpicker)
Vue.use(waterfall)

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})

Vue.filter('dataFormat2', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}`
})

Vue.filter('dataFormat3', function (originVal) {
  const dt = new Date(originVal)
  let usedTime = new Date() - dt
  let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
  let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
  let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
  let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
  let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
  if (days > 0) return days + '天前'
  if (hours > 0) return hours + '小时前'
  if (minutes <= 0) return "刚刚"
  return minutes + '分前'
})


Vue.filter('dataFormat4', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const M = (dt.getMinutes() + '').padStart(2, '0')
  const s = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${M}:${s}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
