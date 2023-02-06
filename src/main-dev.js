import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import mavonEditor from 'mavon-editor'
import marked from 'marked'
import axios from 'axios'
import NProgress from 'nprogress'
import './assets/fonts/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/animate.css'
import '@/assets/css/typo.css';
import '@/assets/css/prism.css'
import 'mavon-editor/dist/css/index.css'
import '@/assets/css/global.css'
import 'nprogress/nprogress.css'
import waterfall from 'vue-waterfall2'
import vcolorpicker from 'vcolorpicker'
import * as echarts from 'echarts'
import md5 from 'js-md5'
import {JSEncrypt} from 'jsencrypt'
import Message from "./components/Message";


Vue.prototype.$md5 = md5;
Vue.prototype.$marked = marked
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts


// const blog = axios.create({ // 博客后台api地址
//     baseURL: 'http://127.0.0.1:8090/',
// })

const blog = axios.create({ // 博客后台api地址
    baseURL: '/api',
})

const rsa = new JSEncrypt();
rsa.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg703+zHtuIrTWC5FJB0Msif7npCvIPXM+6rcFVEUZSSvR1BOu+YSEDAg7UqqG8lIujkhqBwksI+F4P9lRufM/TohMqKwBPAZia+Th1soltySb0nGWMqHrVYH48jloz5E5j62ZxwaWWYgg1AFCzIuO0/qUw1SPj5V0ltI86sNt+14EU+knhNL3kjpPlUaxDY/H3Ea8YIy6aZ3gI4SOZRq6+AS9iaRAaX6bXGbt9Vs54sPBartpULqCr3IZFozVnQVNCy7Ye0gSePebE8j91giHZNNnehnpkn45H8CzxwCpkMVL0xxZaCR9fVlTEinWHjhYyeDDVlpYjqkSS9u5QEYVwIDAQAB")

// const picture = axios.create({ // 图片服务器api地址
//     baseURL: 'http://roxuynt15.hd-bkt.clouddn.com',
//     method: 'post',
//     responseType: 'arraybuffer',
// })

blog.interceptors.request.use(config => {
    NProgress.start()
    config.headers.token = window.localStorage.getItem('token')
    return config
})

// blog.interceptors.response.use(config => {
//     NProgress.done()
//     return config
// })

//标志当前是否正在刷新token
let isRefreshing = false;
//请求队列
let requests = [];
blog.interceptors.response.use(res => {
    NProgress.done()
    if (res.data.code === 401) {
        const config = res.config;
        if (!isRefreshing) {
            isRefreshing = true;
            let refresh = window.localStorage.getItem('refresh');
            //返回刷新token的回调的返回值，本来考虑到由于请求是异步的，所以return会先执行，导致返回一个undefined，那么就需要使用async+await，但实际上没有加也成功了
            return blog.get('/user/refresh', {
                headers: {refresh}
            }).then(({data: res}) => {
                if (res.code === 0) {
                    window.localStorage.setItem("token", JSON.stringify(res.data));
                    return blog(config)
                } else if (res.code === 410) {
                    Message.warning("登陆已过期，请重新登陆")
                    // window.localStorage.clear()
                    setTimeout(() => {
                        window.location.href = "/"
                    }, 800)
                } else {
                    window.location.href = "/"
                    window.localStorage.clear()
                }
            }).catch(() => {
                window.location.href = "/"
                window.localStorage.clear()
            }).finally(() => {
                isRefreshing = false;
            })
        } else {
            return new Promise(resolve => {
                requests.push(() => {
                    resolve(blog(config));
                })
            })
        }
    }
    return res;
})

Vue.prototype.$blog = blog
Vue.prototype.$rsa = rsa
// Vue.prototype.$picture = picture

Vue.config.productionTip = false
Vue.use(Element)
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
