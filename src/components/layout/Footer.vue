<template>
  <div class="animate__animated animate__fadeInUp footer-wrap">
    <!--    center aligned居中-->
    <el-row :gutter="20" class=" footer-info">
      <el-col class="ewm" :xs="24" :sm="4">
        <el-image lazy :src="$store.state.oss + 'default/wechat.png'"
                  :preview-src-list="[$store.state.oss + 'default/wechat.png']" alt="图片加载失败"
                  class="ui rounded image" style="width: 110px"/>
      </el-col>
      <el-col class="new-blog" :xs="24" :sm="7">
        <h4 class="ui inverted header m-text-spaced ">最新博客</h4>
        <div id="newblog-container">
          <div class="recommend-blog l-text list" v-for="blog in footerList" :key="blog.id">
            <a class="item" href="javascript:void(0)" @click="toBlog(blog.id)">{{ blog.title }}</a>
          </div>
        </div>
      </el-col>
      <el-col v-if="isWebSocket" class="intro" :xs="24" :sm="2">
        <div class="seven wide column">
          <br><br>
          <p class="m-text-thin m-text-spaced m-opacity-mini">
            在线人数：{{online}}</p>
        </div>
      </el-col>
      <el-col class="connect" :xs="24" :sm="isWebSocket ? 4 : 5">
        <h4 class="ui inverted header m-text-spaced ">联系我</h4>
        <div class="ui inverted link list">
          <p class="item">Email：2508615597@qq.com</p>
          <p class="item">QQ：2508615597</p>
        </div>
      </el-col>
      <el-col class="intro" :xs="24" :sm="isWebSocket ? 7 : 8">
        <div class="seven wide column">
          <h4 class="ui inverted header m-text-spaced">博客简介</h4>
          <p class="m-text-thin m-text-spaced m-opacity-mini">
            梦想还是要有的，万一实现了呢～</p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div class="author">
        <!--                <p class="m-text-thin m-text-spaced m-opacity-mini">Copright©2018-2022 taiyonoyoni Designed by-->
        <!--                    taiyonoyoni</p>-->
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      footerList: [],
      online: 0,
      isWebSocket: true
    }
  },
  created() {
    this.getfooterList();
    if (!"WebSocket" in window) {
      this.isWebSocket = false;
    } else {
      const that = this;
      let address = `${this.$store.state.webSocketAddr}online`;
      var ws = new WebSocket(address);
      ws.onmessage = function (evt) {
        that.online = 1 * evt.data;
      };
    }
  },
  methods: {
    async getfooterList() {
      const {data: res} = await this.$blog.get('/blog/newblog')
      this.footerList = res.data
    },
    toBlog(id) {
      this.$router.push({
        'path': `/${id}.html`
      }).then(res => {
        window.scrollTo({top: 0, behavior: 'smooth'})
      })
    }
  }
}
</script>

<style scoped lang="less">
*:hover {
  cursor: pointer;
}

.footer-wrap {
  bottom: 0 !important;
  line-height: 2;
  position: relative;
  padding: 40px 20px;
  color: #eee;
  font-size: 14px;
  text-align: center;
  background-color: #545c64;
  transition: .2s;
}

.footer-info {
  line-height: 15px;
  color: rgba(255, 255, 255, .5);

  a {
    text-decoration: none;
    color: rgba(255, 255, 255, .5);
  }

  h4 {
    color: white;
  }

  .list .item {
    line-height: 20px;
  }

  .list .item:hover {
    color: white;
  }

  .el-image {
    margin: 0 auto;
    opacity: 0.8;
  }

  .el-image:hover {
    opacity: 1;
  }
}

.author {
  color: rgba(255, 255, 255, .5);
}

@media only screen and (max-width: 480px) {
  .ewm, .new-blog, .intro, .connect {
    display: none;
  }
}
</style>
