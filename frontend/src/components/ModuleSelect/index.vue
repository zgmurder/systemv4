<template>
  <!-- <div class="root-box">
    <div>训练工作</div>
    <div>单位管理</div>
    <div>账户权限</div>
    <div>大纲标准</div>
    <div>基础数据</div>
  </div> -->
  <el-tabs :value="moduleName" @tab-click="handleClick">
    <el-tab-pane v-for="item in mapModules" :key="item.value" :label="item.name" :name="item.value" />
  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import { setModuleName } from '@/utils/auth'
// import { brotliCompress } from 'zlib'
export default {
  data() {
    return {
      activeName: ''
    }
  },
  computed: {
    ...mapGetters([
      'mapModules',
      'moduleName'
    ])
  },
  // watch: {
  //   'moduleName': {
  //     handler(newVal) {
  //       console.log(newVal, 111)
  //     }
  //   },
  //   immediate: true,
  //   deep: true

  // },
  methods: {
    handleClick(vm) {
      setModuleName(vm.name)
      this.$store.commit('permission/SET_MODULENAME', vm.name)
      const obj = this.mapModules.find(item => item.value === vm.name)
      const path = obj.path || obj.value
      this.$router.push('/' + path)
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
