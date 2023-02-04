<template>
  <el-dialog class="login_dialog" title="请登录" :visible.sync="$store.state.loginFormVisiable" @close="resetLoginForm"
             width="400px" center :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="60px" class="login_form">
      <!--        用户名-->
      <el-form-item prop="username" label="账号">
        <el-input v-model="loginForm.username" @keyup.enter.native="userLogin"></el-input>
      </el-form-item>
      <!--        密码-->
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="loginForm.password" @keyup.enter.native="userLogin"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button @click="resetLoginForm">取消</el-button>
        <el-button type="primary" :disabled="disable" @click="userLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
        loginProvince: '',
        loginCity: '',
        loginLat: 0, //纬度
        loginLng: 0, //经度
      },
      // 表单数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户是否合法
        username: [
          // 必填，提示消息，鼠标焦点消失时触发
          {required: true, message: "请输入用户名", trigger: "blur"},
          {min: 2, max: 16, message: "长度在2-16个字符之间"}
        ],
        // 验证密码是否合法
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"}
        ]
      },
      disable: false
    }
  },
  computed: {
    ...mapState([
      'loginFormVisiable'
    ])
  },
  methods: {
    resetLoginForm() {
      this.$store.commit('cancelLFV')
      this.$refs.loginFormRef.resetFields()
    },
    // 用户登录
    userLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;

        this.disable = true
        setTimeout(() => {
          this.disable = false
        }, 600)

        let send = {username: this.loginForm.username, password: this.$rsa.encrypt(this.loginForm.password)}
        this.$blog.post('/user/login', send).then(({data: res}) => {
          if (res.code !== 0) return this.$message({message: res.msg, type: 'error', offset: 80})
          this.$message({message: '登录成功', type: 'success', offset: 80});
          this.$refs.loginFormRef.resetFields();
          window.localStorage.setItem("token", JSON.stringify(res.data.token));
          window.localStorage.setItem("user", JSON.stringify(res.data.user));
          window.localStorage.setItem("refresh", JSON.stringify(res.data.refreshToken));
          this.$store.commit('getUserInfo')
          this.$store.commit('cancelLFV')
        }).catch(err => {
          this.$message.error("网络繁忙，请稍后再试")
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>

.login_form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_dialog {
  opacity: 1;
}

</style>
