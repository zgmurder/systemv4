<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/specialmission" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
export default {
  name: 'Property',
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50', noFilter: true },
        { prop: 'name', label: '任务名称' }],
      // { prop: 'describe', label: '描述' }],
      schema: [
        { fieldType: 'input', placeholder: '任务名称', label: '任务名称', vModel: 'name', required: true },
        { fieldType: 'input-number', placeholder: '排序码', width: '30%', label: '排序码', vModel: 'order', order: 0 }
        // { fieldType: 'input', placeholder: '描述', label: '描述', vModel: 'describe' }
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
