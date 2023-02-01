<template>
    <el-upload action="http://upload.qiniup.com" :data="dataObj" list-type="picture" :multiple="false"
               :show-file-list="showFileList" :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove"
               :on-success="handleUploadSuccess" :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
</template>

<script>
import {v4 as uuidv4} from "uuid";

export default {
  name: 'singleUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.$store.state.oss + this.value;
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function () {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function (newValue) {
      }
    }
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: '',
        // callback:'',
      },
      dialogVisible: false
    };
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('');
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    pre() {
      return new Promise((resolve, reject) => {
        this.$blog.get('oss/policy').then((res) => {
          resolve(res)
        })
      })
    },
    beforeUpload(file) {
      let _self = this;
      return new Promise((resolve, reject) => {
        _self.pre().then(({data}) => {
          _self.dataObj.token = data.token;
          _self.dataObj.key = data.dir + uuidv4() + "_" + file.name;
          resolve(true)
        }).catch(err => {
          reject(false)
        })
      }).catch(err => {

      })
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true;
      this.fileList.pop();
      this.fileList.push({ name: file.name, url: res.key});
      this.emitInput(this.fileList[0].url);
    }
  }
}
</script>
<style>

</style>
