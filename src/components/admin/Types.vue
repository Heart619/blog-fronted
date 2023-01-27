<template>
    <div>
        <!--    面包屑导航区-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="never">
            <el-button type="primary" @click="addType">新建分类</el-button>
            <el-table :data="typeList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="图片" prop="pic_url" width="150px">
                    <template slot-scope="scope">
                        <el-image :src="$store.state.oss + scope.row.picUrl"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="分类名称" prop="name"></el-table-column>
                <el-table-column label="博客数量" prop="blogNum" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!--            修改按钮-->
                        <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="editBlogDialog(scope.row)"
                        >编辑
                        </el-button>
                        <!--            删除按钮-->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeBlogById(scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :title="this.type.id === null ? '新增分类' : '更新分类'" :visible.sync="createTypeDialogFormVisible">
            <el-form style="text-align: left" ref="createTypeFormRef" :model="createTypeForm"
                     :rules="createTypeFormRules" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="createTypeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="封面图片">
                  <singleUpload v-model="dialogImageUrl"></singleUpload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="backPage">取消</el-button>
                <el-button type="primary" @click="createType">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import singleUpload from "../upload/singleUpload";
export default {
  components: {
    singleUpload
  },
    data() {
        return {
            typeList: [],
            createTypeDialogFormVisible: false,
            dialogImageUrl: '',
            createTypeForm: {
                name: ''
            },
            createTypeFormRules: {
                name: [
                    {required: true, message: '分类名称不能为空', trigger: 'blur'}
                ],
            },
            type: {
                id: null,
                name: '',
                pic_url: ''
            },
            fileList: [],
            dialogVisible: false
        }
    },
    created() {
        this.getFullTypeList();
    },
    methods: {

        compare(property) {
            return function (a, b) {
                let value1 = a[property].length;
                let value2 = b[property].length;
                return value2 - value1;
            }
        },
        // 得到所有的分类
        async getFullTypeList() {
            const {data: res} = await this.$blog.get('/type/getAllType')
            this.typeList = res.data
        },

        selectCard(id) {
            this.selectedCard = id
            // console.log(this.selectedCard)
        },
        createType() {
          const that = this;
            this.$refs.createTypeFormRef.validate(async valid => {
                if (!valid) return
                this.type.name = this.createTypeForm.name
                this.type.pic_url = this.dialogImageUrl
              let res;
              if (this.type.id === null) {
                res = await this.$blog.post(`/admin/type/save`, {
                  'name': that.type.name,
                  'picUrl': that.type.pic_url
                })
              } else {
                res = await this.$blog.post(`/admin/type/update`, {
                  'id': that.type.id,
                  'name': that.type.name,
                  'picUrl': that.type.pic_url
                })
              }
                if (res.data.code === 0) {
                    await this.getFullTypeList()
                    this.$message.success("添加成功")
                } else {
                    if (res.data.code === 401) {
                      await this.$router.push({path: this.$store.state.errorPagePath})
                      return;
                    }
                    this.$message.error(res.data.msg)
                }
              this.createTypeDialogFormVisible = false
            })
        },
        async removeBlogById(row) {
          // 弹出对话框
          this.$confirm('此操作将永久删除该分类, 是否继续',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
            this.$blog.post(`/admin/type/${row.id}/delete`).then(({data: res}) => {
              if (res.code === 0) {
                this.$message.success(res.msg)
                this.getFullTypeList()
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
        handleRemove() {
            this.dialogImageUrl = ''
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        async handleSuccess(res) {
            this.dialogImageUrl = res.data
        },
        backPage() {
          this.createTypeForm.name = ''
          this.createTypeDialogFormVisible = false
        },
        editBlogDialog(row) {
            this.type = row
            // console.log(this.type)
            if (row.picUrl != ''){
                this.dialogImageUrl = row.picUrl
            }
            this.fileList = [{name: row.picUrl, url: row.picUrl}]
            this.createTypeForm.name = row.name
            this.createTypeDialogFormVisible = true
        },
        addType() {
          this.createTypeForm.name = ''
          this.dialogImageUrl = ''
          this.createTypeDialogFormVisible = true
        }
    },
}
</script>

<style scoped>

</style>
