<template>
  <div>
    <single-upload v-if="$store.state.userInfo.type === 2" v-model="dialogImageUrl"></single-upload>
    <waterfall id="waterfall_box" :width="itemWidth" :gutterWidth="gutterWidth" :col="col" :data="pictureList">
      <template>
        <div v-for="p in pictureList" class="waterfall_item" :key="p.id">
          <el-card class="imgs">
            <el-link type="primary" @click="updateShowStatus(p.id, 3)" v-show="p.type === 2">所有人可见</el-link>
            <el-link type="warning" @click="updateShowStatus(p.id, 2)" v-show="p.type === 3">部分可见</el-link>
            &nbsp&nbsp&nbsp&nbsp
            <el-link type="danger" @click="deletePic(p.id, p.image)">删除照片</el-link>
            <div style="width: 100%; height: 100%">
              <el-image class="images" v-if="p.image" :src="$store.state.oss + p.image"
                        :preview-src-list="urlList"></el-image>
<!--              <span>{{ p.image }}</span>-->
            </div>
          </el-card>
        </div>
      </template>
    </waterfall>
  </div>

</template>

<script>
import singleUpload from "../upload/singleUpload";

export default {
  components: {
    singleUpload
  },
  watch: {
    'dialogImageUrl': {
      handler(newVal, oldVal) {
        this.submitImg(newVal);
      }
    }
  },
  data() {
    return {
      urlList: [],
      pictureList: [],
      renderList: [],
      waterfall_box_width: 0,
      waterfall_box_height: 0,
      waterfall_col_num: 0,
      waterfall_col_height_list: null, //每列最大高度
      img_width: 250,
      img_margin_right: 20,
      img_margin_bottom: 20,
      dialogVisible: false,
      dialogImageUrl: '',
      page: 1,
      limit: 8,
      totalPage: 1,
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
    handleRemove() {
      this.dialogImageUrl = ''
    },
    async handleSuccess(res) {
      // console.log(res.data)
      this.dialogImageUrl = res.data
    },
    scroll(scrollData) {
      // console.log(scrollData)
    },
    switchCol(col) {
      this.col = col
      // console.log(this.col)
    },
    loadmore(index) {
      this.data = this.data.concat(this.data)
    },
    showImg(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    async checkImgWidth(fileUrl) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = fileUrl
        let res = {}
        img.onload = function () {
          res = {
            width: this.width,
            height: this.height,
            url: fileUrl
          }
          resolve(res)
        }
      })
    },
    async submitImg(url) {
      if (url === ' ') return;
      await this.$blog.post('/admin/pictures/saveImg', {
        'image': url,
        'type': 2
      }).then(({data: res}) => {
        if (res.code === 401) {
          this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        this.pictureList.push({
          'id': res.data,
          'image': url,
          'type': 2,
        });
      })
    },
    lazyLoading() { // 滚动到底部，再加载的处理事件\
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight

      if (scrollTop + clientHeight >= scrollHeight) {
        // 滚动到底部，逻辑代码
        ++this.page;
        if (this.page > this.totalPage) return;
        this.getPicList()
      }
    },
    async getPicList() {
      const {data: res} = await this.$blog.get(`/admin/pictures/list?page=${this.page}&limit=${this.limit}`)
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
    async deletePic(id, key) {
      const confirmResult = await this.$confirm(
          '确定要删除该图片吗',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$blog.post(`/admin/pictures/delete`, {
        id,
        'image': key
      }).then(({data: res}) => {
        if (res.code === 401) {
          this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        var temp = [];
        for (let i = 0; i < this.pictureList.length; ++i)
          if (this.pictureList[i].id !== id) temp.push(this.pictureList[i]);
        this.pictureList = temp;
        this.$message.success('删除成功！')
      }).catch(err => {
        this.$message.error('网络繁忙，请稍后再试')
      })
    },
    updateShowStatus(id, t) {
      this.$blog.post(`/admin/pictures/updateShowStatus`, {
        id,
        type: t
      }).then(({data: res}) => {
        if (res.code === 401) {
          this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        for (let i = 0; i < this.pictureList.length; ++i)
          if (this.pictureList[i].id === id) this.pictureList[i].type = t;
      }).catch(err => {
        this.$message.error('网络繁忙，请稍后再试')
      })
    }
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
