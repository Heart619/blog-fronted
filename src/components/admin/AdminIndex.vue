<template>
  <div>
    <el-row :gutter="32">
      <el-col :xs="12" :sm="6" style="text-align: center;margin-bottom: 32px;">
        <el-card shadow="hover" @click.native="selectCard (0)">
          <p>总阅读量</p>
          <h2>{{viewCount}}</h2>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" style="text-align: center;margin-bottom: 32px;">
        <el-card shadow="hover" @click.native="selectCard (1)">
          <p>文章总数</p>
          <h2>{{blogCount}}</h2>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" style="text-align: center;margin-bottom: 32px;">
        <el-card shadow="hover" @click.native="selectCard (2)">
          <p>点赞数</p>
          <h2>{{appreciateCount}}</h2>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" style="text-align: center;margin-bottom: 32px;">
        <el-card shadow="hover" @click.native="selectCard (3)">
          <p>评论数</p>
          <h2>{{commentCount}}</h2>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24" style="text-align: center;">
        <el-card shadow="hover">
          <div class="com-page">
            <BlogChart style="width: 100%; height: 350px;" :psMsg="selectedCard"></BlogChart>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="8" :lg="8" style="text-align: center;margin-bottom: 20px;">
        <el-card class="chart-wrapper" shadow="hover">
          <TagChart style="width: 100%;height: 300px;"></TagChart>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" style="text-align: center;margin-bottom: 20px;">
        <el-card class="chart-wrapper" shadow="hover">
          <TypeChart style="width: 100%;height: 300px;"></TypeChart>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" style="text-align: center;margin-bottom: 20px;">
        <el-card class="chart-wrapper" shadow="hover">
          <VisitorMap style="width: 100%;height: 300px;"></VisitorMap>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}"
              style="padding-right:8px;margin-bottom:30px;">
        <recent-blog-list/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:30px;">
        <comment-list id="comments" :comments="commentList"/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:30px;">
        <box-card/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BlogChart from "./charts/BlogChart";
import TagChart from "./charts/TagChart";
import TypeChart from "./charts/TypeChart";
import RecentBlogList from "./charts/RecentBlogList";
import CommentList from "./charts/CommentList";
import BoxCard from "./charts/BoxCard";
import VisitorMap from "./charts/VisitorMap";

export default {
  components: {
    VisitorMap, BlogChart, TagChart, TypeChart,RecentBlogList, CommentList, BoxCard
  },
  data() {
    return {
      blogCount: 0,
      viewCount: 0,
      appreciateCount: 0,
      commentCount: 0,
      selectedCard: 0,
      recommendList: [],
      page: 1,
      totalPage: 0,
      limit: 4,
      commentList: []
    }
  },
  created() {
    this.getcountList();
    this.getCommentList();
  },
  mounted () {
   document.getElementById("comments").addEventListener('scroll', this.lazyLoadingCmt)
  },
  methods: {
    lazyLoadingCmt() { // 滚动到底部，再加载的处理事件\
      const doc = document.getElementById("comments");
      const scrollTop = doc.scrollTop || doc.scrollTop
      const clientHeight = doc.clientHeight
      const scrollHeight = doc.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight) {
        // 滚动到底部，逻辑代码
        ++this.page;
        if (this.page > this.totalPage) return;
        this.getCommentList();
      }
    },
    // 获取评论列表
    async getCommentList() {
      this.loading = true
      const {data: res} = await this.$blog.get(`/admin/comment/list?limit=${this.limit}&page=${this.page}`);
      this.loading = false
      if (res.code === 444) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      this.totalPage = res.page.totalPage
      this.commentList = [...this.commentList, ...res.page.list]
    },
    async getcountList() {
      const {data: res} = await this.$blog.get('/admin/blog/getBlogCount')
      const {data: res2} = await this.$blog.get('/admin/blog/getViewCount')
      const {data: res3} = await this.$blog.get('/admin/blog/getAppreciateCount')
      const {data: res4} = await this.$blog.get('/admin/comment/getCommentCount')
      if (res === 444 || res2 === 444 || res3 === 444 || res4 === 444) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      this.blogCount = res.data
      this.viewCount = res2.data
      this.appreciateCount = res3.data
      this.commentCount = res4.data
    },
    selectCard(id) {
      this.selectedCard = id
    },
  },

}
</script>

<style scoped lang="less">
  .com-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .el-card:hover {
    cursor: pointer;
  }

  .chart-wrapper {
    height: 300px;
    margin-top: 30px;
  }

  .el-card /deep/ .el-card__body {
    padding: 0;
  }
</style>
