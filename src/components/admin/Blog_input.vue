<template>
    <div>
        <!--    面包屑导航区-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>撰写博客</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="5">
            <el-col :span="21">
                <el-input placeholder="请输入文章标题" v-model="blog.title"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button style="border-radius: 20px" type="danger" @click="submit">发布文章</el-button>
            </el-col>
        </el-row>
        <el-row>
            <mavon-editor v-model="blog.content" ref="md"
                          @imgAdd="imgAdd"
                          @imgDel="imgDel"  style="margin: 10px auto;min-height: 70vh"/>
        </el-row>
        <el-row align="right" type="flex" justify="end">

        </el-row>
        <el-dialog class="publish_dialog" title="发布文章" :visible.sync="publishDialogFormVisible">
            <el-form style="text-align: left" ref="publishFormRef" :model="publishForm" :rules="publishFormRules"
                     class="publish_form">
                <el-form-item label="文章分类" prop="type">
                    <el-select size="small" v-model="publishForm.type" placeholder="请选择文章分类" style="margin-right: 10px"
                               @change="setBlogType">
                        <el-option v-for="type in typeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
                    </el-select>
                    <el-button size="small" @click="addType">+ 新建分类</el-button>
                </el-form-item>
                <el-form-item label="文章标签" prop="tags">
                    <el-card shadow="never" style="height: 120px; overflow: auto">
                        <el-checkbox-group v-model="publishForm.tags">
                            <el-checkbox v-for="tag in tagList" :label="tag.id" :key="tag.id">{{tag.name}}</el-checkbox>
                        </el-checkbox-group>
                      <el-input size="small" style="width: 100px;" class="input-new-tag" v-if="inputTagVisible"
                                v-model="inputTagValue" ref="saveTagInput"
                                @keyup.enter.native="handleInputConfirm()"
                                @blur="handleInputConfirm()">
                      </el-input>
                      <el-button v-else size="mini" class="button-new-tag" @click="showInput()">+ 新建标签
                      </el-button>
                    </el-card>
                </el-form-item>
                <el-form-item label="文章类型" prop="flag">
                    <el-select size="small" v-model="publishForm.flag">
                        <el-option
                                v-for="item in flags"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章首图">
                  <singleUpload v-model="dialogImageUrl"></singleUpload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="backPage">取消</el-button>
                <el-button type="primary" @click="publishBlog">发布文章</el-button>
            </div>
        </el-dialog>


      <el-dialog :title="'新增分类'" :visible.sync="createTypeDialogFormVisible">
        <el-form style="text-align: left" ref="createTypeFormRef" :model="createTypeForm"
                 :rules="createTypeFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="createTypeForm.name"></el-input>
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
            blog: {
                id:null,
                content: "",
                flag: "",
                title: "",
                type: {},
                tagIds: '',
                firstPicture: "",
                appreciation: 0,
                user: {},
                views: 0,
                commentabled: true
            },
            dialogImageUrl:'',
            flags: [
                {value: "原创", label: "原创"},
                {value: "转载", label: "转载"},
                {value: "翻译", label: "翻译"}
            ],
            publishDialogFormVisible: false,
            publishForm: {
                // type: {},
                tags: [],
                flag:'原创'
            },
            typeList: [],
            tagList: [],
            publishFormRules: {
                type:[
                    {required: true,message: '请选择类型',trigger: 'blur'}
                ],
                tags:[
                    {required: true,message: '请选择至少一种标签',trigger: 'blur'}
                ],
                flag:[
                    {required: true,message: '请选择文章类型',trigger: 'blur'}
                ],
            },
            createTypeFormRules: {
              name: [
                {required: true, message: '分类名称不能为空', trigger: 'blur'}
              ],
            },
            createTypeDialogFormVisible: false,
            typeDialogImageUrl: '',
            createTypeForm: {
              name: ''
            },
            dialogVisible: false,
            inputTagValue: '',
            inputTagVisible: false,
            type: {

            }
        }
    },
    created(){
      if (typeof this.$route.query.blog !== 'undefined'){
          this.blog = JSON.parse(this.$route.query.blog)
      }
    },
    methods: {
      // 将图片上传到服务器，返回的地址替换到md中
      async imgAdd(pos, $file) {
        let formdata = new FormData();
        formdata.append('file', $file);
        const {data: res} = await this.$blog.post('/admin/pictures/upload', formdata)
        if (res.code === 401) {
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
        // const {data: res} = await this.$picture.get(`/delete/${filename}`)
      },
        // 获取博客类型列表
        async getTypeList() {
            const {data: res} = await this.$blog.get('/type/getAllType')
            this.typeList = res.data
        },
        // 获取博客标签列表
        async getTagList() {
            const {data: res} = await this.$blog.get('/tag/allTag')
            this.tagList = res.data
        },
        async submit() {

          if (this.blog.title === undefined || this.blog.title === null || this.blog.title === '') {
            this.$message.warning("标题不能为空")
            return
          }
          if (this.blog.content === undefined || this.blog.content === null || this.blog.content === '') {
            this.$message.warning("博客内容不能为空")
            return
          }
            if (this.blog.id !== null){
                const {data: res} = await this.$blog.post('/admin/blog/update', this.blog);
                // console.log(res)
                if (res.code === 0) {
                    this.publishDialogFormVisible = false
                    this.$router.go(-1);
                    return this.$message.success('修改博客成功！')
                } else {
                    if (res.code === 401) {
                      await this.$router.push({path: this.$store.state.errorPagePath})
                      return;
                    }
                    this.publishDialogFormVisible = false
                    return this.$message.error('修改博客失败！')
                }
            } else {
                await this.getTypeList()
                await this.getTagList()
                this.publishDialogFormVisible = true
            }
        },
        async handleSuccess(res) {
            this.dialogImageUrl = res.data
        },
        publishBlog() {
            this.$refs.publishFormRef.validate( async valid => {
                if (!valid) return
                this.blog.firstPicture = this.dialogImageUrl
                this.blog.tagIds = this.publishForm.tags.toString().replace(/\[|]/g, '');
                this.blog.flag = this.publishForm.flag
                // console.log(this.blog.content)
                this.blog.userId = JSON.parse(window.sessionStorage.getItem('user')).id;
                this.blog.typeId = this.blog.type.id
                this.blog.type = undefined;
                const {data: res} = await this.$blog.post('/admin/blog/save', this.blog);
                // console.log(res)
                if (res.code === 0) {
                    this.publishDialogFormVisible = false
                    await this.$router.push({path: '/admin/blogs'})
                    return this.$message.success('发布博客成功！')
                } else {
                    if (res.code === 401) {
                      await this.$router.push({path: this.$store.state.errorPagePath})
                      return;
                    }
                    this.publishDialogFormVisible = false
                    return this.$message.error('发布博客失败！')
                }
            })

        },
        handleRemove() {
            this.dialogImageUrl = ''
            // console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        setBlogType(res) {
            this.blog.type = this.typeList.find(item => item.id === res)
        },
        backPage(){
            this.blog.firstPicture = ''
            this.publishDialogFormVisible = false
            this.inputTagVisible = false
            this.inputTagValue = ''
            this.$refs.publishFormRef.resetFields()
        },
      createType() {
        const that = this;
        this.$refs.createTypeFormRef.validate(async valid => {
          if (!valid) return
          this.type.name = this.createTypeForm.name
          this.type.pic_url = this.typeDialogImageUrl
            const {data: res} = await this.$blog.post(`/admin/type/save`, {
              'name': that.type.name,
              'picUrl': that.type.pic_url
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
      addType() {
        this.createTypeForm.name = ''
        this.typeDialogImageUrl = ''
        this.createTypeDialogFormVisible = true;
      },
      showInput() {
        this.inputTagVisible = true
        //   让输入框自动获取焦点
        // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      // 文本框失去焦点,或按下了Enter都会触发
      async handleInputConfirm() {
        // 输入的内容为空时，清空
        if (this.inputTagValue.trim().length === 0) {
          this.inputTagValue = ''
          this.inputTagVisible = false
          return
        }
        const newTag = this.tagList.find(item => item.name === this.inputTagValue.trim())
        if (newTag !== undefined) {
          return;
        }
        await this.$blog.post('/admin/tag/save', {
          'name': this.inputTagValue
        }).then(({data: res}) => {
          if (res.code === 0) {
            this.tagList.push(res.data)
            this.inputTagValue = ''
            this.inputTagVisible = false
            this.$message.success("添加成功")
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
    }
}
</script>

<style scoped lang="less">
    .el-form /deep/ .el-form-item__content {
        line-height: 23px;
    }

    .el-card /deep/ .el-card__body {
        padding: 10px;
    }

</style>
