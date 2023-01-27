<template>
    <el-container style="opacity: 0.9" class="message">
        <el-card class="animate__animated animate__fadeInLeft publish">
            <div class="author">
                <el-avatar v-if="userInfo===null" icon="el-icon-user-solid" size="large" style="background-color: #666"></el-avatar>
                <el-avatar v-else :src="$store.state.oss + userInfo.avatar" size="large"></el-avatar>
                <div>
                    <div class="nkname">
                        <span class="name" v-if=" userInfo===null ">匿名用户</span>
                        <span class="name" v-else>{{userInfo.nickname}} </span>
                    </div>
                </div>
            </div>
            <el-form :model="messageForm" :rules="messageFormRules" ref="messageFormRef">
                <el-form-item prop="content">
                    <el-input :rows="5" v-model="messageForm.content" type="textarea" placeholder="请输入你的留言"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right">
                    <el-button type="primary" @click="publish">点击发表</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card v-if="messageList.length>0" class="animate__animated animate__fadeInLeft">
            <ul style="padding: 0" class="comment-list">
                <li class="comment" v-for="(ms, index) in messageList" :key="ms.id">
                    <el-avatar v-if="ms.avatar!==''" :src="$store.state.oss + ms.avatar" ></el-avatar>
                    <el-avatar v-else  icon="el-icon-user-solid"></el-avatar>
                    <div class="content">
                        <div style="display: flex;justify-content: space-between;width: 100%">
                            <div class="nkname">
                                <span class="name">{{ms.nickname}} </span>
                                <span class="date">{{ms.createTime | dataFormat3}}</span>
                            </div>
                        </div>
                        <p class="reply">{{ms.content}}</p>
                    </div>
                    <!--                    {{cmt}}-->
<!--                  -->
                  <el-link v-if="userInfo !== null && userInfo.id === ms.userId" type="danger" @click="delMsg(ms.id, index)">删除</el-link>
                </li>
              <div :v-loading="loading" element-loading-text="正在加载"></div>
            </ul>
        </el-card>
    </el-container>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            picList: [],
            editing: false,
            messageList: [],
            // userInfo: null,
            message:{
                userId:-1,
                content:''
            },
            messageForm:{
                content:''
            },
            messageFormRules:{
                content: [
                    {required: true, message: "留言内容不能为空！"},
                    {min: 0, max: 100, message: "留言内容不超过100字！"}
                ]
            },
            page: 1,
            limit: 10,
            totalPage: 0,
            loading: false
        }
    },
    created() {
        this.getMessageList()
    },
    computed:{
        ...mapState([
            'userInfo',
            'administrator'
        ])
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.lazyLoading);
    },
    mounted() {
      window.addEventListener('scroll', this.lazyLoading); // 滚动到底部，再加载的处理事件
    },
    methods: {
        lazyLoading () { // 滚动到底部，再加载的处理事件\
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          const clientHeight = document.documentElement.clientHeight
          const scrollHeight = document.documentElement.scrollHeight
          if (scrollTop + clientHeight >= scrollHeight && !this.loading) {
            // 滚动到底部，逻辑代码
            ++this.page;
            if (this.page > this.totalPage) return;
            this.getMessageList();
          }
        },
        // 留言发表
        publish(){
            this.$refs.messageFormRef.validate(  async valid => {
                if (!valid) return
                this.message.content = this.messageForm.content
                if (this.userInfo === null){
                    this.message.id = null
                    this.message.nickname = "匿名用户"
                    this.message.avatar = 'default/avatar.png'
                } else {
                    this.message.userId = this.userInfo.id
                    this.message.nickname = this.userInfo.nickname
                    this.message.avatar = this.userInfo.avatar
                }
                const {data: res} = await this.$blog.post('/message/addMessage', this.message)
              // console.log(this.userInfo)
                if (res.code === 0) {
                  this.messageList.unshift(res.data);
                  this.$message({message: "留言发表成功", type: 'success', offset: 80});
                  this.messageForm.content = '';
                } else {
                    this.$message({message: "留言发表失败！", type: 'error', offset: 80});
                }
            })



        },
        // async getAllPicList() {
        //     const {data: res} = await this.$picture.get('/pic_paths/get_all/')
        //     // console.log(res)
        //     this.picList = res
        // },

        // 获取留言列表
        async getMessageList() {
            this.loading = true;
            const {data: res} = await this.$blog.get(`/message/list?page=${this.page}&limit=${this.limit}`)
            this.loading = false
            this.totalPage = res.page.totalPage
            this.messageList = [...this.messageList, ...res.page.list]
        },
        //删除留言
        async delMsg(id, index) {
          const {data: res} = await this.$blog.post('/message/messages/del/' + id);
          if (res.code === 0) {
            this.messageList.splice(index, 1);
          }
        }
    },
}
</script>

<style scoped lang="less">
    .el-container{
        display: block;
    }

    .publish{
        margin-bottom: 20px;
    }

    .author {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-bottom: 20px;
        .nkname{
            margin: 10px;
        }
    }

    .img {
        width: 300px;
        margin: 20px;
    }

    .comment {
        border-bottom: 1px dashed #ccc;
        margin: 30px 0;
        display: flex;
    }

    /*.el-avatar {*/
    /*    width: 35px;*/
    /*    height: 35px;*/
    /*    border: 2px solid white;*/
    /*    box-shadow: 0 0 10px 2px rgba(0, 0, 0, .06);*/
    /*    flex-shrink: 0;*/
    /*}*/

    .content {
        text-align: left;
        font-size: 14px;
        flex-grow: 1;

        .nkname {
            margin-left: 10px;
            max-width: 530px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            .rp, .date {
                color: #999;
                margin-left: 10px;
            }

            .blog {
                color: #349edf;
                margin-left: 10px;
            }
        }

        .reply {
            margin-left: 10px;
        }

        .op {
            color: #ddd;
            font-weight: lighter;

            .rep {
                color: #349edf;
            }

            .del {
                color: red;
            }
        }

        .op:hover {
            cursor: pointer;
        }
    }
</style>
