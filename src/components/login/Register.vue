<template>
    <el-dialog class="dialog" title="注册" :visible.sync="$store.state.registorFormVisiable" @close="resetForm" width="400px" center>
        <el-form ref="FormRef" :model="Form" :rules="FormRules" class="form" label-width="80px" label-position="left">
            <!--        昵称-->
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="Form.nickname"></el-input>
            </el-form-item>
            <!--        用户名-->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="Form.username"></el-input>
            </el-form-item>
            <!--        密码-->
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="Form.password"></el-input>
            </el-form-item>
            <!--        密码-->
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="Form.email"></el-input>
            </el-form-item>
            <!--        头像-->
            <el-form-item prop="avatar" label="头像">
              <singleUpload v-model="dialogImageUrl"></singleUpload>
            </el-form-item>
            <el-form-item style="text-align: right">
                <el-button @click="resetForm">取消</el-button>
                <el-button type="primary" @click="userRegister">登录</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import singleUpload from "../upload/singleUpload";
export default {
  components: {
    singleUpload
  },
    data() {
        return {
          dataObj: {
            policy: '',
            signature: '',
            key: '',
            ossaccessKeyId: '',
            dir: '',
            host: '',
            // callback:'',
          },
            user: {
                username: '',
                nickname: '',
                avatar: '',
                email: '',
                password: '',
                type: 0
            },
            // 表单数据绑定对象
            Form: {
                nickname: '',
                username: '',
                password: '',
                email: ''
            },
            // 表单验证规则对象
            FormRules: {
                // 验证用户是否合法
                username: [
                    // 必填，提示消息，鼠标焦点消失时触发
                    {required: true, message: "请输入用户名", trigger: "blur"},
                    {min: 2, max: 16, message: "长度在2-16个字符之间"}
                ],
                // 验证用户是否合法
                nickname: [
                    // 必填，提示消息，鼠标焦点消失时触发
                    {required: true, message: "请输入昵称", trigger: "blur"},
                    {min: 2, max: 16, message: "长度在2-16个字符之间"}
                ],
                // 验证密码是否合法
                password: [
                    {required: true, message: "请输入密码", trigger: "blur"},
                    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"}
                ],
            },
            dialogImageUrl: ''
        }
    },
    computed: {
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== '' && this.value !== undefined;
        },
        set: function (newValue) {
        }
      }
    },
    methods: {
        resetForm() {
            this.$store.commit('cancelRFV')
            this.$refs.FormRef.resetFields()
            this.dialogImageUrl = ''
        },
        // 用户登录
        userRegister() {
            this.$refs.FormRef.validate(async valid => {
                if (!valid) return;
                this.user.username = this.Form.username
                this.user.nickname = this.Form.nickname
                this.user.email = this.Form.email
                this.user.avatar = this.dialogImageUrl
                this.user.password = this.$md5(this.Form.password)
                const {data: res} = await this.$blog.post('/user/register', this.user)
                if (res.code !== 0) return this.$message.error(res.msg)
                // console.log(res)
                this.$refs.FormRef.resetFields()
                this.$message({message: '注册成功', type: 'success', offset: 80});
                window.sessionStorage.setItem("token", JSON.stringify(res.data.token));
                window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
                this.$store.commit('getUserInfo')
                this.$store.commit('cancelRFV')
            })
        },
    }
}
</script>

<style lang="less" scoped>

    .avatar-uploader .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

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
