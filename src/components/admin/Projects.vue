<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="项目列表" name="first">
          <el-row :gutter="5">
            <el-col :span="8">
              <el-input placeholder="请输入项目名称查找" v-model="search"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="searchProjectList">查找项目</el-button>
            </el-col>
          </el-row>
          <el-table :data="projectList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="项目名称" prop="title"></el-table-column>
            <el-table-column label="项目图片" prop="pic_url">
              <template slot-scope="scope">
                <el-image :src="$store.state.oss + scope.row.picUrl" style="width: 100%;max-height: 150px"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="项目类型" prop="type">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" size="small" @change="updateProject(scope.row)">
                  <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="项目地址" prop="url">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.url" @blur="updateProject(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="技术栈" prop="techs">
              <template v-if="scope.row.techs!==null" slot-scope="scope">
                <el-tag v-for="(tag,i) in scope.row.techs.split(',')" style="margin: 3px" size="small" closable
                        @close="handleClose(i,scope.row)">{{ tag }}
                </el-tag>
                <el-input size="small" style="width: 100px;" class="input-new-tag" v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue" ref="saveInput"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else size="mini" class="button-new-tag" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--            删除按钮-->
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="removeProjectById(scope.row.id)"
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
        <el-tab-pane label="发布项目" name="second">
          <el-form label-position="left" label-width="80px" style="text-align: left" ref="publishFormRef"
                   :model="publishForm"
                   class="publish_form">
            <el-form-item label="项目名称" prop="title">
              <el-input v-model="publishForm.title"></el-input>
            </el-form-item>
            <el-form-item label="项目类型" prop="type">
              <el-select v-model="publishForm.type">
                <el-option v-for="item in types"
                           :value="item.id"
                           :label="item.name"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目描述" prop="content">
              <el-input v-model="publishForm.content" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="项目图片">
              <singleUpload v-model="dialogImageUrl"></singleUpload>
            </el-form-item>
            <el-form-item label="技术栈" prop="techs">
                <el-tag v-for="(tag, i) in stacks" style="margin: 3px" size="small" closable
                        @close="handleRemoveStack(i)">{{ tag }}
                </el-tag>
                <el-input size="small" style="width: 100px;" class="input-new-tag" v-if="showStackInput"
                          ref="saveInput" v-model="stackInputVal"
                          @keyup.enter.native="handleInputStack()"
                          @blur="handleInputStack()">
                </el-input>
                <el-button v-else size="mini" class="button-new-tag" @click="showAddInput()">+</el-button>
            </el-form-item>
            <el-form-item label="项目地址" prop="url">
              <el-input v-model="publishForm.url"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="publishProject">发布</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>

import singleUpload from "../upload/singleUpload";
import {mapState} from "vuex";

export default {
  components: {
    singleUpload
  },
  data() {
    return {
      project: {
        id: null,
        content: "",
        title: "",
        pic_url: "",
        url: "",
        type: 0,
        techs: ""
      },
      projectList: [],
      dialogImageUrl: '',
      publishForm: {
        title: '',
        content: '',
        url: ''
      },
      dialogVisible: false,
      activeName: 'first',
      types: [
        {id: 0, name: '完整项目'},
        {id: 1, name: '小练习'}
      ],
      search: '',
      page: 1,
      limit: 4,
      totalCount: 0,
      showStackInput: false,
      stacks: [],
      stackInputVal: ''
    }
  },
  mounted() {
    this.getProjectList()
  },
  computed: {
    pagLayout() {
      if (this.screenWidth < 768) {
        return 'prev, pager, next'
      } else {
        return 'total, prev, pager, next, jumper'
      }
    }
  },
  methods: {
    showAddInput() {
      this.showStackInput = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveInput.$refs.input.focus()
      })
    },
    // 点击按钮,展示文本输入框
    showInput(row) {
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveInput.$refs.input.focus()
      })
    },
    handleInputStack() {
      if (this.stackInputVal.trim().length === 0) {
        this.stackInputVal = ''
        this.showStackInput = false
        return;
      }
      this.stacks.push(this.stackInputVal);
      this.stackInputVal = ''
      this.showStackInput = false
    },
    // 确认输入
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return;
      }
      row.techs += ',' + row.inputValue
      row.inputValue = ''
      row.inputVisible = false
      this.updateProject(row)
    },
    handleRemoveStack(idx) {
      this.stacks.splice(idx, 1)
    },
    // 去掉技术
    handleClose(i, row) {
      let tags = row.techs.split(',')
      tags.splice(i, 1)
      row.techs = tags.join(',')
      this.updateProject(row)
    },
    // 点击tab时的事件
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.getProjectList()
      }
    },
    // 删除图片
    handleRemove() {
      this.dialogImageUrl = ''
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片上传成功
    async handleSuccess(res) {
      this.dialogImageUrl = res.data
    },
    // 清空状态
    backPage() {
      this.blog.firstPicture = ''
      this.$refs.publishFormRef.resetFields()
    },
    // 发布项目
    async publishProject() {
      this.project.picUrl = this.dialogImageUrl
      this.project.title = this.publishForm.title
      this.project.content = this.publishForm.content
      this.project.url = this.publishForm.url
      this.project.type = this.publishForm.type
      this.project.techs = this.stacks.join(",")
      const {data: res} = await this.$blog.post('/admin/project/save', this.project)
      if (res.code === 0) {
        this.$message.success('项目发布成功！')
        await this.getProjectList();
        this.activeName = 'first'
      } else {
        if (res.code === 444) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        return this.$message.error('项目发布失败！')
      }
    },
    // 获取项目列表
    async getProjectList() {
      const {data: res} = await this.$blog.get(`/project/list?page=${this.page}&limit=${this.limit}&search=${this.search}`)
      if (res.code !== 0) {
        return this.$message.error('获取项目列表失败！')
      }
      this.totalCount = res.page.totalCount
      res.page.list.forEach(item => {
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
        // 控制网址是否可编辑
        item.inputUrlVisiable = false
      })
      this.projectList = res.page.list
    },
    // 删除项目
    async removeProjectById(id) {
      // 弹出对话框
      const confirmResult = await this.$confirm(
          '确定要删除该项目吗',
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
      const {data: res} = await this.$blog.post(`/admin/project/${id}/delete`)
      if (res.code === 0) {
        await this.getProjectList()
        return this.$message.success('项目删除成功！')
      } else {
        if (res.code === 444) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        return this.$message.error('项目删除失败！')
      }
    },
    // 更新项目
    async updateProject(row) {
      const {data: res} = await this.$blog.post('/admin/project/update', row)
      if (res.code === 0) {
        return this.$message.success('项目更新成功！')
      } else {
        if (res.code === 444) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        return this.$message.error('项目更新失败！')
      }
    },
    searchProjectList() {
      this.page = 1;
      this.getProjectList();
    },
    // 修改当前页大小
    handleSizeChange(newSize) {
      this.limit = newSize
      this.getProjectList()
    },
    // 修改当前页码
    handleCurrentChange(newSize) {
      this.page = newSize
      this.getProjectList()
    },
  }

}
</script>

<style scoped>

</style>
