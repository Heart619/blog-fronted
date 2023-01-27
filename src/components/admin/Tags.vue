<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never">
      <el-button type="primary" style="margin-bottom: 20px" @click="createTagDialogFormVisible = true">新建标签</el-button>
      <el-row :gutter="20">
        <el-col :sm="8" :lg="6" v-for="tag in tagList" style="margin-bottom: 20px;" :key="tag.id">
          <el-card shadow="hover" style="position:relative;border: 2px solid #eee;text-align: left">
            <div class="op" style="position: absolute;right: 5px;top: 5px">
              <i @click="editTagById(tag)" class="el-icon-edit"
                 style="color: #3a8ee6;margin-right: 5px"></i>
              <i @click="deleteTagById(tag.id)" class="el-icon-delete" style="color: red"></i>
            </div>
            <b> 标签名称 <span style="color: #3a8ee6">{{ tag.name }}</span></b> <br>
            <p style="margin-bottom: 0">博客数量 <span style="color: #2ac06d">{{ tag.blogNum }}</span></p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="this.tag.id === null ? '新增标签' : '更新标签'" :visible.sync="createTagDialogFormVisible">
      <el-form style="text-align: left" ref="createTagFormRef" :model="createTagForm"
               :rules="createTagFormRules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="createTagForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backPage">取消</el-button>
        <el-button tag="primary" @click="createTag">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagList: [],
      createTagDialogFormVisible: false,
      createTagForm: {
        name: ''
      },
      createTagFormRules: {
        name: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ],
      },
      tag: {
        id: null,
        name: '',
      },
    }
  },
  created() {
    this.getFullTagList();
  },
  methods: {
    compare(property) {
      return function (a, b) {
        let value1 = a[property].length;
        let value2 = b[property].length;
        return value2 - value1;
      }
    },
    // 根据id编辑标签
    editTagById(row) {
      this.tag.id = row.id
      this.createTagForm.name = row.name
      this.createTagDialogFormVisible = true
    },
    // 创建新标签
    createTag() {
      const _this = this;
      this.$refs.createTagFormRef.validate(async valid => {
        if (!valid) return
        this.tag.name = this.createTagForm.name
        // console.log(this.tag)
        let res;
        if (this.tag.id === null) {
          res = await this.$blog.post(`/admin/tag/save`, {
            'name': _this.tag.name
          })
        } else {
          res = await this.$blog.post(`/admin/tag/update`, {
            'id': _this.tag.id,
            'name': _this.tag.name
          })
        }
        if (res.data.code === 401) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        if (res.data.code === 0) {
          await this.getFullTagList()
        } else if (res.data.code === 500) {
          this.$message.error(res.data.msg)
        }
        this.createTagDialogFormVisible = false
        this.tag.id = null
        this.createTagForm.name = ''
        this.$message.success(res.message)
      })
    },
    // 根据id删除标签
    async deleteTagById(id) {
      // 弹出对话框
      this.$confirm('此操作将永久删除该标签, 是否继续',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$blog.post(`/admin/tag/${id}/delete`).then(({data: res}) => {
              if (res.code === 0) {
                this.$message.success(res.msg)
                this.getFullTagList()
              } else {
                if (res.code === 401) {
                  this.$router.push({path: this.$store.state.errorPagePath})
                  return;
                }
                this.$message.error(res.msg)
              }
            })
          }).catch(err => {
            this.$message.info('已取消删除')
          })
    },
    // 得到所有的标签
    async getFullTagList() {
      const {data: res} = await this.$blog.get('/tag/allTag')
      this.tagList = res.data
    },

    selectCard(id) {
      this.selectedCard = id
    },
    backPage() {
      this.createTagDialogFormVisible = false
      this.createTagForm.name = ''
      this.$refs.createTagFormRef.resetFields()
    },
  },
}
</script>

<style scoped lang="less">
.op:hover {
  cursor: pointer;

  i:hover {
    font-weight: bold;
    font-size: large;
  }
}
</style>
