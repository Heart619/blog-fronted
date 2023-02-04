<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>随笔管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="hover">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="随笔管理" name="first">
          <el-row :gutter="5">
            <el-col :span="8">
              <el-input placeholder="请输入随笔标题" v-model="search"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="searchEssayList">查找随笔</el-button>
            </el-col>
          </el-row>

          <el-table :data="essayList" border stripe :default-sort="{prop: 'createTime', order: 'descending'}">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="随笔标题" prop="title" width="700px"></el-table-column>
            <el-table-column v-if="$store.state.userInfo.type === 2" label="作者" prop="color" width="216px" align="center">
              <template slot-scope="scope">
                <el-avatar :src="$store.state.oss + scope.row.avatar"></el-avatar>{{scope.row.nickName}}
              </template>
            </el-table-column>
            <el-table-column label="边框颜色" prop="color" width="80px" align="center">
              <template slot-scope="scope">
                <el-tag :color="scope.row.color" class="essay-color"></el-tag>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" prop="createTime" sortable width="120px" align="center">
              <template slot-scope="scope">
                {{scope.row.createTime | dataFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <!--            修改按钮-->
                <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    @click="editByid(scope.row)"
                ></el-button>
                <!--            删除按钮-->
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="removeById(scope.row.id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="limit"
              :current-page="page"
              :layout="pagLayout"
              :total="totalCount">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="新建随笔" name="second">
          <el-form label-position="left" label-width="80px" style="text-align: left" ref="publishFormRef"
                   :model="publishForm"
                   class="publish_form">
            <el-form-item label="标题" prop="title">
              <el-input v-model="publishForm.title"></el-input>
            </el-form-item>
            <el-form-item label="色彩" prop="color">
              <el-color-picker size="small" show-alpha v-model="publishForm.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <mavon-editor v-model="publishForm.content"
                            ref="md"
                            @imgAdd="imgAdd"
                            @imgDel="imgDel"
                            style="margin: 10px auto;min-height: 70vh"/>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="publishAssay">发布</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      essay: {
        id: null,
        content: "",
        title: "",
        color: "",
        createTime: ""
      },
      publishDialogFormVisible: false,
      publishForm: {
        color: 'rgba(0, 0, 0, 1)'
      },
      dialogVisible: false,
      activeName: 'first',
      essayList: [],
      vis: false,
      page: 1,
      limit: 5,
      totalCount: 0,
      search: '',
    }
  },
  created() {
    this.getEssayList()
  },
  computed:{
    pagLayout(){
      if (this.screenWidth<768){
        return 'prev, pager, next'
      } else {
        return 'total, prev, pager, next, jumper'
      }
    }
  },
  methods: {
    // 将图片上传到服务器，返回的地址替换到md中
    async imgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append('file', $file);
      const {data: res} = await this.$blog.post('/admin/pictures/upload', formdata);
      if (res.code === 444) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      if (res.code === 0) {
        this.$refs.md.$img2Url(pos, res.data)
      }
    },
    // TODO 删除不需要的图片
    async imgDel(pos) {
      this.$message.warning("功能待完善")
      // console.log(pos)
      // console.log(pos[0])
      // let len = pos[0].split('/').length
      // let filename = pos[0].split('/')[len - 1]
      // // console.log(filename)
      // const {data: res} = await this.$picture.get(`/essay/delete/${filename}`)
    },
    // 获取随笔列表
    async getEssayList() {
      let uid = this.$store.state.userInfo.type;
      const {data: res} = await this.$blog.get(`/essay/list/back?page=${this.page}&limit=${this.limit}&search=${this.search}&userId=${uid === 2 ? '' : this.$store.state.userInfo.id}`)
      if (res.code === 0) {
        this.totalCount = res.page.totalCount
        this.essayList = res.page.list
        this.essayList.forEach(item => {
          item.vis = false
        })
      }
    },
    searchEssayList() {
      this.page = 1;
      this.getEssayList();
    },
    backPage() {
      this.blog.firstPicture = ''
      this.publishDialogFormVisible = false
      this.$refs.publishFormRef.resetFields()
    },
    // 发布随笔
    async publishAssay() {
      if (this.publishForm.content === undefined || this.publishForm.content === null || this.publishForm.content === '') {
        this.$message.warning("随笔内容不能为空")
        return;
      }
      if (this.publishForm.title === undefined || this.publishForm.title === null || this.publishForm.title === '') {
        this.$message.warning("标题不能为空")
        return;
      }

      if (this.publishForm.id !== null) {
        this.essay.id = this.publishForm.id
      }
      this.essay.image = this.dialogImageUrl
      this.essay.title = this.publishForm.title
      this.essay.content = this.publishForm.content
      this.essay.color = this.publishForm.color
      this.essay.avatar = this.$store.state.userInfo.avatar
      this.essay.author = this.$store.state.userInfo.id
      this.essay.praise = 0
      const {data: res} = await this.$blog.post('/admin/essay/save', this.essay)
      if (res.code === 0) {
        this.publishDialogFormVisible = false
        await this.getEssayList();
        this.activeName = 'first'
        return this.$message.success('发布随笔成功！')
      } else {
        if (res.code === 444) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        this.publishDialogFormVisible = false
        return this.$message.error('发布随笔失败！')
      }
    },
    // 点击tab时的事件
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.getEssayList()
      }
    },
    // 删除随笔
    async removeById(id) {
      // 弹出对话框
      const confirmResult = await this.$confirm(
          '确定要删除该随笔吗',
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
      const {data: res} = await this.$blog.post(`/admin/essay/${id}/delete`)
      if (res.code === 0) {
        await this.getEssayList()
        return this.$message.success('随笔删除成功！')
      } else {
        if (res.code === 444) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        return this.$message.error('随笔删除失败！')
      }
    },
    // 编辑随笔
    async editByid(row) {
      const {data: res} = await this.$blog.get(`/admin/essay/default/${row.id}`)
      this.publishForm = res.data
      this.activeName = 'second'
    },
    // 修改当前页大小
    handleSizeChange(newSize) {
      this.limit = newSize
      this.getEssayList()
    },
    // 修改当前页码
    handleCurrentChange(newSize) {
      this.page = newSize
      this.getEssayList()
    },
  }
}
</script>

<style scoped>
  .essay-color {
    width: 30px;
    height: 30px;
    border-radius: 9999px;
    border: 1px solid white;
  }

  .card:hover {
    cursor: pointer;
  }
</style>
