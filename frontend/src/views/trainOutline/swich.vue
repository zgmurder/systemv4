<template>
  <el-switch
    v-if="row.state !== 2"
    :key="row.id"
    v-model="value"
    :active-text="switchText[0]"
    :inactive-text="switchText[1]"
    :disabled="isDisabled && row.state !== 1"
    inactive-color="#ff4949"
    active-color="#13ce66"
    @change="handleChange"
  />
  <!-- :disabled="row[column.prop]" -->
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: this.data[0].state === 1
    }
  },
  computed: {
    column() {
      return this.data[1]
    },
    row() {
      return this.data[0]
    },
    switchText() {
      return this.column.swichText || ['是', '否']
    },
    tableList() {
      return this.data[2]
    },
    isDisabled() {
      return this.tableList.some(item => item.state === 1)
    }
  },
  methods: {
    async handleChange(value) {
      const isOk = await this.$confirm('确定录完该大纲的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => false)
      if (!isOk) return (this.value = !value)
      this.column.change &&
        this.column.change(this.row.id, value)
    }
  }
}
</script>
