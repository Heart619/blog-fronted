<template>
  <div>
    <el-upload action="http://upload.qiniup.com" :data="dataObj" list-type="picture-card" :file-list="fileList"
               :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess"
               :on-preview="handlePreview" :limit="maxCount" :on-exceed="handleExceed" multiple>
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>
<script>

import {v4 as uuidv4} from "uuid";

export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        uuid: ""
      },
      dialogVisible: false,
      dialogImageUrl: null
    };
  },
  computed: {
    fileList() {
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({ url: this.value[i]});
      }
      return fileList;
    }
  },
  mounted() {},
  methods: {
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      this.$emit("input", value);
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
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
        this.pre().then(({data}) => {
              _self.dataObj.token = data.token;
              _self.dataObj.key = data.dir + "/" + uuidv4() + "_" + file.name;
              resolve(true);
            }).catch(err => {
              reject(false);
            });
      });
    },
    handleUploadSuccess(res, file) {
      this.fileList.push({ name: file.name, url: res.key });
      this.emitInput(this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "最多只能上传" + this.maxCount + "张图片",
        type: "warning",
        duration: 1000
      });
    }
  }
};
</script>
<style>

</style>
