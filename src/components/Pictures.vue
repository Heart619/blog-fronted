<template>
  <div>
    <el-empty v-if="pictureList.length === 0" style="width: 1400px; height: 500px" description="暂无照片"></el-empty>
    <waterfall id="waterfall_box" :width="itemWidth" :gutterWidth="gutterWidth" :col="col" :data="pictureList">
      <template>
        <div v-for="p in pictureList" class="waterfall_item" :key="p.id">
          <el-card class="imgs">
            <div style="width: 100%; height: 100%">
              <el-image class="images" v-if="p.image" :src="$store.state.oss + p.image"
                        :preview-src-list="urlList"></el-image>
            </div>
          </el-card>
        </div>
      </template>
    </waterfall>
  </div>
</template>

<script>

export default {
  data() {
    return {
      urlList: [],
      pictureList: [],
      page: 1,
      limit: 8,
      totalPage: 1,
      loading: false
    }
  },
  created() {
    this.getPicList()
  },
  computed: {
    itemWidth() {
      return 270 // #rem布局 计算宽度
    },
    gutterWidth() {
      return (18 * 0.5 * (document.documentElement.clientWidth / 270))	//#rem布局 计算x轴方向margin(y轴方向的margin自定义在css中即可)
    },
    col() {
      return Math.floor(document.documentElement.clientWidth / 270)
    }
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

      if (scrollTop + clientHeight + 160 >= scrollHeight && !this.loading) {
        this.loading = true;
        // 滚动到底部，逻辑代码
        ++this.page;
        if (this.page <= this.totalPage) {
          this.getPicList()
        }
        this.loading = false
      }
    },
    async getPicList() {
      const {data: res} = await this.$blog.get(`/pictures/waterfall?page=${this.page}&limit=${this.limit}`)
      if (res.code === 401) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      this.totalPage = res.page.totalPage
      let i = this.pictureList.length;
      this.pictureList = [...this.pictureList, ...res.page.list]
      for (; i < this.pictureList.length; ++i) {
        this.urlList.push(this.$store.state.oss + this.pictureList[i].image);
      }
    },
  }
}
</script>

<style scoped lang="less">
.el-card /deep/ .el-card__body {
  padding: 0;
}

#waterfall_box {
  width: 100%;
  position: relative;
  margin: 20px auto;

  .waterfall_item {

    .imgs {
      position: relative;
      margin-bottom: 20px;

      img {
        width: 100%;
      }

      span {
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 18px;
        font-size: small;
        color: #eee;
        background-color: rgba(0, 0, 0, 0.3);
        visibility: hidden;
      }

      button {
        position: absolute;
        top: 0;
        right: 0;
        visibility: hidden;
      }
    }

  }

  .waterfall_item:hover {
    cursor: pointer;
    overflow: hidden;


    span {
      color: white;
      transition: all .3s;
      visibility: visible;
    }

    button {
      visibility: visible;
    }

    img {
      transform: scale(1.1);
      width: 100%;
      transition: .6s;
    }
  }
}

</style>
