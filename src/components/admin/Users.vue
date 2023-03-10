<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input placeholder="请输入用户名或用户昵称" v-model="search"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="searchUser()">查找用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border :default-sort="{prop: 'createTime', order: 'descending'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="头像" prop="avatar" min-width="60px" align="center">
          <template slot-scope="scope">
            <el-avatar :src="$store.state.oss + scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname" align="center"></el-table-column>
        <el-table-column label="账号" prop="username" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" min-width="100px"></el-table-column>
        <el-table-column label="注册时间" sortable prop="createTime" min-width="100px" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="最近登录" prop="loginTime" align="center">
          <template slot-scope="scope">
            {{ scope.row.lastLoginTime === null ? scope.row.createTime : scope.row.lastLoginTime | dataFormat3 }}
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">{{ scope.row.loginProvince + ' ' + scope.row.loginCity }}</template>
        </el-table-column>
        <el-table-column label="管理员" min-width="70px" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 2" type="success">超级管理员</el-tag>
            <el-switch v-else :active-value="1" :inactive-value="0" v-model="scope.row.type"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" circle type="danger" icon="el-icon-delete" :disabled="scope.row.type === 2"
                       @click="deleteUser(scope.row.id)"></el-button>
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
    </el-card>
  </div>

</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      userList: [],
      search: '',
      page: 1,
      limit: 8,
      totalCount: 0,
    }
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
    pagLayout() {
      if (this.screenWidth < 768) {
        return 'prev, pager, next'
      } else {
        return 'total, prev, pager, next, jumper'
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$blog.get(`/admin/user/list?page=${this.page}&limit=${this.limit}&search=${this.search}`);
      if (res.code === 0) {
        this.totalCount = res.page.totalCount
        this.userList = res.page.list
      } else {
        if (res.code === 444) {
          await this.$router.push({path: this.$store.state.errorPagePath})
          return;
        }
        this.$message.error("获取用户信息失败！")
      }
    },
    searchUser() {
      this.page = 1
      this.getUserList()
    },
    // 修改用户权限
    async userStateChanged(row) {
      const {data: res} = await this.$blog.post('/admin/user/update', row);
      if (res.code === 444) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      if (res.code !== 0) return this.$message.error("修改权限失败")
      this.$message.success("修改权限成功")

    },
    // 删除用户
    async deleteUser(id) {
      // 弹出对话框
      const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续',
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
      const {data: res} = await this.$blog.post(`/admin/user/del/${id}`)
      if (res.code === 401) {
        await this.$router.push({path: this.$store.state.errorPagePath})
        return;
      }
      if (res.code !== 0) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      await this.getUserList()
    },
    // 修改当前页大小
    handleSizeChange(newSize) {
      this.limit = newSize
      this.getUserList()
    },
    // 修改当前页码
    handleCurrentChange(newSize) {
      this.page = newSize
      this.getUserList()
    },
  }
}
</script>

<style scoped lang="less">

</style>
