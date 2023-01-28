<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="el-card__header" style="text-align: left;padding: 0">
        <h1 style="margin: 0;">评论管理</h1>
      </div>
      <ul style="padding: 0; overflow:auto" class="comment-list">
          <li class="comment" v-for="(cmt, idx) in commentList" :key="cmt.id">
            <el-avatar :src="$store.state.oss + cmt.avatar"></el-avatar>
            <div class="content">
              <div style="display: flex;justify-content: space-between;width: 100%">
                <div class="nkname">
                  <span class="name">{{ cmt.nickname }} </span>
                  <span class="date">{{ cmt.createTime | dataFormat3 }}</span>
                  <span class="rp">回复了文章</span>
                  <span @click="getBlogInfo(cmt.blogId)" class="blog">{{ cmt.blogTitle }}</span>
                </div>
                <div class="op">
                  <span class="del" @click="deleteCommentById(cmt.id, idx)">删除</span>
                </div>
              </div>
              <p class="reply">{{ cmt.content }}</p>
            </div>
          </li>
        <div :v-loading="loading" element-loading-text="正在加载"></div>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editing: false,
      commentList: [],
      page: 1,
      limit: 8,
      totalPage: 1,
      loading: false
    }
  },
  created() {
    this.getCommentList()
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

      if (scrollTop + clientHeight >= scrollHeight) {
        // 滚动到底部，逻辑代码
        ++this.page;
        if (this.page > this.totalPage) return;
        this.getCommentList()
      }
    },
    // 获取评论列表
    async getCommentList() {
      this.loading = true
      const {data: res} = await this.$blog.get(`/admin/comment/list?limit=${this.limit}&page=${this.page}`);
      this.loading = false
      if (res.code === 401) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      this.totalPage = res.page.totalPage
      this.commentList = [...this.commentList, ...res.page.list]
    },
    // 删除评论
    async deleteCommentById(id, index) {
      // 弹出对话框
      const confirmResult = await this.$confirm(
          '此操作将永久删除该评论, 是否继续',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(async () => {
        const {data: res} = await this.$blog.post(`/admin/comment/${id}/delete`);
        if (res.code === 0) {
          this.commentList.splice(index, 1)
          this.$message.success('删除成功！')
          return
        }
        if (res.code === 401) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        this.$message.error('删除失败！')
      }).catch(err => {
        this.$message.info('已取消删除')
      })
    },
    // 跳转到博客详情页
    getBlogInfo(blogId) {
      this.$router.push({path: '/blogInfo', query: {id: blogId}});
    },
  }
}
</script>

<style scoped lang="less">
.scrollBarWrap {
  width: 240px;
  height: 360px;
  border: 3px solid pink;
  /* 第三步，滚动的容器盒子，不能设置自动滚动，注释掉 */
  /* overflow: auto; */
}
.comment {
  border-bottom: 1px dashed #ccc;
  margin: 10px 0;
  display: flex;
}

.el-avatar {
  width: 35px;
  height: 35px;
  border: 2px solid white;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, .06);
  flex-shrink: 0;
}

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
      cursor: pointer;
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
