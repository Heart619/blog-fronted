import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(window.localStorage.getItem('user')),
    token: JSON.parse(window.localStorage.getItem('token')),
    administrator:JSON.parse(window.localStorage.getItem('user'))!==null&&JSON.parse(window.localStorage.getItem('user')).type > 0,
    loginFormVisiable: false,
    registorFormVisiable: false,
    pageName: 'index',
    // webSocketAddr: 'ws://192.168.88.130/websocket/',
    // oss: 'http://roxuynt15.hd-bkt.clouddn.com/', // dev
    oss: 'http://8.130.52.252/oss/',
    webSocketAddr: 'ws://8.130.52.252/websocket/',
    errorPagePath: "/error"
  },
  mutations: {
    // 改变页面
    changePage(state,name){
      state.pageName = name
    },
    // 获取用户信息
    getUserInfo(state){
      state.userInfo = JSON.parse(window.localStorage.getItem('user'))
      state.token = JSON.parse(window.localStorage.getItem('token'))
      if (state.userInfo !== null && state.userInfo.type > 0) {
        state.administrator = true
      } else {
        state.administrator = false
      }
    },
    showLFV(state){
      state.loginFormVisiable = true
    },
    showRFV(state){
      state.registorFormVisiable = true
    },
    cancelLFV(state){
      state.loginFormVisiable = false
    },
    cancelRFV(state){
      state.registorFormVisiable = false
    },
    logout(state){
      state.userInfo = null
      state.administrator = false
    }
  },
  actions: {
  },
  modules: {
  }
})
