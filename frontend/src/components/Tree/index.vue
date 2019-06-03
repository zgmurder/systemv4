
<template>
  <el-tree
    :props="props"
    v-bind="$attrs"
    :load="loadNode"
    node-key="id"
    lazy
    @check-change="handleCheckChange"
  />
</template>
<script>
// import { fromJSON } from '@/api/organization'
import { queryList } from '@/api/baseApi'
export default {
  props: {
    nodepart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      props: {
        label: 'name',
        isLeaf: data => !data.childCount
      },
      url: 'resource/organization'
    }
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        this.$emit('update', resolve)
        return resolve([this.$store.getters.organization])
      } else {
        // const parseObj = await fromJSON(node.data).fetch()
        // const query = parseObj.relation('children').query()
        // this.nodepart && query.notEqualTo('orgType', '部门')
        // const org = await fetchItem(this.url, node.data.id)
        const orgList = await queryList('resource/organization', { where: {
          parentId: node.data.id
          // deactivated: false
        }})
        // console.log(orgList)

        // return resolve(orgList)
        return resolve(orgList)
        // query.ascending('createdAt')
        // query.find().then(list => {
        //   list = list.map(item => ({ ...item.toJSON(), className: item.className }))
        //   return resolve(list)
        // })
      }
    }
  }
}
</script>
<style lang="scss">
.el-tree-node__content{
  height: 44px;
  border: 1px solid #f0f0f0;
  border-top: none;
}
.el-tree{
  border-top: 1px solid #f0f0f0;
}
.custom-tree-node{
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  align-items: center;
  padding-right: 10px;
  .tag{
    margin-left: 10px;
  }
}
</style>
