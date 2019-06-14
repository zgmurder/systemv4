<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/militaryrank" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50' },
        { prop: 'name', label: '军衔名称', filterConfig: value => ({ '$regex': value }) },
        { prop: 'rankLevel1', label: '一级分类', filterConfig: value => ({ '$regex': value }) },
        { prop: 'rankLevel2', label: '二级分类', filterConfig: value => ({ '$regex': value }) }
        // { prop: 'levelCode', label: '等级码' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '军衔名称', label: '军衔名称', vModel: 'name', name: '', required: true },
        { fieldType: 'input', placeholder: '一级分类', label: '一级分类', vModel: 'rankLevel1', rankLevel1: '', required: true },
        { fieldType: 'input', placeholder: '二级分类', label: '二级分类', vModel: 'rankLevel2', rankLevel2: '', required: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
        // { fieldType: 'input-number', placeholder: '二级分类', label: '二级分类', vModel: 'levelCode', levelCode: 0 }
      ]
    }
  },
  methods: {
    dialogVisible(count = 0) {
      const obj = this.schema.find(item => item.vModel === 'order')
      obj.order = count + 1
    }
  }
}
</script>
