<template>
    <div style="display: flex;justify-content: center;align-items: center;height: 50%">
        <h1 class="animate__animated animate__flash" style="color: red;">您没有管理员权限，请联系管理员获取！</h1>

      <el-button type="primary" @click="$router.push({path: prePath})" plain>点我回去</el-button>
    </div>
</template>

<script>
export default {
  data() {
      return {
        prePath: '/',
      }
  },
  beforeRouteEnter(to, from, next) {
    next(x => {
      x.prePath = from.path
    })
  },
}
</script>

<style scoped>

</style>
