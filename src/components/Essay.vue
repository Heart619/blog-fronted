<template>
  <div>
    <el-empty v-if="essayList.length === 0" description="当前暂无随笔"></el-empty>
    <el-container v-if="essayList.length !== 0">
      <el-timeline v-show="true" class="animate__animated animate__fadeInLeft">
        <el-timeline-item :color="essay.borderColor" v-for="essay in essayList" :key="essay.id" :timestamp="essay.createTime | dataFormat" placement="top">
          <el-card style="letter-spacing: 1px;" :style="calcuteStyle(essay)">
            <h2>{{essay.title}}</h2>
            <div class="typo" v-html="essay.content"></div>
            <p>
              <el-avatar size="small" :src="$store.state.oss + essay.avatar"></el-avatar>
              {{ essay.nickName }}
            </p>
          </el-card>
         </el-timeline-item>
      </el-timeline>
    </el-container>
  </div>
</template>

<script>
export default {
    data() {
        return {
            essayList: [],
            page: 1,
            limit: 3,
            totalPage: 0,
        }
    },
    created() {
        this.getEssayList()
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.lazyLoading);
    },
    mounted() {
      window.addEventListener('scroll', this.lazyLoading); // 滚动到底部，再加载的处理事件
    },
    methods:{
        lazyLoading () { // 滚动到底部，再加载的处理事件\
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          const clientHeight = document.documentElement.clientHeight
          const scrollHeight = document.documentElement.scrollHeight

          if (scrollTop + clientHeight >= scrollHeight) {
            // 滚动到底部，逻辑代码
            ++this.page;
            if (this.page > this.totalPage) return;
            this.getEssayList();
          }
        },
        async getEssayList(){
            const {data: res} = await this.$blog.get(`/essay/list?page=${this.page}&limit=${this.limit}`);
            if (res.code === 0){
                  let i = this.essayList.length;
                  this.totalPage = res.page.totalPage
                  this.essayList = [...this.essayList, ...res.page.list]
                  for (; i < this.essayList.length; ++i) {
                      let essay = this.essayList[i];
                      this.essayList[i].cotent = essay.content = this.$marked(essay.content)
                    essay.borderColor = essay.color.split(",")[0]+','+essay.color.split(",")[1]+ ','+essay.color.split(",")[2]+')'
                    essay.contentColor = essay.color.split(",")[0]+','+essay.color.split(",")[1]+ ','+essay.color.split(",")[2]+',0.1)'
                  }
              }
        },
        calcuteStyle(essay){
            return 'border: 3px solid '+essay.borderColor+'; background-color: rgba(255,255,255,0.9);box-shadow: 0 0 30px -10px '+essay.borderColor
        }
    }
}
</script>

<style scoped lang="less">

    .el-timeline {
        font: 16px/1.5 'Microsoft Yahei', 'PingFang SC', 'Hiragino Sans GB', sans-serif !important;

        width: 80%;
        margin: 0 auto;

        .el-image {
            width: 200px;
        }
        .el-card{
            border-radius: 20px;
            box-shadow: 0 0 15px 5px white;
        }
    }

    @media screen and (max-width: 768px){
        .el-timeline{
            width: 98%;
            padding: 2px;
        }

        .el-timeline /deep/ .el-timeline-item__wrapper{
            padding-left: 15px !important;
        }
    }
</style>
