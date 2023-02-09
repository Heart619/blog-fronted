<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;height: 450px;">
    <el-table-column label="最新博客" min-width="180">
      <template slot-scope="scope">
        <p class="title" @click="getBlogInfo(scope.row.id)">
            {{ scope.row.title  }}
        </p>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.typeName }}
      </template>
    </el-table-column>
    <el-table-column label="类别" width="100" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.flag === '原创'">
          {{ scope.row.flag }}
        </el-tag>
        <el-tag type="warning" v-else-if="scope.row.flag === '转载'">
          {{ scope.row.flag }}
        </el-tag>
        <el-tag type="success" v-else-if="scope.row.flag === '翻译'">
          {{ scope.row.flag }}
        </el-tag>
        <el-tag type="danger" v-else>
          {{ scope.row.flag }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null,
      total:0
    }
  },
  created() {
    this.getRecommendList()
  },
  methods: {
      // 获取最新博客列表
      async getRecommendList() {
        const {data: res} = await this.$blog.get('/blog/getRecommendBlogList')
        this.list = res.data.slice(0,5)
        this.total = res.total
      },
      // 跳转到博客详情页
      getBlogInfo(blogId) {
          this.$router.push({path: `/${blogId}.html`});
      },
  }
}
</script>
<style scoped lang="less">
    .title:hover{
        color: #3a8ee6;
        cursor: pointer;
    }
</style>
