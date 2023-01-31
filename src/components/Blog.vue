<template>
  <el-container class="animate__animated animate__fadeIn ">
    <el-card style="background-color: rgba(255, 255, 255,1)" class="first-card">
      <div slot="header" class="total blog-info">
        <div class="user-info">
          <el-avatar size="small"
                     v-if="blog.userAvatar !== '' && blog.userAvatar !== undefined && blog.userAvatar !== null"
                     :src="$store.state.oss + blog.userAvatar"></el-avatar>
          <el-avatar size="small"
                     v-if="blog.userAvatar === '' || blog.userAvatar === undefined || blog.userAvatar === null"
                     :src="$store.state.oss + 'default/avatar.png'"></el-avatar>
          <a href="#" class="header">{{ blog.userNickName }}</a>
        </div>
        <div class="blog-date">
          <i class="el-icon-date"></i>
          <span>{{ blog.createTime | dataFormat }}</span>
        </div>
        <div>
          <i class="el-icon-view"></i>
          <span>{{ blog.views + 1 }}</span>
        </div>
      </div>
      <el-image class="blog-pic"
                v-if="blog.firstPicture !== '' && blog.firstPicture !== undefined && blog.firstPicture !== null"
                :src="$store.state.oss + blog.firstPicture"></el-image>
      <el-image class="blog-pic"
                v-if="blog.firstPicture === '' || blog.firstPicture === undefined || blog.firstPicture === null"
                :src="$store.state.oss + 'default/load.gif'"></el-image>
      <hr/>
      <h2 class="blog-title header">{{ blog.title }}
        <el-tag effect="plain" type="warning" style="font-weight: bold; font-size: small; margin-left: 20px">
          {{ blog.flag }}
        </el-tag>
      </h2>
      <div class="typo m-padded-lr-responsive m-padded-tb-large"
           v-html="blog.content"></div>
      <div class="tags">
        <div class="tag-item" v-for="tag in blog.tags" :key="tag.id">
          <div class="sjx-outer">
            <div class="sjx-inner"></div>
          </div>
          <div class="tag">
            {{ tag.name }}
          </div>
        </div>
      </div>
<!--      <div class="appreciate">-->
<!--        <el-popover-->
<!--            placement="bottom"-->
<!--            title=""-->
<!--            width="300"-->
<!--            trigger="hover"-->
<!--            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">-->
<!--          <div class="give-money">-->
<!--            <div class="give-money-item">-->
<!--              <el-image :src="wechart" title="微信支付"></el-image>-->
<!--              <p>微信</p>-->
<!--            </div>-->
<!--            <div class="give-money-item">-->
<!--              <el-image :src="alipay" title="支付宝支付"></el-image>-->
<!--              <p>支付宝</p>-->
<!--            </div>-->
<!--          </div>-->
<!--          <el-button class="zanshang" slot="reference" type="danger" round plain>赞赏</el-button>-->
<!--        </el-popover>-->
<!--      </div>-->
      <div class="author">
        <ul>
          <li>作者 {{ blog.userNickName }}</li>
          <li>发表时间 {{ blog.createTime | dataFormat }}</li>
        </ul>
      </div>
      <el-card shadow="never" class="comments">
        <div class="header">
          评论
        </div>
        <div v-for="(cmt, idx) in rootCmtTree" :key="cmt.id">
          <comment :cmt="cmt" :parent-id="-1" :rp-active-id="rpActiveId"></comment>
          <reply style="margin-left: 40px" v-if="rpActiveId === cmt.id" :id="cmt.id"
                 :blog-author="blog.userId" :blog-id="blog.id" :comment="cmt"
                 v-on:quit="cancel" v-on:newCmt="replyComp"></reply>
          <span v-else class="reply" @click="rpActiveId = cmt.id">回复</span>
          <span v-if="administrator || userInfo && cmt.userId === userInfo.id" class="delete"
                @click="deleteComment(cmt.id, rootCmtTree, idx)">删除</span>
          <div v-show="cmt.showChildren" style="margin-left: 40px" v-for="(rp, idx) in cmt.children" :key="rp.id">
            <comment :cmt="rp" :parent-id="cmt.id" :rp-active-id="rpActiveId"></comment>
            <reply style="margin-left: 40px" v-if="rpActiveId === rp.id" :id="rp.id"
                   :blog-author="blog.userId" :blog-id="blog.id" :comment="cmt"
                   v-on:quit="cancel" v-on:newCmt="replyComp"></reply>
            <span v-else class="reply" @click="rpActiveId = rp.id">回复</span>
            <span v-if=" administrator || userInfo && rp.userId === userInfo.id" class="delete"
                  @click="deleteComment(rp.id, cmt.children, idx)">删除</span>
          </div>
          <hr>
          <p class="reply" v-show="!cmt.showChildren" @click="showCmt(cmt)">点击展开回复</p>
          <p class="reply" v-show="cmt.showChildren && cmt.children.length !== 0" @click="showCmt(cmt)">收起回复</p>
          <p class="reply" v-show="cmt.showChildren && cmt.children.length === 0 && !loading">暂无更多回复</p>
        </div>
      </el-card>
      <el-form class="commmet-reply" :model="commentForm" :rules="commentFormRules" ref="commentFormRef">
        <el-form-item prop="content">
          <el-input v-model="commentForm.content" :validate-event="false" type="textarea"
                    class="write-commmet" :rows="6">
          </el-input>
        </el-form-item>
        <div class="submit">
          <el-button prefix-icon="el-icon-submit" type="primary" class="item" @click="submitCmt()">
            <i class="el-icon-edit"></i> 发表
          </el-button>
        </div>
      </el-form>
      <el-link v-show="!loading && page < totalPage" @click="lazyLoading">查看更多评论<i class="el-icon-view el-icon--right"></i></el-link>
      <div :v-loading="loading" element-loading-text="正在加载"></div>
    </el-card>
  </el-container>
</template>

<script>
import Prism from '../plugins/prism'
import Login from "./login/Login";
import Comment from "./comment/Comment";
import Reply from "./comment/Reply";
import {mapState} from 'vuex'

export default {
  components: {
    Login, Prism, Comment, Reply
  },
  data() {
    return {
      blog: {
        user: {
          userAvatar: ''
        },
        firstPicture: ''
      },
      replyForm: {
        content: ''
      },
      replyFormRules: {
        content: [
          {required: true, message: "评论内容不能为空！"},
          {min: 0, max: 100, message: "评论内容不超过100字！"}
        ]
      },
      rpActiveId: -1,
      blogId: 0,
      wechart: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      alipay: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      commentForm: {
        content: ''
      },
      loginDialogFormVisible: false,
      commentFormRules: {
        content: [
          {required: true, message: "评论内容不能为空！"},
          {min: 0, max: 100, message: "评论内容不超过100字！"}
        ]
      },
      rootCmtTree: [],
      loading: false,
      page: 1,
      limit: 8,
      totalPage: 0
    }
  },
  watch: {
    '$route'(to, from) {
      this.$router.go(0);
    }
  },
  created() {
    this.getBlogInfomation()
  },
  computed: {
    ...mapState([
      'userInfo',
      'administrator',
    ])
  },
  methods: {
    lazyLoading() { // 滚动到底部，再加载的处理事件\
      // 滚动到底部，逻辑代码
      if (this.loading) return;
      ++this.page;
      if (this.page > this.totalPage) return;
      this.getBlogComments(this.blog.id);
    },
    showCmt(cmt) {
      if (cmt.showChildren === false && cmt.children.length === 0) {
        this.getCmtByPmt(cmt);
      }
      cmt.showChildren = !cmt.showChildren
    },
    getCmtByPmt(cmt) {
      this.$blog.get(`/comment/getCmt/${cmt.blogId}/${cmt.id}`).then(({data: res}) => {
        if (res.code === 0) {
          this.translator(cmt, res.data)
          cmt.children = this.getChildList(cmt.children);
          setTimeout(() => {
            Prism.highlightAll()
          }, 0)
        } else {
          this.$message.error("网络繁忙，请稍后再试")
        }
      }).catch(err => {
        console.log(err)
        this.$message.error("网络繁忙，请稍后再试")
      })
    },
    replyComp() {
      this.$message({message: "评论发表成功", type: 'success', offset: 80});
      this.rpActiveId = -1
    },
    cancel(val) {
      this.rpActiveId = val
    },
    // 获取博客详情信息
    async getBlogInfomation() {
      const {data: res} = await this.$blog.get(`/blog/${this.$route.query.id}.html`)
      if (res.code !== 0) {
        this.$message.error(res.msg);
        return;
      }
      this.blog = res.data
      this.blogId = this.blog.id
      window.scrollTo({top: 0, behavior: 'smooth'})
      await this.getBlogComments(this.blog.id);
    },

    async getBlogComments(blog) {
      this.loading = true
      this.$blog.get(`comment/list?blog=${blog}&page=${this.page}&limit=${this.limit}`).then(({data: res}) => {
        if (res.code !== 0) {
          this.$message.error("网络繁忙，请稍后再试")
          this.loading = false
          return;
        }
        this.totalPage = res.page.totalPage
        this.rootCmtTree = [...this.rootCmtTree, ...res.page.list]
      }).catch(err => {
        this.$message.error(err.msg);
        this.loading = false
      })
      this.loading = false
    },

    translator(parent, children) {
      children.forEach((child, index) => {
        if (child.parentCommentId === parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          this.translator(child, temp)
          child.parentComment = JSON.parse(JSON.stringify(parent))
          parent.children.push(child)
        }
      })
    },

    getChildList(children) {
      let cds = []
      let dfs = (children) => {
        if (children === undefined) return
        children.forEach((child) => {
          cds.push(child)
          if (child.children === undefined) return
          dfs(child.children)
        })
      }
      dfs(children)
      return cds;
    },

    // 提交评论
    submitCmt() {
      this.$refs.commentFormRef.validate(valid => {
        if (!valid) return
        this.submit(-1)
      })
    },
    async submit() {
      let comment = {}
      comment.content = this.commentForm.content
      comment.blogId = this.blog.id
      if (this.$store.state.userInfo === null) {
        this.$store.commit('showLFV')
      } else {
        const {data: res} = await this.$blog.post('comment/save', {
          content: comment.content,
          blogId: comment.blogId,
          userId: this.$store.state.userInfo.id,
          avatar: this.$store.state.userInfo.avatar,
          nickname: this.$store.state.userInfo.nickname,
          adminComment: this.$store.state.userInfo.id === this.blog.userId,
          parentCommentId: -1
        })
        if (res.code === 0) {
          this.rootCmtTree.unshift(res.data)
          this.commentForm.content = ''
          this.$message({message: "评论发表成功", type: 'success', offset: 80});
        } else {
          this.$message({message: "评论发表失败！", type: 'error', offset: 80});
        }
      }
    },
    // 回复博客
    reply(parentId) {
      this.$refs.replyFormRef.validate(valid => {
        if (!valid) return
        this.submit(parentId)
      })
    },
    // 删除评论
    async deleteComment(id, arr, index) {
      const {data: res} = await this.$blog.post(`/admin/comment/${id}/delete`)
      if (res.code === 0) {
        arr.splice(index, 1)
        this.$message({message: "删除评论成功！", type: 'success', offset: 80});
      } else {
        this.$message({message: "删除评论失败！", type: 'error', offset: 80});
      }
    }
  },

}
</script>

<style scoped lang="less">


.el-card {
  width: 100%;
}

.el-popper /deep/ {
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%),
}

.first-card {
  border-radius: 10px 10px 0 0;
  position: relative;
  padding-bottom: 100px;
  /*text-align: center;*/
  font: 300 1em/1.8 PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;

  .blog-pic {
    border-radius: 8px;
  }
}

hr.style-one {
  width: 100%;
  background-image: linear-gradient(to right, rgba(64, 158, 255, 0), rgba(64, 158, 255, 0.75), rgba(64, 158, 255, 0));
}

.commmet-reply {
  position: relative;

  .auth-info {
    position: absolute;
    left: 0;
  }

  .submit {
    text-align: center;
  }

}

.appreciate {
  text-align: center;
}

.give-money {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #409eff;
  border-radius: 10px;

  .give-money-item {
    border-radius: 10px;
    padding: 10px;
    width: 50%;
    text-align: center;

    .el-image {
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-left: 5px;
      margin-right: 5px;
    }

    p {
      font-size: smaller;
      font-weight: bold;
      color: #3a8ee6;
      display: block;
      line-height: 20px;
      margin: 0;
    }
  }
}

.tags {
  display: flex;
  align-items: center;
  margin-left: 50px;
}

.tag-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 20px;
}

.tag {
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  background-color: #ecf5ff;
  border: 1px solid #409eff;
  color: #409eff;
  display: flex;
}

.sjx-outer {
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 7px solid #409eff;
  position: relative;
}

.sjx-inner {
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 7px solid #ecf5ff;
  top: -7px;
  left: 1px;
  position: absolute;
}

.author {
  text-align: left;
  background-color: #fcfff5;
  box-shadow: 0 0 0 1px #a3c293 inset;
  color: #2c662d;
  width: 100%;
  position: absolute;
  left: 0;
  margin: 20px 0;
  padding: 20px 0;
  font-size: small;
  font-family: PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
}

.comments {
  margin-top: 150px;
  box-shadow: 0 1px 2px 0 rgb(34 36 38 / 15%);
  border: 1px solid rgba(34, 36, 38, .15);
  border-top: 2px solid #409EFF;
  text-align: left;

  .reply {
    margin-left: 40px;
    font-size: 12px;
    color: rgba(0, 0, 0, .5);
  }

  .reply:hover {
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }

  .delete {
    margin-left: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, .5);
  }

  .delete:hover {
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }


  .header {
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 1.28571429rem;
    color: rgba(0, 0, 0, .87);
  }

}


.write-commmet {
  margin-top: 20px;
}

.blog-pic {
  width: 100%;
}

.blog-title {
  text-align: center;
}

.blog-info {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, .4);
  font-size: 13px;

  .blog-date {
    margin-right: 5px;
  }

  .user-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-right: 15px;

    .el-avatar {
      margin-right: 5px;
      width: 22px;
      height: 22px;
    }

    .header {
      text-decoration: none;
      color: #3a8ee6;
      font-weight: bold;
    }
  }
}

@media screen and (max-width: 768px) {
  .tags {
    margin-left: 0;
  }

  hr {
    display: none;
  }

  .comment-content {
    font-size: 12px !important;
  }
}

@media only screen and (max-width: 480px) {
  h2 {
    font-weight: normal;
  }

  code, pre {
    font-size: 13px !important;
  }
}
</style>
