<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card1" shadow="never" style="text-align: left">
      <div class="el-card__header" style="text-align: left;padding: 0;">
        <h1 style="margin: 0;">博客管理</h1>
      </div>
      <el-input style="width: 200px;margin-right: 20px;margin-top: 10px" placeholder="标题"
                v-model="queryInfo.query"></el-input>
      <el-select v-model="type" @change="selectType " placeholder="分类" style="margin-right: 20px">
        <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
        </el-option>
      </el-select>
      <el-button @click="clearSearh">清除</el-button>
      <el-button type="primary" @click="searchBlogList">搜索</el-button>
      <el-table :data="blogList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="blog-information">
              <el-row :gutter="20">
                <el-col class="left-item" :sm="12" :lg="8">
                  <el-card shadow="never">
                    <div class="firstPicture">
                      <h1 style="margin: 5px auto">博客首图 &nbsp;&nbsp;<el-button size="mini" circle type="primary"
                                                                               @click="editPic(scope.row)"><i
                          class="el-icon-edit"></i></el-button>
                      </h1>
                      <el-image class="img" :src="$store.state.oss + scope.row.firstPicture"></el-image>
                    </div>
                  </el-card>
                </el-col>
                <el-col class="middle-item" :sm="12" :lg="8">
                  <el-card shadow="never">
                    <h1 style="margin: 5px auto">描述</h1>
                    <div style="word-break:break-all;">{{ scope.row.description }}</div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" width="300px">
          <template slot-scope="scope">
            <p @click="getBlogInfo(scope.row.id)" class="change-type">{{ scope.row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="$store.state.userInfo.type === 2" label="作者" prop="title" width="156px" align="center">
          <template slot-scope="scope">
            <el-avatar :src="$store.state.oss + scope.row.userAvatar"></el-avatar>
            {{ scope.row.userNickName }}
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="type.name" width="150px" align="center">
          <template slot-scope="scope">
            <div @click="changeBlogType(scope.row)" class="change-type">{{ scope.row.typeName }}
              <i class="el-icon-edit"></i></div>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tags" width="250px">
          <template slot-scope="scope">
            <el-tag size="medium" v-for="(tag, i) in scope.row.tags" :key="tag.id" closable
                    @close="handleClose(i,scope.row)">{{ tag.name }}
            </el-tag>
            <el-input size="small" style="width: 100px;" class="input-new-tag" v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue" ref="saveTagInput"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)">
            </el-input>
            <el-button v-else size="mini" class="button-new-tag" @click="showInput(scope.row)">+ New Tag
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="阅读量" prop="views" width="100px" align="center"></el-table-column>
        <el-table-column label="发布时间" prop="createTime" width="110px" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="110px" align="center">
          <template slot-scope="scope">
            {{ scope.row.updateTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90px" align="center">
          <template slot-scope="scope">
            <!--            修改按钮-->
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="editBlogByid(scope.row)"
            ></el-button>
            <!--            删除按钮-->
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="removeBlogById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page="pagenum"
          :layout="pagLayout"
          :total="totalcount">
      </el-pagination>
      <el-dialog class="publish_dialog" title="修改文章分类" :visible.sync="editTypeDialogFormVisible">
        <el-form style="text-align: left" ref="editTypeFormRef" :model="editTypeForm" :rules="editTypeFormRules"
                 class="edit_type_form">
          <el-form-item label="文章分类" prop="type">
            <el-select v-model="editTypeForm.typeId" placeholder="请选择文章分类" style="margin-right: 10px">
              <el-option v-for="type in typeList" :label="type.name" :value="type.id"></el-option>
            </el-select>
            <el-button size="small" @click="addType">+ 新建分类</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backPage">取消</el-button>
          <el-button type="primary" @click="changeTypeSubmit">提交修改</el-button>
        </div>
      </el-dialog>
      <el-dialog class="pic_dialog" title="修改文章首图" center :visible.sync="editPicDialogFormVisible"
                 style="width: 800px;margin: 0 auto">
        <el-form ref="editPicFormRef"
                 class="edit_pic_form">
          <el-form-item style="text-align: center">
            <singleUpload v-model="dialogImageUrl"></singleUpload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backPage2">取消</el-button>
          <el-button type="primary" @click="changePicSubmit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>


    <el-dialog :title="'新增分类'" :visible.sync="createTypeDialogFormVisible">
      <el-form style="text-align: left" ref="createTypeFormRef" :model="createTypeForm"
               :rules="createTypeFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model="createTypeForm.typeName"></el-input>
        </el-form-item>
        <el-form-item label="封面图片">
          <singleUpload v-model="typeDialogImageUrl"></singleUpload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createTypeDialogFormVisible = false">取消</el-button>
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
      queryInfo: {
        query: '',
        typeId: null
      },
      pagenum: 1,
      pagesize: 5,
      blogList: [],
      totalcount: 0,
      editing: false,
      commentList: [],
      typeList: [],
      tagList: [],
      editTypeForm: {
        typeId: null,
        userId: null
      },
      blog: null,
      editTypeDialogFormVisible: false,
      editTypeFormRules: {
        type: [
          {required: true, message: '请选择类型', trigger: 'blur'}
        ],
      },
      type: '',
      inputValue: '',
      inputVisible: false,
      editPicDialogFormVisible: false,
      dialogVisible: false,
      dialogImageUrl: '',
      screenWidth: document.documentElement.clientWidth,  //实时屏幕宽度
      createTypeForm: {
        typeName: ''
      },
      typeDialogImageUrl: '',
      createTypeDialogFormVisible: false,
      createTypeFormRules: {
        typeName: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ],
      },
    }
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
  created() {
    this.getBlogList()
    this.getFullTypeList()
    this.getFullTagList()
  },
  methods: {
    handleRemove() {
      this.dialogImageUrl = ''
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async handleSuccess(res) {
      this.dialogImageUrl = res.data
    },
    // 点击取消按钮
    backPage2() {
      this.editPicDialogFormVisible = false
      this.$refs.editPicFormRef.resetFields()
    },
    // 修改博客首图
    async changePicSubmit() {
      this.blog.firstPicture = this.dialogImageUrl
      const {data: res} = await this.$blog.post('/admin/blog/updateImg', {
        firstPicture: this.blog.firstPicture,
        userId: this.blog.userId,
        id: this.blog.id
      })
      // console.log(res)
      if (res.code === 0) {
        this.editPicDialogFormVisible = false
        return this.$message.success('修改首图成功！')
      } else {
        if (res.code === 401) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        this.editPicDialogFormVisible = false
        return this.$message.error('修改首图失败！')
      }
    },
    editPic(row) {
      this.blog = row
      // console.log(this.blog)
      this.editPicDialogFormVisible = true
    },
    // 跳转到博客详情页
    getBlogInfo(blogId) {
      this.$router.push({path: '/blogInfo', query: {id: blogId}});
    },
    // 修改当前页码
    handleCurrentChange(newSize) {
      this.pagenum = newSize
      this.getBlogList()
    },
    // 修改当前页大小
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getBlogList()
    },
    searchBlogList() {
      this.pagenum = 1;
      this.getBlogList()
    },
    // 获取博客列表
    async getBlogList() {
      const {data: res} = await this.$blog.post('/blog/list', {
        title: this.queryInfo.query,
        typeId: this.queryInfo.typeId,
        page: this.pagenum,
        limit: this.pagesize,
        needTags: 'true',
        userId: this.$store.state.userInfo.type === 2 ? undefined : this.$store.state.userInfo.id
      })
      res.page.list.forEach(item => {
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
        // 标签值转为字符串
      })
      this.blogList = res.page.list
      this.totalcount = res.page.totalCount
    },
    // 删除博客
    async removeBlogById(id) {
      // 弹出对话框
      const confirmResult = await this.$confirm(
          '此操作将永久删除该博客, 是否继续',
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
      const {data: res} = await this.$blog.post(`/admin/blog/${id}/delete`);
      if (res.code === 401) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      if (res.code !== 0) return this.$message.error('删除博客失败！')
      this.$message.success('删除博客成功！')
      await this.getBlogList()
    },
    // 编辑博客
    editBlogByid(blog) {
      // console.log(blog)
      this.$router.push({
        path: "/admin/blog-input",
        query: {blogId: blog.id}
      })
    },
    // 得到所有的分类
    async getFullTypeList() {
      const {data: res} = await this.$blog.get('/type/getAllType')
      this.typeList = res.data
    },
    // 得到所有的标签
    async getFullTagList() {
      const {data: res} = await this.$blog.get('/tag/allTag')
      this.tagList = res.data
    },
    // 修改博客分类
    async changeBlogType(blog) {
      this.editTypeForm.typeId = blog.typeId;
      this.editTypeForm.userId = blog.userId;
      this.editTypeForm.blog = blog.id;
      this.editTypeDialogFormVisible = true
    },
    // 点击取消按钮
    backPage() {
      this.editTypeDialogFormVisible = false
      this.editTypeForm.typeId = null
    },
    // 提交类型修改
    async changeTypeSubmit() {
      // console.log(blog)
      const {data: res} = await this.$blog.post('/admin/blog/updateType', {
        id: this.editTypeForm.blog,
        userId: this.editTypeForm.userId,
        typeId: this.editTypeForm.typeId
      });
      if (res.code === 401) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      if (res.code === 0) {
        this.editTypeDialogFormVisible = false
        await this.getBlogList();
        return this.$message.success('修改博客分类成功！')
      } else {
        this.editTypeDialogFormVisible = false
        return this.$message.error('修改博客分类失败！')
      }
    },
    // 点击按钮,展示文本输入框
    showInput(row) {
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点,或按下了Enter都会触发
    async handleInputConfirm(row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      const newTag = this.tagList.find(item => item.name === row.inputValue.trim())
      if (newTag !== undefined) {
        return;
      }

      await this.$blog.get(`/admin/blog/${row.id}/createTag/${row.inputValue}`).then(({data: res}) => {
        if (res.code === 0) {
          row.tags.push(res.data)
          row.tagIds = row.tags.map(item => {
            return item.id
          }).toString().replace(/\[|]/g, '');

          row.inputValue = ''
          row.inputVisible = false
          this.$message.success('新增博客标签成功！')
        } else {
          if (res.code === 401) {
            this.$router.push({path: this.$store.state.errorPagePath})
            return;
          }
          this.$message.error('新增博客标签失败！')
        }
      }).catch(err => {
        this.$message.error("网络繁忙，请稍后再试")
      })
    },

    // 删除对应的参数可选项
    async handleClose(i, row) {
      let tag = row.tags[i]
      // console.log(tag)
      row.tags.splice(i, 1)
      row.tagIds = row.tags.map(item => {
        return item.id
      }).toString().replace(/\[|]/g, '');

      this.$blog.post('/admin/blog/delTag', {
        id: row.id,
        userId: row.userId,
        tagId: tag.id
      }).then(({data: res}) => {
        if (res.code === 0) {
          this.$message.success('修改博客标签成功！')
        } else {
          if (res.code === 401) {
            this.$router.push({path: this.$store.state.errorPagePath})
            return;
          }
          this.$message.error('修改博客标签失败！')
        }
      }).catch(err => {
        this.$message.error("网络繁忙，请稍后再试")
      })

    },

    // 选择类型
    selectType() {
      this.queryInfo.typeId = this.typeList.find(item => item.name === this.type).id
    },
    // 清空搜索内容
    clearSearh() {
      this.queryInfo.typeId = null
      this.queryInfo.query = ''
      this.type = ''
      this.getBlogList()
    },

    addType() {
      this.createTypeForm.typeName = ''
      this.typeDialogImageUrl = ''
      this.createTypeDialogFormVisible = true;
    },

    createType() {
      const that = this;
      this.$refs.createTypeFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await that.$blog.post(`/admin/type/save`, {
          name: that.createTypeForm.typeName,
          picUrl: that.typeDialogImageUrl
        })
        if (res.code === 0) {
          this.typeList.push(res.data);
          this.$message.success("添加成功")
        } else {
          if (res.code === 401) {
            await this.$router.push({path: this.$store.state.errorPagePath})
            return;
          }
          this.$message.error(res.msg)
        }
        this.createTypeDialogFormVisible = false
      })
    },
  }
}
</script>

<style scoped lang="less">
.el-tag {
  margin: 2px;
}

.blog-information {
  width: 100%;

  .firstPicture {
    text-align: center;

    h1 {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-button {
        margin-left: 20px;
      }
    }

    /*padding-right: 20px;*/
    /*border-right: 1px dashed #999;*/
    /*box-sizing: border-box;*/

    .img {
      margin: 10px 0;
      width: 90%;
      border-radius: 10px;
    }
  }

  .middle-item {
    /*padding-right: 20px;*/
    /*border-right: 1px dashed #999;*/
    height: 100%;
    /*box-sizing: border-box;*/

    h1 {
      text-align: center;
    }

  }

  .right-item {
    /*margin-left: 20px;*/

    .comment {
      border-bottom: 1px dashed #ccc;
      margin: 10px 0;
      display: flex;
    }

    .el-avatar {
      width: 35px;
      height: 35px;
      border: 2px solid white;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, .06);
      flex-shrink: 0;
    }

    .content {
      text-align: left;
      font-size: 14px;
      flex-grow: 1;

      .nkname {
        margin-left: 10px;
        max-width: 530px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .rp, .date {
          color: #999;
          margin-left: 10px;
        }

        .blog {
          color: #349edf;
          margin-left: 10px;
        }
      }

      .reply {
        margin-left: 10px;
      }

      .op {
        color: #ddd;
        font-weight: lighter;

        .rep {
          color: #349edf;
        }

        .del {
          color: red;
        }
      }

      .op:hover {
        cursor: pointer;
      }
    }
  }
}

.change-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-type:hover {
  cursor: pointer;
  color: #409eff;
}

@media screen and (max-width: 748px) {
  .el-input, .el-select {
    width: 100% !important;
    margin-bottom: 20px;
  }

  .blog-information {
    .left-item {
      width: 40%;
    }

    .middle-item {
      width: 30%;
    }

    .right-item {
      width: 30%;
    }
  }
}

</style>
