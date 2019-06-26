<template>
  <div class="indexAndTree-container">
    <treeSchema v-if="$store.getters.organization" :nodepart="$attrs.nodepart" class="tree-schema" :default-expanded-keys="[$store.getters.organization.id]" :highlight-current="true" @current-change="(data,node)=>$emit('current-change',data,node)" />
    <formAndTable ref="formAndTable" v-bind="$attrs" class="formAndTable" @dialogIsClose="$emit('dialogIsClose')"><slot slot="moreHandle" slot-scope="{data}" :data="data" name="moreHandle" /></formAndTable>
  </div>
</template>

<script>
import formAndTable from './index'
import treeSchema from './treeSchema'
export default {
  components: {
    formAndTable,
    treeSchema
  },
  computed: {
    baseComponent() {
      return this.$refs.formAndTable
    }
  },
  created() {
    const { beforeSubmit, beforeEdit, afterEdit } = this.$parent
    this.beforeSubmit = beforeSubmit
    this.beforeEdit = beforeEdit
    this.afterEdit = afterEdit
  }
}
</script>

<style lang="scss" scoped>
.indexAndTree-container{
  display: flex;
  justify-content: space-between;
  .tree-schema{
    min-width: 200px;
  }
  .formAndTable{
    width: calc(100% - 200px)
  }
}
</style>
